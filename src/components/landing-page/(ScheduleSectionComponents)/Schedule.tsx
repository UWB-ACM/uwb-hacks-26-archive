export interface Event {
    startTime: Date;
    endTime?: Date;
    name: string;
    location: string;
}

export interface DaySchedule {
    date: string;
    spirit: string;
    events: Event[];
}

export const schedule: Record<1 | 2 | 3, DaySchedule> = {
    1: {
        date: "4/24",
        spirit: "Twin Day",
        events: [
            {
                startTime: new Date(2026, 3, 24, 10, 0),
                endTime: new Date(2026, 3, 24, 11, 35),
                name: "Check-In",
                location: "ARC Overlook",
            },
            {
                startTime: new Date(2026, 3, 24, 10, 0),
                endTime: new Date(2026, 3, 24, 11, 0),
                name: "Snacks",
                location: "ARC Overlook",
            },
            {
                startTime: new Date(2026, 3, 24, 11, 0),
                endTime: new Date(2026, 3, 24, 12, 0),
                name: "Opening Ceremony",
                location: "ARC Overlook",
            },
            {
                startTime: new Date(2026, 3, 24, 13, 0),
                endTime: new Date(2026, 3, 24, 13, 30),
                name: "Intro to Google AI Studio",
                location: "UW2-005",
            },
            {
                startTime: new Date(2026, 3, 24, 12, 30),
                endTime: new Date(2026, 3, 24, 14, 0),
                name: "Brunch",
                location: "ARC Overlook",
            },
            {
                startTime: new Date(2026, 3, 24, 14, 0),
                endTime: new Date(2026, 3, 24, 15, 0),
                name: "Avanade Fireside Chat",
                location: "ARC Overlook",
            },
            {
                startTime: new Date(2026, 3, 24, 16, 0),
                endTime: new Date(2026, 3, 24, 16, 45),
                name: "Dinner",
                location: "ARC Overlook",
            },
            {
                startTime: new Date(2026, 3, 24, 16, 20),
                endTime: new Date(2026, 3, 24, 17, 20),
                name: "Prototype & Pitch Workshop",
                location: "ARC Overlook",
            },

            {
                startTime: new Date(2026, 3, 24, 17, 30),
                endTime: new Date(2026, 3, 24, 18, 15),
                name: "Hacking with GitHub Copilot",
                location: "UW2-005",
            },
        ],
    },
    2: {
        date: "4/25",
        spirit: "Husky Spirit Wear Day",
        events: [
            {
                startTime: new Date(2026, 3, 25, 9, 30),
                endTime: new Date(2026, 3, 25, 11, 30),
                name: "Check-In",
                location: "ARC Overlook",
            },
            {
                startTime: new Date(2026, 3, 25, 11, 30),
                endTime: new Date(2026, 3, 25, 18, 0),
                name: "In-Person Work Time",
                location: "ARC Overlook",
            },
            {
                startTime: new Date(2026, 3, 25, 12, 0),
                endTime: new Date(2026, 3, 25, 13, 30),
                name: "Networking Luncheon",
                location: "ARC Overlook",
            },
            {
                startTime: new Date(2026, 3, 25, 13, 30),
                endTime: new Date(2026, 3, 25, 14, 30),
                name: "WSECU Credit Talk",
                location: "NCEC",
            },
            {
                startTime: new Date(2026, 3, 25, 14, 0),
                endTime: new Date(2026, 3, 25, 15, 30),
                name: "Club + Special Guests Tabling",
                location: "ARC Overlook",
            },
            {
                startTime: new Date(2026, 3, 25, 14, 30),
                endTime: new Date(2026, 3, 25, 15, 30),
                name: "Grayhats CTF Drop In Event",
                location: "NCEC",
            },
            {
                startTime: new Date(2026, 3, 25, 15, 30),
                endTime: new Date(2026, 3, 25, 16, 15),
                name: "InclusiveAI Workshop",
                location: "NCEC",
            },
            {
                startTime: new Date(2026, 3, 25, 16, 45),
                endTime: new Date(2026, 3, 25, 18, 0),
                name: "Dinner",
                location: "ARC Overlook",
            },
            {
                startTime: new Date(2026, 3, 25, 16, 30),
                endTime: new Date(2026, 3, 25, 17, 45),
                name: "Hackeroon Stand",
                location: "ARC Overlook",
            },
            {
                startTime: new Date(2026, 3, 25, 17, 15),
                endTime: new Date(2026, 3, 25, 18, 0),
                name: "MLH Slideshow Karaoke",
                location: "NCEC",
            },
            {
                startTime: new Date(2026, 3, 25, 18, 30),
                endTime: new Date(2026, 3, 25, 20, 0),
                name: "Clean Up",
                location: "ARC Overlook & NCEC",
            },
            {
                startTime: new Date(2026, 3, 25, 23, 59),
                name: "Devpost Initial Project Submission Due",
                location: "ARC Overlook",
            },
        ],
    },
    3: {
        date: "4/26",
        spirit: "Professional Attire Day",
        events: [
            {
                startTime: new Date(2026, 3, 26, 9, 0),
                endTime: new Date(2026, 3, 26, 10, 0),
                name: "Check-In",
                location: "ARC Overlook",
            },
            {
                startTime: new Date(2026, 3, 26, 10, 0),
                name: "Hacking Concludes",
                location: "ARC Overlook",
            },
            {
                startTime: new Date(2026, 3, 26, 10, 50),
                endTime: new Date(2026, 3, 26, 12, 50),
                name: "Judging",
                location: "ARC Overlook",
            },
            {
                startTime: new Date(2026, 3, 26, 13, 0),
                endTime: new Date(2026, 3, 26, 14, 0),
                name: "Lunch",
                location: "ARC Overlook",
            },
            {
                startTime: new Date(2026, 3, 26, 13, 0),
                endTime: new Date(2026, 3, 26, 14, 0),
                name: "Hackeroon Stand Opens",
                location: "ARC Overlook",
            },
            {
                startTime: new Date(2026, 3, 26, 14, 0),
                endTime: new Date(2026, 3, 26, 14, 30),
                name: "Group Photo",
                location: "ARC Overlook",
            },
            {
                startTime: new Date(2026, 3, 26, 14, 45),
                endTime: new Date(2026, 3, 26, 16, 15),
                name: "Closing Ceremony + Winners",
                location: "ARC Overlook",
            },
            {
                startTime: new Date(2026, 3, 26, 16, 15),
                endTime: new Date(2026, 3, 26, 16, 45),
                name: "Last Chance Hackeroon Stand",
                location: "ARC Overlook",
            },
            {
                startTime: new Date(2026, 3, 26, 17, 0),
                endTime: new Date(2026, 3, 26, 18, 0),
                name: "Clean Up",
                location: "ARC Overlook & NCEC",
            },
        ],
    },
};
