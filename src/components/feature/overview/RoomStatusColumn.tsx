import { cn } from "@/lib/utils";

export interface RoomStatusColumnProps {
    title: string;
    total: number;
    rows: Array<{ label: string; count: number }>;
    className?: string;
}

export function RoomStatusColumn({ title, total, rows, className }: RoomStatusColumnProps) {
    return (
        <div className={cn("flex flex-1 flex-col space-y-3", className)}>
            <div className="flex items-center justify-between border-b border-[#e5e7eb] pb-2">
                <span className="text-sm font-semibold text-[#1e293b]">{title}</span>
                <span className="text-[15px] font-semibold text-[#2563eb]">{total}</span>
            </div>
            <div className="space-y-2">
                {rows.map(row => (
                    <div key={row.label} className="flex items-center justify-between text-sm py-0.5">
                        <span className="text-[#4b5563]">{row.label}</span>
                        <span className="font-medium text-[#1e293b]">{row.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
