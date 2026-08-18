import * as React from "react";
import { LogOut, X, BellOff, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface UpcomingCheckoutsPopoverProps {
    isOpen: boolean;
    onClose: () => void;
    checkouts: any[];
    onCheckOut: (bookingId: string) => Promise<void>;
}

export function UpcomingCheckoutsPopover({ isOpen, onClose, checkouts, onCheckOut }: UpcomingCheckoutsPopoverProps) {
    const popoverRef = React.useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Close on click outside
    React.useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                // Check if the click was on the notification button itself to avoid double toggling
                const target = event.target as HTMLElement;
                if (target.closest("[aria-label='Notifications']")) {
                    return;
                }
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const formatTime = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    return (
        <div
            ref={popoverRef}
            className="absolute right-0 top-12 w-80 sm:w-88 rounded-xl border border-slate-200 bg-white shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        >
            {/* Popover Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-800 text-xs sm:text-sm">Upcoming Checkouts</span>
                    {checkouts.length > 0 && (
                        <span className="rounded-full bg-blue-100 text-blue-700 px-1.5 py-0.5 text-[10px] font-bold">
                            {checkouts.length}
                        </span>
                    )}
                </div>
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
                    aria-label="Close notifications"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* List of checkouts */}
            <div className="max-h-64 overflow-y-auto space-y-2 pr-0.5 scrollbar-thin">
                {checkouts.length === 0 ? (
                    <div className="py-6 text-center text-slate-400 flex flex-col items-center">
                        <BellOff className="h-8 w-8 text-slate-350 mb-2" />
                        <p className="text-[11px] font-semibold">No checkouts scheduled in the next hour</p>
                    </div>
                ) : (
                    checkouts.map(booking => {
                        const guestName = booking.guests?.[0]?.name || "Guest";
                        const roomNum = booking.room?.roomNumber || booking.roomNumber || "N/A";
                        const checkOutTime = booking.checkOut ? formatTime(booking.checkOut) : "";

                        return (
                            <div
                                key={booking.id}
                                className="flex flex-col p-2.5 bg-slate-50 border border-slate-150 rounded-lg hover:border-slate-300 transition-all text-xs"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="font-bold text-slate-800">
                                            Room {roomNum} &bull; {guestName}
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                                            Checkout scheduled for {checkOutTime}
                                        </div>
                                    </div>
                                    
                                    {/* Action button */}
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            if (confirm(`Mark Room ${roomNum} checked out?`)) {
                                                await onCheckOut(String(booking.id));
                                            }
                                        }}
                                        className="rounded-lg bg-rose-600 hover:bg-rose-700 p-1.5 text-white transition-all shadow-3xs cursor-pointer"
                                        title="Quick check out"
                                    >
                                        <LogOut className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Popover Footer */}
            {checkouts.length > 0 && (
                <div className="border-t border-slate-100 pt-2.5 mt-3 text-center">
                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            navigate("/manage-bookings");
                        }}
                        className="inline-flex items-center justify-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                        Go to Manage Bookings
                        <ArrowRight className="h-3 w-3" />
                    </button>
                </div>
            )}
        </div>
    );
}
