import React, { useState } from "react";

const faqItems = [
    {
        question: "What is the format of UWB Hacks 2026?",
        answer: "The hackathon will take place from Friday, April 24, 2026 to Sunday, April 26, 2026. You'll work in teams to brainstorm ideas and build projects that align with this year's theme: The Future. You will have access to mentors, workshops, and networking opportunities to help bring your ideas to life.",
    },
    {
        question: "Who is eligible to participate?",
        answer: `UWB Hacks 2026 is open to university students of all skill levels and experience aged 18 and over, including recent graduates. We have provided options for "Code" and "No Code" projects and will also provide mentorship and learning opportunities.`,
    },
    {
        question: "Does it cost money to enter?",
        answer: "No! Participation is completely free.",
    },
    {
        question: "Will meals be provided?",
        answer: "Yes, meals will be provided on all three days. More details on food to come soon!",
    },
    {
        question:
            "Do I need a team to register, and how many people can be on a team?",
        answer: "Yes. If you don't have a team, we will provide opportunities to form teams before the hackathon begins. Each team must have 3 to 4 members—no exceptions. Teams that don't meet this requirement will be disqualified.",
    },
    {
        question:
            "How do you sign up as a team on Devpost once you have found a team?",
        answer: [
            "Create a Devpost account and register individually – This not only allows you to participate in UWB Hacks 2026, but also makes it easier to join future hackathons. Plus, it helps us plan ahead to ensure we have enough food, seating, and resources for everyone.",
            "Wait until hacking officially begins on April 24th, 2026 – Following the Opening Ceremony, you'll be able to start working on your project.",
            "Begin your project submission on Devpost – Once submissions open, you can list your teammates and save your project as a draft while you continue building.",
        ],
    },
    {
        question: "What else can I do at UWB Hacks 2026?",
        answer: "In addition to the hackathon, participants will have the opportunity to attend interactive workshops, networking sessions, and other engaging activities. These will include insightful talks from industry professionals and hands-on learning experiences designed to align with this year's The Future theme.",
    },
];

const PlusIcon = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="w-4 h-4"
    >
        <path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
    </svg>
);

const MinusIcon = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        fill="currentColor"
        className="w-4 h-4"
    >
        <path d="M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z" />
    </svg>
);

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };

    return (
        <div className="bg-[linear-gradient(180deg,#0d83db,#14c5f8)] px-6 md:px-20 py-16 text-white">
            <h1 className="font-h1 text-5xl md:text-7xl text-center mb-8">
                FAQ
            </h1>
            <div className="w-full max-w-4xl mx-auto">
                {faqItems.map((item, index) => {
                    const isOpen = openIndex === index;

                    return (
                        <div key={index} className="border-b border-white/40">
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="w-full flex justify-between items-center py-5 text-xl text-left"
                            >
                                <span className="text-left">
                                    {item.question}
                                </span>
                                <span className="ml-4 shrink-0 transition-transform duration-300">
                                    {isOpen ? MinusIcon : PlusIcon}
                                </span>
                            </button>

                            {/* https://stackoverflow.com/a/76944290 */}
                            <div
                                className={`grid transition-[grid-template-rows] duration-300 ease-in-out overflow-hidden ${
                                    isOpen
                                        ? "grid-rows-[1fr]"
                                        : "grid-rows-[0fr]"
                                }`}
                            >
                                <div className="overflow-hidden">
                                    <div className="pb-5 text-white/90 px-1 ml-4">
                                        {Array.isArray(item.answer) ? (
                                            <ol className="list-decimal list-inside space-y-2">
                                                {item.answer.map((line, i) => (
                                                    <li key={i}>{line}</li>
                                                ))}
                                            </ol>
                                        ) : (
                                            <p>{item.answer}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default FAQSection;
