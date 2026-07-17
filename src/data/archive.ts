/**
 * Static snapshot data for the archived (GitHub Pages) version of the site.
 *
 * The live site loaded this data from a database. Since the archive has no
 * backend, these are hardcoded, representative values captured for display
 * purposes. Replace them with the real end-of-event data if you have it.
 */

import {
    LeaderboardRecord,
    Prize,
    Transaction,
    TransactionType,
} from "@/src/util/dataTypes";

/**
 * A stand-in user for the (logged-out) static dashboard view.
 * Picture is intentionally empty so the dashboard falls back to the
 * bundled Husky image instead of loading a remote avatar.
 */
export interface DemoUser {
    id: number;
    name: string;
    picture: string;
}

export const demoUser: DemoUser = {
    id: 2026,
    name: "Demo Hacker",
    picture: "",
};

/** Sample hackeroon balance shown on the static dashboard. */
export const demoBalance = 350;

/**
 * Sample transaction history shown on the static dashboard.
 */
export const demoTransactions: Transaction[] = [
    {
        id: 1,
        user: demoUser.id,
        type: TransactionType.SaturdayProjectSubmission,
        amount: 200,
        authorized_by: null,
        event: null,
        prize: null,
        eventName: null,
        prizeName: null,
        time: new Date("2026-04-25T14:30:00-07:00"),
        reverted: false,
    },
    {
        id: 2,
        user: demoUser.id,
        type: TransactionType.SaturdayCheckinLanyard,
        amount: 50,
        authorized_by: null,
        event: null,
        prize: null,
        eventName: null,
        prizeName: null,
        time: new Date("2026-04-25T09:05:00-07:00"),
        reverted: false,
    },
    {
        id: 3,
        user: demoUser.id,
        type: TransactionType.MonthOfHackingActivityWinner,
        amount: 100,
        authorized_by: null,
        event: null,
        prize: null,
        eventName: null,
        prizeName: null,
        time: new Date("2026-04-10T18:00:00-07:00"),
        reverted: false,
    },
    {
        id: 4,
        user: demoUser.id,
        type: TransactionType.PrizePurchase,
        amount: -100,
        authorized_by: null,
        event: null,
        prize: null,
        eventName: null,
        prizeName: "LEGO Roses",
        time: new Date("2026-04-26T13:15:00-07:00"),
        reverted: false,
    },
];

/**
 * Snapshot of the public leaderboard (top earners).
 * Names are placeholders — swap in real values if available.
 */
export const snapshotLeaderboard: LeaderboardRecord[] = [
    { id: 1, name: "Vatsal Patel", picture: "", balance: 1400 },
    { id: 2, name: "Vatsalya Dabhi", picture: "", balance: 1300 },
    { id: 3, name: "Michael Gilbert", picture: "", balance: 1300 },
    { id: 4, name: "Nipun Saini", picture: "", balance: 1275 },
    { id: 5, name: "Matteo", picture: "", balance: 1225 },
];

/**
 * Snapshot of the Hackeroon Shop prizes. `imageName` values map to the
 * bundled images in `src/util/prizeImage.ts`.
 */
export const snapshotPrizes: Prize[] = [
    {
        id: 1,
        name: "Owala Water Bottle (Black)",
        description: "Stay hydrated in style.",
        initialStock: 10,
        sold: 4,
        price: 200,
        imageName: "owalaBlack",
    },
    {
        id: 2,
        name: "Owala Water Bottle (White)",
        description: "Stay hydrated in style.",
        initialStock: 10,
        sold: 6,
        price: 200,
        imageName: "owalaWhite",
    },
    {
        id: 3,
        name: "Anker Portable Charger",
        description: "Never run out of battery mid-hack.",
        initialStock: 8,
        sold: 5,
        price: 350,
        imageName: "ankerPortable",
    },
    {
        id: 4,
        name: "LEGO Cherry Blossoms",
        description: "A blooming build for your desk.",
        initialStock: 6,
        sold: 3,
        price: 300,
        imageName: "legoCherryBlossoms",
    },
    {
        id: 5,
        name: "LEGO Roses",
        description: "A build that never wilts.",
        initialStock: 6,
        sold: 6,
        price: 300,
        imageName: "legoRoses",
    },
    {
        id: 6,
        name: "LEGO Sunflowers",
        description: "Bring some sunshine to your workspace.",
        initialStock: 6,
        sold: 2,
        price: 300,
        imageName: "legoSunflowers",
    },
    {
        id: 7,
        name: "LEGO Lotus",
        description: "A serene botanical build.",
        initialStock: 6,
        sold: 4,
        price: 300,
        imageName: "legoLotus",
    },
    {
        id: 8,
        name: "LEGO Daisies",
        description: "A cheerful floral build.",
        initialStock: 6,
        sold: 1,
        price: 250,
        imageName: "legoDaisies",
    },
    {
        id: 9,
        name: "LEGO F1 Cars",
        description: "Speed onto your shelf.",
        initialStock: 6,
        sold: 5,
        price: 400,
        imageName: "legoF1Cars",
    },
    {
        id: 10,
        name: "Avanade Rucksack",
        description: "Carry your gear to the next hackathon.",
        initialStock: 12,
        sold: 7,
        price: 250,
        imageName: "avanadeRucksack",
    },
    {
        id: 11,
        name: "Avanade Fanny Pack",
        description: "Hands-free and hackathon-ready.",
        initialStock: 12,
        sold: 8,
        price: 150,
        imageName: "avanadeFannyPack",
    },
    {
        id: 12,
        name: "Avanade Mug Warmer",
        description: "Keep your coffee warm through the all-nighter.",
        initialStock: 10,
        sold: 6,
        price: 200,
        imageName: "avanadeMugWarmer",
    },
    {
        id: 13,
        name: "Avanade Picnic Blanket",
        description: "For a well-earned break outdoors.",
        initialStock: 10,
        sold: 3,
        price: 175,
        imageName: "avanadePicnicBlanket",
    },
    {
        id: 14,
        name: "Avanade Bluetooth Tracker",
        description: "Never lose your keys again.",
        initialStock: 10,
        sold: 9,
        price: 150,
        imageName: "avanadeBluetoothTracker",
    },
    {
        id: 15,
        name: "Avanade Block Tower",
        description: "A desk toy for creative breaks.",
        initialStock: 10,
        sold: 2,
        price: 125,
        imageName: "avanadeBlockTower",
    },
    {
        id: 16,
        name: "Car Keychains",
        description: "A little something for the road.",
        initialStock: 20,
        sold: 12,
        price: 75,
        imageName: "carKeychains",
    },
    {
        id: 17,
        name: "Cat Keychains",
        description: "Purr-fect for your keys.",
        initialStock: 20,
        sold: 15,
        price: 75,
        imageName: "catKeychains",
    },
];
