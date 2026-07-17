import PanelHeader from "../Panel/Header";
import PanelContent from "../Panel/Content";
import DetailSelector from "../../DetailSelector";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

import StillMe from "@/public/about/learnAboutWinnersPanel/StillMeThumbnail.png";
import FamilyLink from "@/public/about/learnAboutWinnersPanel/FamilyLink.png";
import EcoLoop from "@/public/about/learnAboutWinnersPanel/EcoLoop.png";
import INeedSomeHelp from "@/public/about/learnAboutWinnersPanel/INeedSomeHelp.png";
import KnowIt from "@/public/about/learnAboutWinnersPanel/KnowIt.png";
import RouteWatch from "@/public/about/learnAboutWinnersPanel/RouteWatch.png";
import { twMerge } from "tailwind-merge";

interface Project {
    id: string;
    title: string;
    description: string;
    image: StaticImageData;
    link: string;
}

function LinkButton({
    href,
    text,
    className,
}: {
    href: string;
    text: string;
    className?: string;
}) {
    return (
        <Link
            href={href}
            className={twMerge(
                "flex justify-center mx-2 my-1 px-6 py-3 rounded-full border-2 border-[var(--grass-color)] bg-white hover:bg-gray-100 sm:text-sm text-md font-bold text-[var(--grass-color)] text-center",
                className,
            )}
            target="_blank"
            rel="noopener noreferrer"
        >
            {text}
        </Link>
    );
}

const projects: Project[] = [
    {
        id: "stillme",
        title: "StillMe",
        description:
            "StillMe brings comfort and connection to people with dementia and their families, combining calendars, messages, memories, and reminders into one easy app.",
        image: StillMe,
        link: "https://devpost.com/software/remembrall-vlkwr8",
    },
    {
        id: "familylink",
        title: "FamilyLink",
        description:
            "Bridging families and care homes with connection, clarity, and care.",
        image: FamilyLink,
        link: "https://devpost.com/software/familylink",
    },
    {
        id: "routewatch",
        title: "RouteWatch",
        description:
            "Helps pedestrians choose safer walking routes using crime data.",
        image: RouteWatch,
        link: "https://devpost.com/software/routewatch",
    },
    {
        id: "knowit",
        title: "KnowIt",
        description:
            "Chrome add-on that scores article reliability and flags phishing emails.",
        image: KnowIt,
        link: "https://devpost.com/software/knowit-h670us",
    },
    {
        id: "ecoloop",
        title: "EcoLoop",
        description:
            "Connects industries to turn surplus into opportunity and reduce emissions.",
        image: EcoLoop,
        link: "https://devpost.com/software/ecoloop",
    },
    {
        id: "INSH",
        title: "I.N.S.H.",
        description:
            "A 2D cooperative puzzle game where two players work together to save the world.",
        image: INeedSomeHelp,
        link: "https://devpost.com/software/i-need-some-help",
    },
];

export default function PrevWinners() {
    const headerStyle =
        "flex font-bold font-glacial-indifference justify-center bg-transparent p-3";

    const contentStyle =
        "grid grid-cols-1 md:grid-cols-[1fr_30%] gap-5 items-center";

    const items = projects.map((project) => ({
        id: project.id,

        header: (
            <PanelHeader parentPanelId={project.id} className={headerStyle}>
                {project.title}
            </PanelHeader>
        ),

        content: (
            <PanelContent parentPanelId={project.id} className={contentStyle}>
                <div>
                    <h2 className="font-bold">{project.title}</h2>
                    <p>{project.description}</p>
                </div>

                <Image
                    src={project.image}
                    alt={`${project.title} project preview`}
                    className="w-full h-auto object-cover"
                    sizes="100vw"
                />
                <div className="flex flex-col md:flex-row col-span-1">
                    <LinkButton
                        href={project.link}
                        text={`View ${project.title}`}
                        className="w-full md:w-1/2"
                    />
                    <LinkButton
                        href="https://uwb-hacks-save-the-world.devpost.com/project-gallery"
                        text={`View All Projects!`}
                        className="w-full md:w-1/2"
                    />
                </div>
            </PanelContent>
        ),
    }));

    return <DetailSelector items={items} />;
}
