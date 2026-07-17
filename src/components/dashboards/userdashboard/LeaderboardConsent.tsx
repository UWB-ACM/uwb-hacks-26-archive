"use client";

import { Checkbox } from "@/src/components/ui/checkbox";
import React, { useState } from "react";
import { DemoUser } from "@/src/data/archive";

export default function LeaderboardConsent({
    initialLeaderboardConsent,
    user,
}: {
    initialLeaderboardConsent: boolean;
    user: DemoUser;
}) {
    const [isLeaderboardConsentChecked, setIsLeaderboardConsentChecked] =
        useState(initialLeaderboardConsent);

    // In the static archive there's no account to persist this to, so the
    // checkbox only toggles local state.
    const setChecked = (checked: boolean) => {
        setIsLeaderboardConsentChecked(checked);
    };

    return (
        <div className="flex items-center space-x-2 py-4">
            <Checkbox
                id="consent-leaderboard-check-comp"
                checked={isLeaderboardConsentChecked}
                onCheckedChange={(checked) => {
                    if (typeof checked !== "boolean") return;

                    setChecked(checked);
                }}
            />
            <label
                htmlFor="consent-leaderboard-check-comp"
                className="text-sm font-medium leading-none"
            >
                Show my name ({user.name}), profile picture, and total earned
                Hackeroon amount on the public leaderboard.
            </label>
        </div>
    );
}
