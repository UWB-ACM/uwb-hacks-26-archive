"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

import CloudSlideIn from "./(AboutSectionComponents)/CloudSlideIn";
import ParticipantsCloud from "@/public/about/ParticipantsCloud.svg";
import SubmittedProjectsCloud from "@/public/about/SubmittedProjectsCloud.svg";
import MOHEventsCloud from "@/public/about/MOHEventsCloud.svg";
import WeekendEventsCloud from "@/public/about/WeekendEventsCloud.svg";

import FlyingCarWithBanner from "@/src/components/landing-page/(AboutSectionComponents)/FlyingCarWithBanner";

import CitySkyline from "@/public/about/skyline.png";
import Grass from "@/public/Grass.svg";
import Bushes from "@/public/about/Bushes.png";
import FlowerBushes from "@/public/about/FlowerBushes.png";
import GrassTuft1 from "@/public/about/Grass1-Dark-Green.png";
import GrassTuft2 from "@/public/about/Grass2-Dark-Green.png";

import { FaLock } from "react-icons/fa6";

import Panel from "./(AboutSectionComponents)/Panel/Panel";
import PanelHeader from "./(AboutSectionComponents)/Panel/Header";
import PanelContent from "./(AboutSectionComponents)/Panel/Content";

import Link from "next/link";

import { Suspense } from "react";
import HackeroonCarousel from "./(AboutSectionComponents)/HackeroonCarousel/Carousel";
import { Prize } from "@/src/util/dataTypes";

import { LeaderboardRecord } from "@/src/util/dataTypes";
import Leaderboard from "./(AboutSectionComponents)/leaderboard/Leaderboard";

import PrevWinners from "./(AboutSectionComponents)/PrevWinners/PrevWinners";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/src/components/ui/alert-dialog";

type AboutSectionProp = {
    hackeroonPrizes: Promise<Prize[]>;
    leaderboardData: Promise<LeaderboardRecord[]>;
};

export default function AboutSection({
    hackeroonPrizes,
    leaderboardData,
}: AboutSectionProp) {
    const gridSquare =
        "flex flex-col w-full rounded-[75] bg-white font-glacial-indifference items-center";
    // used by grid cells that span the ensure row
    const gridSpan =
        "col-span-full w-full rounded-[75] bg-white font-glacial-indifference justify-items-center";
    const panelHeader = "font-glacial-indifference border-none font-bold";

    // Track pressed state (clouds in order).
    const pressedRef = useRef([false, false, false, false]);
    const [easterEggOpen, setEasterEggOpen] = useState(false);
    const claimingRef = useRef(false);

    const checkPattern = useCallback(async () => {
        const pressed = pressedRef.current;
        console.log("Pressed:", pressed);
        // 1010 pattern
        if (pressed[0] && !pressed[1] && pressed[2] && !pressed[3]) {
            if (claimingRef.current) return;
            claimingRef.current = true;

            // In the static archive there's no account to credit, so the
            // easter egg simply shows its celebratory popup.
            setEasterEggOpen(true);

            claimingRef.current = false;
        }
    }, []);

    const pressHandler = useCallback(
        (index: number) => (pressed: boolean) => {
            pressedRef.current[index] = pressed;
            // Don't want it to trigger from them expiring, only
            // the user intentionally pressing the right combo.
            if (pressed) checkPattern();
        },
        [checkPattern],
    );
    return (
        <>
            {/* Statistics */}
            <div className="mt-[10vmin] space-y-[8vmin] xl:space-y-[4vmin]">
                <CloudSlideIn
                    cloudImage={ParticipantsCloud}
                    alt={"300+ Hackers"}
                    position={"left"}
                    padding={"15%"}
                    onPressChange={pressHandler(0)}
                />
                <CloudSlideIn
                    cloudImage={SubmittedProjectsCloud}
                    alt={"88 Submitted Projects"}
                    position={"right"}
                    padding={"21%"}
                    onPressChange={pressHandler(1)}
                />
                <CloudSlideIn
                    cloudImage={MOHEventsCloud}
                    alt={"11 Month of Hacking Events"}
                    position={"left"}
                    padding={"18%"}
                    onPressChange={pressHandler(2)}
                />
                <CloudSlideIn
                    cloudImage={WeekendEventsCloud}
                    alt={"14 Hackathon Weekend Events"}
                    position={"right"}
                    padding={"16%"}
                    onPressChange={pressHandler(3)}
                />
            </div>

            <FlyingCarWithBanner />

            {/* City Skyline and Grass */}
            <div className="w-full relative">
                <Image
                    src={CitySkyline}
                    alt=""
                    className="w-full -translate-y-3 md:-translate-y-5 lg:-translate-y-10"
                    sizes="100vw"
                />
                <Image
                    src={Grass}
                    alt=""
                    className="w-full h-1/2 absolute bottom-0"
                    sizes="100vw"
                />
            </div>

            <div className="w-full h-[5vmin] bg-[#bebebe]" />

            <div className="bg-[var(--grass-color)]">
                {/* Flower bushes */}
                <div className="flex flex-col items-center">
                    <div className="relative flex justify-center w-full bg-blue-500/95 pt-[4vh] md:pt-[6vh] lg:pt-[8vh] xl:pt-[10vh] overflow-hidden">
                        <div
                            className="river-shimmer"
                            style={{ animationDelay: "-9s" }}
                        />
                        <div
                            className="river-shimmer"
                            style={{ animationDelay: "-5.5s" }}
                        />
                        <div
                            className="river-shimmer"
                            style={{ animationDelay: "-2.2s", width: "20%" }}
                        />
                        <div className="relative z-5 flex w-[120vw] shrink-0">
                            <Image
                                src={FlowerBushes}
                                alt=""
                                className="relative translate-x-2 w-1/2 h-auto"
                                sizes="100vw"
                            />
                            <Image
                                src={FlowerBushes}
                                alt=""
                                className="relative -translate-x-2 w-1/2 h-auto"
                                sizes="100vw"
                            />
                        </div>
                    </div>
                    <div className="relative z-5 flex w-[120vw] shrink-0 -scale-y-100 -scale-x-100 bg-[#bebebe]">
                        <Image
                            src={FlowerBushes}
                            alt=""
                            className="relative translate-x-2 w-1/2 h-auto"
                            sizes="100vw"
                        />
                        <Image
                            src={FlowerBushes}
                            alt=""
                            className="relative -translate-x-2 w-1/2 h-auto"
                            sizes="100vw"
                        />
                    </div>
                </div>

                {/* UWB ACM Descriptor Container */}
                <Panel
                    id="uwbacmDescriptionPanel"
                    className="flex flex-col items-center text-center text-white bg-[#bebebe] font-glacial-indifference lg:pt-3 lg:pb-20"
                >
                    <PanelHeader
                        parentPanelId="uwbacmDescriptionPanel"
                        as="h1"
                        isSectionHeader
                        className="bg-[#bebebe] font-glacial-indifference font-bold text-shadow-lg/15"
                    >
                        UWB Association for Computing Machinery
                    </PanelHeader>
                    <PanelContent
                        parentPanelId="uwbacmDescriptionPanel"
                        className="static px-6 pb-12 pt-0 md:px-20 md:pb-6 md:pt-0 sm:text-xl md:text-2xl"
                    >
                        <div className="text-shadow-lg/15">
                            UWB ACM is a chapter of the Association of Computing
                            Machinery at UWB dedicated to creating events and
                            providing insight into academics, research, and
                            careers related to Computer Science. Learn more in
                            our Discord!
                        </div>
                        <Link
                            className="flex items-center justify-center mx-auto w-fit mt-5 sm:mb-2 md:mb-15 px-6 sm:px-12 md:px-20 sm:py-2 md:py-3 rounded-full bg-white hover:bg-gray-100 text-md sm:text-base md:text-2xl lg:text-3xl font-bold text-[var(--grass-color)]"
                            href="https://discord.gg/afVBpYa96B"
                            target="_blank"
                        >
                            DISCORD
                        </Link>
                    </PanelContent>

                    {/* Bushes appear over Discord button, outside of PanelContent so the bushes don't get animated */}
                    <div className="pointer-events-none flex justify-center w-full absolute bottom-0 left-0">
                        <div className="flex w-[120vw] shrink-0">
                            <Image
                                src={Bushes}
                                alt=""
                                className="w-1/2 h-auto sm:translate-x-5"
                                sizes="60vw"
                            />
                            <Image
                                src={Bushes}
                                alt=""
                                className="w-1/2 h-auto "
                                sizes="60vw"
                            />
                        </div>
                    </div>
                </Panel>

                {/* Hackathon Information Grid */}
                <div className="grid py-15 px-[5vw] sm:grid-cols-1 lg:grid-cols-2 gap-y-[10vw] md:gap-y-[5vw] gap-[5vw]">
                    <Panel
                        id="hackeroonPrizePanel"
                        panelBackground="white"
                        className={gridSquare}
                    >
                        <PanelHeader
                            parentPanelId="hackeroonPrizePanel"
                            as="h2"
                            className={`text-[var(--grass-color)] pb-0 ${panelHeader}`}
                        >
                            HACKEROON
                            <br />
                            PRIZES
                        </PanelHeader>
                        <PanelContent
                            parentPanelId="hackeroonPrizePanel"
                            className="w-full h-full flex justify-center font-bold text-center grow p-0 md:p-0"
                        >
                            <Suspense fallback={<div>Loading...</div>}>
                                <HackeroonCarousel
                                    hackeroonPrizes={hackeroonPrizes}
                                />
                            </Suspense>
                        </PanelContent>
                        <div className="w-full">
                            <Image
                                src={GrassTuft2}
                                alt=""
                                className="w-25 md:w-30 ml-15"
                                sizes="(min-width: 768px) 120px, 100px"
                            />
                        </div>
                    </Panel>
                    <Panel
                        id="leaderboardPanel"
                        panelBackground="white"
                        className={gridSquare}
                    >
                        <PanelHeader
                            parentPanelId="leaderboardPanel"
                            as="h2"
                            className={`text-[var(--grass-color)] ${panelHeader}`}
                        >
                            <div>
                                HACKEROON <br></br> LEADERBOARD
                            </div>
                        </PanelHeader>
                        <PanelContent
                            parentPanelId="leaderboardPanel"
                            className="w-full overflow-hidden pt-2 md:pt-2"
                        >
                            <Suspense>
                                <Leaderboard
                                    leaderboardData={leaderboardData}
                                ></Leaderboard>
                            </Suspense>
                        </PanelContent>
                        <div className="w-full flex justify-between">
                            <Image
                                src={GrassTuft1}
                                alt=""
                                className="ml-[10%] w-12 md:w-15"
                                sizes="(min-width: 768px) 120px, 100px"
                            />
                            <Image
                                src={GrassTuft2}
                                alt=""
                                className="mr-[10%] w-25 md:w-30"
                                sizes="(min-width: 768px) 120px, 100px"
                            />
                        </div>
                    </Panel>
                    <Panel
                        id="lastYearsWinnersPanel"
                        panelBackground="white"
                        className={gridSpan}
                    >
                        <PanelHeader
                            parentPanelId="lastYearsWinnersPanel"
                            as="h2"
                            className={`text-[var(--grass-color)] ${panelHeader} pb-3 mb:pb-3`}
                            long
                        >
                            <div>
                                LAST YEAR&apos;S <br></br> PROJECTS
                            </div>
                        </PanelHeader>
                        <PanelContent
                            parentPanelId="lastYearsWinnersPanel"
                            className="flex-1 overflow-hidden pt-0 md:pt-0 w-full"
                        >
                            <p className="text-center text-xl font-bold text-[var(--grass-color)]">
                                Note: this year&apos;s tracks are different (see
                                below)
                            </p>
                            <PrevWinners></PrevWinners>
                        </PanelContent>

                        <div className="absolute bottom-0 left-0 w-full flex px-6">
                            {/* two tufts stay together regardless of screen size */}
                            <div className="pointer-events-none absolute bottom-0 left-0 w-full flex px-6">
                                <Image
                                    src={GrassTuft2}
                                    alt=""
                                    className="absolute bottom-0 left-15 w-25 md:w-30"
                                    sizes="(min-width: 768px) 120px, 100px"
                                />
                                <Image
                                    src={GrassTuft1}
                                    alt=""
                                    className="absolute bottom-0 left-50 w-12 md:w-15 hidden md:block"
                                    sizes="(min-width: 768px) 120px, 100px"
                                />
                            </div>

                            <Image
                                src={GrassTuft1}
                                alt=""
                                className="absolute bottom-0 right-[8%] w-12 md:w-15"
                                sizes="(min-width: 768px) 120px, 100px"
                            />
                        </div>
                    </Panel>
                </div>
            </div>

            {/* Easter Egg 1010 Popup */}
            <AlertDialog
                open={easterEggOpen}
                onOpenChange={(open) => {
                    setEasterEggOpen(open);
                }}
            >
                <AlertDialogContent className="max-w-[90%] sm:max-w-[425px] z-1000">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-center text-2xl font-bold text-[#0d83db]">
                            1010₂ = 10₁₀
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-center">
                            Binary{" "}
                            <span className="font-mono font-bold">1010</span> is{" "}
                            <span className="font-bold">10</span> in decimal,
                            just like our{" "}
                            <span className="font-bold text-[#0d83db]">
                                10th annual hackathon!
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <p className="text-center text-green-600 font-semibold">
                        Nicely spotted!
                    </p>
                    <AlertDialogFooter className="sm:justify-center">
                        <button
                            className="bg-[#0d83db] hover:bg-[#0a6ab8] text-white font-bold py-2 px-8 rounded-full transition-colors"
                            onClick={() => setEasterEggOpen(false)}
                        >
                            Nice!
                        </button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
