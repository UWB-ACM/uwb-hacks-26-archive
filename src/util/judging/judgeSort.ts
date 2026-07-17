import { ROOMS } from "./rooms";
import { Project } from "@/src/util/dataTypes";

/**
 * The minimal shape of a project needed to compute a walking order.
 */
type SortableProject = Pick<Project, "id" | "room" | "tableNum">;

/**
 * Returns the configured index of a room (lower = earlier in walking
 * order). Rooms not present in ROOMS get pushed to the end, with any
 * completely null-room block even further back.
 *
 * @param name - is the room label, or null if the project is unplaced.
 */
function roomOrder(name: string | null): number {
    if (!name) return ROOMS.length + 1;

    const idx = ROOMS.findIndex((r) => r.name === name);
    return idx === -1 ? ROOMS.length : idx;
}

/**
 * Sorts a judge's project list into the order they should walk them,
 * with a per-judge staggered start so two judges covering the same
 * track arrive less often at the same project at the same time.
 *
 * The returned order:
 *   - Groups projects into contiguous blocks by room (rooms staggered by
 *     judge ID).
 *   - Inside each block, sorts by tableNum ascending.
 *   - Rotates each block by `judgeId % block.length`, so each
 *     judge enters the block at a different table but still walks
 *     the block contiguously (wrapping around at the end).
 *   - Appends any projects without a room/tableNum at the end,
 *     sorted by id, so the sort is still total even before tables
 *     have been assigned.
 *
 * @param judgeId - is the judge's user id; drives the staggered start.
 * @param projects - is the judge's project list.
 */
export function sortJudgeProjects<T extends SortableProject>(
    judgeId: number,
    projects: T[],
): T[] {
    if (projects.length === 0) return [];

    // Partition into per-room blocks. Unplaced projects are collected
    // separately and appended last.
    const blocks = new Map<string, T[]>();
    const unplaced: T[] = [];
    for (const p of projects) {
        if (!p.room || p.tableNum == null) {
            unplaced.push(p);
            continue;
        }

        let block = blocks.get(p.room);
        if (!block) {
            block = [];
            blocks.set(p.room, block);
        }

        block.push(p);
    }

    let orderedRoomNames = Array.from(blocks.keys()).sort((a, b) =>
        roomOrder(a) < roomOrder(b) ? -1 : 1,
    );
    const roomNamesOffset = judgeId % orderedRoomNames.length;
    // This ensures that rooms are evenly filled with judges.
    orderedRoomNames = orderedRoomNames
        .slice(roomNamesOffset)
        .concat(orderedRoomNames.slice(0, roomNamesOffset));

    const result: T[] = [];
    for (const roomName of orderedRoomNames) {
        const block = blocks.get(roomName)!;
        // Sort by physical distance so judges do less walking.
        block.sort((a, b) => ((a.tableNum ?? 0) < (b.tableNum ?? 0) ? -1 : 1));

        // Rotate by a judge-specific offset so two judges assigned to
        // the same room don't start at the same table.
        const rot = judgeId % block.length;
        for (let i = 0; i < block.length; i++) {
            result.push(block[(i + rot) % block.length]);
        }
    }

    // Put any unplaced projects at the end (in a consistent order).
    unplaced.sort((a, b) => (a.id < b.id ? -1 : 1));
    result.push(...unplaced);

    return result;
}
