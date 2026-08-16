import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NotificationButtonProps {
    hasUnread?: boolean;
    onClick?: () => void;
    className?: string;
}

export function NotificationButton({ hasUnread = true, onClick, className }: NotificationButtonProps) {
    return (
        <button
            aria-label="Notifications"
            className={cn(
                "relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                className
            )}
            onClick={onClick}
            type="button"
        >
            <Bell className="h-5 w-5" />
            {hasUnread && (
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
            )}
        </button>
    );
}
