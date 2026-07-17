import Image from "next/image";

import ConnectCloud from "@/public/clouds/ConnectCloud.png";
import StrongBrandPresenceCloud from "@/public/clouds/StrongBrandPresenceCloud.png";
import LongTermRelationshipCloud from "@/public/clouds/LongTermRelationshipCloud.png";

import Hover from "./Hover";

export default function WhySponsorClouds() {
    const cloudDimensions = "w-[88%] md:w-3/5 lg:w-1/2 xl:w-2/5";
    const cloudSizesAttribute =
        "(min-width: 1200px) 40vw, (min-width: 1000px) 50vw, (min-width: 800px) 60vw, 88vw";

    return (
        <div className="opacity-90 space-y-[13vh] lg:space-y-[15vh] xl:space-y-[18vh] pb-[13vh] md:pb-[15vh] lg:pb-[20vh] xl:pb-[20vh]">
            <div className="w-full flex">
                <div className="w-[3%] md:w-[10%]" />
                <Hover duration={8} className={cloudDimensions}>
                    <Image
                        src={ConnectCloud}
                        alt=""
                        className="z-8 w-full"
                        sizes={cloudSizesAttribute}
                    />
                </Hover>
                <div className="flex-1" />
            </div>
            <div className="w-full flex">
                <div className="flex-1" />
                <Hover duration={15} className={cloudDimensions}>
                    <Image
                        src={StrongBrandPresenceCloud}
                        alt=""
                        className="z-8 w-full"
                        sizes={cloudSizesAttribute}
                    />
                </Hover>
                <div className="w-[3%] md:w-[10%]" />
            </div>
            <div className="w-full flex">
                <div className="w-[2%] md:w-[20%]" />
                <Hover duration={12} className={cloudDimensions}>
                    <Image
                        src={LongTermRelationshipCloud}
                        alt=""
                        className="z-8 w-full"
                        sizes={cloudSizesAttribute}
                    />
                </Hover>
                <div className="flex-1" />
            </div>
        </div>
    );
}
