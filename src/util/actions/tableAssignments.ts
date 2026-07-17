"use server";

import { getAllProjects } from "../db/project";
import { sendTableAssignmentEmails } from "../awsSes";
import { ensureAdminPermission } from "../staff";
import { getSession } from "../session";

export async function actionSendTableAssignments() {
    try {
        const session = await getSession();
        await ensureAdminPermission(session);
        const projects = await getAllProjects();

        const results = await sendTableAssignmentEmails(projects);

        return {
            success: true,
            sent: results.successfulEmails.length,
            failed: results.failedEmails.length,
        };
    } catch (error) {
        console.error("actionSendTableAssignments error:", error);

        return {
            success: false,
            error: "Failed to send table assignment emails",
        };
    }
}
