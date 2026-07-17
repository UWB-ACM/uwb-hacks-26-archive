import React from "react";

type FunFactsContainerProps = {
    children: React.ReactNode;
};

export default function FunFactsContainer({
    children,
}: FunFactsContainerProps) {
    return (
        <div
            id="funFactsContainer"
            className="grid grid-cols-2 gap-x-16 gap-y-0 items-center justify-items-center px-4"
        >
            {children}
        </div>
    );
}
