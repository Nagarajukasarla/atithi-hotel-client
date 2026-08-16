import * as React from "react";
import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SidebarNavigationItemProps {
    to: string;
    label: string;
    icon: LucideIcon;
    isCollapsed: boolean;
    onClick?: () => void;
}

export function SidebarNavigationItem({ to, label, icon: Icon, isCollapsed, onClick }: SidebarNavigationItemProps) {
    const [showTooltip, setShowTooltip] = React.useState(false);

    return (
        <div className="relative w-full">
            <NavLink
                aria-label={label}
                className={({ isActive }) =>
                    cn(
                        "group relative flex h-10.5 w-full items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                        isCollapsed ? "justify-center px-0" : "justify-start gap-3",
                        isActive
                            ? "bg-[#F5F8FF] text-[#2F56C9] font-semibold"
                            : "text-[#475569] hover:bg-slate-100 hover:text-slate-900"
                    )
                }
                to={to}
                onClick={onClick}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                {({ isActive }) => (
                    <>
                        <Icon
                            className={cn(
                                "h-[18px] w-[18px] shrink-0 transition-colors",
                                isActive ? "text-[#3D6AE8]" : "text-slate-500 group-hover:text-slate-700"
                            )}
                        />
                        {!isCollapsed && <span className="truncate">{label}</span>}
                    </>
                )}
            </NavLink>

            {/* Tooltip in Collapsed State */}
            {isCollapsed && showTooltip && (
                <div
                    aria-hidden="true"
                    className="absolute left-full top-1/2 ml-3 -translate-y-1/2 z-50 whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium text-white shadow-md pointer-events-none"
                >
                    {label}
                </div>
            )}
        </div>
    );
}
