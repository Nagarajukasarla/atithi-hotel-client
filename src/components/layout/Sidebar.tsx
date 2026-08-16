import { SidebarHeader } from "@/components/layout/SidebarHeader";
import { SidebarNavigation } from "@/components/layout/SidebarNavigation";
import { SidebarProfile } from "@/components/layout/SidebarProfile";
import { cn } from "@/lib/utils";

export interface SidebarProps {
    isCollapsed: boolean;
    className?: string;
}

export function Sidebar({ isCollapsed, className }: SidebarProps) {
    return (
        <aside
            aria-label="Sidebar Navigation"
            className={cn(
                "hidden md:flex h-screen flex-col fixed left-0 top-0 z-30 bg-white border-r border-slate-200/80 transition-all duration-200 ease-in-out select-none",
                isCollapsed ? "w-[72px]" : "w-[256px]",
                className
            )}
        >
            <SidebarHeader isCollapsed={isCollapsed} />
            <SidebarNavigation isCollapsed={isCollapsed} showLogout={false} />
            <SidebarProfile isCollapsed={isCollapsed} />
        </aside>
    );
}
