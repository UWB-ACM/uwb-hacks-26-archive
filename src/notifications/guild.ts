import "server-only";

const guildId = process.env.DISCORD_GUILD_ID!;
const botToken = process.env.DISCORD_BOT_TOKEN!;
const batchLength = 1000;

export async function getGuildMembers() {
    let after = "0";
    const allMembers: { user: { bot: boolean; id: string } }[] = [];

    while (true) {
        const res = await fetch(
            `https://discord.com/api/v10/guilds/${guildId}/members?limit=${batchLength}&after=${after}&with_user=true`,
            {
                headers: {
                    Authorization: `Bot ${botToken}`,
                },
            },
        );

        if (!res.ok) {
            const text = await res.text();
            throw new Error(`Discord API error: ${res.status} - ${text}`);
        }

        const batch = await res.json();

        if (!Array.isArray(batch) || batch.length === 0) break;

        allMembers.push(...batch);

        after = batch[batch.length - 1].user.id;

        // safety break (prevents infinite loops)
        if (batch.length < batchLength) break;
    }

    return allMembers;
}
