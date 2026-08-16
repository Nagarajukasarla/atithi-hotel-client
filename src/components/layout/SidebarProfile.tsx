import * as React from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export interface SidebarProfileProps {
    isCollapsed: boolean;
    className?: string;
}

function getInitials(name?: string): string {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function SidebarProfile({ isCollapsed, className }: SidebarProfileProps) {
    const [showTooltip, setShowTooltip] = React.useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login", { replace: true });
    };

    const initials = getInitials(user?.name);
    const displayName = user?.name || "Hotel User";
    const displayRole = user?.role ? `${user.role.charAt(0) + user.role.slice(1).toLowerCase()}` : "User";

    return (
        <div
            className={cn("relative border-t border-slate-200/80 p-3 transition-all duration-200", className)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <div
                className={cn(
                    "flex items-center gap-3 rounded-lg p-1.5 transition-colors",
                    isCollapsed ? "justify-center p-0" : "justify-between"
                )}
            >
                <div className="flex items-center gap-3 overflow-hidden">
                    {/* User Avatar */}
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100 font-semibold text-violet-700 ring-2 ring-violet-500/20 shrink-0 text-xs">
                        {initials}
                    </div>

                    {/* User Info Stack (Expanded only) */}
                    {!isCollapsed && (
                        <div className="flex flex-col overflow-hidden whitespace-nowrap text-left">
                            <span className="text-xs font-semibold text-slate-800 truncate">{displayName}</span>
                            <span className="text-[11px] font-medium text-slate-500 truncate">{displayRole}</span>
                        </div>
                    )}
                </div>

                {/* Logout Button */}
                {!isCollapsed && (
                    <button
                        aria-label="Sign out"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors shrink-0"
                        onClick={handleLogout}
                        title="Sign out"
                        type="button"
                    >
                        <LogOut size={16} />
                    </button>
                )}
            </div>

            {/* Tooltip in Collapsed State */}
            {isCollapsed && showTooltip && (
                <div
                    aria-hidden="true"
                    className="absolute left-full top-1/2 ml-3 -translate-y-1/2 z-50 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-xl pointer-events-auto flex flex-col gap-1.5"
                >
                    <div className="flex flex-col">
                        <span className="font-semibold text-white">{displayName}</span>
                        <span className="text-[10px] text-slate-300">{displayRole}</span>
                    </div>
                    <button
                        className="mt-1 flex items-center gap-1.5 rounded bg-rose-600/80 px-2 py-1 text-[11px] font-medium text-white hover:bg-rose-600 transition"
                        onClick={handleLogout}
                        type="button"
                    >
                        <LogOut size={12} /> Sign out
                    </button>
                </div>
            )}
        </div>
    );
}
