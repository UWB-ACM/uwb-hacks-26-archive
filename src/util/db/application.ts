import {
    ApplicationData,
    ClassStanding,
    Major,
    ReferralSource,
} from "@/src/util/dataTypes";
import sql from "@/src/util/database";

/**
 * Looks up an application by user ID, returning null if not found.
 * @param user - is the ID of the user to look up.
 */
export async function getApplication(
    user: number,
): Promise<ApplicationData | null> {
    const data =
        await sql`SELECT * FROM "Applications" WHERE user_id = ${user}`;
    if (data.length === 0) {
        return null;
    }

    const row = data[0];
    return {
        firstName: row.first_name,
        lastName: row.last_name,
        email: row.email,
        phone: row.phone ?? null,
        discordUsername: row.discord_username,
        school: row.school,
        attendingWeekOfHacking: row.attending_week_of_hacking,
        teamMembers: row.team_members ?? null,
        tshirtSize: row.t_shirt as ApplicationData["tshirtSize"],
        goals: row.goals,
        noCodePreference: row.no_code_preference,
        hackathonExperience: row.hackathon_experience,
        previousAttendee: row.previous_attendee,
        portfolioLink: row.portfolio_links ?? null,

        classStanding: row.class_standing as ClassStanding,
        major: row.major as Major,
        referralSource: row.referral_source as ReferralSource,
        resumeType: row.resume_type ?? null,

        age: row.age ?? null,
        countryOfResidence: row.country ?? null,
        linkedIn: row.linkedin ?? null,
        mlhCodeOfConduct: row.mlh_code_of_conduct ?? false,
        mlhDataSharing: row.mlh_data_sharing ?? false,
        mlhCommunications: row.mlh_communications ?? false,
    };
}

/**
 * Saves the application data for a user.
 *
 * If the user already has an application present in the DB, it will be completely overwritten
 * with the new data.
 *
 * @param user - The ID of the user whose application is being saved.
 * @param data - The application data to save. All fields will be persisted to the database.
 */
export async function saveApplication(
    user: number,
    data: ApplicationData,
): Promise<void> {
    await sql`INSERT INTO "Applications" (
            user_id, first_name, last_name, email, phone, discord_username, school,
            attending_week_of_hacking, team_members, t_shirt,
            goals, no_code_preference, hackathon_experience, previous_attendee,
            portfolio_links, class_standing, major, referral_source, resume_type,
            age, country, linkedin,
            mlh_code_of_conduct, mlh_data_sharing, mlh_communications
        ) VALUES (
            ${user}, ${data.firstName}, ${data.lastName}, ${data.email}, ${data.phone},
            ${data.discordUsername}, ${data.school}, ${data.attendingWeekOfHacking},
            ${data.teamMembers}, ${data.tshirtSize}, ${data.goals},
            ${data.noCodePreference}, ${data.hackathonExperience},
            ${data.previousAttendee}, ${data.portfolioLink},
            ${data.classStanding}, ${data.major}, ${data.referralSource},
            ${data.resumeType},
            ${data.age}, ${data.countryOfResidence}, ${data.linkedIn},
            ${data.mlhCodeOfConduct}, ${data.mlhDataSharing}, ${data.mlhCommunications}
        )
        ON CONFLICT (user_id) DO UPDATE SET
            first_name = ${data.firstName},
            last_name = ${data.lastName},
            email = ${data.email},
            phone = ${data.phone},
            discord_username = ${data.discordUsername},
            school = ${data.school},
            attending_week_of_hacking = ${data.attendingWeekOfHacking},
            team_members = ${data.teamMembers},
            t_shirt = ${data.tshirtSize},
            goals = ${data.goals},
            no_code_preference = ${data.noCodePreference},
            hackathon_experience = ${data.hackathonExperience},
            previous_attendee = ${data.previousAttendee},
            portfolio_links = ${data.portfolioLink},
            class_standing = ${data.classStanding},
            major = ${data.major},
            referral_source = ${data.referralSource},
            resume_type = ${data.resumeType},
            age = ${data.age},
            country = ${data.countryOfResidence},
            linkedin = ${data.linkedIn},
            mlh_code_of_conduct = ${data.mlhCodeOfConduct},
            mlh_data_sharing = ${data.mlhDataSharing},
            mlh_communications = ${data.mlhCommunications}
    `;
}
