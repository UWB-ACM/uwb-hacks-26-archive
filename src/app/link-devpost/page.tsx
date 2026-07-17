import React from "react";
import { Metadata } from "next";
import Header from "@/src/components/header/Header";
import Footer from "@/src/components/Footer";
import { getSession, redirectToLogin } from "@/src/util/session";
import {
    getEmailFromCode,
    getUserIdByDevpostEmail,
    getDevpostEmailByUserId,
} from "@/src/util/db/devpost";
import { getApplication } from "@/src/util/db/application";
import LinkDevpostClient from "./LinkDevpostClient";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Link Devpost Account | UWB Hacks 26",
};

export default async function LinkDevpostPage({
    searchParams,
}: {
    searchParams: Promise<{ code?: string }>;
}) {
    const session = await getSession();
    if (!session.user?.id) {
        await redirectToLogin(session);
        return null;
    }

    const resolvedParams = await searchParams;
    const code = resolvedParams.code;

    let devpostEmail = "";
    let devpostConflict = false;
    let uwbHacksConflict = false;
    let applicationWarning = false;
    let hasApplication = false;

    if (!code) {
        // No code provided
        return redirect("/");
    }
    const fetchedDevpostEmail = await getEmailFromCode(code);
    if (!fetchedDevpostEmail) {
        // Code does not correspond to any email
        return redirect("/");
    }

    devpostEmail = fetchedDevpostEmail;

    // Check current user's DB record to see what they are currently linked to
    const uwbHacksEmail = await getDevpostEmailByUserId(session.user.id);

    // Look up who else might own this link's Devpost email
    const devpostOwnerId = await getUserIdByDevpostEmail(devpostEmail);

    const conflictingUserId =
        devpostOwnerId !== null && devpostOwnerId !== session.user.id
            ? devpostOwnerId
            : null;

    // Flag 1: The devpost email is attached to another user
    devpostConflict = conflictingUserId !== null;

    // Flag 2: The current session user already has a DIFFERENT devpost email attached
    uwbHacksConflict = uwbHacksEmail !== null && uwbHacksEmail !== devpostEmail;

    const currentUserApp = await getApplication(session.user.id);
    hasApplication = currentUserApp !== null;

    // Flag 3: The conflicting user has an application, but the current user doesn't
    if (devpostConflict && conflictingUserId !== null) {
        const conflictingUserApp = await getApplication(conflictingUserId);

        if (conflictingUserApp !== null && currentUserApp === null) {
            applicationWarning = true;
        }
    }

    return (
        <div className="w-full min-h-screen flex flex-col">
            <Header links={[{ id: "home", name: "Home", url: "/" }]} />

            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <LinkDevpostClient
                    code={code}
                    devpostEmail={devpostEmail}
                    currentUserEmail={session.user.email}
                    devpostConflict={devpostConflict}
                    uwbHacksConflict={uwbHacksConflict}
                    applicationWarning={applicationWarning}
                    hasApplication={hasApplication}
                />
            </main>

            <Footer />
        </div>
    );
}
