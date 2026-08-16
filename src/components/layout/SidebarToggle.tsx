import { PanelLeft, PanelLeftClose } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SidebarToggleProps {
    isCollapsed: boolean;
    onToggle: () => void;
    className?: string;
}

export function SidebarToggle({ isCollapsed, onToggle, className }: SidebarToggleProps) {
    return (
        <button
            aria-label="Toggle sidebar"
            className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                className
            )}
            onClick={onToggle}
            type="button"
        >
            {isCollapsed ? <PanelLeft className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </button>
    );
}
