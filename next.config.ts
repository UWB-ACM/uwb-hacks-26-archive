import type { NextConfig } from "next";

// When deploying to a GitHub Pages *project* site the app is served from
// https://<user>.github.io/<repo>/, so it needs a base path. Set the
// PAGES_BASE_PATH env var (e.g. "/uwb-hacks-26-archive") in that case. For a
// custom domain or a user/org root site, leave it unset.
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig: NextConfig = {
    // Emit a fully static site into `out/` that GitHub Pages can serve.
    output: "export",
    // GitHub Pages has no image optimization server.
    images: {
        unoptimized: true,
    },
    basePath: basePath || undefined,
    // Expose the base path to client code so `asset()` can prefix plain
    // string image `src`s (which next/image does not prefix automatically).
    env: {
        NEXT_PUBLIC_BASE_PATH: basePath,
    },
    // Serve every route as a folder with an index.html so refreshes / deep
    // links resolve on a static host.
    trailingSlash: true,
};

export default nextConfig;
