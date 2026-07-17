import Image, { StaticImageData } from "next/image";
import Grass from "@/public/Grass.svg";
import CityBackground2 from "@/public/City-Background-2.png";
import CitySkylineLightBlue from "@/public/sponsorsSection/City-Skyline-LightBlue.svg";

// Billboard Parts
// Sponsor logos go inside BillboardBody
import BillboardTop from "@/public/sponsorsSection/BillboardTop.png";
import BillboardBody from "@/public/sponsorsSection/BillboardBody.png";
import BillboardBottom from "@/public/sponsorsSection/BillboardBottom.png";

// Sponsor Logos
import Link from "next/link";
import Avanade from "@/public/sponsorsSection/Avanade.svg";
import WSECU from "@/public/sponsorsSection/WSECU.svg";
import Pepsi from "@/public/sponsorsSection/Pepsi.png";
import Starbucks from "@/public/sponsorsSection/Starbucks.png";
import ClubCouncil from "@/public/sponsorsSection/ClubCouncil.jpg";
import SAF from "@/public/sponsorsSection/SAF.png";

import { motion } from "motion/react";

interface Sponsor {
    alt: string;
    logoImage: StaticImageData;
    href: string;
    wide?: boolean;
}

const sponsors: Sponsor[] = [
    {
        logoImage: Avanade,
        href: "https://www.avanade.com/en-us",
        alt: "Avanade Logo",
        wide: true,
    },
    {
        logoImage: WSECU,
        href: "https://wsecu.org/",
        alt: "WSECU Logo",
        wide: true,
    },
    {
        logoImage: Pepsi,
        href: "https://www.pepsi.com/",
        alt: "Pepsi Logo",
    },
    {
        logoImage: Starbucks,
        href: "https://www.starbucks.com/",
        alt: "Starbucks Logo",
    },
    {
        logoImage: ClubCouncil,
        href: "https://www.uwb.edu/sea/clubs/club-council",
        alt: "Club Council Logo",
    },
    {
        logoImage: SAF,
        href: "https://depts.washington.edu/safcom/",
        alt: "Services & Activities Fee Committee Logo",
    },
];

const gridVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.2,
        },
    },
};

const logoVariants = {
    hidden: { y: "-100%", opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { ease: "easeInOut" as const, duration: 0.15 },
    },
};

const SponsorsSection = () => {
    return (
        <>
            <div className="relative mt-[7vmax] pb-[5vmax]">
                {/* Billboard */}
                <div className="z-5 relative h-auto w-[75vw] md:w-[65vw] lg:w-[60vw] xl:w-[55vw] mx-auto mb-0 md:mb-8 lg:mb-16 xl:mb-32">
                    <Image
                        src={BillboardTop}
                        alt=""
                        sizes="(min-width: 1200px) 55vw, (min-width: 1000px) 60vw, (min-width: 800px) 65vw, 75vw"
                    />

                    <div className="z-0 relative">
                        <div className="relative z-5 p-4 lg:p-6">
                            <h2 className="text-center text-3xl md:text-4xl xl:text-5xl font-bold mb-[1.5vh] select-none">
                                SPONSORS
                            </h2>

                            <motion.div
                                className="grid grid-cols-2 gap-4 md:gap-8 xl:gap-10 overflow-hidden"
                                variants={gridVariants}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, amount: 0.5 }}
                            >
                                {sponsors.map((sponsor, idx) => (
                                    <motion.div
                                        key={idx}
                                        variants={logoVariants}
                                        className={
                                            sponsor.wide ? "col-span-2" : ""
                                        }
                                    >
                                        <Link
                                            href={sponsor.href}
                                            target="_blank"
                                        >
                                            <Image
                                                src={sponsor.logoImage}
                                                alt={sponsor.alt}
                                                className={
                                                    sponsor.wide
                                                        ? "mx-auto w-3/4 md:w-3/5 max-w-[500px]"
                                                        : "mx-auto w-3/5 max-w-[150px] xl:max-w-[175px]"
                                                }
                                                sizes={
                                                    sponsor.wide
                                                        ? "(min-width: 1515px) 500px, (min-width: 1200px) 33vw, (min-width: 1000px) 36vw, (min-width: 800px) 39vw, 56vw"
                                                        : "(min-width: 1200px) 175px, (min-width: 667px) 150px, 22vw"
                                                }
                                            />
                                        </Link>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>

                        <Image
                            src={BillboardBody}
                            alt=""
                            className="z-0 absolute top-0 w-full h-full"
                            sizes="(min-width: 1200px) 55vw, (min-width: 1000px) 60vw, (min-width: 800px) 65vw, 75vw"
                        />
                    </div>

                    <Image
                        src={BillboardBottom}
                        alt=""
                        sizes="(min-width: 1200px) 55vw, (min-width: 1000px) 60vw, (min-width: 800px) 65vw, 75vw"
                    />
                </div>

                <div className="w-screen z-0 absolute bottom-0 -translate-y-[25px]">
                    <Image
                        src={CitySkylineLightBlue}
                        alt=""
                        className="w-full h-[28vw] lg:h-[35vw] xl:h-[33vw] translate-y-1"
                        sizes="100vw"
                    />
                    <div className="w-full h-[18vmin] md:h-[175px] lg:h-[200px] bg-[#10c6f9]" />
                </div>

                <div className="z-5 absolute bottom-0 w-screen h-[38vw] md:h-[38vw] lg:h-[36vw] xl:h-[39vw] flex -translate-y-[10px] md:-translate-y-[25px]">
                    <Image
                        src={CityBackground2}
                        alt=""
                        className="w-1/3 h-full"
                        sizes="33vw"
                    />
                    <Image
                        src={CityBackground2}
                        alt=""
                        className="w-1/3 h-full"
                        sizes="33vw"
                    />
                    <Image
                        src={CityBackground2}
                        alt=""
                        className="w-1/3 h-full"
                        sizes="33vw"
                    />
                </div>
                <Image
                    src={Grass}
                    alt=""
                    className="z-5 absolute bottom-0 w-screen"
                    sizes="100vw"
                />
            </div>

            {/* City and Grass Reflection */}
            <div className="bg-[#0d83db] pointer-events-none">
                <div className="w-screen min-h-[30vw] md:min-h-[30vh] lg:min-h-[35vh] xl:min-h-[50vh] -scale-y-100 opacity-60 brightness-75 saturate-150">
                    <Image
                        src={CitySkylineLightBlue}
                        alt=""
                        className="z-0 absolute bottom-0 w-screen -translate-y-[25px]"
                        sizes="100vw"
                    />

                    <div className="z-5 absolute bottom-0 w-screen flex -translate-y-[10px] md:-translate-y-[25px]">
                        <Image
                            src={CityBackground2}
                            alt=""
                            className="w-1/3"
                            sizes="33vw"
                        />
                        <Image
                            src={CityBackground2}
                            alt=""
                            className="w-1/3"
                            sizes="33vw"
                        />
                        <Image
                            src={CityBackground2}
                            alt=""
                            className="w-1/3"
                            sizes="33vw"
                        />
                    </div>

                    <Image
                        src={Grass}
                        alt=""
                        className="z-5 absolute bottom-0 w-screen"
                        sizes="100vw"
                    />
                </div>
            </div>
        </>
    );
};

export default SponsorsSection;
