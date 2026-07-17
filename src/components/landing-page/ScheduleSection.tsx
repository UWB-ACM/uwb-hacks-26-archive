import React, { useState } from "react";

import Image from "next/image";
import ScheduleCloudTop from "@/public/scheduleSection/ScheduleCloudTop.svg";
import ScheduleCloudBodyMobile from "@/public/scheduleSection/ScheduleCloudBodyMobile.svg";
import ScheduleCloudBody from "@/public/scheduleSection/ScheduleCloudBody.svg";
import ScheduleCloudBottom from "@/public/scheduleSection/ScheduleCloudBottom.svg";
import Cloud3 from "@/public/clouds/Cloud3.png";

import Panel from "./(AboutSectionComponents)/Panel/Panel";
import PanelHeader from "./(AboutSectionComponents)/Panel/Header";
import PanelContent from "./(AboutSectionComponents)/Panel/Content";

import { FaLongArrowAltLeft } from "react-icons/fa";
import { FaLongArrowAltRight } from "react-icons/fa";

import { schedule, DaySchedule } from "./(ScheduleSectionComponents)/Schedule";
import EventItem from "./(ScheduleSectionComponents)/EventItem";
import { motion } from "motion/react";

const ScheduleSection: React.FC = () => {
    const [day, setDay] = useState<1 | 2 | 3>(() => {
        const currDate = new Date();

        // If the current date is...
        // - before, after, or on the first day of the hackthon, set to 1 (1st day of the hackathon)
        // - before the third day of the hackthon (April 26, midnight), set to 2 (2nd day of hackathon)
        // - otherwise, set to 3 (3rd day of hackathon)
        const apr25 = new Date(2026, 3, 25, 0, 0, 0, 0);
        const apr26 = new Date(2026, 3, 26, 0, 0, 0, 0);
        const apr27 = new Date(2026, 3, 27, 0, 0, 0, 0);

        if (currDate < apr25 || currDate >= apr27) {
            return 1;
        } else if (currDate < apr26) {
            return 2;
        } else {
            return 3;
        }
    });

    const daySchedule: DaySchedule = schedule[day];

    const handleSwitchDay = (direction: "prev" | "next") => {
        const el = document.getElementById("scheduleSectionPanel");
        if (el) {
            window.scrollTo({
                top: el.getBoundingClientRect().top + window.scrollY - 100,
                behavior: "smooth",
            });
        }

        let newDay = day + (direction == "prev" ? -1 : 1);

        if (newDay == 0) {
            newDay = 3;
        } else if (newDay == 4) {
            newDay = 1;
        }

        setDay(newDay as 1 | 2 | 3);
    };

    return (
        <div className="w-full">
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.5 }}
            >
                <motion.div
                    className="relative z-0 w-3/4 md:w-1/2 pt-6 -scale-x-100 -translate-x-1/3 opacity-80"
                    variants={{ hidden: { x: "100%" }, visible: { x: 0 } }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                >
                    <Image
                        src={Cloud3}
                        alt=""
                        sizes="(max-width: 800px) 75vw, 50vw"
                    />
                </motion.div>
                <motion.h2
                    className="relative z-5 w-full pt-6 font-glacial-indifference text-center text-4xl md:text-5xl font-semibold text-white"
                    variants={{
                        hidden: { y: "-100%", opacity: 0 },
                        visible: { y: 0, opacity: 1 },
                    }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    SCHEDULE
                </motion.h2>
                <motion.div
                    className="relative z-0 w-3/4 md:w-1/2 ml-auto translate-x-1/3 opacity-80 -translate-y-[25px]"
                    variants={{ hidden: { x: "100%" }, visible: { x: 0 } }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                >
                    <Image
                        src={Cloud3}
                        alt=""
                        sizes="(max-width: 800px) 75vw, 50vw"
                    />
                </motion.div>
            </motion.div>

            <div className="mx-auto w-[90%] max-w-[850px] mt-[10vmin]">
                <Image
                    src={ScheduleCloudTop}
                    alt=""
                    className="relative z-5 w-full"
                    sizes="(max-width: 944px) 90vw, 850px"
                />
                <div className="relative z-0 w-full -translate-y-0.5 px-[15%]">
                    <Image
                        src={ScheduleCloudBodyMobile}
                        alt=""
                        fill
                        className="block md:hidden absolute top-0 object-fill"
                        sizes="90vw"
                    />
                    <Image
                        src={ScheduleCloudBody}
                        alt=""
                        fill
                        className="hidden md:block absolute top-0 object-fill"
                        sizes="(max-width: 800px) 0vw, min(90vw, 850px)"
                    />

                    <Panel id={"scheduleSectionPanel"}>
                        <PanelHeader
                            parentPanelId={"scheduleSectionPanel"}
                            as="h3"
                            isSectionHeader
                            long
                            className="font-glacial-indifference font-semibold text-[#0078d0] px-0 md:px-0 pb-2 md:pb-2 flex justify-between items-center bg-transparent"
                        >
                            <button onClick={() => handleSwitchDay("prev")}>
                                <FaLongArrowAltLeft className="h-[30px] md:h-[45px] w-[30px] md:w-[45px] text-[#0078d0]/40 hover:text-[#0078d0] duration-300" />
                            </button>
                            DAY {day}
                            <button onClick={() => handleSwitchDay("next")}>
                                <FaLongArrowAltRight className="h-[30px] md:h-[45px] w-[30px] md:w-[45px] text-[#0078d0]/40 hover:text-[#0078d0] duration-300" />
                            </button>
                        </PanelHeader>
                        <PanelContent
                            parentPanelId={"scheduleSectionPanel"}
                            long
                            className="p-0 md:p-0 pb-4 md:pb-4 flex flex-col gap-y-3"
                        >
                            <div className="w-full flex flex-col gap-y-1 justify-center items-center text-lg lg:text-xl font-bold text-blue-500/60 text-center">
                                <span>( {daySchedule.date} )</span>{" "}
                                <span>{daySchedule.spirit.toUpperCase()}</span>
                            </div>
                            {daySchedule.events.map((e, idx) => (
                                <EventItem key={idx} event={e} />
                            ))}
                            <div className="flex justify-between items-center font-glacial-indifference font-semibold text-[#0078d0] text-lg md:text-xl lg:text-2xl">
                                <button onClick={() => handleSwitchDay("prev")}>
                                    <FaLongArrowAltLeft className="h-[30px] md:h-[45px] w-[30px] md:w-[45px] text-[#0078d0]/40 hover:text-[#0078d0] duration-300" />
                                </button>
                                DAY {day}
                                <button onClick={() => handleSwitchDay("next")}>
                                    <FaLongArrowAltRight className="h-[30px] md:h-[45px] w-[30px] md:w-[45px] text-[#0078d0]/40 hover:text-[#0078d0] duration-300" />
                                </button>
                            </div>
                        </PanelContent>
                    </Panel>
                </div>
                <Image
                    src={ScheduleCloudBottom}
                    alt=""
                    className="relative z-5 w-full -translate-y-1 md:translate-x-0.25"
                    sizes="(max-width: 944px) 90vw, 850px"
                />
            </div>
        </div>
    );
};

export default ScheduleSection;
