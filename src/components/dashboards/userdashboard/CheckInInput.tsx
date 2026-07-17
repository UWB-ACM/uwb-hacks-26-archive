"use client";

import React, { useState } from "react";
import DashboardFeedback from "@/src/components/dashboards/DashboardFeedback";
import FancyInput from "@/src/components/ui/FancyInput";

function CheckInInput() {
    const [code, setCode] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    // The live check-in flow credited Hackeroons to the signed-in account.
    // The static archive has no backend, so it just explains that.
    function validateCheckIn() {
        setIsModalOpen(true);
    }

    return (
        <>
            <FancyInput
                value={code}
                onChange={setCode}
                onClick={validateCheckIn}
                button={true}
            />

            <DashboardFeedback
                open={isModalOpen}
                setOpen={setIsModalOpen}
                title="Check-in Unavailable"
                description="Event check-in isn't available on the archived version of the site."
            />
        </>
    );
}

export default CheckInInput;
