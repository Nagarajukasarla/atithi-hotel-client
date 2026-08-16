import * as React from "react";
import { Building2, X } from "lucide-react";
import { SidebarNavigation } from "@/components/layout/SidebarNavigation";
import { cn } from "@/lib/utils";

export interface MobileNavigationProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
    // Prevent background scroll when mobile menu is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <div
                aria-hidden="true"
                className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-200"
                onClick={onClose}
            />

            {/* Drawer Container */}
            <aside
                aria-label="Mobile Navigation"
                className={cn(
                    "relative flex h-full w-[280px] max-w-[85vw] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out z-10"
                )}
            >
                {/* Mobile Header */}
                <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200/80">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                            <Building2 className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-base font-bold text-slate-800 leading-tight">Atithi</span>
                            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                                Hotel Management
                            </span>
                        </div>
                    </div>
                    <button
                        aria-label="Close menu"
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
                        onClick={onClose}
                        type="button"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* User Identity Banner */}
                <div className="flex items-center gap-3 bg-slate-50 p-4 border-b border-slate-200/80">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700 ring-2 ring-blue-500/20 shrink-0 text-sm">
                        NK
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="text-sm font-semibold text-slate-800">Nagaraju Kasarla</span>
                        <span className="text-xs font-medium text-slate-500">Host Administrator</span>
                    </div>
                </div>

                {/* Navigation List */}
                <div className="flex-1 overflow-y-auto">
                    <SidebarNavigation isCollapsed={false} onItemClick={onClose} />
                </div>
            </aside>
        </div>
    );
}
