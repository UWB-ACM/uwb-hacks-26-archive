import React from "react";
import { FaGift, FaFileImport, FaGavel } from "react-icons/fa6"; // Added FaGavel for a "Judging" icon
import { HiSpeakerphone } from "react-icons/hi";
import DashboardButton from "@/src/components/dashboards/DashboardButton";

function AdminActions() {
    return (
        <>
            <DashboardButton href="/dashboard/create-event">
                <FaGift className="h-[30px] w-[30px]" />
                Create Event
            </DashboardButton>
            <DashboardButton href="/dashboard/modify-event">
                <FaGift className="h-[30px] w-[30px]" />
                Modify Event
            </DashboardButton>
            <DashboardButton href="/dashboard/create-prize">
                <FaGift className="h-[30px] w-[30px]" />
                Create Prize
            </DashboardButton>
            <DashboardButton href="/dashboard/modify-prize">
                <FaGift className="h-[30px] w-[30px]" />
                Modify Prize
            </DashboardButton>
            <DashboardButton href="/dashboard/import-devpost">
                <FaFileImport className="h-[30px] w-[30px]" />
                Import Devpost
            </DashboardButton>
            <DashboardButton href="/dashboard/judging">
                <FaGavel className="h-[30px] w-[30px]" />
                Judging Admin
            </DashboardButton>
            <DashboardButton href="/dashboard/notifications">
                <HiSpeakerphone className="h-[30px] w-[30px]" />
                Broadcast Notification
            </DashboardButton>
        </>
    );
}

export default AdminActions;
