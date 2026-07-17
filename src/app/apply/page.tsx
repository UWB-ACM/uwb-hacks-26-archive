import React from "react";
import { Metadata } from "next";
import Footer from "@/src/components/Footer";
import Header from "@/src/components/header/Header";
import ApplicationForm from "../../components/apply/FormContainer";
import { getSession, redirectToLogin } from "@/src/util/session";
import { getApplication } from "@/src/util/db/application";

export const metadata: Metadata = {
    title: "Participant Application | UWB Hacks 26",
};

export default async function ApplyPage() {
    // Users need an account before they can submit an application.
    const session = await getSession();
    if (session.user?.id == null) {
        await redirectToLogin(session);
        return;
    }

    const details = await getApplication(session.user.id);

    return (
        <div className="w-full min-h-screen flex flex-col">
            <Header links={[{ id: "about", name: "About", url: "/#about" }]} />
            <main className="flex-1 flex flex-col">
                <ApplicationForm initialApp={details} />
            </main>
            <Footer className={"bg-[var(--grass-color)] text-white/80"} />
        </div>
    );
}
