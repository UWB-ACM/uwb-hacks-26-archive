import Image, { StaticImageData } from "next/image";
import { cn } from "@/src/util/utils";

interface SponsorshipTierProps {
    tierName: string;
    tierImage: StaticImageData;
    onClick: () => void;
    className?: string;
}

export default function SponsorshipTier({
    tierName,
    tierImage,
    onClick,
    className = "",
}: SponsorshipTierProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-1/5 flex flex-col justify-center items-center duration-300",
                className,
            )}
        >
            <Image
                className={cn("w-3/5 lg:w-2/5 h-auto")}
                src={tierImage}
                alt=""
                sizes={"(min-width: 1000px) 8vw, 12vw"}
            />
            <p className="mt-1 md:mt-2 text-xs md:text-sm lg:text-base xl:text-lg">
                {tierName}
            </p>
        </button>
    );
}
