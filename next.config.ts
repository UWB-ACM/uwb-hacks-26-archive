import type { NextConfig } from "next";

const cspHeader = `
    default-src 'self';
    script-src 'self'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} 'unsafe-inline' https://*.googletagmanager.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://s3.amazonaws.com https://*.google-analytics.com https://*.googletagmanager.com;
    connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    frame-src https://strawpoll.com;
    upgrade-insecure-requests;
`;

const nextConfig: NextConfig = {
    experimental: {
        serverActions: {
            bodySizeLimit: "6mb",
        },
    },
    images: {
        formats: ["image/avif", "image/webp"],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "placehold.co",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "www.gravatar.com",
            },
        ],
    },
    redirects() {
        return [
            {
                source: "/login",
                destination: "/api/auth/google",
                permanent: false,
            },
            {
                source: "/links/yardsign",
                destination: "/?utm_source=yardsign",
                permanent: false,
            },
            {
                source: "/links/standingbanner",
                destination: "/?utm_source=standingbanner",
                permanent: false,
            },
            {
                source: "/links/visits",
                destination: "/?utm_source=visits",
                permanent: false,
            },
        ];
    },
    headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: cspHeader.replace(/\n/g, ""),
                    },
                ],
            },
        ];
    },
};

export default nextConfig;
