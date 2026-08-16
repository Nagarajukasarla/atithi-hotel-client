import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DateTimeFieldProps {
    label: string;
    value: string; // ISO date string or YYYY-MM-DDTHH:mm
    onChange: (val: string) => void;
    error?: string;
    min?: string;
    className?: string;
}

export function DateTimeField({ label, value, onChange, error, min, className }: DateTimeFieldProps) {
    // Convert ISO / standard date string to HTML datetime-local format (YYYY-MM-DDTHH:mm)
    const toLocalInputValue = (isoStr: string) => {
        try {
            const d = new Date(isoStr);
            if (isNaN(d.getTime())) return isoStr;
            const pad = (n: number) => String(n).padStart(2, "0");
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        } catch {
            return isoStr;
        }
    };

    // Format nice display label e.g., "Thu, Aug 12, 12:00"
    const formatNiceDisplay = (isoStr: string) => {
        try {
            const d = new Date(isoStr);
            if (isNaN(d.getTime())) return "";
            return d.toLocaleDateString([], {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return "";
        }
    };

    return (
        <div className={cn("flex flex-col gap-1.5 flex-1", className)}>
            <label className="text-xs font-semibold text-slate-700">{label}</label>
            <div className="relative flex items-center">
                <span className="absolute left-3 text-slate-400 pointer-events-none" aria-hidden="true">
                    <Calendar className="h-4 w-4" />
                </span>
                <input
                    className={cn(
                        "w-full rounded-md border border-[#e5e7eb] bg-white pl-9 pr-3 py-2 text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-[#2563eb]",
                        error && "border-red-500 focus:ring-red-500"
                    )}
                    min={min ? toLocalInputValue(min) : undefined}
                    type="datetime-local"
                    value={toLocalInputValue(value)}
                    onChange={e => onChange(e.target.value)}
                />
            </div>
            {value && <span className="text-[11px] font-medium text-[#2563eb]">{formatNiceDisplay(value)}</span>}
            {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
        </div>
    );
}
