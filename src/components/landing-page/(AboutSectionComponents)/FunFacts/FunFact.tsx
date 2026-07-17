"use client";

import { useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type FunFactProps = {
    src: string;
    displayText: string;
    alt: string;
    className?: string;
};

export default function FunFact({
    src,
    alt,
    displayText,
    className = "",
}: FunFactProps) {
    useEffect(() => {
        gsap.set(".funFact", { scale: 0, rotate: 0 });

        gsap.to(".funFact", {
            delay: 0.2,
            stagger: 0.2,
            duration: 0.35,
            ease: "bounce",
            scale: 1,
            scrollTrigger: {
                trigger: "#funFactsContainer",
                start: "30% 80%",
            },
        });
    }, []);

    return (
        <div className={`funFact w-full relative max-w-[400px] ${className}`}>
            <Image
                className="w-full h-auto"
                src={src}
                alt={alt}
                width={400}
                height={200}
                style={{ objectFit: "contain" }}
            />
            <div
                className="absolute inset-0 flex flex-col items-center justify-center text-center text-blue-500 font-bold 
  px-6"
            >
                <p className="text-base md:text-lg leading-tight">
                    {displayText}
                </p>
            </div>
        </div>
    );
}
