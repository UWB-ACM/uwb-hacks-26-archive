import Bubble from "./Bubble";
import { PropsWithChildren } from "react";
import Image from "next/image";
import HallE from "@/public/HALL-E.png";

type QuestionBubbleProps = {
    question?: string | null;
    hidden: boolean;
    husky: boolean;
};

export default function QuestionBubble({
    question,
    hidden,
    children,
    husky,
}: PropsWithChildren<QuestionBubbleProps>) {
    return (
        <>
            {question && (
                <Bubble side="left" hidden={hidden}>
                    <p>{question}</p>
                </Bubble>
            )}

            {husky && (
                <Image
                    src={HallE}
                    alt=""
                    className="w-1/2 sm:w-1/3 scale-x-[-1] move-around"
                />
            )}

            <Bubble side="right" hidden={hidden}>
                {children}
            </Bubble>
        </>
    );
}
