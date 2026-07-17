/**
 * The base path the site is served under (e.g. "/uwb-hacks-26-archive" for a
 * GitHub Pages project site, or "" for a root/custom-domain deploy).
 *
 * `next/image` and `next/link` prepend the configured basePath automatically,
 * but only for imported static assets — plain string `src="/foo.png"` paths are
 * left untouched. Use `asset()` for those so they resolve on a subpath deploy.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Prefixes a public (`/...`) asset path with the deploy base path.
 */
export function asset(path: string): string {
    return `${BASE_PATH}${path}`;
}
