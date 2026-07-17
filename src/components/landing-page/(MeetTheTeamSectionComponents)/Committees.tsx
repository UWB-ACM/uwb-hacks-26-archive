import { RefObject } from "react";

export interface CommitteeMember {
    name: string;
    image_path: string;
    roles: string[];
    link: string;
}

export const committeeMembers: CommitteeMember[] = [
    {
        name: "Jonah Uellenberg",
        image_path: "/MeetTheTeamPhotos/JonahUellenberg.png",
        roles: ["Executive", "Committee Lead (Digital Experience)"],
        link: "https://uellenberg.org/",
    },
    {
        name: "Sohan Dandu",
        image_path: "/MeetTheTeamPhotos/SohanDandu.jpeg",
        roles: [
            "Executive",
            "Committee Lead (Production Management)",
            "Committee Lead (Sponsorships)",
        ],
        link: "https://www.linkedin.com/in/sohandandu/",
    },
    {
        name: "Nainoo Gobindpuri",
        image_path: "/MeetTheTeamPhotos/NainooGobindpuri.jpg",
        roles: ["Executive", "Committee Lead (Sponsorships)"],
        link: "https://www.linkedin.com/in/khushnain-gobindpuri/",
    },
    {
        name: "Meeti Gobindpuri",
        image_path: "/MeetTheTeamPhotos/MeetiGobindpuri.jpg",
        roles: ["Executive", "Committee Lead (Marketing)"],
        link: "https://www.linkedin.com/in/khushmeetgobindpuri/",
    },
    {
        name: "Sarinna Thaiy",
        image_path: "/MeetTheTeamPhotos/SarinnaThaiy.jpeg",
        roles: ["Executive", "Committee Lead (Content and Design)"],
        link: "https://www.linkedin.com/in/sarinnathaiy/",
    },
    {
        name: "Nandini Mistry",
        image_path: "/MeetTheTeamPhotos/NandiniMistry.jpg",
        roles: [
            "Executive",
            "Committee Lead (Production Management)",
            "Content and Design",
        ],
        link: "https://www.linkedin.com/in/nandinimist/",
    },
    {
        name: "Preeti Gobindpuri",
        image_path: "/MeetTheTeamPhotos/PreetiGobindpuri.png",
        roles: ["Executive", "Committee Lead (Digital Experience)"],
        link: "https://www.linkedin.com/in/khushpreet-gobindpuri/",
    },
    {
        name: "Ruthie Lartey",
        image_path: "/MeetTheTeamPhotos/RuthieLartey.png",
        roles: ["Committee Lead (Content and Design)"],
        link: "https://www.linkedin.com/in/ruthie-lartey/",
    },
    {
        name: "Alan Talavera",
        image_path: "/MeetTheTeamPhotos/AlanTalavera.jpg",
        roles: ["Digital Experience"],
        link: "https://www.linkedin.com/in/alan-corvera/",
    },
    {
        name: "Kenneth Angeles",
        image_path: "/MeetTheTeamPhotos/KennethAngeles.jpg",
        roles: ["Digital Experience"],
        link: "https://www.linkedin.com/in/kenneth-angeles-05632a2a9/",
    },
    {
        name: "Phohanh Tran",
        image_path: "/MeetTheTeamPhotos/PhohanhTran.jpg",
        roles: ["Digital Experience"],
        link: "https://www.linkedin.com/in/phohanh-tran/",
    },
    {
        name: "Reagan George",
        image_path: "/MeetTheTeamPhotos/ReaganGeorge.jpg",
        roles: ["Digital Experience"],
        link: "https://www.linkedin.com/in/reagan-george/",
    },
    {
        name: "Melody Behdarvandian",
        image_path: "/MeetTheTeamPhotos/PrarinBehdarvandian.png",
        roles: ["Content and Design"],
        link: "https://www.linkedin.com/in/p-behdar/",
    },
    {
        name: "Mao Nishio",
        image_path: "/MeetTheTeamPhotos/MaoNishio.png",
        roles: ["Content and Design", "Marketing"],
        link: "https://www.linkedin.com/in/maonishio/",
    },
    {
        name: "Rasajna Kolusu",
        image_path: "/MeetTheTeamPhotos/RasajnaKolusu.jpg",
        roles: ["Content and Design", "Marketing"],
        link: "https://www.linkedin.com/in/sai-rasajna-kolusu/",
    },
    {
        name: "Davina Loekito",
        image_path: "/MeetTheTeamPhotos/DavinaLoekito.JPEG",
        roles: ["Marketing"],
        link: "https://www.linkedin.com/in/davina-loekito/",
    },
    {
        name: "Isabella Ta",
        image_path: "/MeetTheTeamPhotos/IsabellaTa.png",
        roles: ["Marketing"],
        link: "https://www.linkedin.com/in/isabella-ta-0a91a82aa/",
    },
    {
        name: "Ashley Tsang",
        image_path: "/MeetTheTeamPhotos/AshleyTsang.jpg",
        roles: ["Marketing", "Production Management"],
        link: "https://www.linkedin.com/in/ashleytsang29/",
    },
    {
        name: "Seyeon Park",
        image_path: "/MeetTheTeamPhotos/SeyeonPark.jpg",
        roles: ["Marketing", "Sponsorships"],
        link: "https://www.linkedin.com/in/parkseyeon/",
    },
    {
        name: "Prashamsa Bandarapu",
        image_path: "/MeetTheTeamPhotos/PrashamsaBandarapu.png",
        roles: ["Production Management"],
        link: "https://www.linkedin.com/in/prashamsa-bandarapu-b893b1243/",
    },
];

export interface MeetTheTeamCloudProps {
    committeeMemberIconsRef: RefObject<HTMLDivElement | null>;
    handleClick: (selectedIdx: number) => void;
    handleDeselect: () => void;
    selectedMemberIdx: number | null;
}
