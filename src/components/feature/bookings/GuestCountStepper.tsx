import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface GuestCountStepperProps {
    label: string;
    description: string;
    value: number;
    min: number;
    max: number;
    onChange: (newVal: number) => void;
    className?: string;
}

export function GuestCountStepper({
    label,
    description,
    value,
    min,
    max,
    onChange,
    className,
}: GuestCountStepperProps) {
    const isMinDisabled = value <= min;
    const isMaxDisabled = value >= max;

    const handleDecrement = () => {
        if (!isMinDisabled) onChange(value - 1);
    };

    const handleIncrement = () => {
        if (!isMaxDisabled) onChange(value + 1);
    };

    return (
        <div className={cn("flex flex-col gap-1.5 flex-1", className)}>
            <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800">{label}</span>
                <span className="text-[11px] text-slate-500 font-normal">{description}</span>
            </div>

            <div className="flex items-center justify-between rounded-md border border-[#e5e7eb] bg-white p-1 h-9">
                <button
                    aria-label={`Decrement ${label}`}
                    className={cn(
                        "flex h-7 w-7 items-center justify-center rounded text-slate-600 transition-colors cursor-pointer",
                        isMinDisabled
                            ? "opacity-30 cursor-not-allowed bg-slate-100 text-slate-400"
                            : "hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200"
                    )}
                    disabled={isMinDisabled}
                    onClick={handleDecrement}
                    type="button"
                >
                    <Minus className="h-3.5 w-3.5" />
                </button>

                <span className="text-sm font-semibold text-slate-800 px-2 select-none">{value}</span>

                <button
                    aria-label={`Increment ${label}`}
                    className={cn(
                        "flex h-7 w-7 items-center justify-center rounded text-slate-600 transition-colors cursor-pointer",
                        isMaxDisabled
                            ? "opacity-30 cursor-not-allowed bg-slate-100 text-slate-400"
                            : "hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200"
                    )}
                    disabled={isMaxDisabled}
                    onClick={handleIncrement}
                    type="button"
                >
                    <Plus className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
}
