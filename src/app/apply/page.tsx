import React from "react";
import { Metadata } from "next";
import Footer from "@/src/components/Footer";
import Header from "@/src/components/header/Header";
import ApplicationForm from "../../components/apply/FormContainer";

export const metadata: Metadata = {
    title: "Participant Application | UWB Hacks 26",
};

export default function ApplyPage() {
    // On the archived site there's no account system, so the form starts
    // empty and submissions aren't persisted.
    return (
        <div className="w-full min-h-screen flex flex-col">
            <Header links={[{ id: "about", name: "About", url: "/#about" }]} />
            <main className="flex-1 flex flex-col">
                <ApplicationForm initialApp={null} />
            </main>
            <Footer className={"bg-[var(--grass-color)] text-white/80"} />
        </div>
    );
}
