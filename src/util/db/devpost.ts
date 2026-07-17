import "server-only";

import sql from "@/src/util/database";
import { DevpostUser, Project } from "@/src/util/dataTypes";

/**
 * Upserts a Devpost registrant into the devpost_users table.
 * @param user - is the registrant to upsert.
 */
export async function upsertDevpostUser(
    user: Omit<DevpostUser, "id">,
): Promise<void> {
    await sql`
        INSERT INTO devpost_users (first_name, last_name, email, project_url)
        VALUES (${user.firstName}, ${user.lastName}, ${user.email}, ${user.projectUrl})
        ON CONFLICT (email) DO UPDATE SET
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            project_url = EXCLUDED.project_url
    `;
}

/**
 * Upserts a project into the projects table.
 * @param project - is the project to upsert.
 */
export async function upsertProject(
    project: Omit<Project, "id" | "room" | "tableNum">,
): Promise<void> {
    await sql`
        INSERT INTO projects (devpost_id, project_title, submission_url, submitted, devpost_image, try_url, video_url, main_track, side_tracks, user_emails)
        VALUES (${project.devpostId}, ${project.projectTitle}, ${project.submissionUrl}, ${project.submitted}, ${project.devpostImage}, ${project.tryUrl}, ${project.videoUrl}, ${project.mainTrack}, ${project.sideTracks}, ${project.userEmails})
        ON CONFLICT (devpost_id) DO UPDATE SET
            project_title = EXCLUDED.project_title,
            submission_url = EXCLUDED.submission_url,
            submitted = EXCLUDED.submitted,
            devpost_image = EXCLUDED.devpost_image,
            try_url = EXCLUDED.try_url,
            video_url = EXCLUDED.video_url,
            main_track = EXCLUDED.main_track,
            side_tracks = EXCLUDED.side_tracks,
            user_emails = EXCLUDED.user_emails
    `;
}

/**
 * Returns all devpost_tag values from the tracks table.
 */
export async function getAllTrackTags(): Promise<string[]> {
    const data =
        await sql`SELECT devpost_tag FROM tracks WHERE devpost_tag IS NOT NULL`;
    return data.map((row) => row.devpost_tag);
}

/**
 * Syncs devpost emails to users by:
 * 1. Link matching emails between users and imported devpost_users
 * 2. Create devpost_codes entries for unlinked devpost_users to send linking emails to.
 *
 * 3. Returns rows where:
 *      - no linked user exists and
 *      - no code was sent last in the lest 7 days.
 *
 * @returns the list of devpost_emails and codes that need linking emails sent.
 */
export async function syncDevpostEmailsToUsers() {
    // 1. Auto-linking perfectly matching emails.
    await sql`
        UPDATE users 
        SET devpost_email = email 
        WHERE devpost_email IS NULL 
          AND email IN (SELECT email FROM devpost_users)
          AND email NOT IN (SELECT devpost_email FROM users WHERE devpost_email IS NOT NULL);
    `;

    // 2. Inserting into devpost_codes for unlinked devpost_users (if they are in users table with a linked devpost_email, we ignore them).
    await sql`
        INSERT INTO devpost_codes (devpost_email)
        SELECT du.email FROM devpost_users du
        LEFT JOIN users u ON u.devpost_email = du.email
        WHERE u.id IS NULL
        ON CONFLICT DO NOTHING;
    `;

    // 3. Find codes that need emails sent (sent > 7 days ago, OR never sent)
    // AND haven't been linked by a user yet.
    const toEmail = await sql`
        SELECT dc.devpost_email, dc.code 
        FROM devpost_codes dc
        LEFT JOIN users u ON u.devpost_email = dc.devpost_email
        WHERE u.id IS NULL 
          AND (dc.last_sent_at IS NULL OR dc.last_sent_at <= now() - interval '1 days');
    `;

    return toEmail.map((row) => ({
        devpost_email: row.devpost_email,
        code: row.code,
    }));
}

/**
 * Updates devpost codes as sent in the database.
 *
 * @param emails - the list of devpost_emails that we just sent linking emails to.
 */
export async function markDevpostCodesAsSent(emails: string[]) {
    if (emails.length === 0) return;
    await sql`UPDATE devpost_codes SET last_sent_at = now() WHERE devpost_email = ANY(${emails}::text[])`;
}

/**
 * Retrieves the devpost_email associated with a given code.
 *
 * @param code - the code that was sent in the email link to users to link their devpost account.
 * @return the devpost_email associated with the code, or null if no valid code is found.
 */
export async function getEmailFromCode(code: string): Promise<string | null> {
    const result =
        await sql`SELECT devpost_email FROM devpost_codes WHERE code = ${code}`;
    if (result.length === 0) {
        return null;
    }
    return result[0].devpost_email;
}

/**
 * Fetch the current user's devpost_email from the database.
 *
 * @param userId - the ID of the user to fetch the devpost_email for.
 * @return the devpost_email associated with the user, or null if no email is linked.
 */
export async function getDevpostEmailByUserId(
    userId: number,
): Promise<string | null> {
    const result =
        await sql`SELECT devpost_email FROM users WHERE id = ${userId}`;
    if (result.length === 0) {
        return null;
    }
    return result[0].devpost_email;
}

/**
 * Checks if a given devpost email is already linked to another user's account, and returns that user's ID if so.
 *
 * @param devpostEmail - the devpost email to check for conflicts.
 * @returns the ID of the user who holds that email, or null if no conflict exists.
 */
export async function getUserIdByDevpostEmail(
    devpostEmail: string,
): Promise<number | null> {
    const result = await sql`
        SELECT id FROM users 
        WHERE devpost_email = ${devpostEmail} 
        LIMIT 1
    `;
    return result.length > 0 ? result[0].id : null;
}

/**
 * Fetches the room and table assignment for a user's project.
 * A project belongs to the user when their devpost_email matches one
 * of the project's user_emails. Only returns a result when both room
 * and table are assigned, just in case.
 *
 * @param userId - is the ID of the user to look up a project placement for.
 * @returns the room and table number, or null if none is found.
 */
export async function getProjectPlacementForUser(
    userId: number,
): Promise<{ room: string; tableNum: number } | null> {
    const result = await sql`
        SELECT p.room, p.table_num
        FROM projects p
        INNER JOIN users u ON u.devpost_email = ANY(p.user_emails)
        WHERE u.id = ${userId}
          AND p.room IS NOT NULL
          AND p.table_num IS NOT NULL
        LIMIT 1
    `;

    if (result.length === 0) {
        return null;
    }
    return {
        room: result[0].room,
        tableNum: result[0].table_num,
    };
}

/**
 * Links a Devpost email to a user's account. This function first removes the devpost email from any other user that currently has it linked to prevent UNIQUE constraint errors, and then links it to the specified user.
 *
 * @param devpostEmail - the Devpost email to link.
 * @param userId - the ID of the user to link the email to.
 */
export async function linkDevpostEmailToUser(
    devpostEmail: string,
    userId: number,
): Promise<void> {
    await sql.begin(async (sql) => {
        await sql`
            UPDATE users 
            SET devpost_email = NULL 
            WHERE devpost_email = ${devpostEmail} AND id != ${userId}
        `;

        await sql`
            UPDATE users 
            SET devpost_email = ${devpostEmail}
            WHERE id = ${userId}
        `;
    });
}
