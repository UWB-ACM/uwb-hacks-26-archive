import React, { Dispatch, RefObject, SetStateAction } from "react";

import { DisplayTrack } from "../tracks";

type TracksNavHeaderProps = {
    tracks: DisplayTrack[];
    tracksNavRef: RefObject<HTMLDivElement | null>;
    selectedTrackIdx: number;
    setSelectedTrackIdx: Dispatch<SetStateAction<number>>;
};

export default function TracksNavHeader({
    tracks,
    tracksNavRef,
    selectedTrackIdx,
    setSelectedTrackIdx,
}: TracksNavHeaderProps) {
    return (
        <div className="mx-20">
            <div
                ref={tracksNavRef}
                className="z-100 w-full flex flex-wrap items-center items-stretch justify-center px-1 gap-1 md:px-2 md:gap-2"
            >
                {tracks.map((track, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedTrackIdx(idx)}
                        className={`track min-h-[75px] md:min-h-[85px] font-glacial-indifference font-bold text-md sm:text-2xl text-[#0e83da] px-3 md:px-5 py-2 md:py-3 border-3 border-[#0e83da] rounded-[100] duration-300 ${idx === selectedTrackIdx ? "bg-[#0fc6f9] border-[#0fc6f9] hover:bg-[#0e83da] hover:border-[#0e83da] text-white" : "bg-[--cloud-color] hover:bg-[#eefafd]"}`}
                    >
                        {track.name}
                    </button>
                ))}
            </div>
        </div>
    );
}
