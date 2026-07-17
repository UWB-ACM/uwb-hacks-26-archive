"use client";

import { useMemo } from "react";
import { Project } from "@/src/util/dataTypes";
import ProjectCard from "@/src/components/dashboards/judge/ProjectCard";
import Header from "@/src/components/header/Header";
import { sortJudgeProjects } from "@/src/util/judging/judgeSort";

const HEADER_LINKS = [{ id: "Home", name: "Home", url: "/" }];

/**
 * The top-level judge portal UI - a list of project cards in walking
 * order. Projects are sorted once on mount via `sortJudgeProjects`,
 * which groups by room and rotates each block by a judge-specific
 * offset so two judges on the same track don't start at the same
 * table.
 *
 * @param judgeId - is the logged-in judge's user id, used as the seed
 *     for the staggered walk order.
 * @param projects - is the list of projects assigned to the judge.
 */
export function JudgingPage({
    judgeId,
    projects,
}: {
    judgeId: number;
    projects: Array<Project & { completedAt: Date | null }>;
}) {
    const ANY_PROJECTS = projects.length === 0;

    // Sorting ensures we reduce the judge's walk and stagger
    // rounds correctly.
    const sorted = useMemo(
        () => sortJudgeProjects(judgeId, projects),
        [judgeId, projects],
    );

    return (
        <div className="w-full min-h-full flex flex-col">
            <Header links={HEADER_LINKS} />
            <h1 className="font-edge-of-the-galaxy text-5xl text-[#ffffff] text-center mt-8">
                Judge Portal
            </h1>

            {ANY_PROJECTS ? (
                <div className="flex justify-center">
                    <p className="mt-4 font-h1 text-3xl text-[#39a8f1] text-center w-[90%] md:w-[80%]">
                        Waiting For Assignments...
                    </p>
                </div>
            ) : (
                <div className="grow p-8 overflow-scroll overflow-x-hidden grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sorted.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            )}
        </div>
    );
}
