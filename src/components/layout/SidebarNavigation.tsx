import { BedDouble, CalendarCheck, CreditCard, LayoutDashboard, LogOut, Settings, Receipt, Sliders } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SidebarNavigationItem } from "@/components/layout/SidebarNavigationItem";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export interface SidebarNavigationProps {
    isCollapsed: boolean;
    showLogout?: boolean;
    onItemClick?: () => void;
    className?: string;
}

export function SidebarNavigation({ isCollapsed, showLogout = true, onItemClick, className }: SidebarNavigationProps) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const navItems = [
        { to: "/overview", label: "Overview", icon: LayoutDashboard },
        { to: "/bookings", label: "Bookings", icon: CalendarCheck },
        { to: "/manage-bookings", label: "Manage Bookings", icon: Sliders },
        { to: "/payments", label: "Payments", icon: Receipt },
        { to: "/rooms", label: "Rooms", icon: BedDouble },
        { to: "/settings", label: "Settings", icon: Settings },
        { to: "/plans", label: "Plans", icon: CreditCard },
    ];

    const handleLogout = async () => {
        try {
            await logout();
        } finally {
            onItemClick?.();
            navigate("/login", { replace: true });
        }
    };

    return (
        <nav className={cn("flex flex-1 flex-col justify-between p-3 space-y-1", className)}>
            <div className="space-y-1">
                {navItems.map(item => (
                    <SidebarNavigationItem
                        key={item.to}
                        icon={item.icon}
                        isCollapsed={isCollapsed}
                        label={item.label}
                        to={item.to}
                        onClick={onItemClick}
                    />
                ))}
            </div>

            {showLogout && (
                <div className="border-t border-slate-200/80 pt-2">
                    <button
                        aria-label="Logout"
                        className={cn(
                            "group flex h-10.5 w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-[#475569] transition-all duration-150 outline-none hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-blue-500",
                            isCollapsed ? "justify-center px-0" : "justify-start gap-3"
                        )}
                        onClick={handleLogout}
                        type="button"
                    >
                        <LogOut className="h-[18px] w-[18px] shrink-0 text-slate-500 transition-colors group-hover:text-slate-700" />
                        {!isCollapsed && <span className="truncate">Logout</span>}
                    </button>
                </div>
            )}
        </nav>
    );
}
