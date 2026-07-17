import React from "react";
import { useState } from "react";

type DetailItem = {
    id: string;
    header: React.ReactNode;
    content: React.ReactNode;
};

type DetailPanelProps = {
    items: DetailItem[];
};

export default function DetailSelector({ items }: DetailPanelProps) {
    const [selectedId, setSelectedId] = useState<string>(items[0]?.id);
    const selectedItem = items.find((c) => c.id === selectedId);

    return (
        <div className="grid auto-rows-auto">
            <div className="w-full flex justify-evenly flex-wrap">
                {items.map((item) => (
                    <div
                        key={item.id}
                        onClick={() => setSelectedId(item.id)}
                        className={`${
                            selectedId === item.id
                                ? "bg-blue-100"
                                : "hover:bg-gray-100"
                        } hover:cursor-pointer`}
                    >
                        {item.header}
                    </div>
                ))}
            </div>
            <div>{selectedItem?.content}</div>
        </div>
    );
}
