import { useState, useRef, use, useEffect, useCallback } from "react";

import gsap from "gsap";
import HackeroonItemCard from "./Card";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Prize } from "@/src/util/dataTypes";
import Link from "next/link";

const CARD_WIDTH_PX = 220;
const CARD_GAP_PX = 16;
const ANIM_DURATION = 0.4;

export default function HackeroonCarousel({
    hackeroonPrizes,
}: {
    hackeroonPrizes: Promise<Prize[]>;
}) {
    const prizes = use(hackeroonPrizes);

    const [currIdx, setCurrIdx] = useState(0);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const stripRef = useRef<HTMLDivElement | null>(null);
    const currIdxRef = useRef(currIdx);

    // Keep the ref in sync so the ResizeObserver callback always reads the latest index
    useEffect(() => {
        currIdxRef.current = currIdx;
    }, [currIdx]);

    const computeOffset = useCallback((index: number) => {
        const containerWidth =
            containerRef.current?.offsetWidth ?? CARD_WIDTH_PX;
        return (
            containerWidth / 2 -
            CARD_WIDTH_PX / 2 -
            index * (CARD_WIDTH_PX + CARD_GAP_PX)
        );
    }, []);

    // Set initial position without animation on mount or when prizes change
    useEffect(() => {
        gsap.set(stripRef.current, { x: computeOffset(currIdx) });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prizes]);

    // Re-center the strip whenever the container is resized
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver(() => {
            gsap.set(stripRef.current, {
                x: computeOffset(currIdxRef.current),
            });
        });

        observer.observe(container);
        return () => observer.disconnect();
    }, [computeOffset]);

    const navigate = useCallback(
        (nextIdx: number) => {
            gsap.killTweensOf(stripRef.current);
            setCurrIdx(nextIdx);
            gsap.to(stripRef.current, {
                x: computeOffset(nextIdx),
                duration: ANIM_DURATION,
                ease: "power3.inOut",
            });
        },
        [computeOffset],
    );

    const handleNext = () => {
        const nextIdx = currIdx === prizes.length - 1 ? 0 : currIdx + 1;
        navigate(nextIdx);
    };

    const handlePrev = () => {
        const nextIdx = currIdx === 0 ? prizes.length - 1 : currIdx - 1;
        navigate(nextIdx);
    };

    return (
        <div className="w-full pt-[5vh] flex flex-col justify-center">
            <div
                ref={containerRef}
                className="relative w-full flex items-center"
            >
                <div
                    ref={stripRef}
                    style={{
                        display: "grid",
                        gridAutoFlow: "column",
                        gridAutoColumns: `${CARD_WIDTH_PX}px`,
                        gap: `${CARD_GAP_PX}px`,
                    }}
                >
                    {prizes.map((prize, idx) => (
                        <HackeroonItemCard
                            key={prize.id}
                            hackeroonPrize={prize}
                            isActive={idx === currIdx}
                        />
                    ))}
                </div>

                <div className="absolute left-0 top-0 w-[10%] h-full bg-[linear-gradient(90deg,rgba(244,253,255,1)_0%,rgba(244,253,255,1)_50%,rgba(244,253,255,0.7)_68%,rgba(244,253,255,0.3)_84%,rgba(244,253,255,0)_100%)]" />
                <div className="absolute right-0 top-0 w-[10%] h-full bg-[linear-gradient(270deg,rgba(244,253,255,1)_0%,rgba(244,253,255,1)_50%,rgba(244,253,255,0.7)_68%,rgba(244,253,255,0.3)_84%,rgba(244,253,255,0)_100%)]" />
            </div>

            <div className="w-full flex justify-between items-center gap-x-6 pt-[8vh] px-4 md:px-4 lg:px-6 xl:px-8">
                <CarouselControls onClick={handlePrev}>
                    <ChevronLeft className="w-full h-full text-black" />
                </CarouselControls>
                <Link
                    href="/hackeroon-shop"
                    className="text-center text-base md:text-lg xl:text-xl duration-300 hover:-translate-y-1 hover:text-blue-400"
                >
                    Go To Hackeroon Shop!
                </Link>
                <CarouselControls onClick={handleNext}>
                    <ChevronRight className="w-full h-full text-black" />
                </CarouselControls>
            </div>
        </div>
    );
}

type CarouselControlsProps = {
    children: React.ReactNode;
    onClick: () => void;
};

function CarouselControls({ onClick, children }: CarouselControlsProps) {
    return (
        <button
            onClick={onClick}
            className="w-[50px] h-[50px] duration-300 hover:scale-110"
        >
            {children}
        </button>
    );
}
