"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import PrizeCard from "@/src/components/dashboards/staff/PrizeCard";
import { Prize, TransactionType, User } from "@/src/util/dataTypes";
import { actionCreateTransaction } from "@/src/util/actions/transactions";
import Link from "next/link";
import DashboardFeedback from "@/src/components/dashboards/DashboardFeedback";

export default function BuyPage({
    user,
    balance,
    prizes,
}: {
    user: User;
    balance: number;
    prizes: Prize[];
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [buyResponse, setBuyResponse] = useState<
        { success: boolean; prize: Prize }[]
    >([]);

    const [hackeroonAmount, setHackeroonAmount] = useState(balance);
    const [selectedItems, setSelectedItems] = useState<Prize[]>([]);
    const [currentPrizes, setCurrentPrizes] = useState<Prize[]>(prizes);
    const [prizesHeaderHeight, setPrizesHeaderHeight] = useState(0);
    const [dashboardHeaderOffset, setDashboardHeaderOffset] = useState(0);
    const prizesHeaderRef = useRef<HTMLDivElement | null>(null);

    const [loading, setLoading] = useState<boolean>(false);

    const handleSubmit = async () => {
        if (loading) return;
        setLoading(true);

        if (selectedItems.length !== 0) {
            const res: { success: boolean; prize: Prize }[] = [];
            const successIDs = new Set();
            let refundAmount = 0;

            for (const item of selectedItems) {
                try {
                    const data = await actionCreateTransaction(
                        user.id,
                        TransactionType.PrizePurchase,
                        // We need to subtract the item's price from the user's balance, not
                        // add it.
                        //
                        // This also allows the staff to arbitrarily chose the price,
                        // but since they can create arbitrary transactions anyway,
                        // that doesn't matter.
                        // This can only be ran by staff though, so users can't
                        // decide their own prices.
                        -item.price,
                        null,
                        item.id,
                    );

                    const success = data != null && !("error" in data);

                    res.push({
                        prize: item,
                        success,
                    });

                    // "Refund" any failed transactions.
                    // This is just a visual change, and doesn't
                    // modify the true balance.
                    if (!success) {
                        refundAmount += item.price;
                    } else {
                        successIDs.add(item.id);
                    }
                } catch (e) {
                    console.error(e);

                    res.push({
                        prize: item,
                        success: false,
                    });

                    refundAmount += item.price;
                }
            }

            setBuyResponse(res);
            setHackeroonAmount((amount) => amount + refundAmount);
            setSelectedItems([]);
            // Unselecting a prize will make its displayed stock go up, so
            // we need to update our list to reflect what has been sold.
            setCurrentPrizes((prizes) =>
                prizes.map((prize) => ({
                    ...prize,
                    sold: prize.sold + (successIDs.has(prize.id) ? 1 : 0),
                })),
            );
            setIsModalOpen(true);
        }

        setLoading(false);
    };

    const [transactionTitle, transactionColor] = useMemo(() => {
        let successCount = 0;
        let failureCount = 0;

        for (const transaction of buyResponse) {
            if (transaction.success) {
                successCount++;
            } else {
                failureCount++;
            }
        }

        if (successCount === buyResponse.length) {
            return ["Success", "bg-green-400"];
        }

        if (failureCount === buyResponse.length) {
            return ["Failure", "bg-red-400"];
        }

        return ["Some Transactions Failed", "bg-yellow-400"];
    }, [buyResponse]);

    const transactionBody = useMemo(() => {
        const successNames = buyResponse.filter((item) => item.success);
        const failureNames = buyResponse.filter((item) => !item.success);

        return (
            <div className="flex flex-col gap-4">
                {successNames.length > 0 && (
                    <div>
                        Successfully purchased:
                        <ul className="list-disc list-inside pl-4 font-bold">
                            {successNames.map((item) => (
                                <li key={item.prize.id}>{item.prize.name}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {failureNames.length > 0 && (
                    <div>
                        Failed to purchase:
                        <ul className="list-disc list-inside pl-4 font-bold">
                            {failureNames.map((item) => (
                                <li key={item.prize.id}>{item.prize.name}</li>
                            ))}
                        </ul>
                        I don{"'"}t have enough time to do this properly, but
                        you might be getting this message if the user already
                        purchased this prize (some prizes are once per user).
                    </div>
                )}
            </div>
        );
    }, [buyResponse]);

    useEffect(() => {
        const headerElement = prizesHeaderRef.current;
        if (!headerElement) return;

        const updateHeight = () => {
            setPrizesHeaderHeight(headerElement.getBoundingClientRect().height);
            setDashboardHeaderOffset(window.innerWidth >= 1024 ? 112 : 0);
        };

        updateHeight();

        const resizeObserver = new ResizeObserver(updateHeight);
        resizeObserver.observe(headerElement);
        window.addEventListener("resize", updateHeight);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("resize", updateHeight);
        };
    }, []);

    return (
        <div className="relative">
            {/*
                Header

                Contains:
                    - Title of Page ("Prizes")
                    - Person you're buying prizes for
                    - Person's current total hackeroon amount
            */}
            <div
                ref={prizesHeaderRef}
                className="sticky top-0 lg:top-28 z-100 flex flex-col justify-center bg-neutral-100 py-4 px-6 border-b border-black gap-y-2"
            >
                <h1 className="text-center text-2xl md:text-3xl font-bold">
                    Prizes
                </h1>
                <div className="flex flex-col lg:flex-row justify-around gap-x-4 text-center text-xl md:text-2xl gap-y-2">
                    <h2>
                        Buying for{" "}
                        <span className="font-bold">{user.name}</span>
                    </h2>
                    <h2>
                        Hackeroons Remaining:{" "}
                        <span className="font-bold">{hackeroonAmount}</span>
                    </h2>
                </div>
            </div>

            {/*
                Buy Prize

                Contains:
                    - Prize Cards
                    - Shopping Cart / Selected Items
            */}
            <div className="flex">
                {/* Prize Cards */}
                <div className="w-[75vw] md:w-[73vw] lg:w-[75vw] xl:w-[75vw] p-4 overflow-x-hidden grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {currentPrizes.map((prize, index) => (
                        <PrizeCard
                            key={index}
                            prize={prize}
                            hackeroonAmount={hackeroonAmount}
                            setHackeroonAmount={setHackeroonAmount}
                            selectedItems={selectedItems}
                            setSelectedItems={setSelectedItems}
                            showStock
                        />
                    ))}
                </div>

                {/* Shopping Cart / Selected Items */}
                <div
                    className="w-[25vw] md:w-[27vw] lg:w-[25vw] xl:w-[25vw] flex flex-col justify-between bg-neutral-100 border-l-2 border-black sticky"
                    style={{
                        top: `${prizesHeaderHeight + dashboardHeaderOffset}px`,
                        height: `calc(100vh - ${prizesHeaderHeight + 123.2}px)`,
                    }}
                >
                    {/* Selected Items */}
                    <div className="p-2">
                        <h2 className="text-center text-xl md:text-2xl">
                            Selected Items
                        </h2>
                        <ul className="list-disc px-4 space-y-2">
                            {selectedItems.map((item) => (
                                <li key={item.id}>{item.name}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-col">
                        {/* Complete Button */}
                        <button
                            className="p-3 bg-green-500 hover:bg-green-600/90 duration-300 text-center text-white border-y-2 border-black"
                            onClick={handleSubmit}
                        >
                            Complete
                        </button>

                        {/* exit button that returns user back to staff dashboard */}
                        <Link
                            className="p-3 bg-red-500 hover:bg-red-600/90 duration-300 text-center text-white border-b-2 border-black"
                            href={`/dashboard/${user.id}`}
                        >
                            Exit
                        </Link>
                    </div>
                </div>
            </div>

            <DashboardFeedback
                open={isModalOpen}
                setOpen={setIsModalOpen}
                title={transactionTitle}
                description={transactionBody}
                className={transactionColor}
            />
        </div>
    );
}
