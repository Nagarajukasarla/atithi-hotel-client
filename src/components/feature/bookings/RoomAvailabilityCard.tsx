import { BookRoomAction } from "@/components/feature/bookings/BookRoomAction";
import { RoomBedBadge } from "@/components/feature/bookings/RoomBedBadge";
import type { CandidateRoom } from "@/types/bookings";
import { cn } from "@/lib/utils";

export interface RoomAvailabilityCardProps {
    room: CandidateRoom;
    onBookNow: (room: CandidateRoom) => void;
    className?: string;
}

export function RoomAvailabilityCard({ room, onBookNow, className }: RoomAvailabilityCardProps) {
    return (
        <div className={cn("flex flex-col gap-3 rounded-lg border border-[#e2e8f0] bg-white p-4 shadow-xs", className)}>
            <div className="flex items-center justify-between">
                <span className="text-base font-bold text-slate-800">#{room.number}</span>
                <RoomBedBadge bedType={room.bedType} />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-medium text-slate-700">Floor - {room.floor}</span>
                <span className="font-medium text-slate-500">{room.roomType}</span>
            </div>

            <p className="text-xs text-slate-500 leading-snug line-clamp-2">{room.facilities}</p>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-1">
                <span
                    className={cn(
                        "text-[11px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider",
                        room.status === "Vacant"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                    )}
                >
                    {room.status}
                </span>
                <div className="w-1/2">
                    <BookRoomAction fullWidth onBookNow={onBookNow} room={room} />
                </div>
            </div>
        </div>
    );
}
