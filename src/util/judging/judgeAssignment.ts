import { sortJudgeProjects } from "./judgeSort";
import { JudgeAssignment, Project, Track } from "@/src/util/dataTypes";

/**
 * The number of judges that should score each (project, track) pair.
 */
export const JUDGES_PER_TRACK = 3;

/**
 * The minimum count of judges simultaneously scheduled at the same
 * project in the same round that should trigger a collision warning.
 */
export const COLLISION_THRESHOLD = 3;

/**
 * The minimal shape of a track needed for judge assignment.
 */
export type AssignTrack = Pick<Track, "id" | "devpostTag">;

/**
 * The minimal shape of a project needed for judge assignment.
 */
export type AssignProject = Pick<
    Project,
    "id" | "mainTrack" | "sideTracks" | "room" | "tableNum"
>;

/**
 * The minimal shape of a judge needed for judge assignment.
 */
export interface AssignJudge {
    /**
     * The judge's user id.
     */
    id: number;

    /**
     * The ids of tracks the judge has been opted in to.
     */
    trackIds: number[];
}

/**
 * The minimal shape of a judge assignment (judge -> project) needed for
 * judge assignment.
 */
export type AssignJudgeAssignment = Pick<
    JudgeAssignment,
    "judgeId" | "projectId"
>;

/**
 * The output of `computeJudgeAssignments`.
 */
export interface JudgeAssignmentResult {
    /**
     * The assignments that should be inserted into the database.
     * Does not include assignments that already exist.
     */
    newAssignments: AssignJudgeAssignment[];

    /**
     * The top 3 highest project counts assigned to a single judge, in
     * descending order. The first entry is the worst-case round count
     * (the old `max workload` number). Surfacing the top 3 lets admins
     * spot a single outlier judge - e.g. one handling all sidetracks -
     * inflating the perceived round count beyond what the rest of the
     * pool actually needs. Has up to 3 entries; fewer if there are
     * fewer than 3 judges.
     */
    neededRounds: number[];

    /**
     * Non-fatal issues (unknown track tags, empty tags, insufficient
     * judges for a track, etc.). Shown to the admin after the run.
     */
    warnings: string[];
}

/**
 * Decides which judges to add to which projects so that every
 * (project, track) pair has JUDGES_PER_TRACK judges covering it.
 *
 * Candidate ranking, in order:
 *   1. Workload ascending - the judge with the fewest existing
 *      assignments is preferred (primary fairness knob).
 *   2. Shared main track - among judges with equal workload, those
 *      who already have an assignment to a project in the current
 *      project's main track come first, so judges concentrate within
 *      a single main track when possible.
 *   3. Minimum table distance ascending - among judges still tied,
 *      the one whose closest existing table sits nearest to the
 *      project's table wins. Judges with no assignment in the
 *      project's room (or with no table data) are treated as
 *      infinitely far, so the same-room preference falls out for free.
 *
 * @param tracks - is the list of all tracks known to the system.
 * @param projects - is the list of projects to assign judges to.
 * @param judges - is the list of judges available to be assigned.
 * @param existing - is the list of (judge, project) pairs already in
 *     the database. Used to seed workload and per-judge table lists
 *     so re-runs don't double-assign.
 */
export function computeJudgeAssignments(
    tracks: AssignTrack[],
    projects: AssignProject[],
    judges: AssignJudge[],
    existing: AssignJudgeAssignment[],
): JudgeAssignmentResult {
    const warnings: string[] = [];
    const newAssignments: AssignJudgeAssignment[] = [];

    // 1. INDEXING: Maps for O(1) lookups.
    const judgeMap = new Map(judges.map((j) => [j.id, j]));
    const trackMap = new Map(tracks.map((t) => [t.devpostTag, t]));
    const projectMap = new Map(projects.map((p) => [p.id, p]));

    // Judge ID -> # of assigned projects.
    const judgeWorkload = new Map<number, number>();
    for (const j of judges) judgeWorkload.set(j.id, 0);
    for (const a of existing) {
        judgeWorkload.set(a.judgeId, (judgeWorkload.get(a.judgeId) ?? 0) + 1);
    }

    // For each judge, the (room, tableNum) of every project they're
    // already assigned to. Used by the distance tiebreak below.
    const judgeTables = new Map<number, { room: string; tableNum: number }[]>();
    for (const j of judges) judgeTables.set(j.id, []);
    for (const a of existing) {
        const p = projectMap.get(a.projectId);
        if (!p || !p.room || p.tableNum == null) continue;

        judgeTables
            .get(a.judgeId)
            ?.push({ room: p.room, tableNum: p.tableNum });
    }

    // For each judge, the set of main tracks of every project they're
    // already assigned to. Used by the shared-main-track tiebreak below.
    const judgeMainTracks = new Map<number, Set<string>>();
    for (const j of judges) judgeMainTracks.set(j.id, new Set());
    for (const a of existing) {
        const p = projectMap.get(a.projectId);
        if (!p || !p.mainTrack) continue;

        judgeMainTracks.get(a.judgeId)?.add(p.mainTrack);
    }

    /**
     * The minimum walking distance from `project`'s table to any of
     * the judge's existing tables in the same room.
     *
     * Returns Infinity if the project has no placement, the judge has
     * no assignments yet, or the judge has no assignments in the
     * project's room - so a judge already in the room always beats one
     * who isn't, and unplaced projects fall back to the next tiebreak.
     *
     * @param judgeId - is the judge to score.
     * @param project - is the project we're considering placing them at.
     */
    const minTableDistance = (
        judgeId: number,
        project: AssignProject,
    ): number => {
        if (!project.room || project.tableNum == null) return Infinity;

        const tables = judgeTables.get(judgeId)!;

        let best = Infinity;
        for (const t of tables) {
            if (t.room !== project.room) continue;

            const d = Math.abs(t.tableNum - project.tableNum);
            if (d < best) best = d;
        }

        return best;
    };

    // The full set of (judge, project) pairs after this run, used so
    // subsequent iterations see assignments we just made.
    const assignments: AssignJudgeAssignment[] = [...existing];

    // 2. ASSIGNMENT ENGINE
    for (const project of projects) {
        const projectTrackTags = Array.from(
            new Set([project.mainTrack, ...project.sideTracks]),
        );

        for (const tag of projectTrackTags) {
            if (!tag) {
                warnings.push(`Project ${project.id} has an empty track tag.`);
                continue;
            }

            const track = trackMap.get(tag);
            if (!track) {
                warnings.push(
                    `Track tag "${tag}" (Project ${project.id}) not found.`,
                );
                continue;
            }

            const projectAssignments = assignments.filter(
                (a) => a.projectId === project.id,
            );

            // Note: count judge contributions across tracks for the same project.
            const trackJudgesAssignedCount = projectAssignments.filter((a) => {
                const judge = judgeMap.get(a.judgeId);
                return judge?.trackIds.includes(track.id);
            }).length;

            if (trackJudgesAssignedCount < JUDGES_PER_TRACK) {
                const needed = JUDGES_PER_TRACK - trackJudgesAssignedCount;

                const candidates = judges
                    .filter((j) => {
                        return (
                            j.trackIds.includes(track.id) &&
                            !projectAssignments.some((a) => a.judgeId === j.id)
                        );
                    })
                    .sort((a, b) => {
                        // (1) fewest assignments so far.
                        const wa = judgeWorkload.get(a.id) ?? 0;
                        const wb = judgeWorkload.get(b.id) ?? 0;
                        if (wa !== wb) return wa < wb ? -1 : 1;

                        // (2) judges who already have a project in this
                        //     project's main track come first, so judges
                        //     stay concentrated within a main track.
                        const sa =
                            project.mainTrack &&
                            judgeMainTracks.get(a.id)?.has(project.mainTrack)
                                ? 0
                                : 1;
                        const sb =
                            project.mainTrack &&
                            judgeMainTracks.get(b.id)?.has(project.mainTrack)
                                ? 0
                                : 1;
                        if (sa !== sb) return sa < sb ? -1 : 1;

                        // (3) closest existing table to the project's table,
                        //     to minimize judge walking distance.
                        const da = minTableDistance(a.id, project);
                        const db = minTableDistance(b.id, project);
                        if (da !== db) return da < db ? -1 : 1;

                        // Deterministic tiebreak on judge id.
                        return a.id < b.id ? -1 : 1;
                    });

                if (candidates.length < needed) {
                    warnings.push(
                        `Insufficient judges for track "${tag}" (Project ${project.id}). Found ${candidates.length}/${needed}.`,
                    );
                }

                for (let i = 0; i < Math.min(needed, candidates.length); i++) {
                    const selectedJudge = candidates[i];

                    newAssignments.push({
                        judgeId: selectedJudge.id,
                        projectId: project.id,
                    });

                    // Update local tracking maps so the next iteration
                    // sees this assignment.
                    judgeWorkload.set(
                        selectedJudge.id,
                        (judgeWorkload.get(selectedJudge.id) ?? 0) + 1,
                    );
                    assignments.push({
                        judgeId: selectedJudge.id,
                        projectId: project.id,
                    });
                    if (project.room && project.tableNum != null) {
                        judgeTables.get(selectedJudge.id)!.push({
                            room: project.room,
                            tableNum: project.tableNum,
                        });
                    }
                    if (project.mainTrack) {
                        judgeMainTracks
                            .get(selectedJudge.id)!
                            .add(project.mainTrack);
                    }
                }
            }
        }
    }

    const neededRounds = [...judgeWorkload.values()]
        // Sort descending.
        .sort((a, b) => (b < a ? -1 : 1))
        .slice(0, 3);

    return { newAssignments, neededRounds, warnings };
}

/**
 * The ordered list of projects that a single judge should visit.
 * Returned by `analyzeCollisions` to support admin debugging.
 */
export interface JudgeWalk {
    /**
     * The user id of the judge.
     */
    judgeId: number;

    /**
     * The project ids this judge should visit, in walking order.
     * The index of a project in this list is its round number for that
     * judge.
     */
    projectIds: number[];
}

/**
 * A report of a round where too many judges converge on the same project.
 */
export interface CollisionReport {
    /**
     * The id of the project that has a pile-up.
     */
    projectId: number;

    /**
     * The round (0-based index in each judge's walk) at which the
     * pile-up happens.
     */
    round: number;

    /**
     * The ids of the judges scheduled to hit this project in this round.
     */
    judgeIds: number[];
}

/**
 * Builds each judge's walk list using `sortJudgeProjects`, then flags
 * any (project, round) pair that has COLLISION_THRESHOLD or more judges
 * scheduled on it simultaneously.
 *
 * @param projects - is the list of projects (with room/tableNum) used
 *     to look up each assignment's location.
 * @param allAssignments - is the full list of (judge, project) pairs
 *     after the assignment pass (existing + newly added).
 */
export function analyzeCollisions(
    projects: AssignProject[],
    allAssignments: AssignJudgeAssignment[],
): CollisionReport[] {
    const projectById = new Map(projects.map((p) => [p.id, p]));

    // Group assignments by judge so each judge's walk can be sorted
    // independently.
    const byJudge = new Map<number, AssignProject[]>();
    for (const assignment of allAssignments) {
        const project = projectById.get(assignment.projectId);
        if (!project) continue;

        let list = byJudge.get(assignment.judgeId);
        if (!list) {
            list = [];
            byJudge.set(assignment.judgeId, list);
        }

        list.push(project);
    }

    // counts[round] -> Map<projectId, judgeIds[]>: who visits each
    // project at each round number.
    const counts: Map<number, number[]>[] = [];

    for (const [judgeId, projs] of byJudge.entries()) {
        const sorted = sortJudgeProjects(judgeId, projs);

        // Count projects per round and identify collisions.
        for (let round = 0; round < sorted.length; round++) {
            if (!counts[round]) counts[round] = new Map();

            const pid = sorted[round].id;
            const arr = counts[round].get(pid);

            if (arr) arr.push(judgeId);
            else counts[round].set(pid, [judgeId]);
        }
    }

    const collisions: CollisionReport[] = [];
    for (let round = 0; round < counts.length; round++) {
        const map = counts[round];

        for (const [projectId, judgeIds] of map.entries()) {
            if (judgeIds.length >= COLLISION_THRESHOLD) {
                collisions.push({ projectId, round, judgeIds });
            }
        }
    }

    return collisions;
}
