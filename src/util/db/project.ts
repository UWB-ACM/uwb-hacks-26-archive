import "server-only";

import sql from "@/src/util/database";
import { Project } from "../dataTypes";

export interface ProjectJudgeFeedback {
    judgeId: number;
    judgeName: string | null;
    feedback: string | null;
}

export interface ProjectJudgeScore {
    judgeId: number;
    questionId: number;
    questionText: string;
    score: number;
}

export interface ProjectWithJudgeFeedback {
    projectId: number;
    userEmails: string[];
    judgeAssignments: ProjectJudgeFeedback[];
    judgeScores: ProjectJudgeScore[];
}

/**
 * Retrieves the list of every project from the database.
 */
export async function getAllProjects(): Promise<Project[]> {
    const data =
        await sql`SELECT id, devpost_id, project_title, submission_url, submitted, devpost_image, try_url, video_url, main_track, side_tracks, user_emails, room, table_num FROM projects;`;

    return await Promise.all(
        data.map(async (entry) => ({
            id: entry.id,
            devpostId: entry.devpost_id,
            projectTitle: entry.project_title,
            submissionUrl: entry.submission_url,
            submitted: entry.submitted,
            devpostImage: entry.devpost_image,
            tryUrl: entry.try_url,
            videoUrl: entry.video_url,
            mainTrack: entry.main_track,
            sideTracks: entry.side_track,
            userEmails: entry.user_emails,
            room: entry.room,
            tableNum: entry.table_num,
        })),
    );
}

export async function getAllProjectFeedback(): Promise<
    ProjectWithJudgeFeedback[]
> {
    const assignmentRows = await sql`
        SELECT
            p.id AS project_id,
            p.user_emails,
            ja.judge_id,
            ja.feedback,
            u.name AS judge_name
        FROM projects p
        INNER JOIN judge_assignments ja ON p.id = ja.project_id
        INNER JOIN users u ON ja.judge_id = u.id
        ORDER BY p.id, ja.judge_id
    `;

    const scoreRows = await sql`
        SELECT
            js.project_id,
            js.judge_id,
            js.question_id,
            js.score,
            q.question_text
        FROM judging_scores js
        INNER JOIN judging_questions q ON js.question_id = q.id
    `;

    const projectsById = new Map<number, ProjectWithJudgeFeedback>();

    const getOrCreate = (projectId: number, userEmails: string[] | null) => {
        let project = projectsById.get(projectId);
        if (!project) {
            project = {
                projectId,
                userEmails: userEmails ?? [],
                judgeAssignments: [],
                judgeScores: [],
            };

            projectsById.set(projectId, project);
        }

        return project;
    };

    for (const row of assignmentRows) {
        const project = getOrCreate(row.project_id, row.user_emails);
        const trimmedFeedback =
            typeof row.feedback === "string" ? row.feedback.trim() : null;

        project.judgeAssignments.push({
            judgeId: row.judge_id,
            judgeName: row.judge_name ?? null,
            feedback: trimmedFeedback,
        });
    }

    for (const row of scoreRows) {
        const project = getOrCreate(row.project_id, null);
        project.judgeScores.push({
            judgeId: row.judge_id,
            questionId: row.question_id,
            questionText: row.question_text ?? "",
            score: Number(row.score),
        });
    }

    return Array.from(projectsById.values());
}
