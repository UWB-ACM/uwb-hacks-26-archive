import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import { clsx } from "clsx";

export default function DashboardFeedback({
    open,
    setOpen,
    title,
    description,
    className,
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    title: React.ReactElement | string;
    description: React.ReactElement | string;
    className?: string;
}) {
    return (
        <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
            <DialogContent
                className={clsx(
                    "max-w-[90%] sm:max-w-[425px] z-1000",
                    className,
                )}
            >
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                {description}
            </DialogContent>
        </Dialog>
    );
}
