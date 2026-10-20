import { AvailabilitySearchForm } from "@/components/feature/bookings/AvailabilitySearchForm";
import { RoomAvailabilityTable } from "@/components/feature/bookings/RoomAvailabilityTable";
import type { AvailabilityQuery, CandidateRoom } from "@/types/bookings";
import { cn } from "@/lib/utils";

export interface FrontDeskBookingViewProps {
    rooms: CandidateRoom[];
    onSearch: (query: AvailabilityQuery) => void;
    onBookNow: (room: CandidateRoom) => void;
    isSearching?: boolean;
    isLoading?: boolean;
    className?: string;
}

export function FrontDeskBookingView({
    rooms,
    onSearch,
    onBookNow,
    isSearching = false,
    isLoading = false,
    className,
}: FrontDeskBookingViewProps) {
    return (
        <div className={cn("space-y-5", className)}>
            <AvailabilitySearchForm isSearching={isSearching} onSearch={onSearch} />
            <RoomAvailabilityTable onBookNow={onBookNow} rooms={rooms} isLoading={isLoading || isSearching} />
        </div>
    );
}
