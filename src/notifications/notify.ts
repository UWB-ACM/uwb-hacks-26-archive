import "server-only";
import { getGuildMembers } from "./guild";
import { broadcastDM } from "./discord";

// Send a message to ALL guild members (bulk DM)
export async function notifyAll(message: string) {
    const members = await getGuildMembers();

    const users: string[] = members
        .filter((m) => m.user && !m.user.bot)
        .map((m) => m.user.id);

    return await broadcastDM(users, message);
}
