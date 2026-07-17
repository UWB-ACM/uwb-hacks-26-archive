import Image from "next/image";
import { CommitteeMember } from "./Committees";
import { asset } from "@/src/util/asset";

interface CommitteeMemberIconProps {
    idx: number;
    committeeMember: CommitteeMember;
    isSelected: boolean;
    handleClick: (selectedIdx: number) => void;
    tabIndex: 0 | -1;
}

const CommitteeMemberIcon = ({
    idx,
    committeeMember,
    isSelected,
    handleClick,
    tabIndex,
}: CommitteeMemberIconProps) => {
    return (
        <button
            type="button"
            className={`shrink-0 relative h-[150px] md:h-[200px] lg:h-[225px] w-[150px] md:w-[200px] lg:w-[225px] border-black border rounded-full overflow-hidden cursor-pointer hover:scale-104 duration-300 p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 ${isSelected ? "scale-105" : "scale-100"}`}
            onClick={() => handleClick(idx)}
            tabIndex={tabIndex}
            aria-pressed={isSelected}
            aria-label={committeeMember.name}
        >
            <Image
                src={asset(committeeMember.image_path)}
                alt={committeeMember.name}
                className="object-cover"
                fill
                sizes="(min-width: 1000px) 225px, (min-width: 800px) 200px, 150px"
            />
        </button>
    );
};

export default CommitteeMemberIcon;
