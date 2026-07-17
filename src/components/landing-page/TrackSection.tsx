"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
// Panel components
import Panel from "./(AboutSectionComponents)/Panel/Panel";
import PanelHeader from "./(AboutSectionComponents)/Panel/Header";

import { tracks_data } from "./(TracksSectionComponents)/tracks";

// Used in Tracks section background
import Image from "next/image";
import Cloud from "@/public/tracksSection/CloudBackground.png";

// Tab navigation for tracks
import Tracks from "./(TracksSectionComponents)/TracksTabNavigation/Tracks";

import { DisplayTrack } from "./(TracksSectionComponents)/tracks";

gsap.registerPlugin(ScrollTrigger);

const TracksSection = ({ noTrackAnimation }: { noTrackAnimation: boolean }) => {
    const panelPadding = "py-6 md:py-10";

    // tracks contains all relevant information about each of the tracks
    const tracks: DisplayTrack[] = tracks_data;
    const tracksNavRef = useRef<HTMLDivElement | null>(null);
    const selectedTrackRef = useRef<HTMLDivElement | null>(null);

    return (
        <div>
            <div className="bg-[var(--grass-color)]">
                <Image
                    src={Cloud}
                    alt=""
                    className="w-[100%] h-auto "
                    sizes="100vw"
                />
            </div>
            <Panel
                id="tracksPanel"
                className={panelPadding}
                panelColor="var(--cloud-color)"
            >
                <PanelHeader
                    parentPanelId="tracksPanel"
                    as="h2"
                    className="border-none lg:w-full font-glacial-indifference font-bold bg-transparent pb-3 md:pb-4 lg:pb-6"
                    isSectionHeader
                >
                    TRACKS
                </PanelHeader>

                <Tracks
                    tracks={tracks}
                    tracksNavRef={tracksNavRef}
                    selectedTrackRef={selectedTrackRef}
                />
            </Panel>
            <Image
                src={Cloud}
                alt=""
                className="w-[100%] h-auto rotate-180"
                sizes="100vw"
            />
        </div>
    );
};

export default TracksSection;
