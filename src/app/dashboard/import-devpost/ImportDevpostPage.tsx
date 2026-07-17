"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import actionImportProjects, {
    actionImportRegistrants,
    actionSyncDevpostEmails,
    ImportResult,
} from "@/src/util/actions/devpost";

export default function ImportDevpostPage() {
    const [syncLoading, setSyncLoading] = useState(false);
    const [syncResult, setSyncResult] = useState("");

    const handleManualSync = async () => {
        setSyncLoading(true);
        setSyncResult("");

        try {
            const result = await actionSyncDevpostEmails();
            if (result?.error) {
                setSyncResult(`Error: ${result.error}`);
            } else if (result) {
                setSyncResult(`Success: Queued ${result.sent} emails.`);
            }
        } catch (e) {
            console.error("Manual sync failed:", e);
            setSyncLoading(false);
            setSyncResult(
                "Error: Network error or server is down. Please try again later.",
            );
            return;
        }
        setSyncLoading(false);
    };

    return (
        <div className="min-h-[80vh] w-full grid place-content-center">
            <div className="flex flex-col gap-6 max-w-lg w-full">
                <ImportSection
                    title="Import Registrants"
                    onImport={actionImportRegistrants}
                />
                <ImportSection
                    title="Import Projects"
                    onImport={actionImportProjects}
                />
                <div className="p-4 border-black border rounded-lg bg-white flex flex-col gap-4">
                    <h2 className="text-xl md:text-2xl text-center font-semibold">
                        Sync Devpost Emails
                    </h2>
                    <p className="text-sm text-center text-gray-600">
                        Manually trigger the sync logic. Matches known emails,
                        generates codes, and sends emails to unlinked users.
                    </p>
                    <button
                        onClick={handleManualSync}
                        disabled={syncLoading}
                        className="py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-500 text-white duration-200 border-black border disabled:opacity-50"
                    >
                        {syncLoading ? "Syncing..." : "Run Devpost Sync"}
                    </button>
                    {syncResult && (
                        <p
                            className={`text-center font-bold ${syncResult.startsWith("Error") ? "text-red-600" : "text-green-700"}`}
                        >
                            {syncResult}
                        </p>
                    )}
                </div>
                <Link
                    href="/dashboard"
                    className="py-2 px-4 rounded-md bg-red-500 text-white text-center"
                >
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}

function ImportSection({
    title,
    onImport,
}: {
    title: string;
    onImport: (csvText: string) => Promise<ImportResult | null>;
}) {
    const fileRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ImportResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        const file = fileRef.current?.files?.[0];
        if (!file) {
            setError("Please select a CSV file.");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const text = await file.text();
            const res = await onImport(text);

            if (res == null) {
                setError("Unknown error.");
            } else {
                setResult(res);
            }
        } catch (e) {
            setError(
                e instanceof Error ? e.message : "An unknown error occurred.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 border-black border rounded-lg bg-white">
            <h2 className="text-xl md:text-2xl text-center font-semibold">
                {title}
            </h2>
            <div className="mt-4 flex flex-col gap-4">
                <input
                    ref={fileRef}
                    type="file"
                    accept=".csv"
                    className="border-black border p-2 rounded-md bg-neutral-100"
                />
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="py-2 px-4 rounded-md bg-green-600 hover:bg-green-500 text-white duration-200 border-black border disabled:opacity-50"
                >
                    {loading ? "Importing..." : "Import"}
                </button>
            </div>

            {error && (
                <p className="mt-4 text-red-600 text-center font-bold">
                    {error}
                </p>
            )}

            {result && (
                <div className="mt-4">
                    <p className="text-green-700 font-bold text-center">
                        Successfully imported {result.imported} record
                        {result.imported !== 1 ? "s" : ""}.
                    </p>

                    {result.warnings.length > 0 && (
                        <div className="mt-2">
                            <p className="font-semibold text-yellow-700">
                                Warnings ({result.warnings.length}):
                            </p>
                            <ul className="list-disc list-inside text-sm text-yellow-700 max-h-40 overflow-y-auto">
                                {result.warnings.map((w, i) => (
                                    <li key={i}>{w}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {result.errors.length > 0 && (
                        <div className="mt-2">
                            <p className="font-semibold text-red-600">
                                Errors ({result.errors.length}):
                            </p>
                            <ul className="list-disc list-inside text-sm text-red-600 max-h-40 overflow-y-auto">
                                {result.errors.map((e, i) => (
                                    <li key={i}>{e}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
