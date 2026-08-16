import { RoomStatusColumn } from "@/components/feature/overview/RoomStatusColumn";
import { StatisticsSection } from "@/components/feature/overview/StatisticsSection";
import type { RoomStatusData } from "@/types/overview";

export interface RoomStatusStatisticsProps {
    data: RoomStatusData;
    className?: string;
}

export function RoomStatusStatistics({ data, className }: RoomStatusStatisticsProps) {
    const occupiedRows = [
        { label: "Clean", count: data.occupied.clean },
        { label: "Dirty", count: data.occupied.dirty },
        { label: "Inspected", count: data.occupied.inspected },
    ];

    const availableRows = [
        { label: "Clean", count: data.available.clean },
        { label: "Dirty", count: data.available.dirty },
        { label: "Inspected", count: data.available.inspected },
    ];

    return (
        <StatisticsSection className={className} title="Room status">
            <div className="flex flex-col sm:flex-row gap-6 md:gap-10 lg:gap-12">
                <RoomStatusColumn rows={occupiedRows} title="Occupied rooms" total={data.occupied.total} />
                <div className="hidden sm:block w-px bg-[#e5e7eb] self-stretch" />
                <RoomStatusColumn rows={availableRows} title="Available rooms" total={data.available.total} />
            </div>
        </StatisticsSection>
    );
}
