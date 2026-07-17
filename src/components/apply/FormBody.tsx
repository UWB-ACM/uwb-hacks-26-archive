import { useState, useRef, useEffect } from "react";
import Bubble from "./Bubble";
import QuestionBubble from "./QuestionBubble";
import {
    ApplicationData,
    Major,
    ClassStanding,
    ReferralSource,
} from "@/src/util/dataTypes";
import { FieldErrors, useForm } from "react-hook-form";
import { INPUT_TYPES } from "@/src/components/apply/UserInput";
import { IoPaperPlaneSharp } from "react-icons/io5";
import HallE from "@/public/HALL-E.png";
import Image from "next/image";

const DESCRIPTION1 =
    "Welcome to UWB Hacks 2026!\n Please fill out this form to register to participate in the hackathon.";
const DESCRIPTION2 =
    "UWB Hacks is taking place on Friday, April 24th to Sunday, April 26th. Please ensure you are able to attend before registering.";
const DESCRIPTION3 =
    "Note: You must be a current university student (or recent graduate) and at least 18 years old to register.";

/**
 * The details for each question.
 * This doesn't define order, which is specified in `QUESTION_ORDER` below.
 * All items are required unless otherwise specified.
 *
 * The key here specifies the key in `ApplicationData` where the answer should
 * be stored, and also uniquely identifies the question. Type corresponds to the
 * type name in `QuestionTypeMap`, which maps to the same type specified in `ApplicationData`.
 */
const QUESTIONS = {
    firstName: { text: "What is your first name?", type: "TEXT" },
    lastName: { text: "What is your last name?", type: "TEXT" },
    email: { text: "What is your school email address?", type: "TEXT" },
    age: { text: "How old are you? (Must be 18+)", type: "AGE_SELECT" },
    countryOfResidence: {
        text: "What country do you reside in?",
        type: "COUNTRY_SELECT",
    },
    major: { text: "What is your major?", type: "MAJOR" },
    school: {
        text: "What school/university do you attend?",
        type: "SCHOOL_SELECT",
    },
    classStanding: {
        text: "What is your class standing?",
        type: "CLASS_STANDING",
    },
    referralSource: {
        text: "How did you hear about UWB Hacks 2026?",
        type: "REFERRAL_SOURCE",
    },
    attendingWeekOfHacking: {
        text: "Do you intend to participate in the week of hacking? Week of hacking is a series of workshops to help you prepare for the hackathon.",
        type: "BOOLEAN",
    },
    teamMembers: {
        text: "Please list your team members, or leave blank if you're looking for a team or currently undecided. Note: teams must be 3 to 4 people, no exceptions!",
        type: "TEXT_MULTILINE",
        required: false,
    },
    phone: {
        text: "We will send participants notifications to coordinate the event. What is your phone number?",
        type: "TEXT",
    },
    discordUsername: {
        text: "What is your Discord username?",
        type: "TEXT",
    },
    goals: {
        text: "What are you hoping to get out of UWB Hacks?",
        type: "TEXT_MULTILINE",
    },
    noCodePreference: {
        text: "Do you plan to make a code or no-code project?",
        type: "NO_CODE_PREFERENCE",
    },
    previousAttendee: {
        text: "Have you attended UWB Hacks before?",
        type: "BOOLEAN",
    },
    hackathonExperience: {
        text: "If you've previously attended UWB Hacks, how would you describe your hackathon experience? What would you change?",
        type: "TEXT_MULTILINE",
        required: false,
    },
    tshirtSize: {
        text: "What is your t-shirt size (unisex)?",
        type: "T_SHIRT",
    },
    portfolioLink: {
        text: "Please provide a link to your GitHub/portfolio (optional).",
        type: "TEXT",
        required: false,
    },
    linkedIn: {
        text: "Please provide a link to your LinkedIn profile (optional). This will be shared with our sponsors and partners for recruiting and networking purposes.",
        type: "TEXT",
        required: false,
    },
    resumeType: {
        text: "Upload your resume (optional). This will be shared with our sponsors and partners for recruiting and networking purposes.",
        type: "RESUME_TYPE",
        required: false,
    },
    mlhCodeOfConduct: {
        text: "UWB Hacks is an MLH member event, and we require all participants to adhere to MLH's policies and code of conduct.",
        type: "MLH_CODE_OF_CONDUCT",
    },
    mlhDataSharing: {
        text: null,
        type: "MLH_DATA_SHARING",
    },
    mlhCommunications: {
        text: null,
        type: "MLH_COMMUNICATIONS",
        required: false,
    },
} as const satisfies Record<
    keyof ApplicationData,
    { text: string | null; type: keyof QuestionTypeMap; required?: boolean }
>;

/**
 * The order in which questions from QUESTIONS will be displayed.
 */
const QUESTION_ORDER: (keyof ApplicationData)[] = [
    "firstName",
    "lastName",
    "email",
    "age",
    "countryOfResidence",
    "major",
    "school",
    "classStanding",
    "referralSource",
    "attendingWeekOfHacking",
    "teamMembers",
    "phone",
    "discordUsername",
    "noCodePreference",
    "previousAttendee",
    "hackathonExperience",
    "tshirtSize",
    "goals",
    "portfolioLink",
    "linkedIn",
    "resumeType",
    "mlhCodeOfConduct",
    "mlhDataSharing",
    "mlhCommunications",
];

/**
 * Converts between type names in runtime and their corresponding
 * TypeScript types.
 */
export type QuestionTypeMap = {
    TEXT: string;
    TEXT_MULTILINE: string;
    BOOLEAN: boolean;
    MAJOR: Major;
    CLASS_STANDING: ClassStanding;
    REFERRAL_SOURCE: ReferralSource;
    T_SHIRT: ApplicationData["tshirtSize"];
    NO_CODE_PREFERENCE: ApplicationData["noCodePreference"];
    RESUME_TYPE: string | null;
    SCHOOL_SELECT: string;
    COUNTRY_SELECT: string | null;
    AGE_SELECT: number | null;
    MLH_CODE_OF_CONDUCT: boolean;
    MLH_DATA_SHARING: boolean;
    MLH_COMMUNICATIONS: boolean;
};

export default function FormBody({
    initialApp,
    onSubmit,
}: {
    initialApp: ApplicationData | null;
    onSubmit: (
        data: ApplicationData,
        resumeFile: File | null,
        deleteResume: boolean,
    ) => void;
}) {
    // Used for displaying the next unanswered question
    // If they already have an application, no need to require clicking
    // through all the buttons again.
    const [currentIndex, setCurrentIndex] = useState(
        initialApp == null ? 0 : QUESTION_ORDER.length,
    );
    const isFinished = currentIndex >= QUESTION_ORDER.length;

    // Holds the selected resume file until form submission
    const resumeFileRef = useRef<File | null>(null);
    // Whether the user explicitly cleared their resume
    const deleteResumeRef = useRef(false);

    // Used for dynamic scrolling
    const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

    const formRef = useRef<HTMLFormElement>(null);
    const {
        register,
        control,
        trigger,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm<ApplicationData>({ mode: "onBlur" });

    const scrollToError = (errors: FieldErrors<ApplicationData>) => {
        const first = QUESTION_ORDER.flatMap((q, i) =>
            q in errors ? [i] : [],
        )[0];
        if (!first) return;

        const el = questionRefs.current[first];
        if (!el) return;

        if (el instanceof HTMLElement) {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.focus();
        }
    };

    // Auto-scroll form
    useEffect(() => {
        // Skip for index 0, since it hides the top content,
        // and also skip for editing, since the user probably
        // wants to start from the top anyway.
        if (currentIndex === 0 || initialApp != null) return;

        const el = questionRefs.current[currentIndex];
        el?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });

        // This is a bit of a hack.
        // The animation gets messed up if we focus immediately, so
        // wait a bit longer (10ms) and then focus.
        const timer = setTimeout(() => {
            // react-hook-form focus doesn't always work (for controllers),
            // so grabbing the element directly is more reliable.
            const focusable = el?.querySelector<HTMLElement>(
                "input, select, textarea",
            );
            focusable?.focus();
        }, 310);
        return () => clearTimeout(timer);
    }, [currentIndex, initialApp]);

    return (
        <div className="relative flex flex-col w-full min-h-screen max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12 pb-[35vh] md:pb-[40vh]">
            <div className="flex-grow w-full max-w-5xl mx-auto px-4 py-8 md:px-6 md:py-12">
                {/* Description always displays */}
                <Bubble side="left">{DESCRIPTION1}</Bubble>
                <Bubble side="left">{DESCRIPTION2}</Bubble>
                <Bubble side="left">{DESCRIPTION3}</Bubble>

                {/* Display each question */}
                <form
                    onSubmit={
                        // ESLint is confused here, since both onSubmit
                        // and onError are only called on user input, not during
                        // render (which the lint is worried about).
                        handleSubmit(
                            // eslint-disable-next-line react-hooks/refs
                            (data) =>
                                onSubmit(
                                    data,
                                    resumeFileRef.current,
                                    deleteResumeRef.current,
                                ),
                            // eslint-disable-next-line react-hooks/refs
                            scrollToError,
                        )
                    }
                    ref={formRef}
                >
                    {QUESTION_ORDER.map((q, i) => {
                        const QuestionComponent =
                            INPUT_TYPES[QUESTIONS[q].type];

                        return (
                            // Dummy div used for autoscroll
                            <div
                                key={q}
                                ref={(el) => {
                                    questionRefs.current[i] = el;
                                }}
                            >
                                <QuestionBubble
                                    question={QUESTIONS[q].text}
                                    hidden={i > currentIndex}
                                    husky={i === currentIndex}
                                >
                                    <div className="flex flex-row items-center">
                                        <div className="flex flex-col flex-1 p-2 min-w-0">
                                            <QuestionComponent
                                                name={q}
                                                register={register}
                                                control={control}
                                                setError={setError}
                                                clearErrors={clearErrors}
                                                defaultValue={initialApp?.[q]}
                                                required={
                                                    "required" in QUESTIONS[q]
                                                        ? (QUESTIONS[q]
                                                              .required as boolean)
                                                        : true
                                                }
                                                onFileSelect={(file) => {
                                                    resumeFileRef.current =
                                                        file;
                                                }}
                                                onDeleteResume={(deleted) => {
                                                    deleteResumeRef.current =
                                                        deleted;
                                                }}
                                            />

                                            {errors[q] && (
                                                <p className="text-red-500 text-sm ml-3">
                                                    {errors[q]?.message ||
                                                        "Answer required"}
                                                </p>
                                            )}
                                        </div>

                                        {currentIndex === i && (
                                            <button
                                                aria-label="Next"
                                                className="p-[5px] ml-[10px] rounded-full overflow-hidden bg-[#84c6ff]"
                                                onClick={async (e) => {
                                                    // Something (either react-hook-form or the browser) is
                                                    // moving focus to the next input field when this button is clicked.
                                                    // This breaks the animation, so disable it.
                                                    e.preventDefault();

                                                    // Validate all currently shown fields so we can
                                                    // stop the user immediately if there's an error.
                                                    const formValid =
                                                        await trigger(
                                                            QUESTION_ORDER.slice(
                                                                0,
                                                                currentIndex +
                                                                    1,
                                                            ),
                                                        );
                                                    if (!formValid) {
                                                        // This isn't exactly right, since errors still points
                                                        // to the old list of errors. But the only item that should
                                                        // be missing is the last form input, so scrolling isn't a
                                                        // big deal.
                                                        // Maybe there's some way to request the latest errors from
                                                        // react-hook-form, though?
                                                        scrollToError(errors);
                                                        return;
                                                    }

                                                    // Make sure we don't go backwards.
                                                    setCurrentIndex((curIdx) =>
                                                        Math.max(curIdx, i + 1),
                                                    );
                                                }}
                                            >
                                                <IoPaperPlaneSharp
                                                    color="white"
                                                    size={20}
                                                    className="relative -left-[2px] -bottom-[1px]"
                                                />
                                            </button>
                                        )}
                                    </div>
                                </QuestionBubble>
                            </div>
                        );
                    })}

                    <Bubble side="left" hidden={!isFinished}>
                        {
                            "That's it! Take a moment to review your application, then click the button below to submit."
                        }
                    </Bubble>

                    <Bubble side="left" hidden={!isFinished}>
                        <input
                            type="submit"
                            value="Submit"
                            className="cursor-pointer"
                        />
                    </Bubble>

                    <Image
                        src={HallE}
                        alt=""
                        className="w-1/2 sm:w-1/3 scale-x-[-1] move-around"
                        hidden={!isFinished}
                    />
                </form>
            </div>
        </div>
    );
}
