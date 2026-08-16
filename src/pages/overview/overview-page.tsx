import * as React from "react";
import { CustomerReviews } from "@/components/feature/overview/CustomerReviews";
import { FloorStatusStatistics } from "@/components/feature/overview/FloorStatusStatistics";
import { OccupancyBarChart } from "@/components/feature/overview/OccupancyBarChart";
import { OverviewMetricCard } from "@/components/feature/overview/OverviewMetricCard";
import { RoomStatusStatistics } from "@/components/feature/overview/RoomStatusStatistics";
import { RoomTypeStatisticsCard } from "@/components/feature/overview/RoomTypeStatisticsCard";
import { StatisticsSection } from "@/components/feature/overview/StatisticsSection";
import {
    INITIAL_CUSTOMER_REVIEWS,
    INITIAL_FLOOR_PROGRESS,
    INITIAL_OCCUPANCY_DATA,
    INITIAL_OVERVIEW_METRICS,
    INITIAL_ROOM_STATUS_DATA,
    INITIAL_ROOM_TYPE_METRICS,
} from "@/features/overview/overview-data";

export function OverviewPage() {
    const [selectedFloorId, setSelectedFloorId] = React.useState<string>("floor-1");

    return (
        <main
            aria-label="Hotel Operations Overview"
            className="min-h-full w-full bg-[#f2f8ff] p-4 sm:p-5 flex flex-col gap-5 text-[#1e293b]"
        >
            {/* Section 1 — Overview KPIs */}
            <StatisticsSection title="Overview">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#e5e7eb]">
                    {INITIAL_OVERVIEW_METRICS.map(metric => (
                        <OverviewMetricCard
                            key={metric.id}
                            subtitle={metric.subtitle}
                            title={metric.title}
                            value={metric.value}
                        />
                    ))}
                </div>
            </StatisticsSection>

            {/* Section 2 — Room type metrics */}
            <StatisticsSection title="Rooms">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {INITIAL_ROOM_TYPE_METRICS.map(room => (
                        <RoomTypeStatisticsCard
                            key={room.id}
                            active={room.active}
                            dailyPrice={room.dailyPrice}
                            hourlyPrice={room.hourlyPrice}
                            title={room.title}
                            total={room.total}
                        />
                    ))}
                </div>
            </StatisticsSection>

            {/* Section 3 — Room and floor status */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-5">
                <RoomStatusStatistics className="lg:col-span-6" data={INITIAL_ROOM_STATUS_DATA} />
                <FloorStatusStatistics
                    className="lg:col-span-4"
                    floors={INITIAL_FLOOR_PROGRESS}
                    selectedFloorId={selectedFloorId}
                    onFloorChange={setSelectedFloorId}
                />
            </div>

            {/* Section 4 — Occupancy and feedback */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-5">
                <OccupancyBarChart className="lg:col-span-7" data={INITIAL_OCCUPANCY_DATA} />
                <CustomerReviews className="lg:col-span-3" reviews={INITIAL_CUSTOMER_REVIEWS} />
            </div>
        </main>
    );
}
