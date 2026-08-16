import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SidebarHeaderProps {
    isCollapsed: boolean;
    className?: string;
}

export function SidebarHeader({ isCollapsed, className }: SidebarHeaderProps) {
    return (
        <div
            className={cn(
                "flex h-16 items-center px-4 border-b border-slate-200/80 transition-all duration-200",
                isCollapsed ? "justify-center" : "justify-start gap-3",
                className
            )}
        >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs shrink-0">
                <Building2 className="h-5 w-5" />
            </div>
            {!isCollapsed && (
                <div className="flex flex-col overflow-hidden whitespace-nowrap">
                    <span className="text-base font-bold text-slate-800 leading-tight">Atithi</span>
                    <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                        Hotel Management
                    </span>
                </div>
            )}
        </div>
    );
}
