import Image from "next/image";
import React from "react";
import { Prize } from "@/src/util/dataTypes";
import { retrievePrizeImage } from "@/src/util/prizeImage";

type HackeroonItemCardProps = {
    hackeroonPrize: Prize;
    isActive?: boolean;
};

export default function HackeroonItemCard({
    hackeroonPrize,
    isActive = false,
}: HackeroonItemCardProps) {
    return (
        <div
            className={`h-full p-4 flex flex-col justify-center shadow-[3px_3px_0_rgb(0,0,0,1)] rounded-2xl border-black border-2 bg-green-500/90 text-white transition-all duration-300 ${
                isActive ? "scale-110 opacity-100" : "scale-95 opacity-50"
            }`}
        >
            {/* Prize Name */}
            <p className="font-glacial-indifference text-center text-base md:text-lg lg:text-xl">
                {hackeroonPrize.name}
            </p>
            {/* Prize Image */}
            <div className="relative w-[150px] h-[150px] mx-auto p-4 mt-2 bg-white rounded-md border-2 border-black aspect-square">
                <Image
                    src={retrievePrizeImage(hackeroonPrize.imageName)}
                    alt={"Image of " + hackeroonPrize.name}
                    fill
                    className="object-contain p-4"
                    sizes="(min-width: 1000px) 25vw, (min-width: 800px) 35vw, (min-width: 450px) 45vw, 55vw"
                />
            </div>
            {/* Prize Cost */}
            <p className="text-center mt-2 text-xs lg:text-base">
                {hackeroonPrize.price} Hackeroons
            </p>
        </div>
    );
}
