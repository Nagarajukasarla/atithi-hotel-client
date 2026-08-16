import * as React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { MobileNavigation } from "@/components/layout/MobileNavigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";

export function AppLayout() {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);

    const handleToggleSidebar = () => {
        setIsSidebarCollapsed(prev => !prev);
    };

    return (
        <div className="min-h-screen w-full bg-[#f2f8ff] text-slate-800 flex flex-col antialiased">
            {/* Desktop Sidebar (Fixed) */}
            <Sidebar isCollapsed={isSidebarCollapsed} />

            {/* Mobile Slide-out Drawer */}
            <MobileNavigation isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />

            {/* Main Layout Container (Offset by Sidebar width on desktop) */}
            <div
                className={cn(
                    "flex flex-1 flex-col min-h-screen transition-[padding] duration-200 ease-in-out",
                    isSidebarCollapsed ? "md:pl-[72px]" : "md:pl-[256px]"
                )}
            >
                {/* Top Header (Sticky) */}
                <Header
                    isSidebarCollapsed={isSidebarCollapsed}
                    onOpenMobileNav={() => setIsMobileNavOpen(true)}
                    onToggleSidebar={handleToggleSidebar}
                />

                {/* Page Content Outlet Container */}
                <main aria-label="Main Content" className="flex-1 w-full overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
