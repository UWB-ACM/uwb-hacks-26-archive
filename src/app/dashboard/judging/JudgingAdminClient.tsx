"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    actionAssignJudges,
    actionAssignTables,
} from "@/src/util/actions/judge";
import { actionSendTableAssignments } from "@/src/util/actions/tableAssignments";

export default function JudgingAdminClient() {
    const [tableStatus, setTableStatus] = useState<
        "idle" | "loading" | "success" | "error"
    >("idle");
    const [judgeStatus, setJudgeStatus] = useState<
        "idle" | "loading" | "success" | "error"
    >("idle");
    const [emailStatus, setEmailStatus] = useState<
        "idle" | "loading" | "success" | "error"
    >("idle");

    const [tableCount, setTableCount] = useState(0);
    const [tableWarnings, setTableWarnings] = useState<string[]>([]);
    const [tableErrorMessage, setTableErrorMessage] = useState<string | null>(
        null,
    );

    const [judgeCount, setJudgeCount] = useState(0);
    const [collisionCount, setCollisionCount] = useState(0);
    const [neededRounds, setNeededRounds] = useState<number[]>([]);
    const [judgeWarnings, setJudgeWarnings] = useState<string[]>([]);
    const [judgeErrorMessage, setJudgeErrorMessage] = useState<string | null>(
        null,
    );

    const handleAssignTables = async () => {
        setTableStatus("loading");
        setTableErrorMessage(null);
        setTableWarnings([]);

        const result = await actionAssignTables();

        if (result.success) {
            setTableStatus("success");
            setTableCount(result.tableAssignmentsCount ?? 0);
            setTableWarnings(result.warnings || []);
        } else {
            setTableStatus("error");
            setTableErrorMessage(result.error ?? "Something went wrong.");
        }
    };

    const handleAssignJudges = async () => {
        setJudgeStatus("loading");
        setJudgeErrorMessage(null);
        setJudgeWarnings([]);

        const result = await actionAssignJudges();

        if (result.success) {
            setJudgeStatus("success");
            setJudgeCount(result.judgeAssignmentsCount ?? 0);
            setCollisionCount(result.collisionCount ?? 0);
            setNeededRounds(result.neededRounds ?? []);
            setJudgeWarnings(result.warnings || []);
        } else {
            setJudgeStatus("error");
            setJudgeErrorMessage(result.error ?? "Something went wrong.");
        }
    };

    const handleNotification = async () => {
        setEmailStatus("loading");

        const result = await actionSendTableAssignments();

        if (result.success) {
            setEmailStatus("success");
        } else {
            setEmailStatus("error");
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 text-black">
            <div className="w-full max-w-md bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-xl">
                <h1 className="text-4xl font-black italic uppercase mb-4 text-center">
                    Judging Admin
                </h1>

                <div className="bg-yellow-100 border-2 border-black p-4 mb-8 text-sm font-bold">
                    ⚠️ ATTENTION: Run table assignment first to place unassigned
                    projects, then judge assignment to assign judges to every
                    track for every project.
                </div>

                <button
                    onClick={handleAssignTables}
                    disabled={tableStatus === "loading"}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-4 px-6 my-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all disabled:opacity-50 uppercase italic"
                >
                    {tableStatus === "loading"
                        ? "Assigning..."
                        : "Assign Tables"}
                </button>
                <button
                    onClick={handleAssignJudges}
                    disabled={judgeStatus === "loading"}
                    className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-4 px-6 my-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all disabled:opacity-50 uppercase italic"
                >
                    {judgeStatus === "loading"
                        ? "Assigning..."
                        : "Assign Judges"}
                </button>
                <button
                    onClick={handleNotification}
                    className="w-full bg-blue-300 hover:bg-blue-400 text-white font-black py-4 px-6 my-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all disabled:opacity-50 uppercase italic"
                >
                    {emailStatus === "loading"
                        ? "Sending..."
                        : "Send Email Notification"}
                </button>

                {tableStatus === "success" && (
                    <div className="mt-6 text-center">
                        <p className="text-green-600 font-bold">
                            ✅ Placed {tableCount} project(s) at tables.
                        </p>

                        {tableWarnings.length > 0 && (
                            <div className="mt-4 p-4 bg-orange-50 border-2 border-orange-200 rounded-md text-left">
                                <p className="text-orange-700 font-bold text-sm mb-2">
                                    ⚠️ Warnings ({tableWarnings.length}):
                                </p>
                                <ul className="text-xs text-orange-600 list-disc ml-4 space-y-1">
                                    {tableWarnings.map((w, i) => (
                                        <li key={i}>{w}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {tableStatus === "error" && (
                    <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-md">
                        <p className="text-red-600 font-bold text-center">
                            {tableErrorMessage}
                        </p>
                    </div>
                )}

                {judgeStatus === "success" && (
                    <div className="mt-6 text-center">
                        <p className="text-green-600 font-bold">
                            ✅ Created {judgeCount} judge assignment(s).
                        </p>
                        {collisionCount > 0 ? (
                            <p className="text-orange-600 font-bold mt-2">
                                ⚠️ {collisionCount} round collision(s) detected
                                (3+ judges at the same project).
                            </p>
                        ) : (
                            <p className="text-green-600 font-bold mt-2">
                                ✅ No round collisions.
                            </p>
                        )}
                        {neededRounds.length > 0 && (
                            <p className="text-green-600 font-bold mt-2">
                                ✅ Top judge workloads:{" "}
                                {neededRounds.join(", ")} round(s).
                            </p>
                        )}

                        {judgeWarnings.length > 0 && (
                            <div className="mt-4 p-4 bg-orange-50 border-2 border-orange-200 rounded-md text-left">
                                <p className="text-orange-700 font-bold text-sm mb-2">
                                    ⚠️ Warnings ({judgeWarnings.length}):
                                </p>
                                <ul className="text-xs text-orange-600 list-disc ml-4 space-y-1">
                                    {judgeWarnings.map((w, i) => (
                                        <li key={i}>{w}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {judgeStatus === "error" && (
                    <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-md">
                        <p className="text-red-600 font-bold text-center">
                            {judgeErrorMessage}
                        </p>
                    </div>
                )}

                <Link
                    href="/dashboard"
                    className="block mt-8 text-center font-bold underline decoration-2 underline-offset-4 hover:text-gray-600 text-black"
                >
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
