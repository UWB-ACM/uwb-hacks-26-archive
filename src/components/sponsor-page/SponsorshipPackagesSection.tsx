"use client";

import Image from "next/image";
import CitySkyline from "@/public/about/skyline.png";

import SponsorshipTier from "./SponsorshipTier";
import Glow from "@/public/sponsor-page/Glow.png";
import Sparkle from "@/public/sponsor-page/Sparkle.png";
import Star from "@/public/sponsor-page/Star.png";
import ShootingStar from "@/public/sponsor-page/ShootingStar.png";
import Sun from "@/public/sponsor-page/Sun.png";

import { useState, useEffect, useRef, Fragment } from "react";
import { motion } from "motion/react";

export default function SponsorshipPackagesSection() {
    const sponsorshipTierPerks = {
        Bronze: {
            image: Glow,
            perks: [
                "Send mentors",
                "Send judges",
                "Provide prizes",
                "Provide swag",
                "Logo on website",
                "Logo on t-shirt",
                "Access to resume book",
                "Challenge statement",
            ],
            minDonation: 500,
            className: "translate-x-[10%] translate-y-[25%]",
        },
        Silver: {
            image: Sparkle,
            perks: [
                "Send mentors",
                "Send judges",
                "Provide prizes",
                "Provide swag",
                "Logo on website",
                "Logo on t-shirt",
                "Access to resume book",
                "Challenge statement",
                "Sponsor an event",
                "Host a workshop",
            ],
            minDonation: 1500,
            className: "-translate-y-[10%]",
        },
        Gold: {
            image: Star,
            perks: [
                "Send mentors",
                "Send judges",
                "Provide prizes",
                "Provide swag",
                "Logo on website",
                "Logo on t-shirt",
                "Access to resume book",
                "Challenge statement",
                "Sponsor an event",
                "Host a workshop",
                "Sponsor a track",
            ],
            minDonation: 2500,
            className: "-translate-x-[13%] translate-y-[20%]",
        },
        Platinum: {
            image: ShootingStar,
            perks: [
                "Send mentors",
                "Send judges",
                "Provide prizes",
                "Provide swag",
                "Logo on website",
                "Logo on t-shirt",
                "Access to resume book",
                "Challenge statement",
                "Sponsor an event",
                "Host a workshop",
                "Sponsor a track",
                "Speak at opening and closing ceremony for 5 minutes",
            ],
            minDonation: 5000,
            className: "-translate-x-[15%] -translate-y-[5%] scale-75",
        },
        Diamond: {
            image: Sun,
            perks: [
                "Send mentors",
                "Send judges",
                "Provide prizes",
                "Provide swag",
                "Logo on website",
                "Logo on t-shirt",
                "Access to resume book",
                "Challenge statement",
                "Sponsor an event",
                "Host a workshop",
                "Sponsor a track",
                "Speak at opening and closing ceremony for 7 minutes",
            ],
            minDonation: 10000,
            className: "-translate-x-[30%] -translate-y-[18%]",
        },
    };

    const [selectedTier, setSelectedTier] =
        useState<keyof typeof sponsorshipTierPerks>("Bronze");

    const [perksElementHeight, setPerksElementHeight] = useState(0);
    const perksElementRef = useRef<HTMLParagraphElement | null>(null);
    useEffect(() => {
        if (!perksElementRef.current) return;

        const observer = new ResizeObserver(() => {
            if (perksElementRef.current) {
                setPerksElementHeight(
                    perksElementRef.current.getBoundingClientRect().height,
                );
            }
        });

        observer.observe(perksElementRef.current);

        return () => observer.disconnect();
    }, []);

    return (
        <section className="mt-[3vh] md:mt-[5vh] lg:mt-[10vh]">
            <h2 className="font-edge-of-the-galaxy text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-center tracking-wider md:tracking-widest">
                Sponsorship Packages <br />{" "}
                <span className="font-glacial-indifference text-base md:text-lg lg:text-xl xl:text-2xl tracking-normal">
                    Click each tier to view its perks!
                </span>
            </h2>

            <div className="w-full flex gap-4 md:gap-8 px-4 md:px-8 mt-[1.5vmin] md:mt-[2vmin] xl:mt-[3vmin]">
                {Object.entries(sponsorshipTierPerks).map(
                    ([tierName, tier]) => (
                        <SponsorshipTier
                            key={tierName}
                            tierName={tierName}
                            tierImage={tier.image}
                            onClick={() =>
                                setSelectedTier(
                                    tierName as keyof typeof sponsorshipTierPerks,
                                )
                            }
                            className={`${tier.className} ${selectedTier === tierName ? "scale-125" : "filter brightness-25 opacity-25 hover:scale-110 hover:brightness-50"}`}
                        />
                    ),
                )}
            </div>

            <div className="flex flex-col justify-center items-center my-[8vmin] space-y-1 lg:space-y-2">
                <div className="text-center">
                    <p className="text-xl md:text-2xl lg:text-3xl xl:text-4xl">
                        {selectedTier}
                    </p>
                    <p className="-mt-1 md:text-lg lg:text-xl xl:text-2xl text-white/80">
                        Minimum $
                        <span className="underline underline-offset-4 decoration-1">
                            {sponsorshipTierPerks[selectedTier].minDonation}
                        </span>
                    </p>
                </div>

                <motion.div
                    animate={{ height: perksElementHeight || "auto" }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                    <p
                        ref={perksElementRef}
                        className="w-[80vw] max-w-[800px] mx-auto text-sm md:text-base lg:text-lg xl:text-xl text-center text-neutral-100"
                    >
                        {sponsorshipTierPerks[selectedTier].perks.map(
                            (perk, idx) => (
                                <Fragment key={selectedTier + "-" + idx}>
                                    <span>{perk}</span>{" "}
                                    {idx !==
                                        sponsorshipTierPerks[selectedTier].perks
                                            .length -
                                            1 && (
                                        <span className="text-[#1084dc]">
                                            •{" "}
                                        </span>
                                    )}
                                </Fragment>
                            ),
                        )}
                    </p>
                </motion.div>
            </div>

            <Image
                src={CitySkyline}
                alt=""
                className="w-full"
                sizes={"100vw"}
            />
        </section>
    );
}
