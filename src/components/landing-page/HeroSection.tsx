import Image from "next/image";
import Link from "next/link";
import Cloud3 from "@/public/clouds/Cloud3.png";
import Bridge from "@/public/Bridge-Background.png";
import { daysUntilEvent } from "@/src/util/date";
import { motion } from "motion/react";
import { Suspense } from "react";
import JudgeButton from "./(HeroSectionComponents)/JudgeButtonComponent";
import FloatingCity from "@/public/FloatingCity.png";

export default function HeroSection({
    isJudge,
}: {
    isJudge: Promise<boolean>;
}) {
    const daysLeft = daysUntilEvent();

    return (
        <>
            {/* Main Content */}
            <div className="relative flex justify-center">
                {/* Left Cloud */}
                <Image
                    src={Cloud3}
                    alt=""
                    className="absolute top-20 -left-20 md:-left-20 lg:-left-15 scale-x-[-1] opacity-40 w-1/2 md:w-1/3 lg:w-1/4"
                />

                {/* Right Cloud */}
                <Image
                    src={Cloud3}
                    alt=""
                    className="absolute bottom-5 right-3 md:right-2 lg:right-1 opacity-40 w-1/2 md:w-1/3 lg:w-1/4"
                />

                <div className="z-5 flex flex-col text-center px-6 pt-20 sm:px-12 md:px-20 max-w-4xl">
                    <h1 className="text-white font-bold text-4xl font-glacial-indifference">
                        UWB HACKS 2026: The Future
                    </h1>

                    <p className="text-white mt-4 text-sm sm:text-lg md:text-xl lg:text-2xl mx-auto">
                        Halle comes to us from the future, traveling back to our
                        time with a purpose: to help us build what comes next.
                        She knows tomorrow is full of opportunities, but
                        it&apos;s up to us to create it. Together, we can build
                        our future.
                    </p>

                    <p className="text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl mt-4 font-glacial-indifference">
                        Friday, April 24 - Sunday, April 26, 2026
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-wrap justify-center gap-4 mt-6 w-full max-w-lg mx-auto">
                        <Link
                            className="flex-1 min-w-[120px] bg-white hover:bg-gray-100 text-[#0d83db] text-sm sm:text-base md:text-lg lg:text-xl font-bold py-3 px-6 sm:px-8 md:px-10 rounded-full flex items-center justify-center"
                            href="https://uwb-hacks-the-future.devpost.com/project-gallery"
                        >
                            SEE THE INNOVATIONS
                        </Link>

                        <Link
                            className="flex-1 min-w-[120px] bg-white hover:bg-gray-100 text-[#0d83db] text-sm sm:text-base md:text-lg lg:text-xl font-bold py-3 px-6 sm:px-8 md:px-10 rounded-full flex items-center justify-center"
                            href="/sponsor"
                        >
                            SPONSOR US
                        </Link>
                    </div>
                    <Suspense>
                        <JudgeButton isJudge={isJudge}></JudgeButton>
                    </Suspense>
                </div>
            </div>

            <div className="w-full relative mt-[18vw] md:mt-[15vh] lg:mt-[10vh]">
                {/* Train */}
                <motion.div
                    className="w-[80%] sm:w-[75%] md:w-[70%] lg:w-[65%] ml-auto"
                    initial={{ x: "100%" }} // offscreen to the right
                    animate={{ x: "-100%", marginLeft: 0 }} // translates 100% to the left and completely reduces left margin; final position will be offscreen to the left
                    transition={{
                        duration: 5, // in seconds
                        repeat: Infinity, // loop forever
                        repeatType: "loop", // resets to start instantly
                        repeatDelay: 1,
                        ease: [0.33, 0.67, 0.67, 0.33], // train slows down in the middle of the bridge when "X-days count shows up" to emphasize how many days are left, then speeds up along both ends of the bridge
                    }}
                >
                    <Image
                        src="/train.svg"
                        alt={
                            daysLeft +
                            (daysLeft === 1 ? " day " : " days ") +
                            "left"
                        }
                        width={1100}
                        height={88}
                        className="w-full h-auto"
                    />
                </motion.div>
                {/* Bridge */}
                <div className="relative w-full h-[3.5vmin] md:h-[4vmin] lg:h-[4.25vmin] xl:h-[5.25vmin]">
                    <Image src={Bridge} alt="" className="w-full h-auto" fill />
                </div>

                {/* Left & Right Buildings */}
                <div className="absolute -top-[16vw] lg:-top-[12.5vw] xl:-top-[11.75vw] w-full flex justify-between">
                    <div className="relative w-[40%] lg:w-1/3 aspect-square -translate-x-2/5">
                        <Image src={FloatingCity} alt="" fill />
                    </div>
                    <div className="relative w-[40%] lg:w-1/3 aspect-square scale-x-[-1] translate-x-2/5">
                        <Image src={FloatingCity} alt="" fill />
                    </div>
                </div>
            </div>
        </>
    );
}
