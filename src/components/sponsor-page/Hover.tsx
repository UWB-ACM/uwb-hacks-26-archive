"use client";

import React from "react";
import { motion } from "motion/react";

interface HoverProps {
    children: React.ReactNode;
    duration?: number;
    className?: string;
}

export default function Hover({
    children,
    duration = 10,
    className = "",
}: HoverProps) {
    return (
        <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, "-15px", 0] }}
            transition={{ repeat: Infinity, duration: duration }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
