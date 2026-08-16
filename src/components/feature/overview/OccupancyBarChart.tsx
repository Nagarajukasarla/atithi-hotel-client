import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { StatisticsSection } from "@/components/feature/overview/StatisticsSection";
import type { OccupancyChartDatum } from "@/types/overview";

export interface OccupancyBarChartProps {
    data: OccupancyChartDatum[];
    className?: string;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-md border border-[#e5e7eb] bg-white px-3 py-1.5 shadow-md">
                <p className="text-xs font-semibold text-[#1e293b]">{label}</p>
                <p className="text-xs font-medium text-[#2f80ed]">Occupancy: {payload[0].value}</p>
            </div>
        );
    }
    return null;
}

export function OccupancyBarChart({ data, className }: OccupancyBarChartProps) {
    return (
        <StatisticsSection className={className} title="Occupancy Statistics">
            <div className="w-full h-[240px] pt-2">
                <ResponsiveContainer height="100%" width="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid stroke="#f0f2f5" strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            axisLine={false}
                            dataKey="label"
                            tick={{ fill: "#666666", fontSize: 12 }}
                            tickLine={false}
                        />
                        <YAxis axisLine={false} tick={{ fill: "#666666", fontSize: 12 }} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f0f2f5" }} />
                        <Bar
                            aria-label="Monthly Occupancy Bar Chart"
                            barSize={18}
                            dataKey="value"
                            fill="#2f80ed"
                            radius={[5, 5, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </StatisticsSection>
    );
}
