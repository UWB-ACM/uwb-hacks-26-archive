import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function UWBHacks2025Snapshot() {
    const UWBHacksSnapshotTextContent = [
        "300+ Hackers",
        "$9,000 in Prizes",
        "85+ Projects Submitted",
        "11+ Participating Institutions",
    ];
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIdx((prev) => (prev + 1) % UWBHacksSnapshotTextContent.length);
        }, 3500);

        return () => clearInterval(interval);
    }, [UWBHacksSnapshotTextContent.length]);

    return (
        <div className="h-fit overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.p
                    key={idx}
                    initial={{ y: "-100%", opacity: 0.25 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "100%", opacity: 0.25 }}
                    transition={{ duration: 0.35, ease: "anticipate" }}
                    className="text-xl md:text-2xl lg:text-3xl font-bold"
                >
                    {UWBHacksSnapshotTextContent[idx]}
                </motion.p>
            </AnimatePresence>
        </div>
    );
}
