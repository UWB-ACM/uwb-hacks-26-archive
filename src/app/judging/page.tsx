import React from "react";
import { getSession } from "@/src/util/session";
import { ensureJudgePermission } from "@/src/util/judge";
import { JudgingPage } from "@/src/app/judging/JudgingPage";
import { getJudgeAssignments } from "@/src/util/db/judge";

export default async function Page() {
    const session = await getSession();
    await ensureJudgePermission(session);

    const judgeAssingments = await getJudgeAssignments(session.user!.id);

    return (
        <JudgingPage judgeId={session.user!.id} projects={judgeAssingments} />
    );
}
