"use client";

import Script from "next/script";

declare global {
    interface Window {
        dataLayer: unknown[];
    }
}

// This needs to be outside the component
// so it gets executed immediately, which is how
// the Google Analytics script works.
if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer.push(arguments);
    }
    // @ts-expect-error gtag
    gtag("js", new Date());
    // @ts-expect-error gtag
    gtag("config", "G-Q3ES8YLK92");
}

export function Analytics() {
    return (
        <>
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-Q3ES8YLK92"
                strategy="afterInteractive"
            />
        </>
    );
}
