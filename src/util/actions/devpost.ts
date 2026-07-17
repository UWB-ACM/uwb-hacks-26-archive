"use server";
import "server-only";

import Papa from "papaparse";
import { hasPermissions, PermissionLevel, Project } from "@/src/util/dataTypes";
import { getSession } from "@/src/util/session";
import { getPermissionLevel } from "@/src/util/db/user";
import {
    getAllTrackTags,
    getEmailFromCode,
    linkDevpostEmailToUser,
    markDevpostCodesAsSent,
    syncDevpostEmailsToUsers,
    upsertDevpostUser,
    upsertProject,
} from "@/src/util/db/devpost";
import { sendDevpostLinkingEmails } from "../awsSes";
import { revalidatePath } from "next/cache";
import { ensureAdminPermission } from "../staff";

const MIN_TEAM_SIZE = 3;
const MAX_TEAM_SIZE = 4;

export interface ImportResult {
    imported: number;
    warnings: string[];
    errors: string[];
}

/**
 * Parses a Devpost human-formatted list into individual items.
 * For example, "A, B, and C" -> ["A", "B", "C"].
 */
function parseHumanList(text: string): string[] {
    if (!text || !text.trim()) return [];

    // Split on ", and ", ", ", or " and "
    return text
        .split(/, (?:and )?| and /)
        .map((s) => s.trim())
        .filter(Boolean);
}

/**
 * Extracts the numeric Devpost submission ID from a submission URL.
 * For example, "https://....devpost.com/submissions/12345-project" -> "12345"
 */
function parseDevpostId(url: string): string | null {
    const match = url.match(/\/submissions\/(\d+)/);
    return match ? match[1] : null;
}

/**
 * Imports registrants from a Devpost CSV export into devpost_users.
 * @param csvText - is the raw CSV text content.
 */
export async function actionImportRegistrants(
    csvText: string,
): Promise<ImportResult | null> {
    const session = await getSession();
    if (!session.user?.id) return null;

    const permission = await getPermissionLevel(session.user.id);
    if (
        permission == null ||
        !hasPermissions(permission, { has: PermissionLevel.Admin })
    ) {
        return null;
    }

    const result: ImportResult = { imported: 0, warnings: [], errors: [] };

    const parsed = Papa.parse<Record<string, string>>(csvText, {
        header: true,
        skipEmptyLines: true,
    });

    if (parsed.errors.length > 0) {
        result.errors.push(
            ...parsed.errors.map((e) => `Row ${e.row}: ${e.message}`),
        );

        // Parsing errors are fatal, since we might put the
        // DB into a bad state if we ignore them.
        return result;
    }

    const promises: Promise<void>[] = [];

    for (let i = 0; i < parsed.data.length; i++) {
        const row = parsed.data[i];

        // Emails need to be normalized for consistency.
        const email = row["Email"]?.trim().toLowerCase();
        if (!email) {
            result.errors.push(`Row ${i + 2}: Missing email address.`);
            continue;
        }

        const firstName = row["First Name"]?.trim() ?? "";
        const lastName = row["Last Name"]?.trim() ?? "";
        const projectUrlsRaw = row["Project URLs"]?.trim() ?? "";

        // People shouldn't be submitting multiple projects, but if they do
        // we'll just use the first one for simplicity.
        const projectUrls = parseHumanList(projectUrlsRaw);
        const projectUrl = projectUrls.length > 0 ? projectUrls[0] : null;

        if (projectUrls.length > 1) {
            result.warnings.push(
                `Row ${i + 2}: Multiple project URLs found for ${email}: ${projectUrls.join(", ")}`,
            );
        }

        promises.push(
            upsertDevpostUser({ firstName, lastName, email, projectUrl }),
        );
    }

    for (const promise of promises) {
        try {
            await promise;
            result.imported++;
        } catch (e) {
            result.errors.push(
                `Failed to import registrant: ${e instanceof Error ? e.message : String(e)}`,
            );
        }
    }

    return result;
}

/**
 * Imports projects from a Devpost CSV export into the projects table.
 * @param csvText - is the raw CSV text content.
 */
async function actionImportProjects(
    csvText: string,
): Promise<ImportResult | null> {
    const session = await getSession();
    if (!session.user?.id) return null;

    const permission = await getPermissionLevel(session.user.id);
    if (
        permission == null ||
        !hasPermissions(permission, { has: PermissionLevel.Admin })
    ) {
        return null;
    }

    const result: ImportResult = { imported: 0, warnings: [], errors: [] };

    // This is a hack, since Devpost puts in the first additional team member as a header
    // and leaves the rest as "...".
    // This just fixes the header so it includes up to a certain number of team member columns.
    // The 5 is completely arbitrary.
    const csvParts = csvText.split("\n");
    csvParts[0] = csvParts[0].replace(
        /,\.\.\.$/,
        "," +
            Array(5)
                .fill("")
                .map(
                    (_, idx) =>
                        `Team Member ${idx + 2} First Name,Team Member ${idx + 2} Last Name,Team Member ${idx + 2} Email`,
                )
                .join(","),
    );
    console.log(csvParts[0]);
    const fixedCSVText = csvParts.join("\n");

    const parsed = Papa.parse<Record<string, string>>(fixedCSVText, {
        header: true,
        skipEmptyLines: true,
    });
    // Different column sizes per row are expected due to
    // the way Devpost handles team sizes.
    parsed.errors = parsed.errors.filter((e) => e.code !== "TooFewFields");

    if (parsed.errors.length > 0) {
        result.errors.push(
            ...parsed.errors.map((e) => `Row ${e.row}: ${e.message}`),
        );

        // Parsing errors are fatal, since we might put the
        // DB into a bad state if we ignore them.
        return result;
    }

    // Fetch known track tags for validation
    let knownTags: string[] = [];
    try {
        knownTags = await getAllTrackTags();
    } catch (e) {
        result.errors.push(
            `Could not fetch known tracks from database: ${e instanceof Error ? e.message : String(e)}`,
        );

        // Not technically fatal, but it indicates a problem with the database.
        return result;
    }

    const promises: Promise<void>[] = [];

    for (let i = 0; i < parsed.data.length; i++) {
        const row = parsed.data[i];

        const submissionUrl = row["Submission Url"]?.trim();
        if (!submissionUrl) {
            // This is expected for unsubmitted projects.
            continue;
        }

        const devpostId = parseDevpostId(submissionUrl);
        if (!devpostId) {
            result.errors.push(
                `Row ${i + 2}: Could not parse Devpost ID from URL: ${submissionUrl}`,
            );
            continue;
        }

        const projectTitle = row["Project Title"]?.trim() ?? "";
        const projectStatus = row["Project Status"]?.trim() ?? "";
        // We select by visible so that we can manually review projects and
        // remove ones we don't want to judge (devpost doesn't allow us to delete projects).
        const submitted =
            projectStatus.toLowerCase().includes("submitted") &&
            projectStatus.toLowerCase().includes("visible");
        const tryUrl = row['"Try it out" Links']?.trim() || null;
        const videoUrl = row["Video Demo Link"]?.trim() || null;
        const mainTrack = row["What Main Track Have You Chosen?"]?.trim() ?? "";
        const sideTracks = parseHumanList(
            row[
                "Which Mlh Prizes Would You Like To Enter Your Project In?"
            ]?.trim() ?? "",
        );

        if (!mainTrack) {
            result.errors.push(
                `Row ${i + 2}: Missing main track for project "${projectTitle}"!`,
            );
            continue;
        }

        // If any selected track isn't a known tag, something has gone wrong.
        if (!knownTags.includes(mainTrack)) {
            result.warnings.push(
                `Row ${i + 2}: Unknown main track "${mainTrack}" for project "${projectTitle}"`,
            );
        }

        for (const tag of sideTracks) {
            if (!knownTags.includes(tag)) {
                result.warnings.push(
                    `Row ${i + 2}: Unknown side track "${tag}" for project "${projectTitle}"`,
                );
            }
        }

        // Collect all team member emails.
        const userEmails: string[] = [];
        const submitterEmail = row["Submitter Email"]?.trim();
        if (submitterEmail) {
            userEmails.push(submitterEmail);
        } else {
            result.warnings.push(
                `Row ${i + 2}: Missing submitter email for project "${projectTitle}"`,
            );
        }

        // Dynamically collect team member emails.
        for (let n = 1; ; n++) {
            const emailCol = row[`Team Member ${n} Email`]?.trim();
            // This means we've read the last valid column.
            if (emailCol === undefined) break;

            if (emailCol) {
                userEmails.push(emailCol);
            }
        }

        // We can't enforce this requirement on Devpost, but we can at least
        // stay informed of any teams that are non-compliant.
        if (
            userEmails.length < MIN_TEAM_SIZE ||
            userEmails.length > MAX_TEAM_SIZE
        ) {
            result.warnings.push(
                `Row ${i + 2}: Invalid team size for project "${projectTitle}" (${userEmails.length} members, expected ${MIN_TEAM_SIZE} to ${MAX_TEAM_SIZE})`,
            );
        }

        const project: Omit<Project, "id" | "room" | "tableNum"> = {
            devpostId,
            projectTitle,
            submissionUrl,
            submitted,
            // TODO: Figure out how to find devpost image.
            devpostImage: null,
            tryUrl,
            videoUrl,
            mainTrack,
            sideTracks,
            userEmails,
        };

        promises.push(upsertProject(project));
    }

    for (const promise of promises) {
        try {
            await promise;
            result.imported++;
        } catch (e) {
            result.errors.push(
                `Failed to import project: ${e instanceof Error ? e.message : String(e)}`,
            );
        }
    }

    return result;
}

export default actionImportProjects;

/**
 * Automatically syncs matched devpost emails, creates pairing codes for unlinked ones,
 * and blasts out SES emails to new unlinked devs or retries after 7 days.
 *
 * @returns the number of emails sent and any error message if applicable.
 */
export async function actionSyncDevpostEmails(): Promise<{
    sent: number;
    error: string;
} | null> {
    const session = await getSession();
    await ensureAdminPermission(session);

    try {
        const pendingEmails = await syncDevpostEmailsToUsers();

        if (pendingEmails.length === 0) {
            return {
                sent: 0,
                error: "No emails currently require syncing, no linking emails sent.",
            };
        }

        // In production, this will be 50 as a reasonable safe batch size.
        // SES has a default sending limit of 14 emails per second, so 50 with a short delay is a safe bet to avoid hitting rate limits while still processing the queue in a timely manner.
        const MAX_EMAILS = 50;
        const emailsToProcess = pendingEmails.slice(0, MAX_EMAILS);

        const { successfulEmails, failedEmails } =
            await sendDevpostLinkingEmails(emailsToProcess);

        if (successfulEmails.length > 0) {
            await markDevpostCodesAsSent(successfulEmails);
        }

        if (failedEmails.length > 0) {
            return {
                sent: successfulEmails.length,
                error: `Sent ${successfulEmails.length}, but failed to send ${failedEmails.length} emails. Failed emails: ${failedEmails.map((failed) => failed.email).join(", ")}`,
            };
        }

        return { sent: successfulEmails.length, error: "" };
    } catch (error) {
        console.error("\n==== AWS SES DETAILED ERROR ==== \n", error);
        return {
            sent: 0,
            error: error instanceof Error ? error.message : String(error),
        };
    }
}

/**
 * Links a user's account to a devpost email based on a code they received in an email.
 *
 * @param code - the code that was sent in the email link to users to link their devpost account.
 */
export async function actionLinkDevpostAccount(code: string): Promise<{
    success: boolean;
    error: string;
}> {
    const session = await getSession();
    if (!session.user?.id)
        return { success: false, error: "Authentication failed" };

    const devpostEmail = await getEmailFromCode(code);
    if (!devpostEmail)
        return { success: false, error: "Invalid or expired code" };

    try {
        await linkDevpostEmailToUser(devpostEmail, session.user.id);
        revalidatePath("/dashboard");
    } catch (error) {
        console.error(
            `Error linking devpost email ${devpostEmail} to user ${session.user.id}:`,
            error,
        );
        return {
            success: false,
            error: "An internal error occurred while linking your account.",
        };
    }

    return { success: true, error: "" };
}
