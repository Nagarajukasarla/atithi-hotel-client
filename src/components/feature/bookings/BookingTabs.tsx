import * as React from "react";
import { cn } from "@/lib/utils";

export type BookingTabValue = "frontDesk" | "onlinePlatform";

export interface BookingTabsProps {
    value: BookingTabValue;
    onValueChange: (val: BookingTabValue) => void;
    frontDeskCount?: number;
    onlineCount?: number;
}

export function BookingTabs({ value, onValueChange, frontDeskCount, onlineCount }: BookingTabsProps) {
    const tabs: Array<{ id: BookingTabValue; label: string; count?: number }> = [
        { id: "frontDesk", label: "Front Desk", count: frontDeskCount },
        { id: "onlinePlatform", label: "Online Platform", count: onlineCount },
    ];

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === "ArrowRight") {
            e.preventDefault();
            const nextIndex = (index + 1) % tabs.length;
            onValueChange(tabs[nextIndex].id);
        } else if (e.key === "ArrowLeft") {
            e.preventDefault();
            const prevIndex = (index - 1 + tabs.length) % tabs.length;
            onValueChange(tabs[prevIndex].id);
        }
    };

    return (
        <div className="w-full border-b border-[#e0e0e0] bg-white">
            <div className="flex w-full" role="tablist">
                {tabs.map((tab, idx) => {
                    const isActive = value === tab.id;
                    return (
                        <button
                            key={tab.id}
                            aria-selected={isActive}
                            className={cn(
                                "relative flex-1 py-3 text-center text-[15px] font-medium transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1890ff] focus-visible:z-10",
                                isActive
                                    ? "font-semibold text-[#1890ff] border-b-2 border-[#1890ff] -mb-[1px]"
                                    : "text-[#666666] hover:bg-[#f5f5f5] hover:text-[#333333]"
                            )}
                            onClick={() => onValueChange(tab.id)}
                            onKeyDown={e => handleKeyDown(e, idx)}
                            role="tab"
                            tabIndex={isActive ? 0 : -1}
                            type="button"
                        >
                            <span className="inline-flex items-center gap-2">
                                {tab.label}
                                {tab.count !== undefined && (
                                    <span
                                        className={cn(
                                            "rounded-full px-2 py-0.5 text-xs font-semibold",
                                            isActive ? "bg-[#e6f7ff] text-[#1890ff]" : "bg-slate-100 text-slate-500"
                                        )}
                                    >
                                        {tab.count}
                                    </span>
                                )}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
