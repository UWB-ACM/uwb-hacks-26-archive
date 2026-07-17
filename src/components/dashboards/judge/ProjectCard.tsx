"use client";

import React from "react";
import Link from "next/link";
import { Project } from "@/src/util/dataTypes";

/**
 * A single card in the judge portal listing. Links to the scoring
 * page and shows the project's physical location when known so the
 * judge can walk directly to the table.
 *
 * @param project - is the project to render a card for.
 */
export default function ProjectCard({
    project,
}: {
    project: Project & { completedAt: Date | null };
}) {
    const hasLocation = project.room && project.tableNum != null;
    return (
        <Link href={`/judging/${project.id}`} className="h-min">
            <div
                className={`flex flex-col items-center p-6 rounded-lg border-4 border-black shadow-comic ${project.completedAt !== null ? "bg-green-500" : "bg-neutral-200"}`}
            >
                <p className="font-bold text-2xl">{project.projectTitle}</p>
                {hasLocation ? (
                    <p className="font-bold text-lg text-[#2886c4]">
                        Room {project.room} · Table {project.tableNum}
                    </p>
                ) : (
                    <p className="text-sm italic text-neutral-500">
                        No table assigned
                    </p>
                )}
                <p>{project.mainTrack}</p>
                <p>{project.sideTracks.join(", ")}</p>
                <p className="text-sm">#{project.id}</p>
            </div>
        </Link>
    );
}
