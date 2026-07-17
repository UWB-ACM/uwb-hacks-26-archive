import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { MeetTheTeamCloudProps, committeeMembers } from "./Committees";
import CommitteeMemberInfo from "./CommitteeMemberInfo";
import CommitteeMemberIcon from "./CommitteeMemberIcon";

const MeetTheTeamCloud = ({
    committeeMemberIconsRef,
    handleClick,
    handleDeselect,
    selectedMemberIdx,
}: MeetTheTeamCloudProps) => {
    const infoRef = useRef<HTMLDivElement | null>(null);
    const prevHeightRef = useRef<number>(0);

    useLayoutEffect(() => {
        const el = infoRef.current;
        if (!el) return;

        // don't need to animate height on lg and xl screens as height is dictated by flex container
        if (window.matchMedia("(min-width: 1000px)").matches) {
            prevHeightRef.current = 0;
            return;
        }

        const newHeight = el.scrollHeight;

        if (prevHeightRef.current > 0 && prevHeightRef.current !== newHeight) {
            gsap.fromTo(
                el,
                { height: prevHeightRef.current },
                {
                    height: newHeight,
                    duration: 0.2,
                    ease: "power2.inOut",
                    onComplete: () => {
                        gsap.set(el, { height: "auto" });
                    },
                },
            );
        }

        prevHeightRef.current = newHeight;
    }, [selectedMemberIdx]);

    return (
        <div className="w-full flex flex-col lg:flex-row">
            {/* Committee Member Icons */}
            <div className="relative overflow-hidden lg:h-[550px]">
                <div
                    ref={committeeMemberIconsRef}
                    className="flex lg:flex-col gap-x-[5vmin] lg:gap-x-0 lg:gap-y-[5vmin] py-3 lg:py-0 lg:px-3"
                >
                    {/* rendered twice for the purpose of the infinite carousel animation */}
                    {[0, 1].map((dup) => (
                        <div
                            key={dup}
                            className="flex lg:flex-col-reverse h-full gap-x-[5vmin] lg:gap-x-0 lg:pl-0 lg:gap-y-[5vmin]"
                        >
                            {committeeMembers.map((committeeMember, idx) => (
                                <CommitteeMemberIcon
                                    key={`${dup}-${committeeMember.name}`}
                                    idx={idx}
                                    committeeMember={committeeMember}
                                    isSelected={idx === selectedMemberIdx}
                                    handleClick={handleClick}
                                    tabIndex={dup === 0 ? 0 : -1}
                                />
                            ))}
                        </div>
                    ))}
                </div>

                {/* white linear gradients to make memberIcons fade in / fade out */}
                <div className="block lg:hidden absolute top-0 left-0 w-[8%] h-full bg-[linear-gradient(90deg,rgba(244,253,255,1)_0%,rgba(244,253,255,0.85)_20%,rgba(244,253,255,0.55)_45%,rgba(244,253,255,0.2)_70%,rgba(244,253,255,0.05)_88%,rgba(244,253,255,0)_100%)] pointer-events-none" />
                <div className="block lg:hidden absolute top-0 right-0 w-[8%] h-full bg-[linear-gradient(270deg,rgba(244,253,255,1)_0%,rgba(244,253,255,0.85)_20%,rgba(244,253,255,0.55)_45%,rgba(244,253,255,0.2)_70%,rgba(244,253,255,0.05)_88%,rgba(244,253,255,0)_100%)] pointer-events-none" />
                <div className="hidden lg:block absolute top-0 w-full h-[20%] bg-[linear-gradient(180deg,rgba(244,253,255,1)_0%,rgba(244,253,255,0.85)_20%,rgba(244,253,255,0.55)_45%,rgba(244,253,255,0.2)_70%,rgba(244,253,255,0.05)_88%,rgba(244,253,255,0)_100%)] pointer-events-none" />
                <div className="hidden lg:block absolute bottom-0 w-full h-[20%] bg-[linear-gradient(0deg,rgba(244,253,255,1)_0%,rgba(244,253,255,0.85)_20%,rgba(244,253,255,0.55)_45%,rgba(244,253,255,0.2)_70%,rgba(244,253,255,0.05)_88%,rgba(244,253,255,0)_100%)] pointer-events-none" />
            </div>

            {/* Selected Committee Member Info */}
            <div ref={infoRef} className="grow lg:w-0 overflow-hidden">
                <CommitteeMemberInfo
                    committeeMember={null}
                    isHidden={selectedMemberIdx !== null}
                />

                {committeeMembers.map((committeeMember, idx) => (
                    <CommitteeMemberInfo
                        key={committeeMember.name}
                        committeeMember={committeeMember}
                        isHidden={selectedMemberIdx !== idx}
                        onClose={handleDeselect}
                    />
                ))}
            </div>
        </div>
    );
};

export default MeetTheTeamCloud;
