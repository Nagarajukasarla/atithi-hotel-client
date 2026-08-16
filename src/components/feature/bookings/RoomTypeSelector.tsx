import type { RoomTypeOption } from "@/types/bookings";
import { cn } from "@/lib/utils";

export interface RoomTypeSelectorProps {
    value: RoomTypeOption;
    onChange: (type: RoomTypeOption) => void;
    className?: string;
}

const OPTIONS: RoomTypeOption[] = ["Standard", "Deluxe", "Premium"];

export function RoomTypeSelector({ value, onChange, className }: RoomTypeSelectorProps) {
    return (
        <div className={cn("flex flex-col gap-1.5", className)}>
            <label className="text-xs font-semibold text-slate-700">Room Type</label>
            <div className="flex rounded-md border border-[#e5e7eb] bg-[#f8fafc] p-1 gap-1" role="radiogroup">
                {OPTIONS.map(option => {
                    const isSelected = value === option;
                    return (
                        <button
                            key={option}
                            aria-checked={isSelected}
                            className={cn(
                                "flex-1 rounded-sm py-1.5 px-3 text-xs font-medium transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb]",
                                isSelected
                                    ? "bg-[#2563eb] text-white shadow-xs font-semibold"
                                    : "text-[#4b5563] hover:bg-slate-200/60"
                            )}
                            onClick={() => onChange(option)}
                            role="radio"
                            type="button"
                        >
                            {option}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
