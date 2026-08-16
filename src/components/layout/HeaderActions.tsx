import { NotificationButton } from "@/components/layout/NotificationButton";
import { cn } from "@/lib/utils";

export interface HeaderActionsProps {
    className?: string;
}

export function HeaderActions({ className }: HeaderActionsProps) {
    return (
        <div className={cn("flex items-center gap-2 sm:gap-3", className)}>
            <NotificationButton />
            <button
                aria-label="User Profile"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700 ring-2 ring-blue-500/20 text-xs hover:ring-blue-500/40 transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                type="button"
            >
                NK
            </button>
        </div>
    );
}
