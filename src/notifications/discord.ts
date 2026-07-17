import "server-only";
import { setTimeout as delay } from "node:timers/promises";

const botToken = process.env.DISCORD_BOT_TOKEN!;

async function sendDM(userId: string, message: string) {
    const dmRes = await fetch(
        "https://discord.com/api/v10/users/@me/channels", // create a DM channel for the bot
        {
            method: "POST",
            headers: {
                Authorization: `Bot ${botToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                recipient_id: userId, // recipient of the DM channel
            }),
        },
    );

    const dm = await dmRes.json(); // stores DM channel ID (used to send a message) and type

    // sends a message through the DM channel
    await fetch(`https://discord.com/api/v10/channels/${dm.id}/messages`, {
        method: "POST",
        headers: {
            Authorization: `Bot ${botToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            content: message, // the message we send
        }),
    });
}

// send DMs to a list of users (broadcast)
export async function broadcastDM(userIds: string[], message: string) {
    for (const id of userIds) {
        try {
            await sendDM(id, message);

            // basic rate limit safety
            delay(50); // 20 requests per second (safely under Discord's limit: 50 per second)
        } catch (err) {
            console.error(`Failed to DM ${id}`, err);
        }
    }
}
