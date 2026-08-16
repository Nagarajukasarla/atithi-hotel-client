import type * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RateDisplayProps {
    value: number | string;
    unit: string;
    currency?: string;
    icon?: React.ReactNode;
    className?: string;
}

export function RateDisplay({ value, unit, currency, icon, className }: RateDisplayProps) {
    return (
        <div className={cn("inline-flex items-center gap-1.5", className)}>
            <span className="text-[#2563eb] shrink-0" aria-hidden="true">
                {icon || <Clock className="h-4 w-4" />}
            </span>
            <div className="inline-flex items-baseline gap-1">
                <span className="text-[18px] font-semibold text-[#2563eb] leading-none">
                    {currency}
                    {value}
                </span>
                <span className="text-xs text-[#858d9d] leading-none">{unit}</span>
            </div>
        </div>
    );
}
