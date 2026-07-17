"use client";

import {
    hasPermissions,
    PermissionLevel,
    Transaction,
    TransactionType,
    typeNameMap,
    User,
} from "@/src/util/dataTypes";
import { Session, SessionUser } from "@/src/util/session";
import Link from "next/link";
import React, { Dispatch, SetStateAction, useState } from "react";
import { actionSetTransactionReverted } from "@/src/util/actions/transactions";

export function ModifyUserPage({
    user,
    balance,
    history,
    permission,
    session,
}: {
    user: User;
    balance: number;
    history: Transaction[];
    permission: PermissionLevel;
    session: Session;
}) {
    const [curHistory, setCurHistory] = useState(history);
    const [curBalance, setCurBalance] = useState(balance);

    return (
        <div className="w-[90vw] max-w-[700px] mx-auto bg-neutral-100 p-5 flex flex-col justify-between rounded-md border-2 border-black shadow-lg">
            {/* main content of the user, separate from the exit button */}
            <div>
                {/* displaying name and email of user, will have to change once database integrated*/}
                <div className="py-2 text-lg md:text-xl lg:text-2xl">
                    <span className="font-bold">{user.name}</span> |{" "}
                    {user.email}
                </div>
                {/* displaying number of hackeroons user has */}
                <div className="py-2">
                    Hackeroons{" "}
                    <span className="text-2xl font-bold">{curBalance}</span>
                </div>
                {/* displaying user transactions */}
                <div className="py-2">
                    <p className="font-bold">Transactions</p>
                    <TransactionList
                        history={curHistory}
                        setHistory={setCurHistory}
                        setBalance={setCurBalance}
                        permission={permission}
                        sessionUser={session.user!}
                        balance={curBalance}
                    />
                </div>
            </div>
            {/* exit button that returns user back to staff dashboard */}
            <Link
                className="mt-4 py-3 rounded-lg text-center bg-red-500 text-white"
                href={`/dashboard/${user.id}`}
            >
                Exit
            </Link>
        </div>
    );
}

function TransactionList({
    history,
    setHistory,
    setBalance,
    sessionUser,
    permission,
    balance,
}: {
    history: Transaction[];
    setHistory: Dispatch<SetStateAction<Transaction[]>>;
    setBalance: Dispatch<SetStateAction<number>>;
    sessionUser: SessionUser;
    permission: PermissionLevel;
    balance: number;
}) {
    return (
        <ul className="flex flex-col gap-y-4">
            {/* iterating through user's transaction list */}
            {history.map((transaction) => (
                <li className="" key={transaction.id}>
                    <TransactionItem
                        transaction={transaction}
                        permission={permission}
                        sessionUser={sessionUser}
                        balance={balance}
                        revert={(reverted) => {
                            // Set the given transaction to reverted.
                            setHistory((history) =>
                                history.map((t2) => {
                                    if (t2.id === transaction.id) {
                                        return {
                                            ...t2,
                                            reverted,
                                        };
                                    }

                                    return t2;
                                }),
                            );

                            // Remove the cost of the transaction from the balance.
                            setBalance(
                                (balance) =>
                                    balance +
                                    // Unreverting adds the amount back, not
                                    // removes it.
                                    (reverted ? -1 : 1) * transaction.amount,
                            );
                        }}
                    />
                </li>
            ))}
        </ul>
    );
}

function TransactionItem({
    sessionUser,
    permission,
    transaction,
    balance,
    revert,
}: {
    sessionUser: SessionUser;
    permission: PermissionLevel;
    transaction: Transaction;
    balance: number;
    revert: (reverted: boolean) => void;
}) {
    const isAdmin = hasPermissions(permission, { has: PermissionLevel.Admin });

    const canRevert = isAdmin || transaction.authorized_by === sessionUser.id;
    // If the transaction is already reverted, then unreverting adds
    // the amount back, not subtracts it.
    const canRevertWithBalance =
        balance + (transaction.reverted ? 1 : -1) * transaction.amount >= 0;

    let buttonColor;
    let buttonText;

    if (canRevertWithBalance) {
        if (transaction.reverted) {
            // Unrevert.
            buttonColor = "bg-blue-500";
            buttonText = "Un-revert";
        } else {
            // Revert.
            buttonColor = "bg-red-500";
            buttonText = "Revert";
        }
    } else {
        // Insufficient balance.
        if (transaction.reverted) {
            // Unrevert.
            buttonColor = "bg-blue-800";
            buttonText = "Cannot Un-revert";
        } else {
            // Revert.
            buttonColor = "bg-red-800";
            buttonText = "Cannot Revert";
        }
    }

    return (
        <div className="flex flex-row justify-between items-center gap-x-4">
            <p
                className={
                    (transaction.reverted ? "line-through" : "") +
                    " border-black border-2 p-1 bg-indigo-200"
                }
            >
                [{typeNameMap[transaction.type as TransactionType]}] H$
                {transaction.amount}{" "}
                {transaction.event !== null &&
                    `${transaction.event} (${transaction.eventName})`}
                {transaction.prize !== null &&
                    `${transaction.prize} (${transaction.prizeName})`}
                <br />
                {transaction.time.toString()}
            </p>
            <div>
                {canRevert && (
                    <button
                        className={
                            buttonColor +
                            " border border-black rounded-xl p-2 text-white"
                        }
                        onClick={async () => {
                            if (!canRevert || !canRevertWithBalance) return;

                            const newRevertedStatus = !transaction.reverted;

                            if (
                                await actionSetTransactionReverted(
                                    transaction.id,
                                    newRevertedStatus,
                                )
                            ) {
                                revert(newRevertedStatus);
                            }
                        }}
                    >
                        {buttonText}
                    </button>
                )}
            </div>
        </div>
    );
}
