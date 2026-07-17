import "server-only";

import { cache } from "react";
import { cookies, headers } from "next/headers";
import { buildKey, redis } from "@/src/util/redis";
import { NextRequest } from "next/server";
import { User } from "./dataTypes";
import { redirect } from "next/navigation";
import { CookieSync } from "@/src/proxy";

/** Header name used to pass session data from middleware to RSC without a second Redis fetch. */
export const SESSION_DATA_HEADER = "x-session-data";

export const cookieName =
    process.env.NODE_ENV === "development"
        ? "session-uwbh25-dev"
        : "__Host-session-uwbh25";

/**
 * The time that a session should last for, in seconds.
 */
const sessionTimeSeconds = 7 * 24 * 60 * 60;

/**
 * The part of a user that's available in a session.
 * These need to be parts of the user that never change,
 * as we don't have a mechanism to refresh the user's
 * data.
 */
export type SessionUser = Pick<User, "id" | "name" | "email" | "picture">;

/**
 * The data associated with a user's session.
 *
 * This is just a regular object, and changes to
 * it won't persist across requests.
 * To save a modification to it, use saveSession.
 */
export interface Session {
    /**
     * The user's data (if they're authenticated).
     * This only includes data that realistically should
     * never change.
     * Other data needs to be queried per-request.
     */
    user?: SessionUser;

    /**
     * A random value to prevent tampering with the auth URL.
     */
    googleState?: string;

    /**
     * A path to redirect to after authentication has succeeded.
     */
    redirectAfter?: string;
}

/**
 * Gets the user's session.
 * If it can't be loaded for some reason, this returns
 * an empty session.
 *
 * Results are deduplicated per render via React cache(), so calling this
 * multiple times in the same render tree costs only one Redis read.
 * When middleware is active it passes the already-fetched session via the
 * x-session-data header, eliminating the Redis read entirely.
 */
export const getSession = cache(async function getSession(): Promise<Session> {
    // If middleware already fetched the session, use that instead of Redis.
    const headerList = await headers();
    const sessionHeader = headerList.get(SESSION_DATA_HEADER);
    if (sessionHeader) {
        try {
            // TODO: See proxy.ts for info about the decoding.
            const parsed = JSON.parse(atob(sessionHeader));
            if (parsed && typeof parsed === "object") {
                return parsed as Session;
            }
        } catch {
            // Fall through to the Redis read if the header is malformed.
        }
    }

    const cookieStore = await cookies();

    const cookie = cookieStore.get(cookieName);
    if (!cookie?.value) {
        console.error("No session cookie found.");
        return {};
    }

    // We have a session ID, so try to read the data for it.
    const data = await redis.get<Session>(buildKey("session", cookie.value));
    if (!data || typeof data !== "object") {
        console.error("Session data is invalid.");
        return {};
    }

    return data;
});

/**
 * Ensures that a request/response has a session, and returns it.
 */
export async function ensureSession(
    req: NextRequest,
    cookies: CookieSync,
): Promise<Session> {
    const cookie = req.cookies.get(cookieName);

    // If we have a cookie, ensure that it points to a valid session.
    // Otherwise, create a new one.
    if (cookie?.value) {
        // On routes that use session (almost all of them), this
        // will probably lead to extra unneeded redis fetches.
        // Apparently NextJS doesn't support sessions very well.
        // The only real solution is to create a fake session-data
        // header that gets passed on to later code, but I'm not sure
        // if there are security concerns with that, and it just
        // feels like a poor solution overall.
        const data = await redis.get<Session>(
            buildKey("session", cookie.value),
        );
        if (data && typeof data === "object") {
            return data;
        }
    }

    const newSessionId = crypto.randomUUID();

    // Save an empty session.
    await redis.set(buildKey("session", newSessionId), "{}", {
        ex: sessionTimeSeconds,
    });

    // Dates are in milliseconds
    const expiresAt = new Date(Date.now() + sessionTimeSeconds * 1000);

    cookies.set({
        name: cookieName,
        value: newSessionId,
        expires: expiresAt,
        httpOnly: true,
        // Development isn't a secure context.
        secure: process.env.NODE_ENV !== "development",
        // Not strict because the session may be used to
        // generate first load HTML, and to enable auth
        // with OAuth2 redirects.
        sameSite: "lax",
    });

    // New sessions are empty.
    return {};
}

/**
 * Saves the new session data.
 * This can only be used in server actions or API routes.
 *
 * @param data - is the new session data to save.
 */
export async function saveSession(data: Session): Promise<void> {
    const cookieStore = await cookies();

    const cookie = cookieStore.get(cookieName);
    if (!cookie?.value) {
        // This shouldn't happen, since every user should
        // have a session.
        // We could try to create a new session for them, but
        // this indicates a deeper issue and doing so will only
        // lead to confusion.
        // This function isn't used for displaying the site itself,
        // rather providing interactive functionality, so erroring here
        // will still allow most of the site to function.
        throw new Error(
            "Tried to save session data without a valid session cookie!",
        );
    }

    await redis.set(buildKey("session", cookie.value), JSON.stringify(data), {
        ex: sessionTimeSeconds,
    });
}

/**
 * Sends the user to the login page.
 * This can only be used in server actions or API routes.
 * In client components, send them to /api/auth/google.
 *
 * @param session - is the user's session.
 */
export async function redirectToLogin(session: Session): Promise<never> {
    // Once auth is done, send the user back to the URL they were trying to access.
    // This is always a URL on the website, so no validation is required.
    //
    // The URL the user accessed this page from gets injected into the
    // header by the middleware.
    // This is required because we can't access it otherwise.
    const headerList = await headers();
    const curURL = headerList.get("x-current-url");
    if (curURL) {
        session.redirectAfter = curURL;
        await saveSession(session);
    }

    redirect("/api/auth/google");
}
