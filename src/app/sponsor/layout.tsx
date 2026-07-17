import React from "react";
import Header from "@/src/components/header/Header";
import Footer from "@/src/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sponsor Us | UWB Hacks 26",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={`w-full`}>
            <Header bgColor={"#0d83db"} links={[]} />
            {children}
            <Footer className={"bg-[#13c5f8] text-white/80"} />
        </div>
    );
}
