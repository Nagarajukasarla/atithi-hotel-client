import { cn } from "@/lib/utils";

export interface OverviewMetricCardProps {
    title: string;
    subtitle: string;
    value: number | string;
    className?: string;
}

export function OverviewMetricCard({ title, subtitle, value, className }: OverviewMetricCardProps) {
    return (
        <div className={cn("flex min-w-[170px] flex-1 items-end justify-between py-1 px-2 text-left", className)}>
            <div className="flex flex-col">
                <span className="text-sm font-medium text-[#6b7280] leading-snug">{title}</span>
                <span className="text-[15px] font-normal text-[#4b5563] leading-snug">{subtitle}</span>
            </div>
            <div className="text-2xl font-semibold text-[#2563eb] leading-none">{value}</div>
        </div>
    );
}
