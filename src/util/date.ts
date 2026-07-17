/**
 * Converts the given date to the string format required by
 * datetime-local.
 * @param date - is the Date to convert.
 */
export function dateToDatetimeLocal(date: Date): string {
    const pad = (value: number): string => {
        return value.toString().padStart(2, "0");
    };

    // Get local date/time components
    const year = date.getFullYear();
    // Month is 0-indexed, so add 1
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    // datetime-local format is "YYYY-MM-DDTHH:MM"
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

/**
 * Converts a string in the format given by datetime-local to a Date.
 * @param datetimeLocal - is the datetime-local string to convert.
 */
export function datetimeLocalToDate(datetimeLocal: string): Date {
    return new Date(datetimeLocal);
}

/**
 * Returns the number of days until the event.
 */
export function daysUntilEvent(): number {
    const dayInMs = 24 * 60 * 60 * 1000;

    // Midnight in Pacific Time
    const eventDate = new Date("2026-04-24T00:00-07:00");
    const now = new Date();

    // Ceil (and max) are used so that on 11:59pm 4/23, it says one day left, and one minute later,
    // it switches to 0 days left (and stays that way).
    const days = Math.max(
        0,
        Math.ceil((eventDate.getTime() - now.getTime()) / dayInMs),
    );

    return days;
}
