import React from "react";
import Header, { handleLogout } from "@/src/components/header/Header";
import Footer from "@/src/components/Footer";
import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Dashboard | UWB Hacks 26",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={`${geistSans.variable} ${geistMono.variable} w-full`}>
            <Header
                links={[
                    {
                        id: "logout",
                        name: "Logout",
                        customOnClick: handleLogout,
                    },
                ]}
            />

            {children}

            <Footer />
        </div>
    );
}
