import PrizeCard from "@/src/components/dashboards/staff/PrizeCard";
import React from "react";
import { snapshotPrizes } from "@/src/data/archive";
import { Metadata } from "next";
import Header from "@/src/components/header/Header";
import Footer from "@/src/components/Footer";

export const metadata: Metadata = {
    title: "Hackeroon Shop | UWB Hacks 26",
};

export default function PrizesPage() {
    // Prizes come from the static archive snapshot instead of the database.
    const prizes = [...snapshotPrizes];

    prizes.sort((a, b) => {
        if (a.price < b.price) {
            return -1;
        } else if (a.price > b.price) {
            return 1;
        }
        return 0;
    });

    return (
        <div className="w-full min-h-full flex flex-col">
            <Header
                links={[
                    {
                        id: "about",
                        name: "About",
                        url: "/#about",
                    },
                    {
                        id: "tracks",
                        name: "Tracks",
                        url: "/#tracks",
                    },
                    {
                        id: "schedule",
                        name: "Schedule",
                        url: "/#schedule",
                    },
                    {
                        id: "faq",
                        name: "FAQ",
                        url: "/#faq",
                    },
                    {
                        id: "dashboard",
                        name: "Dashboard",
                        url: "/dashboard",
                    },
                ]}
            />

            <h1 className="font-edge-of-the-galaxy text-5xl text-[#2886c4] text-center mt-8">
                Hackeroon Shop
            </h1>

            <div className="flex justify-center">
                <p className="mt-4 font-h1 text-3xl text-[#39a8f1] text-center w-[90%] md:w-[80%]">
                    Check out what your hackeroons can buy!
                </p>
            </div>

            <p className="mb-5 self-center text-center max-w-[80%] md:max-w-[50%] font-bold">
                The Hackeroon Shop will be open on Saturday, April 25th from
                6:00 PM to 8:00 PM and Sunday, April 26th from 9:00 AM to 2:00
                PM. Come by the top floor of the ARC to browse and redeem your
                Hackeroons for prizes in person!
                <br />
                <br />
                Prizes are offered on a first-come-first-serve basis.
                <br /> Prices also may be subject to change!
            </p>

            <div className="w-full grow p-8 overflow-scroll overflow-x-hidden grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {prizes.map((prize, index) => (
                    <PrizeCard key={index} prize={prize} />
                ))}
            </div>

            <Footer />
        </div>
    );
}
