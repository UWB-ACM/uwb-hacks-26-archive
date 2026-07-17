/**
 * An identifier for the current revision of the legal terms.
 * Every time they are updated, this must be incremented.
 */
export const TERMS_LEVEL = 1;

/**
 * A user and balance in the database.
 */
export interface LeaderboardRecord {
    picture: string;
    /**
     * The user's ID, which is unique to it.
     */
    id: number;

    /**
     * The prize's name.
     */
    name: string;

    /**
     * The number of hackeroons in account.
     */
    balance: number;
}

/**
 * A user record in the database.
 */
export interface User {
    /**
     * The user's ID, which is unique to them.
     */
    id: number;

    /**
     * The user's google ID, used for OAuth2 with google.
     */
    googleId: string;

    /**
     * The user's name.
     */
    name: string;

    /**
     * The user's email, which is unique per-account.
     */
    email: string;

    /**
     * A URL to the user's picture, or a Gravatar URL
     * if it doesn't exist.
     */
    picture: string;

    /**
     * The user's balance.
     *
     * This needs to be retrieved separately from the user.
     */
    balance: number;

    /**
     * The terms level that the user has agreed to.
     * @see TERMS_LEVEL
     */
    terms: number;

    /**
     * Has the user agreed to be displayed
     * on the leaderboard?
     */
    leaderboardConsent: boolean;
}

/**
 * What privileges is the user able to access.
 *
 * In general, Staff is for things like adding
 * hackaroons, and Admin is for managing the
 * database.
 */
export enum PermissionLevel {
    /**
     * Something everyone can do.
     */
    User = 0,

    /**
     * Something like adding hackaroons.
     */
    Staff = 1,

    /**
     * Something like managing the database.
     */
    Admin = 2,

    /**
     * Something like updating scores on projects, access to judge portal, and the ability to judge teams
     */
    Judge = 3,
}

// Define which capabilities each role has
export const PermissionGrants: Record<PermissionLevel, PermissionLevel[]> = {
    [PermissionLevel.User]: [PermissionLevel.User],
    [PermissionLevel.Judge]: [PermissionLevel.Judge, PermissionLevel.User],
    [PermissionLevel.Staff]: [PermissionLevel.Staff, PermissionLevel.User],
    [PermissionLevel.Admin]: [
        PermissionLevel.Admin,
        PermissionLevel.Staff,
        PermissionLevel.User,
        PermissionLevel.Judge,
    ],
};

/**
 * Determines whether a user meets the permission requirements.
 * @param user - is the permissions of the user to check.
 * @param requires - is the required permission level.
 */
export function hasPermissions(
    user: PermissionLevel,
    requires: { has: PermissionLevel },
): boolean {
    const userCapabilities = PermissionGrants[user];
    return userCapabilities.includes(requires.has);
}

/**
 * An event record in the database.
 */
export interface Event {
    /**
     * The event's ID, which is unique to it.
     */
    id: number;

    /**
     * The event's name.
     */
    name: string;

    /**
     * The event's description.
     */
    description: string;

    /**
     * The data/time when the event will start (if it exists).
     */
    start: Date | null;

    /**
     * The data/time when the event will end (if it exists).
     */
    end: Date | null;

    /**
     * The physical or virtual location for an event (if it exists).
     */
    location: string | null;

    /**
     * The number of hackeroons that should be awarded
     * for attending this event.
     */
    attendanceAmount: number;
}

/**
 * A prize record in the database.
 */
export interface Prize {
    /**
     * The prize's ID, which is unique to it.
     */
    id: number;

    /**
     * The prize's name.
     */
    name: string;

    /**
     * The prize's description (if it exists).
     */
    description: string | null;

    /**
     * The initial stock of the prize.
     */
    initialStock: number;

    /**
     * The number of prizes that have been sold so far.
     */
    sold: number;

    /**
     * The prize's price.
     */
    price: number;

    /**
     * An identifier for the image that should be shown
     * for this prize.
     */
    imageName: string | null;
}

/**
 * Data stored in Redis that a check-in code maps to.
 */
export interface CheckInInfo {
    /**
     * Is the duration of the code in seconds.
     */
    duration: number;

    /**
     * Is the staff member who created by the code (if they exist).
     */
    authorized_by: number | null;

    /**
     * Is the ID of the event which the code corresponds to.
     */
    event: number;
}

/**
 * A transaction record in the database.
 */
export interface Transaction {
    /**
     * The event's ID, which is unique to it.
     */
    id: number;

    /**
     * The ID of the user who this transaction is about.
     */
    user: number;

    /**
     * The type of the transaction (i.e., its purpose).
     */
    type: TransactionType;

    /**
     * The amount added to the user's balance.
     * This field can be negative, in which case it
     * means how much is removed.
     */
    amount: number;

    /**
     * The ID of the user who authorized this transaction (if they exist).
     */
    authorized_by: number | null;

    /**
     * If this transaction was related to an event, this is the ID of that event.
     */
    event: number | null;

    /**
     * If this transaction was related to a prize, this is the ID of that prize.
     */
    prize: number | null;

    /**
     * If this transaction was related to an event, this is the name of that event.
     */
    eventName: string | null;

    /**
     * If this transaction was related to a prize, this is the name of that prize.
     */
    prizeName: string | null;

    /**
     * The time at which the transaction occurred.
     */
    time: Date;

    /**
     * Has the transaction been reverted?
     * If true, it no longer counts towards the
     * user's balance.
     */
    reverted: boolean;
}

/**
 * A transaction type.
 *
 * This is used to determine what the transaction
 * was for.
 */
export enum TransactionType {
    /**
     * A generic transaction.
     */
    Unknown = 0,

    /**
     * A reward associated with attending an event.
     */
    EventAttendance = 1,

    /**
     * A payment to purchase a prize.
     */
    PrizePurchase = 2,

    /**
     * Someone did well in an event, asked a good question,
     * or helped out.
     */
    Performance = 3,

    /**
     * Someone won an event activity.
     */
    MonthOfHackingActivityWinner = 4,

    /** Friday Transactions! */
    FridayCostumeTwin = 5,

    // FridayFireSideChat = 8,

    FridayHollyTheHusky = 9,

    /** Saturday Transactions! */
    SaturdayCheckinLanyard = 18,

    SaturdayCostumeHusky = 6,

    SaturdayTalkWithDanTerry = 11,

    SaturdayTalkWithArmoraRama = 21,

    SaturdayPhotoWithHolly = 13,

    SaturdayTalkToKody = 14,

    SaturdaySandbox = 17,

    SaturdayBadmintonSocial = 15,

    SaturdayProjectSubmission = 25,

    /** Sunday Transactions! */
    SundayCostumeProfessional = 7,

    SundayDemoDay = 16,

    SundayCheckinLanyard = 19,

    SundayAdmissionsBoothPhoto = 20,

    StudentInterview = 22,

    KeyboardCompetition = 23,

    /**
     * Easter egg: pressing the two left clouds simultaneously (1010 pattern).
     * 1010 in binary = 10 in decimal = 10th annual hackathon!
     */
    EasterEgg1010 = 24,

    SlideshowKaraokePresenter = 26,
}

/**
 * A map of transaction types to their hackeroon amounts.
 * This only includes transaction types which have a constant value.
 * MUST BE NON-NEGATIVE.
 */
export const valuedTransactionAmounts = {
    [TransactionType.Performance]: 25,
    [TransactionType.MonthOfHackingActivityWinner]: 100,
    [TransactionType.StudentInterview]: 50,
    [TransactionType.KeyboardCompetition]: 100,
    [TransactionType.SlideshowKaraokePresenter]: 100,

    [TransactionType.FridayCostumeTwin]: 25,
    // [TransactionType.FridayFireSideChat]: 100,
    [TransactionType.FridayHollyTheHusky]: 50,

    [TransactionType.SaturdayCheckinLanyard]: 50,
    [TransactionType.SaturdayCostumeHusky]: 25,
    [TransactionType.SaturdayTalkWithDanTerry]: 100,
    [TransactionType.SaturdayTalkWithArmoraRama]: 100,
    [TransactionType.SaturdayPhotoWithHolly]: 50,
    [TransactionType.SaturdayTalkToKody]: 50,
    [TransactionType.SaturdaySandbox]: 50,
    [TransactionType.SaturdayBadmintonSocial]: 100,
    [TransactionType.SaturdayProjectSubmission]: 200,

    [TransactionType.SundayCheckinLanyard]: 50,
    [TransactionType.SundayCostumeProfessional]: 25,
    [TransactionType.SundayDemoDay]: 100,
    [TransactionType.SundayAdmissionsBoothPhoto]: 50,

    [TransactionType.EasterEgg1010]: 50,
} as const;

/**
 * A map of valued transaction types to the
 * maximum number of them a user may achieve.
 * Use Infinity to allow no limit.
 * MUST BE NON-NEGATIVE.
 */
export const valuedTransactionLimits: Record<
    keyof typeof valuedTransactionAmounts,
    number
> = {
    [TransactionType.Performance]: Infinity,
    [TransactionType.MonthOfHackingActivityWinner]: 3,
    [TransactionType.StudentInterview]: 1,
    [TransactionType.KeyboardCompetition]: 1,
    [TransactionType.SlideshowKaraokePresenter]: 1,

    [TransactionType.FridayCostumeTwin]: 1,
    // [TransactionType.FridayFireSideChat]: 1,
    [TransactionType.FridayHollyTheHusky]: 1,

    [TransactionType.SaturdayCheckinLanyard]: 1,
    [TransactionType.SaturdayCostumeHusky]: 1,
    [TransactionType.SaturdayTalkWithDanTerry]: 1,
    [TransactionType.SaturdayTalkWithArmoraRama]: 1,
    [TransactionType.SaturdayPhotoWithHolly]: 1,
    [TransactionType.SaturdayTalkToKody]: 1,
    [TransactionType.SaturdaySandbox]: 1,
    [TransactionType.SaturdayBadmintonSocial]: 1,
    [TransactionType.SaturdayProjectSubmission]: 1,

    [TransactionType.SundayCheckinLanyard]: 1,
    [TransactionType.SundayCostumeProfessional]: 1,
    [TransactionType.SundayDemoDay]: 1,
    [TransactionType.SundayAdmissionsBoothPhoto]: 1,

    [TransactionType.EasterEgg1010]: 1,
};

export const reasonTypeMap = {
    unknown: TransactionType.Unknown,
    performance: TransactionType.Performance,
    "activity-winner": TransactionType.MonthOfHackingActivityWinner,
    "student-interview": TransactionType.StudentInterview,
    "keyboard-comp": TransactionType.KeyboardCompetition,
    "slideshow-karaoke-presenter": TransactionType.SlideshowKaraokePresenter,

    "friday-costume-twin": TransactionType.FridayCostumeTwin,
    // "friday-fire-side-chat": TransactionType.FridayFireSideChat,
    "friday-holly-the-husky": TransactionType.FridayHollyTheHusky,

    "saturday-checkin-lanyard": TransactionType.SaturdayCheckinLanyard,
    "saturday-costume-husky": TransactionType.SaturdayCostumeHusky,
    "saturday-talk-dan-terry": TransactionType.SaturdayTalkWithDanTerry,
    "saturday-talk-armora-rama": TransactionType.SaturdayTalkWithArmoraRama,
    "saturday-holly-photo": TransactionType.SaturdayPhotoWithHolly,
    "saturday-sandbox": TransactionType.SaturdaySandbox,
    "saturday-talk-kody": TransactionType.SaturdayTalkToKody,
    "saturday-badminton": TransactionType.SaturdayBadmintonSocial,
    "saturday-project-submission": TransactionType.SaturdayProjectSubmission,

    "sunday-checkin-lanyard": TransactionType.SundayCheckinLanyard,
    "sunday-costume-professional": TransactionType.SundayCostumeProfessional,
    "sunday-demo-day": TransactionType.SundayDemoDay,
    "sunday-admissions-photo": TransactionType.SundayAdmissionsBoothPhoto,

    "easter-egg-1010": TransactionType.EasterEgg1010,
} as const;

export const reasonNameMap: Record<keyof typeof reasonTypeMap, string> = {
    unknown: "Unknown",
    performance: "Performance",
    "activity-winner": "Activity Winner",
    "student-interview": "Student Interview",
    "keyboard-comp": "Keyboard Competition",
    "slideshow-karaoke-presenter": "Slideshow Karaoke Presenter",

    "friday-costume-twin": "Twin Costume (Friday)",
    // "friday-fire-side-chat": "Fire Side Chat (Friday)",
    "friday-holly-the-husky": "Picture with Holly (Friday)",

    "saturday-checkin-lanyard": "Check-in with Lanyard (Saturday)",
    "saturday-costume-husky": "Husky Spirit Costume (Saturday)",
    "saturday-talk-dan-terry": "Talk with Dan Terry (Saturday)",
    "saturday-talk-armora-rama": "Talk with Armora Rama (Saturday)",
    "saturday-holly-photo": "Picture with Holly (Saturday)",
    "saturday-talk-kody": "Talk with Kody (Saturday)",
    "saturday-sandbox": "Sandbox VR Demo (Saturday)",
    "saturday-badminton": "Badminton Social (Saturday)",
    "saturday-project-submission": "Project Submission (Saturday)",

    "sunday-checkin-lanyard": "Check-in with Lanyard (Sunday)",
    "sunday-costume-professional": "Professional Costume (Sunday)",
    "sunday-demo-day": "Demo Day (Sunday)",
    "sunday-admissions-photo": "Admissions Booth Photo (Sunday)",

    "easter-egg-1010": "Easter Egg: 1010",
};

export const typeNameMap: Record<TransactionType, string> = {
    [TransactionType.Unknown]: "Unknown",
    [TransactionType.EventAttendance]: "Event Attendance",
    [TransactionType.PrizePurchase]: "Prize Purchase",
    [TransactionType.Performance]: "Performance",
    [TransactionType.MonthOfHackingActivityWinner]: "Activity Winner",
    [TransactionType.StudentInterview]: "Student Interview",
    [TransactionType.KeyboardCompetition]: "Keyboard Competition",
    [TransactionType.SlideshowKaraokePresenter]: "Slideshow Karaoke Presenter",

    [TransactionType.FridayCostumeTwin]: "Twin Costume (Friday)",
    // [TransactionType.FridayFireSideChat]: "Fire Side Chat (Friday)",
    [TransactionType.FridayHollyTheHusky]: "Picture with Holly (Friday)",

    [TransactionType.SaturdayCheckinLanyard]:
        "Check-in with Lanyard (Saturday)",
    [TransactionType.SaturdayCostumeHusky]: "Husky Spirit Costume (Saturday)",
    [TransactionType.SaturdayTalkWithDanTerry]:
        "Talk with Dan Terry (Saturday)",
    [TransactionType.SaturdayTalkWithArmoraRama]:
        "Talk with Armora Rama (Saturday)",
    [TransactionType.SaturdayPhotoWithHolly]: "Picture with Holly (Saturday)",
    [TransactionType.SaturdayTalkToKody]: "Talk with Kody (Saturday)",
    [TransactionType.SaturdaySandbox]: "Sandbox VR Demo (Saturday)",
    [TransactionType.SaturdayBadmintonSocial]: "Badminton Social (Saturday)",
    [TransactionType.SaturdayProjectSubmission]:
        "Project Submission (Saturday)",

    [TransactionType.SundayCheckinLanyard]: "Check-in with Lanyard (Sunday)",
    [TransactionType.SundayCostumeProfessional]:
        "Professional Costume (Sunday)",
    [TransactionType.SundayDemoDay]: "Demo Day (Sunday)",
    [TransactionType.SundayAdmissionsBoothPhoto]:
        "Admissions Booth Photo (Sunday)",

    [TransactionType.EasterEgg1010]: "Easter Egg: 1010",
};

/**
 * A track record in the database.
 */
export interface Track {
    /**
     * The track's ID, which is unique to it.
     */
    id: number;

    /**
     * The display name of the track.
     */
    trackName: string;

    /**
     * The Devpost tag associated with this track, as it shows
     * up in the CSV export.
     */
    devpostTag: string;

    /**
     * Whether this is a main track (as opposed to a side track).
     */
    mainTrack: boolean;

    /**
     * IDs of judging questions associated with this track.
     */
    questions: number[];
}

/**
 * A single row in a judging question's score rubric.
 */
export interface ScoreFormatRow {
    /**
     * The minimum score (inclusive) this row applies to.
     */
    min: number;

    /**
     * The maximum score (inclusive) this row applies to.
     */
    max: number;

    /**
     * The descriptive label for this score range.
     */
    label: string;
}

/**
 * A scoring rubric for a judging question, rendered as a table
 * below the score input.
 */
export interface ScoreFormat {
    /**
     * The rubric rows, in display order.
     */
    rows: ScoreFormatRow[];
}

/**
 * A judging question record in the database.
 */
export interface JudgingQuestion {
    /**
     * The question's ID, which is unique to it.
     */
    id: number;

    /**
     * The question body displayed to the judge.
     */
    questionText: string;

    /**
     * An optional subtitle/clarification rendered under the question
     * and above the rubric table.
     */
    description: string | null;

    /**
     * The scoring rubric to display below the input (if it exists).
     */
    scoreFormat: ScoreFormat | null;
}

/**
 * A judge assignment linking a judge to a project.
 */
export interface JudgeAssignment {
    /**
     * The user ID of the judge.
     */
    judgeId: number;

    /**
     * The ID of the assigned project.
     */
    projectId: number;

    /**
     * When the judge completed judging this project (if they have).
     */
    completedAt: Date | null;
}

/**
 * A judging score for a specific question on a project by a judge.
 */
export interface JudgingScore {
    /**
     * The ID of the judge who submitted the score.
     */
    judgeId: number;

    /**
     * The ID of the project being scored.
     */
    projectId: number;

    /**
     * The ID of the judging question being answered.
     */
    questionId: number;

    /**
     * The numeric score given (0 to 10, inclusive).
     */
    score: number;

    /**
     * When the score was submitted.
     */
    submittedAt: Date;
}

/**
 * A project record in the database.
 */
export interface Project {
    /**
     * The project's ID, which is unique to it.
     */
    id: number;

    /**
     * The Devpost submission ID (numeric, as it appears in the submission URL).
     */
    devpostId: string;

    /**
     * The title of the project, pulled from Devpost.
     */
    projectTitle: string;

    /**
     * The Devpost submission URL (if it exists).
     */
    submissionUrl: string | null;

    /**
     * Whether the project has been submitted.
     */
    submitted: boolean;

    /**
     * URL of the project's Devpost image (if it exists).
     */
    devpostImage: string | null;

    /**
     * URL where the project can be demonstrated (if it exists).
     */
    tryUrl: string | null;

    /**
     * URL of the project's demo video (if it exists).
     */
    videoUrl: string | null;

    /**
     * The Devpost tag of the project's main track.
     */
    mainTrack: string;

    /**
     * Devpost tags of any side tracks the project is entered in.
     */
    sideTracks: string[];

    /**
     * Email addresses of the team members.
     * Note: this is the email on Devpost, not necessarily the
     * email in our account system.
     */
    userEmails: string[];

    /**
     * Room the project has been placed in (if assigned).
     */
    room: string | null;

    /**
     * Table number within the room (if assigned). Multiple projects
     * may share the same (room, tableNum) when projectsPerTable > 1.
     */
    tableNum: number | null;
}

/**
 * A registrant record from the Devpost CSV export.
 */
export interface DevpostUser {
    /**
     * The record's ID, which is unique to it (does NOT correspond to the users table).
     */
    id: number;

    /**
     * The registrant's first name (if it exists).
     */
    firstName: string | null;

    /**
     * The registrant's last name (if it exists).
     */
    lastName: string | null;

    /**
     * The registrant's email address (unique).
     */
    email: string;

    /**
     * The URL of the registrant's submitted project (if they have one).
     */
    projectUrl: string | null;
}

/**
 * Represents the student's class standing.
 * These values correspond to the IDs in the `Class Standing` database table.
 */
export enum ClassStanding {
    Freshman = 1,
    Sophomore = 2,
    Junior = 3,
    Senior = 4,
    Masters = 5,
    RunningStart = 6,
}

/**
 * Represents the student's area of study.
 * These values correspond to the IDs in the `Majors` database table.
 */
export enum Major {
    ComputerScience = 1,
    AppliedComputing = 2,
    ComputerEngineering = 3,
    DataScienceVis = 4,
    Business = 5,
    OtherSTEM = 6,
    OtherNonSTEM = 7,
}

/**
 * Represents how the user heard about the hackathon.
 * These values correspond to the IDs in the `Referral Source` database table.
 */
export enum ReferralSource {
    Discord = 1,
    Email = 2,
    WordOfMouth = 3,
    PhysicalPoster = 4,
    ACM = 5,
    OtherClub = 6,
    Other = 7,
}

/**
 * Data about a user's application, excluding the user ID.
 * I.e., this is all the data a user entered themselves on the form.
 */
export interface ApplicationData {
    /**
     * The applicant's first name.
     */
    firstName: string;

    /**
     * The applicant's last name.
     */
    lastName: string;

    /**
     * The applicant's contact email.
     */
    email: string;

    /**
     * The applicant's phone number (if provided).
     */
    phone: string | null;

    /**
     * The applicant's Discord username for communication during the event.
     */
    discordUsername: string;

    /**
     * The name of the school the applicant attends.
     */
    school: string;

    /**
     * Whether the applicant plans to attend the "Week of Hacking" events
     * leading up to the main hackathon.
     */
    attendingWeekOfHacking: boolean;

    /**
     * A list of team members the applicant plans to work with,
     * or null if they are looking for a team.
     */
    teamMembers: string | null;

    /**
     * The applicant's shirt size.
     */
    tshirtSize: "XS" | "SM" | "MD" | "LG" | "XL" | "2XL" | "3XL";

    /**
     * The applicant's personal goals for attending the hackathon.
     */
    goals: string;

    /**
     * The applicant's interest in a no-code option
     */
    noCodePreference: "CODE" | "NO CODE" | "NO PREFERENCE";

    /**
     * A description of the applicant's previous hackathon experience.
     */
    hackathonExperience: string;

    /**
     * Has the applicant attended UWB Hacks before?
     */
    previousAttendee: boolean;

    /**
     * A link to the applicant's portfolio or GitHub (if provided).
     */
    portfolioLink: string | null;

    /**
     * The ID of the applicant's class standing.
     * @see ClassStanding
     */
    classStanding: ClassStanding;

    /**
     * The ID of the applicant's major.
     * @see Major
     */
    major: Major;

    /**
     * The ID of the source from which the applicant heard about the event.
     * @see ReferralSource
     */
    referralSource: ReferralSource;

    /**
     * The file extension of the applicant's uploaded resume,
     * or null if no resume was uploaded.
     */
    resumeType: string | null;

    /**
     * The applicant's age.
     */
    age: number | null;

    /**
     * The applicant's country of residence.
     */
    countryOfResidence: string | null;

    /**
     * A link to the applicant's LinkedIn profile (if provided).
     */
    linkedIn: string | null;

    /**
     * Has the applicant agreed to the MLH Code of Conduct?
     */
    mlhCodeOfConduct: boolean;

    /**
     * Has the applicant authorized sharing their data with MLH?
     */
    mlhDataSharing: boolean;

    /**
     * Has the applicant opted in to MLH communications?
     */
    mlhCommunications: boolean;
}
