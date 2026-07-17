/**
 * A single physical room in the judging layout.
 *
 * Tables in a room are numbered 1..numTables; each table can seat up
 * to `projectsPerTable` projects (they share the same (room, tableNum)
 * and are treated as zero walking distance apart).
 *
 * Tables in a room should be numbered such that consecutive numbers
 * are physically adjacent, i.e. walking along tables in numeric order
 * traverses the room in a straight-ish line.
 */
export interface RoomConfig {
    /**
     * The room label as stored in projects.room (e.g. "A", "N").
     */
    name: string;

    /**
     * The number of physical tables in the room.
     */
    numTables: number;

    /**
     * How many projects can share a single physical table.
     * Two means each table seats one project on either side.
     */
    projectsPerTable: number;
}

/**
 * The list of every physical room available to the hackathon.
 *
 * Rooms are considered for overflow in the order they appear here,
 * so put the "preferred overflow" rooms first.
 */
export const ROOMS = [
    { name: "ARC", numTables: 53, projectsPerTable: 1 },
    { name: "NCEC", numTables: 12, projectsPerTable: 2 },
] as const satisfies RoomConfig[];

/**
 * The mapping from a track's devpost_tag to the room it should
 * preferentially occupy.
 *
 * Tracks without an entry here are placed after affinity tracks using
 * the overflow rules (next room in ROOMS order with free seats).
 */
export const TRACK_ROOM_AFFINITY: Record<
    string,
    (typeof ROOMS)[number]["name"]
> = {
    "Cities & Societies (Code)": "ARC",
    "Human Experience (Code)": "ARC",
    "Avanade Business Solutions (No Code)": "NCEC",
};
