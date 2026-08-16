import type { CandidateRoom } from "@/types/bookings";
import { cn } from "@/lib/utils";

export interface BookRoomActionProps {
    room: CandidateRoom;
    onBookNow: (room: CandidateRoom) => void;
    fullWidth?: boolean;
    className?: string;
}

export function BookRoomAction({ room, onBookNow, fullWidth = false, className }: BookRoomActionProps) {
    const isVacant = room.status === "Vacant";

    if (!isVacant) {
        return (
            <button
                aria-label={`Manage Payment for Room ${room.number}`}
                className={cn(
                    "rounded-md bg-[#10b981] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#059669] active:bg-[#047857] transition-colors cursor-pointer min-h-[36px]",
                    fullWidth && "w-full justify-center flex items-center",
                    className
                )}
                onClick={() => onBookNow(room)}
                type="button"
            >
                Payment
            </button>
        );
    }

    return (
        <button
            aria-label={`Book Room ${room.number}`}
            className={cn(
                "rounded-md bg-[#2563eb] px-3.5 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-[#1d4ed8] active:bg-[#1e40af] transition-colors cursor-pointer min-h-[36px]",
                fullWidth && "w-full justify-center flex items-center",
                className
            )}
            onClick={() => onBookNow(room)}
            type="button"
        >
            Book Now
        </button>
    );
}
