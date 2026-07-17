"use server";
import { sendProjectFeedbackEmails } from "../awsSes";
import { ensureAdminPermission } from "../staff";
import { getSession } from "../session";
import { getAllProjectFeedback } from "../db/project";

export async function actionSendProjectFeedback() {
    try {
        const session = await getSession();
        await ensureAdminPermission(session);

        const projectsWithFeedback = await getAllProjectFeedback();

        const results = await sendProjectFeedbackEmails(projectsWithFeedback);

        return {
            success: true,
            sent: results.allSuccessfulEmails.length,
            failed: results.allFailedEmails,
        };
    } catch (error) {
        console.error("actionSendProjectFeedback error:", error);

        return {
            success: false,
            error: "Failed to send project feedback emails",
        };
    }
}
