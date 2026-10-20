import { Calendar, Clock } from "lucide-react";
import { RateDisplay } from "@/components/feature/overview/RateDisplay";
import { cn } from "@/lib/utils";

export interface RoomTypeStatisticsCardProps {
    title: string;
    active: number;
    total: number;
    hourlyPrice?: number;
    dailyPrice: number;
    currency?: string;
    className?: string;
}

export function RoomTypeStatisticsCard({
    title,
    active,
    total,
    hourlyPrice,
    dailyPrice,
    currency,
    className,
}: RoomTypeStatisticsCardProps) {
    const hasHourly = hourlyPrice !== undefined && hourlyPrice !== null && hourlyPrice > 0;

    return (
        <div
            className={cn(
                "flex flex-col justify-between rounded-lg border-[1.5px] border-[#e5e7eb] bg-white p-4 shadow-xs",
                className
            )}
        >
            <div className="flex items-baseline justify-between mb-3">
                <h3 className="text-sm font-medium text-[#1e293b]">{title}</h3>
                <div className="inline-flex items-baseline">
                    <span className="text-[21px] font-semibold text-[#4b5563]">{active}</span>
                    <span className="text-[20px] font-normal text-[#858d9d] ml-0.5">/{total}</span>
                </div>
            </div>
            <div
                className={cn(
                    "grid gap-2 pt-2 border-t border-[#f0f2f5]",
                    hasHourly ? "grid-cols-2" : "grid-cols-1"
                )}
            >
                {hasHourly && (
                    <RateDisplay currency={currency} icon={<Clock className="h-4 w-4" />} unit="/hr" value={hourlyPrice} />
                )}
                <RateDisplay
                    currency={currency}
                    icon={<Calendar className="h-4 w-4" />}
                    unit="/day"
                    value={dailyPrice}
                />
            </div>
        </div>
    );
}
