"use client";

import Image from "next/image";
import FlyingCar from "@/public/about/FlyingCar.png";
import Banner from "@/public/about/Banner.svg";
import { motion } from "motion/react";

export default function FlyingCarWithBanner() {
    return (
        <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
                duration: 16,
                repeat: Infinity,
                repeatDelay: 2.5,
                ease: "linear",
            }}
        >
            <div className="flex items-center justify-center my-[10vmin] md:my-[14vmin]">
                {/* Banner with text */}
                <Image
                    src={Banner}
                    alt="The future is closer than you think. Stay tuned for more..."
                    className="w-[65%] md:w-[50%] lg:w-[45%] xl:w-[40%]"
                />

                {/* Flying Car */}
                <Image
                    src={FlyingCar}
                    alt=""
                    className="w-[35vw] md:w-[35vw] lg:w-[30vw] xl:w-[25vw] -ml-2 md:-ml-4 lg:-ml-6"
                    sizes="(max-width: 800px) 35vw, (max-width: 1000px) 35vw, (max-width: 1200px) 30vw, 25vw"
                />
            </div>
        </motion.div>
    );
}
