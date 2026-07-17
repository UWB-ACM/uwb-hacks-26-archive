import Link from "next/link";
import React, { use } from "react";

export default function JudgeButton({
    isJudge,
}: {
    isJudge: Promise<boolean>;
}) {
    const isJudgeVal = use(isJudge);

    return (
        <div
            className={`flex flex-wrap justify-center gap-4 mt-6 w-full max-w-lg mx-auto ${isJudgeVal ? "visible" : "collapse"}`}
        >
            <Link
                className="flex-1 min-w-[120px] bg-white hover:bg-gray-100 text-[#0d83db] text-sm sm:text-base md:text-lg lg:text-xl font-bold py-3 px-6 sm:px-8 md:px-10 rounded-full flex items-center justify-center"
                href="/judging"
            >
                Judge Portal
            </Link>
        </div>
    );
}
