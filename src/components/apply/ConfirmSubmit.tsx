import Image from "next/image";
import Link from "next/link";
import Cloud3 from "@/public/clouds/Cloud3.png";
import React, { useState } from "react";

export default function ConfirmSubmit({
    onEdit,
    showPopup,
}: {
    onEdit: () => void;
    showPopup: boolean;
}) {
    const [viewPopUp, setViewPopUp] = useState(showPopup);
    const togglePopUp = () => setViewPopUp(!viewPopUp);

    return (
        <>
            {viewPopUp && (
                // the z-index is +1 that of the header to have full-screen blur
                <div className="fixed inset-0 flex items-center justify-center z-[1000]">
                    {/* Blur the background */}
                    <div
                        className="absolute inset-0 bg-black opacity-50"
                        onClick={togglePopUp} // let the user exit the popup easily
                    />
                    {/* The popup message */}
                    <div className="z-50 text-center bg-white rounded-2xl w-9/10 md:w-1/2 lg:w-1/3 py-6 px-8">
                        <h1 className="sm:text-3xl md:text-4xl font-bold mb-4 font-sans">
                            Onto Your Next Step
                        </h1>
                        <p className="sm:text-lg md:text-xl lg:text-2xl">
                            Join on Devpost!{" "}
                            <Link
                                className="underline text-red-500"
                                onClick={togglePopUp}
                                href="https://uwb-hacks-the-future.devpost.com/"
                                target="_blank"
                            >
                                Click Here
                            </Link>
                        </p>
                        <p>
                            Hint: This is
                            <span className="font-bold"> required!</span>
                        </p>
                        <p className="pt-3 md:pt-1">
                            Devpost will be used to submit your hackathon
                            project and view others&apos; work!
                        </p>
                    </div>
                </div>
            )}
            <div className="relative">
                {/* Left Cloud */}
                <Image
                    src={Cloud3}
                    alt=""
                    className="absolute z-0 top-20 -left-20 md:-left-20 lg:-left-16 scale-x-[-1] opacity-40 w-1/2 md:w-1/3 lg:w-1/4"
                />

                {/* Right Cloud */}
                <Image
                    src={Cloud3}
                    alt=""
                    className="absolute z-0 bottom-40 right-3 md:right-2 lg:right-1 opacity-40 w-1/2 md:w-1/3 lg:w-1/4"
                />

                {/* Submission confirmation message */}
                {/* A subcontainer is used to ensure the is displayed over the clouds */}
                <div className="z-10 text-center mt-20 sm:mt-15">
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 font-sans">
                        Thank you for submitting your application!
                    </h1>
                    <p className="mt-4 text-sm sm:text-lg md:text-xl lg:text-2xl">
                        See you for UWB Hacks 2026: Hacks the Future
                    </p>
                    <p className="m-2 text-sm sm:text-lg md:text-xl lg:text-2xl font-bold">
                        Friday, April 24 - Sunday, April 26, 2026
                    </p>
                    <p>
                        Remember to sign up on{" "}
                        <Link
                            className="underline text-blue-500 font-bold"
                            href="https://uwb-hacks-the-future.devpost.com/"
                            target="_blank"
                        >
                            Devpost
                        </Link>
                        !
                    </p>

                    <button
                        className="mx-auto mt-8 min-w-[120px] bg-white hover:bg-gray-100 text-[#0d83db] text-sm sm:text-base md:text-lg lg:text-xl font-bold py-3 px-6 sm:px-8 md:px-10 rounded-full flex items-center justify-center"
                        onClick={onEdit}
                    >
                        Edit Application
                    </button>
                </div>
            </div>
        </>
    );
}
