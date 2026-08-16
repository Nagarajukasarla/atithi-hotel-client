import type { BedType } from "@/types/bookings";
import { cn } from "@/lib/utils";

export interface RoomBedBadgeProps {
    bedType: BedType;
    className?: string;
}

export function RoomBedBadge({ bedType, className }: RoomBedBadgeProps) {
    const getBadgeStyle = (type: BedType) => {
        switch (type) {
            case "King":
                return "bg-amber-50 text-amber-700 border-amber-200";
            case "Queen":
                return "bg-purple-50 text-purple-700 border-purple-200";
            default:
                return "bg-blue-50 text-blue-700 border-blue-200";
        }
    };

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold uppercase tracking-wider",
                getBadgeStyle(bedType),
                className
            )}
        >
            {bedType}
        </span>
    );
}
