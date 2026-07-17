"use client";

import { useState } from "react";
import FormBody from "./FormBody";
import Image from "next/image";
import GrassBackground from "@/public/Grass.svg";
import { ApplicationData } from "@/src/util/dataTypes";
import ConfirmSubmit from "./ConfirmSubmit";

export default function ApplicationForm({
    initialApp,
}: {
    initialApp: ApplicationData | null;
}) {
    const [lastSubmitted, setLastSubmitted] = useState<ApplicationData | null>(
        initialApp,
    );
    // If the user previously submitted, show them the confirmation message
    // first to make it obvious it was received.
    const [isSubmitted, setIsSubmitted] = useState(initialApp != null);

    const onSubmit = async (
        data: ApplicationData,
        _resumeFile: File | null,
        _deleteResume: boolean,
    ) => {
        // Applications are closed on the archived site; there is no backend to
        // save to, so we just show the confirmation screen locally.
        setIsSubmitted(true);
        setLastSubmitted(data);
    };

    return (
        <div className="bg-[#84c6ff] h-full flex-1 flex flex-col">
            {!isSubmitted ? (
                // Use the latest application.
                <FormBody initialApp={lastSubmitted} onSubmit={onSubmit} />
            ) : (
                <ConfirmSubmit
                    onEdit={() => setIsSubmitted(false)}
                    // Only show the popup on their first submission.
                    showPopup={initialApp == null}
                />
            )}

            <div className="flex-1" />

            {/* Background grass */}
            <div className="relative z-0 mt-4 md:mt-6 lg:mt-8">
                <Image
                    src={GrassBackground}
                    alt=""
                    className="z-0 w-full pointer-events-none"
                />
            </div>
        </div>
    );
}
