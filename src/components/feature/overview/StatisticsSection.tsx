import type * as React from "react";
import { cn } from "@/lib/utils";

export interface StatisticsSectionProps {
    title: string;
    headerAction?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
    bodyClassName?: string;
}

export function StatisticsSection({ title, headerAction, children, className, bodyClassName }: StatisticsSectionProps) {
    return (
        <section className={cn("rounded-[8px] bg-white p-4 shadow-[0_0_8px_rgba(0,0,0,0.05)]", className)}>
            <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="text-[1.1rem] font-semibold text-[#1e293b] leading-tight">{title}</h2>
                {headerAction ? <div>{headerAction}</div> : null}
            </div>
            <div className={cn("w-full", bodyClassName)}>{children}</div>
        </section>
    );
}
