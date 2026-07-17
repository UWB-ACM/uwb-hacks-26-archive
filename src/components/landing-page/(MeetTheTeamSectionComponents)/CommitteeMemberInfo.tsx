import Link from "next/link";
import { X } from "lucide-react";
import { CommitteeMember } from "./Committees";
import { cn } from "@/src/util/utils";

interface CommitteeMemberInfoProps {
    committeeMember: CommitteeMember | null;
    isHidden: boolean;
    onClose?: () => void;
}

const CommitteeMemberInfo = ({
    committeeMember,
    isHidden,
    onClose,
}: CommitteeMemberInfoProps) => {
    const roles =
        committeeMember !== null
            ? committeeMember.roles.map((role, idx) => (
                  <li key={idx}>{role}</li>
              ))
            : null;

    return (
        <div
            className={cn(
                "w-full h-full flex flex-col text-shadow-md lg:text-left",
                isHidden ? "hidden" : "flex",
            )}
        >
            {committeeMember ? (
                <>
                    {onClose && (
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close committeeMemberInfo"
                            className="ml-auto rounded-full p-1 hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black cursor-pointer"
                        >
                            <X size={22} />
                        </button>
                    )}
                    <div className="max-w-[300px] m-auto pt-1 lg:pt-0">
                        <Link
                            href={committeeMember.link}
                            target="_blank"
                            className="text-lg lg:text-xl font-semibold underline lg:no-underline lg:hover:underline underline-offset-2 text-blue-400"
                        >
                            {committeeMember.name}
                        </Link>
                        <ul className="pl-5 text-base md:text-lg list-disc">
                            {roles}
                        </ul>
                    </div>
                </>
            ) : (
                <p className="max-w-[300px] m-auto pt-2 lg:pt-0 text-base md:text-lg text-center">
                    Select one of our wonderful hackathon organizers to learn
                    more about them!
                </p>
            )}
        </div>
    );
};

export default CommitteeMemberInfo;
