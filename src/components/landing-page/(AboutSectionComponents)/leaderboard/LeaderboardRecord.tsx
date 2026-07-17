import React from "react";
import Image from "next/image";

type LeaderboardUserRecordProps = {
    ranking: number;
    name: string;
    hackeroonAmount: number;
    picture: string;
};

export default function LeaderboardUserRecord({
    ranking,
    name,
    hackeroonAmount,
    picture,
}: LeaderboardUserRecordProps) {
    return (
        <div className="w-full font-glacial-indifference flex justify-between gap-x-4 lg:gap-x-2 bg-white border-2 border-black p-3 text-black md:text-lg lg:text-xl rounded-tr-md rounded-bl-md shadow-[3px_3px_0_rgb(0,0,0,1)]">
            <div className="relative w-[50px] h-[50px] md:w-[55px] md:h-[55px] lg:w-[65px] lg:h-[65px] aspect-square">
                <Image
                    className="relative z-0 rounded-md border border-black"
                    src={picture}
                    alt="User Profile Photo"
                    fill
                />
                <div className="absolute z-5 top-0 left-0 -translate-x-1/2 -translate-y-1/2 font-bold bg-white p-2 aspect-square rounded-full border border-black text-base w-[40px] md:w-[45px] h-[40px] md:h-[45px]">
                    {ranking}
                </div>
            </div>

            <p className="self-center text-center font-semibold text-sm md:text-base lg:text-base xl:text-xl">
                {name}
            </p>
            <p className="self-center text-center text-sm md:text-base lg:text-base xl:text-xl">
                {hackeroonAmount} H$
            </p>

            {/* <div className="flex gap-x-2">
                <p className="self-center text-center font-semibold">{name}</p>
                <p className="self-center text-center">{hackeroonAmount}</p>
            </div> */}
        </div>
    );
}
