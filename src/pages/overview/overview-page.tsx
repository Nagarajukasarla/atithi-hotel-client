import * as React from "react";
import { CustomerReviews } from "@/components/feature/overview/CustomerReviews";
import { FloorStatusStatistics } from "@/components/feature/overview/FloorStatusStatistics";
import { OccupancyBarChart } from "@/components/feature/overview/OccupancyBarChart";
import { OverviewMetricCard } from "@/components/feature/overview/OverviewMetricCard";
import { RoomStatusStatistics } from "@/components/feature/overview/RoomStatusStatistics";
import { RoomTypeStatisticsCard } from "@/components/feature/overview/RoomTypeStatisticsCard";
import { StatisticsSection } from "@/components/feature/overview/StatisticsSection";
import { roomTypeService } from "@/api/room-type-service";
import { roomService } from "@/api/room-service";
import type { RoomTypeConfig } from "@/pages/settings/room-types-dialog";
import {
    INITIAL_CUSTOMER_REVIEWS,
    INITIAL_FLOOR_PROGRESS,
    INITIAL_OCCUPANCY_DATA,
    INITIAL_ROOM_STATUS_DATA,
} from "@/features/overview/overview-data";


export function OverviewPage() {
    const [selectedFloorId, setSelectedFloorId] = React.useState<string>("floor-1");
    const [roomTypes, setRoomTypes] = React.useState<RoomTypeConfig[]>([]);
    const [overviewStats, setOverviewStats] = React.useState<{
        todayCheckInCount: number;
        todayCheckOutCount: number;
        totalGuestsInHotel: number;
        totalAvailableRooms: number;
    } | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchOverviewData = async () => {
            setIsLoading(true);
            try {
                const [typesRes, statsRes] = await Promise.all([
                    roomTypeService.getRoomTypes(),
                    roomService.getOverviewStats()
                ]);
                if (typesRes.success && typesRes.data) {
                    setRoomTypes(typesRes.data);
                }
                if (statsRes.success && statsRes.data) {
                    setOverviewStats(statsRes.data);
                }
            } catch (error) {
                console.error("Failed to load overview data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        void fetchOverviewData();
    }, []);

    const metrics = [
        {
            id: "check-in",
            title: "Today's",
            subtitle: "Check-in",
            value: overviewStats ? overviewStats.todayCheckInCount : 0,
        },
        {
            id: "check-out",
            title: "Today's",
            subtitle: "Check-out",
            value: overviewStats ? overviewStats.todayCheckOutCount : 0,
        },
        {
            id: "in-hotel",
            title: "Total",
            subtitle: "In hotel",
            value: overviewStats ? overviewStats.totalGuestsInHotel : 0,
        },
        {
            id: "available-room",
            title: "Total",
            subtitle: "Available room",
            value: overviewStats ? overviewStats.totalAvailableRooms : 0,
        },
    ];

    return (
        <main
            aria-label="Hotel Operations Overview"
            className="min-h-full w-full bg-[#f2f8ff] p-4 sm:p-5 flex flex-col gap-5 text-[#1e293b]"
        >
            {/* Section 1 — Overview KPIs */}
            <StatisticsSection title="Overview">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#e5e7eb]">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, idx) => (
                            <div key={idx} className="flex min-w-[170px] flex-1 items-center justify-between py-2 px-4 text-left animate-pulse bg-white/60 rounded-lg">
                                <div className="flex flex-col gap-1.5 w-2/3">
                                    <div className="h-3 w-12 bg-slate-200 rounded-md" />
                                    <div className="h-5 w-24 bg-slate-200 rounded-md" />
                                </div>
                                <div className="h-8 w-8 bg-slate-200 rounded-md" />
                            </div>
                        ))
                    ) : (
                        metrics.map(metric => (
                            <OverviewMetricCard
                                key={metric.id}
                                subtitle={metric.subtitle}
                                title={metric.title}
                                value={metric.value}
                            />
                        ))
                    )}
                </div>
            </StatisticsSection>

            {/* Section 2 — Room type metrics */}
            <StatisticsSection title="Rooms">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-4 shadow-xs animate-pulse h-[120px]"
                            >
                                <div className="flex justify-between items-baseline mb-4">
                                    <div className="h-4 w-28 bg-slate-200 rounded-md" />
                                    <div className="h-6 w-12 bg-slate-200 rounded-md" />
                                </div>
                                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                                    <div className="h-5 bg-slate-200 rounded-md w-full" />
                                    <div className="h-5 bg-slate-200 rounded-md w-full" />
                                </div>
                            </div>
                        ))
                    ) : roomTypes.length === 0 ? (
                        <div className="col-span-1 sm:col-span-2 xl:col-span-4 flex items-center justify-center p-8 bg-white rounded-lg border border-[#e5e7eb] italic text-slate-400">
                            No active room types found.
                        </div>
                    ) : (
                        roomTypes.map(room => (
                            <RoomTypeStatisticsCard
                                key={room.id}
                                active={room.activeRoomsCount || 0}
                                dailyPrice={room.basePrice}
                                hourlyPrice={room.hourlyPrice}
                                title={room.name}
                                total={room.totalRoomsCount || 0}
                            />
                        ))
                    )}
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
