import React, { RefObject, useState } from "react";
import TracksNav from "./TracksNav";
import SelectedTrackInformation from "./SelectedTrackInformation";
import { DisplayTrack } from "../tracks";

type TracksProps = {
    tracks: DisplayTrack[];
    tracksNavRef: RefObject<HTMLDivElement | null>;
    selectedTrackRef: RefObject<HTMLDivElement | null>;
};

export default function Tracks({
    tracks,
    tracksNavRef,
    selectedTrackRef,
}: TracksProps) {
    const [selectedTrackIdx, setSelectedTrackIdx] = useState(0);

    return (
        <>
            {/* Use to select track */}
            <TracksNav
                tracks={tracks}
                tracksNavRef={tracksNavRef}
                selectedTrackIdx={selectedTrackIdx}
                setSelectedTrackIdx={setSelectedTrackIdx}
            />

            {/*
                Selected Track Information
                - track name
                - description
            */}
            <SelectedTrackInformation
                selectedTrackRef={selectedTrackRef}
                selectedTrack={tracks[selectedTrackIdx]}
            />
        </>
    );
}
