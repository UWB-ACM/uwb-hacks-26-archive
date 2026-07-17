import { Event } from "./Schedule";
import { MdLocationPin } from "react-icons/md";
import { FaRegClock } from "react-icons/fa";
import { cn } from "@/src/util/utils";

interface EventProps {
    event: Event;
}

const formatTime = (date: Date): string =>
    date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });

const EventItem = ({ event }: EventProps) => {
    const now = new Date();
    const isActive =
        !!event.endTime && now >= event.startTime && now <= event.endTime;
    const isSoon =
        !isActive &&
        event.startTime.getTime() - now.getTime() <= 15 * 60 * 1000 &&
        event.startTime > now;

    const soonStyles = "bg-blue-50 text-blue-400 border-blue-300";
    const activeStyles = "bg-blue-400 text-white border-blue-200";

    const timeDisplay = event.endTime
        ? `${formatTime(event.startTime)} - ${formatTime(event.endTime)}`
        : formatTime(event.startTime);

    return (
        <div
            className={cn(
                "flex flex-col md:flex-row gap-y-1 justify-between items-center w-full rounded-xl p-2 border border-b-6 border-r-6 text-sm md:text-base lg:text-lg text-center md:text-left",
                isSoon ? soonStyles : "",
                isActive ? activeStyles : "",
            )}
        >
            <div className="flex flex-col gap-y-1 items-center md:items-start max-w-[350px]">
                <span className="font-bold">
                    {isSoon ? "[Coming Up]" : ""}
                    {isActive ? "[Live]" : ""} {event.name}
                </span>
                <div className="flex items-center gap-x-2">
                    <FaRegClock className="h-[20px] w-[20px]" />{" "}
                    <span>{timeDisplay}</span>
                </div>
            </div>
            <div className="flex items-center gap-x-1 text-center">
                <MdLocationPin className="h-[25px] w-[25px]" />{" "}
                <span>{event.location}</span>
            </div>
        </div>
    );
};

export default EventItem;
