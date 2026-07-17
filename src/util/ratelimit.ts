import ipaddr from "ipaddr.js";
import { Session } from "@/src/util/session";
import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/src/util/redis";

export const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(1000, "5 s"),
});

/**
 * Returns a unique key to ratelimit a user (based on user ID or IP address).
 * If something goes wrong, this falls back to ratelimiting every request under
 * the same key.
 *
 * @param session - is the user's session (if it exists).
 * @param ip - is the user's IP address (if it exists).
 */
export function rateLimitKey(
    session: Session | null,
    ip: string | null | undefined,
): string {
    // If the user is logged in, we can grant them their own session.
    // This will alleviate issues caused by users sharing the same IP
    // during the hackathon.
    if (session?.user?.id != null) {
        return `user:${session.user.id.toString()}`;
    }

    if (ip == null) {
        // This is expected in development, since it goes through
        // Vercel's IP headers, but it should never happen in production.
        // If it does, all IPs will be pooled under the same ratelimit.
        if (process.env.NODE_ENV === "production") {
            console.error("Ratelimit IP is null!");
        }

        return "global";
    }

    let addr: ipaddr.IPv4 | ipaddr.IPv6;
    try {
        addr = ipaddr.process(ip);
    } catch (e) {
        // Again, this should never happen, but it's better
        // to apply global ratelimiting than to fail every request.
        console.error(e);
        return "global";
    }
    // This handles IPv4 and IPv4-in-IPv6 addresses.
    if (addr.kind() === "ipv4") return `ipv4:${addr.toString()}`;

    // We need to apply a /64 mask to IPv6 addresses, since that's how they're typically
    // distributed. Otherwise, the space is too wide for rate limiting to have any effect.
    // We can do this by just taking only the first half of the address.
    // This isn't a valid IPv6 address (nor is it compacted), but it's unique for ratelimiting
    // purposes.
    const maskedAddr = (addr as ipaddr.IPv6).parts
        .slice(0, 4)
        .map((p) => p.toString(16))
        .join(":");
    return `ipv6:${maskedAddr}`;
}
