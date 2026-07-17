import { ROOMS, TRACK_ROOM_AFFINITY } from "./rooms";

/**
 * The minimal shape of a project needed for table assignment.
 *
 * Decoupled from the full Project type so callers can pass in whatever
 * they've got - typically a trimmed-down row straight from the
 * projects table.
 */
export interface AssignableProject {
    /**
     * The project's database id.
     */
    id: number;

    /**
     * The devpost tag of the project's main track. Used to group
     * same-track projects contiguously and to look up the track's
     * room affinity.
     */
    mainTrack: string;

    /**
     * The room the project is already placed in, if any. Projects
     * with both room and tableNum set are treated as already-assigned
     * and left untouched.
     */
    room: string | null;

    /**
     * The table number within the project's room, if any.
     */
    tableNum: number | null;
}

/**
 * A single placement the caller should persist to the projects table.
 */
export interface TablePlacement {
    /**
     * The id of the project to update.
     */
    projectId: number;

    /**
     * The room to place the project in.
     */
    room: string;

    /**
     * The table number within that room.
     */
    tableNum: number;
}

/**
 * The output of `computeTableAssignments`.
 */
export interface TableAssignmentResult {
    /**
     * The new placements to persist.
     * Already-assigned projects are not included here.
     */
    placements: TablePlacement[];

    /**
     * Non-fatal issues (missing affinity, split blocks, over capacity,
     * unknown rooms, etc.). Shown to the admin after the run.
     */
    warnings: string[];
}

/**
 * The live fill state of one room during a single assignment pass.
 *
 * Tables are visited in numeric order so same-track blocks land on
 * consecutive tables. Each table is filled up to `projectsPerTable`
 * (counting any pre-existing placements) before we advance, so
 * partially-occupied tables get topped up rather than wasted.
 */
interface RoomState {
    /**
     * The room label.
     */
    name: string;

    /**
     * The number of physical tables in the room.
     */
    numTables: number;

    /**
     * How many projects can share one table.
     */
    projectsPerTable: number;

    /**
     * The next table (1-indexed) to consider for placement. Every
     * table strictly less than this is full. If it exceeds
     * `numTables`, the room is full.
     */
    nextTable: number;

    /**
     * Map from 1-indexed table number to the number of projects
     * currently placed there (counting both pre-existing placements
     * and ones added during this pass). `takeSeat` advances past any
     * table whose count has reached `projectsPerTable`.
     */
    seatsByTable: Map<number, number>;
}

/**
 * Builds the initial RoomState for every configured room, seeding
 * each room's per-table occupancy from the projects already placed
 * there so partial tables get filled the rest of the way before we
 * move on.
 *
 * @param occupiedByRoom - is a map from room name to a map from table
 *     number to the count of projects already placed at that table.
 */
function initRoomStates(
    occupiedByRoom: Map<string, Map<number, number>>,
): RoomState[] {
    return ROOMS.map((r) => {
        const occ = occupiedByRoom.get(r.name);
        const seatsByTable = new Map<number, number>();
        if (occ) {
            for (const [tableNum, count] of occ.entries()) {
                seatsByTable.set(tableNum, count);
            }
        }

        return {
            name: r.name,
            numTables: r.numTables,
            projectsPerTable: r.projectsPerTable,
            nextTable: 1,
            seatsByTable,
        };
    });
}

/**
 * Claims the next free seat in a room and returns its table number,
 * or null if the room is full.
 *
 * Walks tables in numeric order, topping up partially-occupied tables
 * (including ones with pre-existing placements) before advancing, so
 * we never collide with existing placements and never waste a slot.
 *
 * @param state - is the mutable fill state of the room to claim from.
 */
function takeSeat(state: RoomState): { tableNum: number } | null {
    while (state.nextTable <= state.numTables) {
        const taken = state.seatsByTable.get(state.nextTable) ?? 0;
        if (taken >= state.projectsPerTable) {
            state.nextTable++;
            continue;
        }

        const tableNum = state.nextTable;
        state.seatsByTable.set(tableNum, taken + 1);
        if (taken + 1 >= state.projectsPerTable) {
            state.nextTable++;
        }

        return { tableNum };
    }

    return null;
}

/**
 * Computes table placements for every project that doesn't already
 * have one.
 *
 * Idempotent: projects with both `room` and `tableNum` set are left
 * untouched, so re-runs only fill in gaps. Warnings are emitted for
 * any surprising pre-existing state (unknown rooms, out-of-range
 * tables, over-filled tables, etc.).
 *
 * The algorithm:
 *   - Group unassigned projects by mainTrack so same-track projects
 *     stay contiguous in whatever room they land in.
 *   - Place tracks with a configured affinity first, each into its
 *     preferred room. Any overflow spills into the next room in
 *     ROOMS order that still has capacity.
 *   - Place tracks without an affinity last using the same spill
 *     order.
 *
 * Within a single room, same-track projects get consecutive table
 * numbers, so judges walking a track-sorted list move along an
 * arithmetic progression of table numbers.
 *
 * @param projects - is every project we care about (submitted ones).
 *     Already-placed projects must be included so their seats get
 *     reserved; they will not appear in the result's placements.
 */
export function computeTableAssignments(
    projects: AssignableProject[],
): TableAssignmentResult {
    const warnings: string[] = [];
    const placements: TablePlacement[] = [];

    // Room -> tableNum -> count
    const occupiedByRoom = new Map<string, Map<number, number>>();
    for (const p of projects) {
        if (p.room && p.tableNum != null) {
            let inner = occupiedByRoom.get(p.room);
            if (!inner) {
                inner = new Map();
                occupiedByRoom.set(p.room, inner);
            }

            inner.set(p.tableNum, (inner.get(p.tableNum) ?? 0) + 1);
        }
    }

    // Validate that the current config is correct.
    for (const [roomName, occ] of occupiedByRoom.entries()) {
        const cfg = ROOMS.find((r) => r.name === roomName);
        if (!cfg) {
            warnings.push(
                `FAILURE: Projects placed in unknown room "${roomName}" (not in ROOMS config).`,
            );
            continue;
        }

        for (const [tableNum, count] of occ.entries()) {
            if (tableNum < 1 || tableNum > cfg.numTables) {
                warnings.push(
                    `FAILURE: Existing placement in room "${roomName}" at table ${tableNum} is outside 1..${cfg.numTables}.`,
                );
            }

            if (count > cfg.projectsPerTable) {
                warnings.push(
                    `FAILURE: Room "${roomName}" table ${tableNum} has ${count} projects but config allows ${cfg.projectsPerTable}.`,
                );
            }
        }
    }

    const unassigned = projects.filter((p) => !p.room || p.tableNum == null);
    if (unassigned.length === 0) {
        return { placements, warnings };
    }

    // Group by mainTrack, preserving input order within groups so
    // repeated runs with the same input produce the same output.
    const byTrack = new Map<string, AssignableProject[]>();
    for (const p of unassigned) {
        if (!p.mainTrack) {
            warnings.push(`Project ${p.id} has no main_track!`);
        }

        const key = p.mainTrack ?? "";
        const group = byTrack.get(key);

        if (group) group.push(p);
        else byTrack.set(key, [p]);
    }

    const roomStates = initRoomStates(occupiedByRoom);
    const roomStateByName = new Map(roomStates.map((s) => [s.name, s]));

    // Place affinity-having tracks first so they get first priority on
    // their preferred room; non-affinity tracks fall through to
    // whatever capacity remains.
    const tracksWithAffinity: string[] = [];
    const tracksWithoutAffinity: string[] = [];
    for (const tag of byTrack.keys()) {
        if (TRACK_ROOM_AFFINITY[tag]) tracksWithAffinity.push(tag);
        else {
            warnings.push(`Track ${tag} has no affinity!`);
            tracksWithoutAffinity.push(tag);
        }
    }

    /**
     * Places every project in a track block into rooms, trying the
     * preferred room first then spilling in ROOMS order.
     *
     * @param tag - is the track's devpost tag (for warning messages).
     * @param group - is the list of projects in this track to place.
     * @param preferredRoomName - is the track's affinity room, or null
     *     if the track has no configured affinity.
     */
    const placeTrackBlock = (
        tag: string,
        group: AssignableProject[],
        preferredRoomName: string | null,
    ) => {
        let remaining = group;

        if (preferredRoomName) {
            const state = roomStateByName.get(preferredRoomName);
            if (state) {
                remaining = placeProjects(remaining, state, placements);
                if (remaining.length > 0) {
                    warnings.push(
                        `Track "${tag}": affinity room "${preferredRoomName}" full, spilling ${remaining.length} project(s).`,
                    );
                }
            }
        }

        // Spill into the other rooms.
        for (const state of roomStates) {
            if (remaining.length === 0) break;
            if (state.name === preferredRoomName) continue;

            remaining = placeProjects(remaining, state, placements);
        }

        if (remaining.length > 0) {
            warnings.push(
                `FAILURE: Track "${tag}": out of room capacity, ${remaining.length} project(s) left unassigned.`,
            );
        }
    };

    // Place projects into tables.
    for (const tag of tracksWithAffinity) {
        placeTrackBlock(tag, byTrack.get(tag)!, TRACK_ROOM_AFFINITY[tag]);
    }
    for (const tag of tracksWithoutAffinity) {
        placeTrackBlock(tag, byTrack.get(tag)!, null);
    }

    return { placements, warnings };
}

/**
 * Places as many projects from `group` into the given room as will fit,
 * appending placements in order and returning the leftover projects
 * (which preserve their original order for downstream contiguity).
 *
 * @param group - is the ordered list of projects to place.
 * @param state - is the mutable fill state of the target room.
 * @param placements - is the result array that new placements are
 *     appended to.
 */
function placeProjects(
    group: AssignableProject[],
    state: RoomState,
    placements: TablePlacement[],
): AssignableProject[] {
    const leftover: AssignableProject[] = [];
    for (const p of group) {
        const seat = takeSeat(state);
        if (!seat) {
            leftover.push(p);
            continue;
        }

        placements.push({
            projectId: p.id,
            room: state.name,
            tableNum: seat.tableNum,
        });
    }

    return leftover;
}
