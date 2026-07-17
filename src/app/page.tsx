import HomePage from "@/src/app/HomePage";
import { getPrizes } from "../util/db/prize";
import { getLeaderboard } from "../util/db/leaderboard";
import { getSession } from "../util/session";
import { hasPermissions, PermissionLevel } from "../util/dataTypes";
import { getPermissionLevel } from "../util/db/user";
import { permission } from "process";

export default async function Page() {
    // The catch is to let this work in builds without databases.
    const hackeroonPrizes = getPrizes().catch((e) => {
        console.error(e);
        return [];
    });
    const leaderboardData = getLeaderboard().catch((e) => {
        console.error(e);
        return [];
    });

    const isJudge = getSession()
        .then((session) =>
            session?.user?.id ? getPermissionLevel(session.user.id) : null,
        )
        .then(
            (permission) =>
                permission != null &&
                hasPermissions(permission, { has: PermissionLevel.Judge }),
        )
        .catch((e) => {
            console.error(e);
            return false;
        });

    return (
        <HomePage
            hackeroonPrizes={hackeroonPrizes}
            leaderboardData={leaderboardData}
            isJudge={isJudge}
        />
    );
}
