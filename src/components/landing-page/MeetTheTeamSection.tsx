import { useState, useEffect, useRef, useCallback } from "react";

import MeetTheTeamCloud from "./(MeetTheTeamSectionComponents)/MeetTheTeamCloud";
import gsap from "gsap";

import Image from "next/image";
import FlyingCarCloudTop from "@/public/MeetTheTeamSection/FlyingCarCloudTop.png";
import FlyingCarCloudBody from "@/public/MeetTheTeamSection/FlyingCarCloudBody.png";
import FlyingCarCloudBottom from "@/public/MeetTheTeamSection/FlyingCarCloudBottom.png";

import Panel from "./(AboutSectionComponents)/Panel/Panel";
import PanelHeader from "./(AboutSectionComponents)/Panel/Header";
import PanelContent from "./(AboutSectionComponents)/Panel/Content";

import { cn } from "@/src/util/utils";

const MeetTheTeamSection = () => {
    const panelHeaderStyles =
        "border-0 lg:border-0 font-glacial-indifference font-semibold text-[#0078d0] p-0 pb-3 bg-transparent";
    const panelContentStyles = "p-0 md:p-0";

    // keeps track of currently selected memberIcon
    // set to null when no one is selected
    const [selectedMemberIdx, setSelectedMemberIdx] = useState<number | null>(
        null,
    );

    // committeeMemberIconsRef references revolving element
    // committeeMemberIconsRef is used by GSAP timeline, tlRef.current, to perform the animation
    const committeeMemberIconsRef = useRef<HTMLDivElement | null>(null);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    const buildTimeline = useCallback(() => {
        const el = committeeMemberIconsRef.current;
        if (!el) {
            tlRef.current?.kill();
            tlRef.current = null;
            return;
        }

        tlRef.current?.kill();
        const isRow = window.getComputedStyle(el).flexDirection === "row";
        const half = isRow ? el.scrollWidth / 2 : el.scrollHeight / 2;
        if (half <= 0) {
            tlRef.current = null;
            return;
        }

        const tl = gsap.timeline({ repeat: -1 });
        tlRef.current = tl;

        if (isRow) {
            gsap.set(el, { x: 0, y: 0 });
            tl.fromTo(el, { x: 0 }, { x: -half, duration: 35, ease: "none" });
        } else {
            gsap.set(el, { x: 0, y: -half });
            tl.fromTo(el, { y: -half }, { y: 0, duration: 40, ease: "none" });
        }
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setSelectedMemberIdx(null);
            tlRef.current?.resume();
        };
        handleResize();
        window.addEventListener("resize", handleResize);

        const el = committeeMemberIconsRef.current;
        if (el) {
            buildTimeline();
            const ro = new ResizeObserver(buildTimeline);
            ro.observe(el);
            return () => {
                window.removeEventListener("resize", handleResize);
                ro.disconnect();
                tlRef.current?.kill();
                tlRef.current = null;
            };
        }

        return () => window.removeEventListener("resize", handleResize);
    }, [buildTimeline]);

    const handleDeselect = useCallback(() => {
        tlRef.current?.resume();
        setSelectedMemberIdx(null);
    }, []);

    const handleClick = (selectedIdx: number) => {
        if (selectedMemberIdx === null || selectedIdx !== selectedMemberIdx) {
            tlRef.current?.pause();
            setSelectedMemberIdx(selectedIdx);
        } else {
            handleDeselect();
        }
    };

    useEffect(() => {
        if (selectedMemberIdx === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleDeselect();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [selectedMemberIdx, handleDeselect]);

    return (
        <div className="mt-[10vmin] relative mx-auto w-[90%] max-w-[750px]">
            <Image
                src={FlyingCarCloudTop}
                alt=""
                className="w-full"
                sizes="(max-width: 834px) 90vw, 750px"
            />

            <div className="relative w-full">
                <Image
                    src={FlyingCarCloudBody}
                    alt=""
                    className="z-0 absolute top-0 w-full h-full"
                    sizes="(max-width: 834px) 90vw, 750px"
                />

                <Panel id={"meetTheTeamPanel"} className={cn("px-[10%]")}>
                    <PanelHeader
                        parentPanelId={"meetTheTeamPanel"}
                        as={"h2"}
                        isSectionHeader
                        className={cn(panelHeaderStyles)}
                    >
                        MEET THE TEAM
                    </PanelHeader>
                    <PanelContent
                        parentPanelId={"meetTheTeamPanel"}
                        className={cn(panelContentStyles)}
                    >
                        <MeetTheTeamCloud
                            committeeMemberIconsRef={committeeMemberIconsRef}
                            handleClick={handleClick}
                            handleDeselect={handleDeselect}
                            selectedMemberIdx={selectedMemberIdx}
                        />
                    </PanelContent>
                </Panel>
            </div>

            <Image
                src={FlyingCarCloudBottom}
                alt=""
                className="w-full"
                sizes="(max-width: 834px) 90vw, 750px"
            />
        </div>
    );
};

export default MeetTheTeamSection;
