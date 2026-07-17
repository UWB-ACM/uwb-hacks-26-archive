"use server";
import "server-only";

import { ApplicationData } from "@/src/util/dataTypes";
import { getApplication, saveApplication } from "../db/application";
import { getSession } from "../session";
import { validateApplicationData } from "../applicationValidation";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET } from "../r2";

/**
 * Saves the application data for the user who sent this request.
 * If they already sent an application, override it.
 *
 * @param formData - should contain "applicationData" (JSON-stringified ApplicationData)
 *                   and "resume" (optional, File object).
 */
export async function actionSaveApplication(formData: FormData) {
    const session = await getSession();

    const userID = session.user?.id;
    if (!userID) {
        throw new Error(
            "User ID not found when attempting to save hackathon application",
        );
    }

    const rawData = formData.get("applicationData");
    if (typeof rawData !== "string") {
        throw new Error("Application data is missing or invalid");
    }

    const data: ApplicationData = JSON.parse(rawData);

    // Resume is optional.
    let resumeFile = formData.get("resume");
    if (!(resumeFile instanceof File) || resumeFile.size < 0) {
        resumeFile = null;
    }

    const deleteResume = formData.get("deleteResume") === "true";

    // Get the old application data so we can cleanup the old resume if the
    // type changes or the user explicitly deletes it.
    // There's a small race condition here, but it's unlikely to happen in the real world:
    // - Request 1 sends resume.docx
    // - Request 1 fetches old application
    // - Request 2 sends resume.pdf, saves it, and updates everything
    // - Request 1 deletes resume.doc (old resume), saves the new one, and updates everything
    const existing = await getApplication(userID);
    const oldResumeType = existing?.resumeType ?? null;

    if (deleteResume && !resumeFile) {
        // User explicitly removed their resume without uploading a new one
        data.resumeType = null;
    } else if (!resumeFile) {
        // No new file, no deletion request from user, so keep it the same.
        data.resumeType = oldResumeType;
    }

    const validationErrors = validateApplicationData(data, resumeFile);
    if (validationErrors) {
        throw new Error(`Application data is invalid: ${validationErrors}`);
    }

    await saveApplication(userID, data);

    // If we're uploading a new file type, we need to clean up
    // the old resume since otherwise we'd end up with two files.
    if (oldResumeType && oldResumeType !== data.resumeType) {
        try {
            await r2Client.send(
                new DeleteObjectCommand({
                    Bucket: R2_BUCKET,
                    Key: `resumes/${userID}.${oldResumeType}`,
                }),
            );
        } catch {
            // Best-effort cleanup — don't fail the request
        }
    }

    // Upload resume if requested
    if (resumeFile) {
        const ext = data.resumeType!;
        const key = `resumes/${userID}.${ext}`;

        await r2Client.send(
            new PutObjectCommand({
                Bucket: R2_BUCKET,
                Key: key,
                Body: Buffer.from(await resumeFile.arrayBuffer()),
                ContentType: resumeFile.type || "application/octet-stream",
            }),
        );
    }
}
