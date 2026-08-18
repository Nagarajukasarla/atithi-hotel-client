import * as React from "react";
import { NotificationButton } from "@/components/layout/NotificationButton";
import { UpcomingCheckoutsPopover } from "@/components/layout/UpcomingCheckoutsPopover";
import { bookingService } from "@/api/booking-service";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export interface HeaderActionsProps {
    className?: string;
}

export function HeaderActions({ className }: HeaderActionsProps) {
    const { toast } = useToast();
    const [isPopoverOpen, setIsPopoverOpen] = React.useState<boolean>(false);
    const [upcomingCheckouts, setUpcomingCheckouts] = React.useState<any[]>([]);

    const fetchCheckouts = React.useCallback(async () => {
        try {
            const res = await bookingService.getUpcomingCheckouts();
            if (res.success && res.data) {
                setUpcomingCheckouts(res.data);
            }
        } catch (error) {
            console.error("Failed to load upcoming checkouts in HeaderActions:", error);
        }
    }, []);

    // Initial fetch + start interval polling
    React.useEffect(() => {
        void fetchCheckouts();

        const interval = setInterval(() => {
            void fetchCheckouts();
        }, 30000); // Poll every 30 seconds

        return () => clearInterval(interval);
    }, [fetchCheckouts]);

    const handleCheckOut = async (bookingId: string) => {
        try {
            const res = await bookingService.checkOutBooking(bookingId);
            if (res.success) {
                toast("Room checked out successfully!", "success");
                void fetchCheckouts();
            } else {
                toast(res.message || "Failed to check-out booking.", "error");
            }
        } catch (error) {
            console.error("Quick checkout error:", error);
            toast("An error occurred during quick checkout.", "error");
        }
    };

    return (
        <div className={cn("flex items-center gap-2 sm:gap-3", className)}>
            {/* Notification container with popover */}
            <div className="relative">
                <NotificationButton 
                    hasUnread={upcomingCheckouts.length > 0} 
                    onClick={() => setIsPopoverOpen(prev => !prev)}
                />
                <UpcomingCheckoutsPopover 
                    isOpen={isPopoverOpen} 
                    onClose={() => setIsPopoverOpen(false)}
                    checkouts={upcomingCheckouts}
                    onCheckOut={handleCheckOut}
                />
            </div>
            
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
