import { RefObject } from "react";

import { DisplayTrack } from "@/src/components/landing-page/(TracksSectionComponents)/tracks";

type SelectedTrackInformationProps = {
    selectedTrackRef: RefObject<HTMLDivElement | null>;
    selectedTrack: DisplayTrack;
};

export default function SelectedTrackInformation({
    selectedTrackRef,
    selectedTrack,
}: SelectedTrackInformationProps) {
    return (
        <div ref={selectedTrackRef} className="p-4 px-10 md:p-12">
            <p className="mx-auto text-center md:w-3/4 md:text-xl text-[#0078d0]">
                {selectedTrack.description}
            </p>
        </div>
    );
}
