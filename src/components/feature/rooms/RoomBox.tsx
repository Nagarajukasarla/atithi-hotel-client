import type { BookingOrder, Room, RoomStateType, RoomStatusType } from "@/types/rooms";
import { cn } from "@/lib/utils";
import { BedDouble, Crown, Gem } from "lucide-react";

type Theme = { backgroundColor: string; borderColor: string; textColor: string };

const statusThemes: Record<RoomStatusType, Theme> = {
    Vacant: { backgroundColor: "#ffffff", borderColor: "#e2e8f0", textColor: "#1a202c" },
    Occupied: { backgroundColor: "#ebf5ff", borderColor: "#3b82f6", textColor: "#1e3a8a" },
    "Stay Over": { backgroundColor: "#fff7ed", borderColor: "#f97316", textColor: "#9a3412" },
    "Check In": { backgroundColor: "#f0fdf4", borderColor: "#10b981", textColor: "#065f46" },
    "Check Out": { backgroundColor: "#fef2f2", borderColor: "#ef4444", textColor: "#991b1b" },
};

const stateThemes: Record<RoomStateType, Theme> = {
    Clean: { backgroundColor: "#f0fdf4", borderColor: "#10b981", textColor: "#065f46" },
    Dirty: { backgroundColor: "#fef2f2", borderColor: "#ef4444", textColor: "#991b1b" },
    Inspected: { backgroundColor: "#ebf5ff", borderColor: "#3b82f6", textColor: "#1e3a8a" },
    "Out of Service": {
        backgroundColor: "rgb(250, 250, 250)",
        borderColor: "rgb(156, 163, 175)",
        textColor: "rgb(75, 85, 99)",
    },
    "Out of Order": {
        backgroundColor: "rgb(118, 118, 118)",
        borderColor: "rgb(91, 91, 91)",
        textColor: "rgb(77, 77, 77)",
    },
};

export interface RoomBoxProps {
    room: Room;
    bookingOrder?: BookingOrder;
    selectedRoom: Room | null;
    onClick: () => void;
    deluxeBadgeSrc?: string;
    vipBadgeSrc?: string;
}

function getBookingRange(booking?: BookingOrder): { start: string; end: string } | null {
    if (!booking) return null;
    const start = new Date(booking.duration.start);
    const end = new Date(booking.duration.end);
    return booking.isHourly
        ? {
              start: start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              end: end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }
        : {
              start: start.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
              end: end.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
          };
}

export function RoomBox({ room, bookingOrder, selectedRoom, onClick, deluxeBadgeSrc, vipBadgeSrc }: RoomBoxProps) {
    const selected = selectedRoom?.id === room.id;
    const status = statusThemes[room.roomStatus] ?? statusThemes.Vacant;
    const state = stateThemes[room.roomState] ?? stateThemes.Clean;
    const range = getBookingRange(bookingOrder);
    const badgeSrc = room.roomType === "Deluxe" ? deluxeBadgeSrc : room.roomType === "VIP" ? vipBadgeSrc : undefined;

    return (
        <button
            aria-label={`Room ${room.number}, ${room.roomStatus}, ${room.roomState}`}
            aria-pressed={selected}
            className={cn(
                "group relative flex min-h-[140px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border p-3 text-center shadow-[0_1px_3px_rgba(0,0,0,0.1)] transition-[transform,box-shadow,border-width] duration-200",
                "hover:z-[1] hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(0,0,0,0.15)]",
                "focus-visible:z-[2] focus-visible:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                selected && "z-[2] -translate-y-0.5 border-2 shadow-[0_4px_15px_rgba(0,0,0,0.2)]",
                "motion-reduce:transform-none motion-reduce:transition-none"
            )}
            onClick={onClick}
            style={{
                backgroundColor: status.backgroundColor,
                borderColor: status.borderColor,
                color: status.textColor,
            }}
            type="button"
        >
            <span className="flex h-3 w-full items-center justify-between" aria-hidden="true">
                <span className="flex flex-1 items-center justify-start">
                    {bookingOrder?.isHourly && (
                        <span className="h-2.5 w-2.5 rounded-full bg-[#e53e3e] shadow-[0_0_0_2px_rgba(229,62,62,0.2)] transition duration-200 group-hover:scale-[1.15] group-hover:shadow-[0_0_0_3px_rgba(229,62,62,0.3)]" />
                    )}
                </span>
                <span className="flex flex-1 items-center justify-end">
                    {badgeSrc ? (
                        <img alt="" className="h-3.5 w-auto object-contain" src={badgeSrc} />
                    ) : room.roomType === "Deluxe" ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#3b82f6] bg-blue-100/60 px-1 rounded">
                            DLX
                        </span>
                    ) : room.roomType === "VIP" || room.roomType === "Presidential" ? (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#9333ea] bg-purple-100/60 px-1 rounded">
                            VIP
                        </span>
                    ) : null}
                </span>
            </span>

            {/* Room Type Icon (Standard: BedDouble, Premium Male: Crown blue, Premium Female: Gem pink) */}
            <div
                className="flex items-center justify-center mt-2 h-6"
                aria-hidden="true"
                title={room.isPremium ? (room.premiumType === "FEMALE" ? "Premium Female" : "Premium Male") : "Standard"}
            >
                {room.isPremium ? (
                    room.premiumType === "FEMALE" ? (
                        <Gem className="w-5.5 h-5.5 text-rose-500 fill-rose-100/40" />
                    ) : (
                        <Crown className="w-5.5 h-5.5 text-blue-500 fill-blue-100/40" />
                    )
                ) : (
                    <BedDouble className="w-5.5 h-5.5 text-slate-400" />
                )}
            </div>

            <span className="my-1.5 mb-1 flex flex-col gap-0.5 text-[26px] font-bold leading-none">
                {room.number}
                {range && (
                    <span
                        className={cn(
                            "mt-1 block text-center text-xs font-medium leading-[1.3]",
                            bookingOrder?.isHourly
                                ? "font-medium tracking-[0.5px] text-[#2d3748]"
                                : "text-xs text-[#4a5568]"
                        )}
                    >
                        {range.start} - {range.end}
                    </span>
                )}
            </span>

            <span
                className="mt-2 w-fit rounded-xl border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.5px]"
                style={{
                    backgroundColor: state.backgroundColor,
                    borderColor: state.borderColor,
                    color: state.textColor,
                }}
            >
                {room.roomState}
            </span>
        </button>
    );
}
