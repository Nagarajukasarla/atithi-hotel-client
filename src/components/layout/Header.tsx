import { useLocation } from "react-router-dom";
import { Menu } from "lucide-react";
import { HeaderActions } from "@/components/layout/HeaderActions";
import { SidebarToggle } from "@/components/layout/SidebarToggle";
import { cn } from "@/lib/utils";

export interface HeaderProps {
    isSidebarCollapsed: boolean;
    onToggleSidebar: () => void;
    onOpenMobileNav: () => void;
    className?: string;
}

function getPageTitle(pathname: string): string {
    if (pathname.startsWith("/bookings")) return "Bookings";
    if (pathname.startsWith("/payments")) return "Payments";
    if (pathname.startsWith("/rooms")) return "Rooms";
    if (pathname.startsWith("/settings")) return "Settings";
    if (pathname.startsWith("/plans")) return "Plans";
    return "Overview";
}

export function Header({ isSidebarCollapsed, onToggleSidebar, onOpenMobileNav, className }: HeaderProps) {
    const location = useLocation();
    const pageTitle = getPageTitle(location.pathname);

    return (
        <header
            className={cn(
                "sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white px-4 sm:px-6 transition-all duration-200",
                className
            )}
        >
            {/* Left Area: Toggle + Title */}
            <div className="flex items-center gap-3">
                {/* Mobile Hamburger Button */}
                <button
                    aria-label="Open mobile menu"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-colors md:hidden cursor-pointer"
                    onClick={onOpenMobileNav}
                    type="button"
                >
                    <Menu className="h-5 w-5" />
                </button>

                {/* Desktop Sidebar Toggle */}
                <div className="hidden md:block">
                    <SidebarToggle isCollapsed={isSidebarCollapsed} onToggle={onToggleSidebar} />
                </div>

                {/* Page Title */}
                <h1 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">{pageTitle}</h1>
            </div>

            {/* Right Area: Actions */}
            <HeaderActions />
        </header>
    );
}
