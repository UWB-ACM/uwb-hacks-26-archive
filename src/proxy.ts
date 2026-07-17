import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ensureSession, SESSION_DATA_HEADER } from "@/src/util/session";
import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { ipAddress } from "@vercel/functions";
import { ratelimit, rateLimitKey } from "@/src/util/ratelimit";

export async function proxy(req: NextRequest) {
    const cookies = createCookieSync(req);

    // We're using the return value for ratelimiting, but ensureSession always
    // needs to be called here so that downstream code has a session cookie.
    const session = await ensureSession(req, cookies);

    const ratelimitID = rateLimitKey(session, ipAddress(req));
    const ratelimitRes = await ratelimit.limit(ratelimitID);
    if (!ratelimitRes.success) {
        // This is 500 instead of 429 so that NextJS server actions get rejected.
        // Otherwise, the error might get hidden.
        return new NextResponse("Too many requests!", { status: 500 });
    }

    // We need to pass the URL through as headers since NextJS
    // doesn't allow us to access it in server components
    // otherwise.
    req.headers.set("x-current-url", req.url);

    // Forward the already-fetched session so that downstream getSession()
    // calls can skip their own Redis read entirely.
    //
    // TODO: Encoding in base64 is a hack to force it to ASCII, since
    //       we hit errors with non-ASCII chars.
    req.headers.set(SESSION_DATA_HEADER, btoa(JSON.stringify(session)));

    const res = NextResponse.next({ request: { headers: req.headers } });
    cookies.apply(res);

    return res;
}

export const config = {
    /**
     * Run on all routes except:
     * - /_next/static  — pre-built JS/CSS bundles (fetched many times per page load)
     * - /_next/image   — image optimisation endpoint
     * - /favicon.ico and common static file extensions
     *
     * Without this exclusion, every asset fetch would trigger ensureSession +
     * ratelimit.limit(), each of which costs Redis commands.
     */
    matcher: [
        "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    ],
};

/**
 * For some reason, NextJS has decided that to set cookies in the middleware and have
 * them appear in both the browser and downstream server code, we must do the following:
 * 1. Set the cookie on the request object. This must happen before the response object is made.
 *    Data like expiration, etc. is not preserved.
 * 2. Create a response object and copy the newly modified headers to it during construction.
 * 3. Add the same cookies that we added in (1) to the response object, plus extra data like expiration.
 *
 * This is a helper to let us do these steps without interleaving all the middleware code.
 * The middleware functions just call get/set, which works off of the request object, and then we can
 * call apply to do the second pass on response.
 */
export interface CookieSync {
    get(name: string): string | undefined;
    set(cookie: ResponseCookie): void;
    delete(name: string): void;
    apply(response: NextResponse): void;
}

function createCookieSync(request: NextRequest): CookieSync {
    const pending: ResponseCookie[] = [];

    return {
        get(name) {
            return request.cookies.get(name)?.value;
        },
        set(cookie) {
            request.cookies.set(cookie.name, cookie.value);
            pending.push(cookie);
        },
        delete(name) {
            request.cookies.delete(name);
            pending.push({ name, value: "", maxAge: 0 });
        },
        apply(response) {
            for (const cookie of pending) {
                response.cookies.set(cookie);
            }
        },
    };
}
