import { getSession } from "@/src/util/session";
import JudgingAdminClient from "./JudgingAdminClient";
import { Metadata } from "next";
import { ensureAdminPermission } from "@/src/util/staff";

export const metadata: Metadata = {
    title: "Judging Admin | UWB Hacks 26",
};

export default async function Page() {
    const session = await getSession();
    await ensureAdminPermission(session);

    // 3. Render the Client UI if authorized
    return <JudgingAdminClient />;
}
