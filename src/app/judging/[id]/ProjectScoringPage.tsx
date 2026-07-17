"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Project, JudgingQuestion, JudgingScore } from "@/src/util/dataTypes";
import {
    actionSubmitScore,
    actionCompleteAssignment,
    actionSubmitFeedback,
} from "@/src/util/actions/judge";
import Header from "@/src/components/header/Header";

const HEADER_LINKS = [{ id: "Home", name: "Home", url: "/" }];

export default function ProjectScoringPage({
    project,
    questions,
    existingScores,
    existingFeedback,
}: {
    project: Project;
    questions: JudgingQuestion[];
    existingScores: JudgingScore[];
    existingFeedback: string | null;
}) {
    const router = useRouter();

    // Seed state from any scores already in the DB so revisiting the page pre-fills inputs.
    const [scores, setScores] = useState<Record<number, number>>(
        Object.fromEntries(existingScores.map((s) => [s.questionId, s.score])),
    );
    const [feedback, setFeedback] = useState<string>(
        existingFeedback === null ? "" : existingFeedback,
    );

    const [completing, setCompleting] = useState(false);

    // All questions must have a defined score before the judge can mark complete.
    const allScored =
        questions.length === 0 || questions.every((q) => q.id in scores);

    const [error, setError] = useState<string | null>(null);

    function handleChange(questionId: number, raw: string) {
        const val = parseInt(raw);
        if (!isNaN(val) && val >= 0 && val <= 10) {
            setScores((prev) => ({ ...prev, [questionId]: val }));
        }
    }

    // Autosave to DB when the judge finishes entering a score for a question.
    async function handleMouseUp(questionId: number) {
        const score = scores[questionId];
        if (score !== undefined) {
            try {
                await actionSubmitScore(project.id, questionId, score);
            } catch (e) {
                setError(
                    "Something went wrong submitting your score. Please tell a staff member",
                );
                console.error("Failed to submit score", {
                    projectId: project.id,
                    questionId,
                    score,
                    error: e,
                });
            }
        }
    }

    async function handleComplete() {
        setCompleting(true);
        setError(null);
        const scoreQuestionArray = questions
            .filter((q) => scores[q.id] !== undefined)
            .map((q) => [q.id, scores[q.id]] as [number, number]);

        try {
            await actionCompleteAssignment(
                project.id,
                scoreQuestionArray,
                feedback,
            );
            router.push("/judging");
        } catch (e) {
            setError(
                "Something went wrong with submitting your assessment. Please inform a staff member",
            );
            console.error("Failed to submit all scores", {
                error: e,
            });
            setCompleting(false);
        }
    }

    return (
        <div className="w-full min-h-full flex flex-col">
            <Header links={HEADER_LINKS} />

            <div className="flex flex-col gap-6 p-8 max-w-3xl mx-auto w-full">
                <Link
                    href="/judging"
                    className="font-h2 text-[#ffffff]  w-fit font-bold text-2xl"
                >
                    ← Back to projects
                </Link>

                {/* Project info card */}
                <div className="bg-neutral-200 rounded-lg border-4 border-black shadow-comic p-6">
                    <h1 className="font-bold text-4xl text-[#2886c4] text-center ">
                        {project.projectTitle}
                    </h1>

                    <div className="flex flex-wrap gap-2 mt-3 justify-center">
                        <span className="bg-white border-2 border-black px-3 py-1 rounded-full font-h2 text-sm font-bold">
                            {project.mainTrack}
                        </span>
                        {project.sideTracks.map((track) => (
                            <span
                                key={track}
                                className="bg-white border-2 border-black px-3 py-1 rounded-full font-h2 text-sm font-bold"
                            >
                                {track}
                            </span>
                        ))}
                    </div>

                    <div className="flex gap-4 mt-4 flex-wrap">
                        {project.submissionUrl && (
                            <Link
                                href={project.submissionUrl}
                                target="_blank"
                                className="font-h2 text-[#2886c4] underline font-bold"
                            >
                                Devpost →
                            </Link>
                        )}
                        {project.tryUrl && (
                            <Link
                                href={project.tryUrl}
                                target="_blank"
                                className="font-h2 text-[#2886c4] underline"
                            >
                                Demo →
                            </Link>
                        )}
                        {project.videoUrl && (
                            <Link
                                href={project.videoUrl}
                                target="_blank"
                                className="font-h2 text-[#2886c4] underline"
                            >
                                Video →
                            </Link>
                        )}
                    </div>
                </div>

                {/* Scoring questions */}
                {questions.length === 0 ? (
                    <p className="font-h2 text-xl text-neutral-500">
                        Something went wrong and no questions were assigned.
                        Please find a staff member immediately.
                    </p>
                ) : (
                    <div className="flex flex-col gap-4">
                        <h2 className="font-h1 text-2xl text-[#ffffff] text-center text-4xl">
                            Scoring
                        </h2>
                        {questions.map((question) => {
                            const currentScore = scores[question.id];
                            return (
                                <div
                                    key={question.id}
                                    className="bg-neutral-200 rounded-lg border-4 border-black shadow-comic p-6 flex flex-col gap-3"
                                >
                                    <p className="font-h2 text-lg font-bold">
                                        {question.questionText}
                                    </p>
                                    {question.description && (
                                        <p className="font-h2 text-sm italic text-neutral-700">
                                            {question.description}
                                        </p>
                                    )}
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="range"
                                                min={0}
                                                max={10}
                                                value={currentScore ?? 0}
                                                onChange={(e) =>
                                                    handleChange(
                                                        question.id,
                                                        e.target.value,
                                                    )
                                                }
                                                onPointerUp={() =>
                                                    handleMouseUp(question.id)
                                                }
                                                onKeyUp={() =>
                                                    handleMouseUp(question.id)
                                                }
                                                className="flex-1 accent-[#2886c4] h-3 cursor-pointer"
                                            />

                                            <span className="font-h2 font-bold text-xl w-8 text-center border-2 border-black rounded bg-white">
                                                {currentScore !== undefined
                                                    ? currentScore
                                                    : "—"}
                                            </span>
                                        </div>
                                    </div>
                                    {question.scoreFormat &&
                                        question.scoreFormat.rows.length >
                                            0 && (
                                            <table className="w-full mt-2 border-2 border-black bg-white text-sm font-h2 table-fixed">
                                                <thead>
                                                    <tr className="bg-[#2886c4] text-white">
                                                        <th className="border-2 border-black px-2 py-1 w-20 text-center">
                                                            Score
                                                        </th>
                                                        <th className="border-2 border-black px-2 py-1 text-left">
                                                            Description
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {question.scoreFormat.rows.map(
                                                        (row, i) => {
                                                            const highlight =
                                                                currentScore !==
                                                                    undefined &&
                                                                currentScore >=
                                                                    row.min &&
                                                                currentScore <=
                                                                    row.max;
                                                            return (
                                                                <tr
                                                                    key={i}
                                                                    className={
                                                                        highlight
                                                                            ? "bg-yellow-200 font-bold"
                                                                            : ""
                                                                    }
                                                                >
                                                                    <td className="border-2 border-black px-2 py-1 text-center">
                                                                        {row.min ===
                                                                        row.max
                                                                            ? row.min
                                                                            : `${row.min}-${row.max}`}
                                                                    </td>
                                                                    <td className="border-2 border-black px-2 py-1">
                                                                        {
                                                                            row.label
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            );
                                                        },
                                                    )}
                                                </tbody>
                                            </table>
                                        )}
                                </div>
                            );
                        })}
                    </div>
                )}
                {/* Feedback — special case, not part of scored questions */}
                <div className="bg-neutral-200 rounded-lg border-4 border-black shadow-comic p-6 flex flex-col gap-3">
                    <h2 className="font-h2 text-lg font-bold">
                        Feedback for the team (optional)
                    </h2>
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        onBlur={() =>
                            actionSubmitFeedback(project.id, feedback)
                        }
                        rows={4}
                        placeholder="Leave constructive feedback for the team..."
                        className="w-full border-2 border-black rounded p-2 font-h2 text-sm resize-none bg-white"
                    />
                </div>

                {error && (
                    <p className="font-h2 text-red-500 font-bold text-center text-5xl">
                        {error}
                    </p>
                )}

                <button
                    onClick={handleComplete}
                    disabled={!allScored || completing}
                    className="mt-2 font-h2 text-xl bg-[#2886c4] text-white border-4 border-black shadow-comic rounded-lg px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#39a8f1] transition-colors"
                >
                    {completing ? "Submitting..." : "Mark Complete"}
                </button>
            </div>
        </div>
    );
}
