import React, { Suspense } from "react";
import QRCode from "react-qr-code";
import Image from "next/image";
import Husky from "@/public/about/husky.png";
import CheckInInput from "@/src/components/dashboards/userdashboard/CheckInInput";
import LinkButton from "@/src/components/dashboards/userdashboard/LinkButton";
import SupportSection from "@/src/components/dashboards/userdashboard/SupportSection";
import LeaderboardConsent from "@/src/components/dashboards/userdashboard/LeaderboardConsent";
import TransactionTable from "./userdashboard/TransactionTable";
import { DemoUser, demoBalance, demoTransactions } from "@/src/data/archive";

/**
 * The user dashboard. On the live site the balance, transaction history and
 * consent settings were fetched per-user from the database. In the static
 * archive they come from a demo-data snapshot instead.
 */
function UserDashboard({ user }: { user: DemoUser }) {
    const transactions = demoTransactions;

    return (
        // User Dashboard Container
        <div className="w-[90%] mx-auto rounded-md sm:mt-12">
            {/* General User Information */}
            <div className="w-full flex flex-col gap-y-8 md:flex-row justify-around items-center md:px-14 lg:px-20">
                {/* User PFP, First and Last Name, & Hackeroon Amount */}
                <div className="w-full flex gap-x-8">
                    <Image
                        src={user.picture || Husky}
                        alt={"Your profile photo"}
                        width={150}
                        height={150}
                        className="w-full sm:max-w-[150px] rounded-full bg-white border-black border-2"
                    />
                    <div className="flex flex-col justify-around py-2">
                        <div>
                            <div className="text-2xl font-bold">
                                {user.name}
                            </div>
                            <div className="text-lg ">
                                {"User ID: " + user.id}
                            </div>
                        </div>
                        <div className="flex items-center gap-x-2 text-xl">
                            <p>Hackeroons: </p>
                            <span className="font-bold text-3xl">
                                {demoBalance}
                            </span>
                        </div>
                    </div>
                </div>

                {/* User Unique QR Code */}
                <div>
                    <Suspense
                        fallback={
                            <div className="w-[150px] h-[150px] border border-black bg-gray-400" />
                        }
                    >
                        <QRCode
                            size={150}
                            value={`https://uwbhacks.com/dashboard/${user.id}`}
                            viewBox={`0 0 256 256`}
                        />
                    </Suspense>
                    <h3 className="text-center text-lg mt-2">Your QR Code</h3>
                </div>
            </div>

            {/* Actions and Check-In */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">
                <div className="bg-neutral-100 border-2 border-black/60 shadow-xl rounded-xl p-4 flex flex-col items-center ">
                    <h2 className="text-lg font-semibold mb-2">Check-In</h2>
                    <CheckInInput />
                </div>
                <div className="bg-neutral-100 border-2 border-black/60 shadow-xl rounded-xl p-4 flex flex-col items-center ">
                    <h2 className="text-lg font-semibold mb-2">
                        Quick Actions
                    </h2>
                    <div className="flex flex-col md:flex-row gap-5">
                        <LinkButton
                            href="/hackeroon-shop"
                            text="Hackeroon Shop"
                        />
                        <SupportSection />
                    </div>

                    <div className="pt-3 max-w-[80%] md:max-w-[60%] mx-auto">
                        <LeaderboardConsent
                            user={user}
                            initialLeaderboardConsent={true}
                        />
                    </div>
                </div>
            </div>

            {/* User Transaction History */}
            <TransactionTable transactions={transactions} />
        </div>
    );
}

export default UserDashboard;
