"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

import Image from "next/image";
import BigCloud from "@/public/clouds/BigCloud.png";
import WhySponsorClouds from "./WhySponsorClouds";
import HallE from "@/public/HALL-E.png";

export default function WhySponsorSection() {
    const headerRef = useRef(null);
    const isInView = useInView(headerRef, { margin: "-150px", once: true });

    return (
        <section className="relative overflow-hidden">
            <div className="relative z-8 -left-[25vw] md:-left-[12.5vw]">
                <Image
                    src={BigCloud}
                    alt=""
                    className="h-auto max-w-none w-[150vw] md:w-[125vw]"
                    sizes={"(min-width: 800px) 125vw, 150vw"}
                />
            </div>

            <motion.h2
                ref={headerRef}
                initial={{ y: "-100%", opacity: 0 }}
                animate={{
                    y: isInView ? "0" : "-100%",
                    opacity: isInView ? 1 : 0,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="font-edge-of-the-galaxy text-4xl lg:text-5xl text-center tracking-wider md:tracking-widest w-[80vw] max-w-[1000px] mx-auto mt-[8vmin] mb-[12vmin]"
            >
                Why Sponsor UWBHacks?
            </motion.h2>

            <WhySponsorClouds />

            <div className="relative z-8 -translate-x-[25vw] md:-translate-x-[12.5vw]">
                <motion.div className="-z-5 absolute bottom-2/3 left-2/5 md:left-1/3 w-1/4 scale-x-[-1]">
                    <Image
                        src={HallE}
                        alt=""
                        className="w-full h-full"
                        sizes={"25vw"}
                    />
                </motion.div>

                <Image
                    src={BigCloud}
                    alt=""
                    className="h-auto max-w-none w-[150vw] md:w-[125vw]"
                    sizes={"(min-width: 800px) 125vw, 150vw"}
                />
            </div>
        </section>
    );
}
