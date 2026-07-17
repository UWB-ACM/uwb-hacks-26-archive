import type { Metadata, Viewport } from "next";
import React from "react";
import Header from "@/src/components/header/Header";
import Footer from "@/src/components/Footer";

const title = "UWB Hacks 2026";
const description =
    "Students assemble! We need your skills, NOW! Combine forces and push your potential to the limit at the 10th annual UW Bothell Hackathon, UWB Hacks 2026: The Future!";
const url = "https://uwbhacks.com/";

export const metadata: Metadata = {
    title,
    description,
    alternates: {
        canonical: url,
    },
    twitter: {
        title,
        description,
        card: "summary_large_image",
        images: {
            url: "https://uwbhacks.com/card-image.png",
            width: 1358,
            height: 827,
        },
    },
    openGraph: {
        url,
        title,
        description,
        locale: "en_US",
        images: {
            url: "https://uwbhacks.com/card-image.png",
            width: 1358,
            height: 827,
        },
    },
    robots: "max-image-preview:large",
};

export const viewport: Viewport = {
    themeColor: "#11c4f8",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={`antialiased w-full`}>
            <Header links={[]} />
            {children}
            <Footer />
        </div>
    );
}
