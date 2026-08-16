import { SemiDonutProgress } from "@/components/feature/overview/SemiDonutProgress";
import { StatisticsSection } from "@/components/feature/overview/StatisticsSection";
import type { FloorProgress } from "@/types/overview";

export interface FloorStatusStatisticsProps {
    floors: FloorProgress[];
    selectedFloorId: string;
    onFloorChange: (floorId: string) => void;
    className?: string;
}

export function FloorStatusStatistics({
    floors,
    selectedFloorId,
    onFloorChange,
    className,
}: FloorStatusStatisticsProps) {
    const currentFloor = floors.find(f => f.id === selectedFloorId) || floors[0];

    return (
        <StatisticsSection
            className={className}
            headerAction={
                <div className="relative">
                    <label className="sr-only" htmlFor="floor-select">
                        Select floor
                    </label>
                    <select
                        className="h-9 min-h-[36px] min-w-[110px] rounded-md border border-[#e5e7eb] bg-white px-3 py-1 text-xs font-medium text-[#1e293b] shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-[#2f80ed] focus-visible:border-transparent cursor-pointer"
                        id="floor-select"
                        value={selectedFloorId}
                        onChange={e => onFloorChange(e.target.value)}
                    >
                        {floors.map(floor => (
                            <option key={floor.id} value={floor.id}>
                                {floor.name}
                            </option>
                        ))}
                    </select>
                </div>
            }
            title="Floor status"
        >
            <div className="flex flex-col sm:flex-row items-center justify-around gap-4 py-2">
                <SemiDonutProgress
                    label={`${currentFloor?.name || "Floor"} progress`}
                    value={currentFloor?.completedPercent ?? 0}
                />

                <div className="flex flex-col gap-2.5 sm:self-center">
                    <div className="flex items-center gap-2">
                        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#2f80ed] shrink-0" />
                        <span className="text-xs font-medium text-[#4b5563]">Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#cbd5e1] shrink-0" />
                        <span className="text-xs font-medium text-[#4b5563]">Yet to Complete</span>
                    </div>
                </div>
            </div>
        </StatisticsSection>
    );
}
