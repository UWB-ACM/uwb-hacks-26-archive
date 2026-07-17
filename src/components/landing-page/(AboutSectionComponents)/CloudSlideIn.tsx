import Image, { StaticImageData } from "next/image";
import { motion, useInView, useAnimate } from "motion/react";
import React, { useRef, useEffect, useState } from "react";

/**
 * image of cloud positioned based on arguments; cloud slides in when user scrolls
 * @param cloudImage cloud SVG
 * @param alt - is the alt text for the image
 * @param position whether cloud should be positioned to the left or right
 * @param padding how far cloud should be positioned from left or right; should be percentage (e.g. "25%")
 * @param onPressChange - is a callback function triggered when the cloud is pressed or reappears (unpressed)
 */
export default function CloudSlideIn({
    cloudImage,
    alt,
    position,
    padding,
    onPressChange,
}: {
    cloudImage: StaticImageData;
    alt: string;
    position: "left" | "right";
    padding: string;
    onPressChange?: (pressed: boolean) => void;
}) {
    const triggerRef = useRef<HTMLDivElement | null>(null);

    return (
        <div ref={triggerRef} className="w-full flex">
            <div
                style={{
                    width: position == "left" ? padding : 0,
                    flexGrow: position == "right" ? 1 : 0,
                }}
            />
            <SlideIn triggerRef={triggerRef} position={position}>
                <Hover>
                    <ScaleDownOnTap onPressChange={onPressChange}>
                        <Image
                            src={cloudImage}
                            alt={alt}
                            className="w-full h-full"
                        />
                    </ScaleDownOnTap>
                </Hover>
            </SlideIn>
            <div
                style={{
                    width: position == "right" ? padding : 0,
                    flexGrow: position == "left" ? 1 : 0,
                }}
            />
        </div>
    );
}

function SlideIn({
    children,
    triggerRef,
    position,
}: {
    children: React.ReactNode;
    triggerRef: React.RefObject<HTMLDivElement | null>;
    position: "left" | "right";
}) {
    const inView = useInView(triggerRef, { amount: 0.75, once: true });
    const offscreenX = position === "left" ? "-200%" : "200%";

    return (
        <motion.div
            initial={{ x: offscreenX }}
            animate={{ x: inView ? 0 : offscreenX }}
            transition={{ duration: 0.75, ease: "easeOut" }}
            className="w-2/5 md:w-1/2 lg:w-2/5 xl:w-1/4"
        >
            {children}
        </motion.div>
    );
}

function Hover({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
                delay: 1,
                duration: 2,
                ease: "easeInOut",
                repeat: Infinity,
            }}
            className="w-full h-full"
        >
            {children}
        </motion.div>
    );
}

function ScaleDownOnTap({
    children,
    onPressChange,
}: {
    children: React.ReactNode;
    onPressChange?: (pressed: boolean) => void;
}) {
    const [hidden, setHidden] = useState(false);
    const numClicks = useRef(0);
    const timeoutIDRef = useRef<NodeJS.Timeout | null>(null);
    const [scope, animate] = useAnimate();

    useEffect(() => {
        // cleanup timeout when component unmounts
        return () => {
            if (timeoutIDRef.current) {
                clearTimeout(timeoutIDRef.current);
                timeoutIDRef.current = null;
            }
        };
    }, []);

    async function disappear() {
        if (!scope.current) return;

        setHidden(true);
        onPressChange?.(true);

        await animate(
            scope.current,
            { opacity: 0.5, scale: 0, rotate: 1440 },
            { duration: 1, ease: "easeOut" },
        );
        await animate(scope.current, { opacity: 1, rotate: 0 });
        await animate(
            scope.current,
            { scale: 1, rotate: 0 },
            { delay: 1, duration: 0.25, ease: "easeOut" },
        );

        setHidden(false);
        onPressChange?.(false);
    }

    function handleClick() {
        numClicks.current++;
        if (numClicks.current === 5) disappear();

        // clear previous timeout
        if (timeoutIDRef.current) clearTimeout(timeoutIDRef.current);

        // set new timeout
        timeoutIDRef.current = setTimeout(() => {
            numClicks.current = 0;
        }, 2250);
    }

    return (
        <motion.div
            ref={scope}
            onClick={handleClick}
            whileTap={
                hidden
                    ? undefined
                    : {
                          scale: 0.75,
                          transition: { duration: 0.1, ease: "easeInOut" },
                      }
            }
            className="w-full h-full cursor-pointer select-none"
        >
            {children}
        </motion.div>
    );
}
