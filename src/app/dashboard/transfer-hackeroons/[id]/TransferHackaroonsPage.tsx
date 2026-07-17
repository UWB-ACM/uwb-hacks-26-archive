"use client";

import React, { useState } from "react";
import { actionCreateTransaction } from "@/src/util/actions/transactions";
import {
    hasPermissions,
    PermissionLevel,
    reasonNameMap,
    reasonTypeMap,
    User,
    valuedTransactionAmounts,
} from "@/src/util/dataTypes";
import Link from "next/link";
import DashboardFeedback from "@/src/components/dashboards/DashboardFeedback";

export default function TransferHackaroonsPage({
    user,
    staffPerms,
}: {
    user: User;
    staffPerms: PermissionLevel;
}) {
    const excludedTypes: (keyof typeof reasonTypeMap)[] = [
        "student-interview",
        "keyboard-comp",
        "friday-holly-the-husky",
        "saturday-checkin-lanyard",
        "saturday-talk-dan-terry",
        "saturday-talk-armora-rama",
        "saturday-holly-photo",
        "saturday-sandbox",
        "saturday-talk-kody",
        "saturday-badminton",
        "saturday-project-submission",
        "sunday-checkin-lanyard",
        "sunday-demo-day",
        "sunday-admissions-photo",
        "easter-egg-1010",
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [feedbackSuccess, setFeedbackSuccess] = useState<
        "success" | "error" | "over-limit"
    >("error");

    const feedbackTitle = {
        success: "Success",
        error: "Failure",
        "over-limit": "Failure",
    } as const;

    const feedbackDescription = {
        success: "Successfully credited Hackeroons.",
        error: "An error occurred. Please try again, and ensure that this transaction doesn't make the user's balance go below zero.",
        "over-limit":
            "This user has already received the maximum amount they can for this transaction category.",
    } as const;

    const feedbackColors = {
        success: "bg-green-400",
        error: "bg-red-400",
        "over-limit": "bg-yellow-400",
    };

    const [amount, setAmount] = useState<number>(0);
    const [reason, setReason] =
        useState<keyof typeof reasonTypeMap>("performance");

    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Disable unknown for non-admins.
        // This isn't secure, but the reason
        // it's disabled is that people were
        // using it incorrectly, so it's fine.
        if (
            !hasPermissions(staffPerms, {
                has: PermissionLevel.Admin,
            }) &&
            reason === "unknown"
        ) {
            return;
        }

        if (loading) return;
        setLoading(true);

        try {
            // If this transaction type has a prescribed amount,
            // use that instead of the saved one.
            const reasonType = reasonTypeMap[reason];
            const trueAmount =
                reasonType in valuedTransactionAmounts
                    ? valuedTransactionAmounts[
                          reasonType as keyof typeof valuedTransactionAmounts
                      ]
                    : amount;

            const data = await actionCreateTransaction(
                user.id,
                reasonTypeMap[reason],
                trueAmount,
                null,
                null,
            );

            setIsModalOpen(true);

            if (data != null && "error" in data) {
                setFeedbackSuccess(data["error"]);
            } else if (data != null) {
                setFeedbackSuccess("success");
            } else {
                setFeedbackSuccess("error");
            }
        } catch (e) {
            console.error(e);

            setIsModalOpen(true);
            setFeedbackSuccess("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Container for "Transfer Hackeroons" Content */}
            <div className="w-[90vw] max-w-[700px] bg-white p-5 mx-auto my-2 rounded-xl border border-black grid place-content-center">
                <form onSubmit={handleSubmit}>
                    <h1 className="text-center text-2xl md:text-3xl lg:text-4xl">
                        Transferring Hackeroons to{" "}
                        <span className="font-bold whitespace-nowrap">
                            {user.name}
                        </span>
                    </h1>
                    <div className="grid place-content-center">
                        {reason === "unknown" && (
                            <div className="flex flex-col w-full mt-4 md:text-sm lg:text-md">
                                <span className="text-red-600">
                                    I have disabled Unknown for non-admins as it
                                    {"'"}s been causing issues with our systems
                                    and makes it difficult to understand
                                    transactions. If you{"'"}re trying to give a
                                    user Hackeroons for attending an event,
                                    please make an event code for them and have
                                    them enter it. If you have a legitimate
                                    need, please copy the URL in the address bar
                                    and send a message to Jonah discussing it.
                                </span>
                            </div>
                        )}

                        {/* Only show amount for transaction types with no prescribed value. */}
                        {!(
                            reasonTypeMap[reason] in valuedTransactionAmounts
                        ) && (
                            <>
                                <div className="flex flex-col w-full mt-4 md:text-lg lg:text-xl">
                                    <label htmlFor="amount">Amount</label>
                                    <input
                                        required
                                        id="amount"
                                        type="number"
                                        min={0}
                                        step={5}
                                        value={amount.toString()}
                                        className="px-4 py-3 border border-black rounded-md"
                                        onChange={(e) =>
                                            setAmount(Number(e.target.value))
                                        }
                                    />
                                </div>
                            </>
                        )}
                        <div className="flex flex-col w-full mt-4 md:text-lg lg:text-xl">
                            <label htmlFor="reason">Reason</label>
                            <select
                                id="reason"
                                value={reason}
                                className="px-4 py-3 border border-black rounded-md"
                                onChange={(e) =>
                                    setReason(
                                        e.target
                                            .value as keyof typeof reasonTypeMap,
                                    )
                                }
                            >
                                {Object.keys(reasonTypeMap)
                                    .filter(
                                        (el) =>
                                            !excludedTypes.includes(
                                                el as keyof typeof reasonTypeMap,
                                            ),
                                    )
                                    .map((key) => (
                                        <option key={key} value={key}>
                                            {
                                                reasonNameMap[
                                                    key as keyof typeof reasonTypeMap
                                                ]
                                            }
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <input
                            className="mt-4 py-3 bg-green-500 hover:bg-green-600 duration-200 rounded-md border border-black text-white cursor-pointer"
                            type="submit"
                        />

                        {/* exit button that returns user back to staff dashboard */}
                        <Link
                            className="mt-4 py-3 bg-red-500 hover:bg-red-600 duration-200 rounded-md border border-black text-white text-center cursor-pointer"
                            href={`/dashboard/${user.id}`}
                        >
                            Exit
                        </Link>
                    </div>
                </form>
            </div>

            <DashboardFeedback
                open={isModalOpen}
                setOpen={setIsModalOpen}
                title={feedbackTitle[feedbackSuccess]}
                description={feedbackDescription[feedbackSuccess]}
                className={feedbackColors[feedbackSuccess]}
            />
        </>
    );
}
