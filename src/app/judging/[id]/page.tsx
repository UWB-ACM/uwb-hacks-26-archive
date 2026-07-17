import React from "react";
import { getSession } from "@/src/util/session";
import {
    getProject,
    getJudgingQuestions,
    getScoresForProject,
    getFeedback,
} from "@/src/util/db/judge";
import ProjectScoringPage from "./ProjectScoringPage";
import { ensureJudgePermission } from "@/src/util/judge";
import { redirect } from "next/navigation";

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const session = await getSession();
    await ensureJudgePermission(session);

    const projectId = parseInt((await params).id);

    const project = await getProject(projectId);
    if (!project) {
        return redirect("/judging");
    }
    const [questions, existingScores] = await Promise.all([
        getJudgingQuestions(projectId, session.user!.id),
        getScoresForProject(session.user!.id, projectId),
    ]);

    const existingFeedback = await getFeedback(projectId, session.user!.id);

    return (
        <ProjectScoringPage
            project={project}
            questions={questions}
            existingScores={existingScores}
            existingFeedback={existingFeedback}
        />
    );
}
