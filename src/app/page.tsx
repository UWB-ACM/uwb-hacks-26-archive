import HomePage from "@/src/app/HomePage";
import { snapshotPrizes, snapshotLeaderboard } from "@/src/data/archive";

export default function Page() {
    // This is the static archive: the prize and leaderboard data that was
    // once loaded from the database is now served from a hardcoded snapshot.
    return (
        <HomePage
            hackeroonPrizes={Promise.resolve(snapshotPrizes)}
            leaderboardData={Promise.resolve(snapshotLeaderboard)}
        />
    );
}
