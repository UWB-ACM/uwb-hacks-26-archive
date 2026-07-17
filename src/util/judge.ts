import { hasPermissions, PermissionLevel } from "@/src/util/dataTypes";
import { redirectToLogin, Session } from "@/src/util/session";
import { getPermissionLevel } from "@/src/util/db/user";
import { redirect } from "next/navigation";

/**
 * This validates that the requesting user has Judge level permissions.
 * If the user does not meet these requirements, they will be redirected
 * @param session  - is the session of the requester.
 * @returns  the user's permissions.
 */
export async function ensureJudgePermission(
    session: Session,
): Promise<PermissionLevel | never> {
    if (!session.user?.id) return await redirectToLogin(session);

    // Ensure that the user has permission
    const permission = await getPermissionLevel(session.user.id);

    if (
        permission == null ||
        !hasPermissions(permission, { has: PermissionLevel.Judge })
    ) {
        return redirect("/");
    }

    return permission;
}
