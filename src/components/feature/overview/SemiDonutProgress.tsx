import { cn } from "@/lib/utils";

export interface SemiDonutProgressProps {
    value: number;
    label?: string;
    color?: string;
    trackColor?: string;
    className?: string;
}

export function SemiDonutProgress({
    value,
    label = "Completion percentage",
    color = "#2f80ed",
    trackColor = "#f0f2f5",
    className,
}: SemiDonutProgressProps) {
    // Clamp value between 0 and 100
    const clampedValue = Math.min(100, Math.max(0, value));

    // Arc math for 180-degree semi-donut:
    // Radius R = 65, center (100, 85), strokeWidth = 14
    // Semi-circle circumference = Math.PI * R = 3.14159 * 65 ≈ 204.2
    const R = 65;
    const circumference = Math.PI * R;
    const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

    return (
        <div
            className={cn("relative flex flex-col items-center justify-center w-full max-w-[220px] mx-auto", className)}
        >
            <span className="sr-only">
                {label}: {clampedValue}%
            </span>

            <svg aria-hidden="true" className="w-full h-auto overflow-visible" viewBox="0 0 200 110">
                {/* Track Arc (180° background) */}
                <path
                    d="M 35 85 A 65 65 0 0 1 165 85"
                    fill="none"
                    stroke={trackColor}
                    strokeLinecap="round"
                    strokeWidth="14"
                />

                {/* Progress Arc (180° gauge value) */}
                <path
                    d="M 35 85 A 65 65 0 0 1 165 85"
                    fill="none"
                    stroke={color}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    strokeWidth="14"
                    style={{ transition: "stroke-dashoffset 0.5s ease-in-out" }}
                />

                {/* Center Percentage Display */}
                <text
                    className="text-2xl font-bold fill-[#1e293b]"
                    dominantBaseline="middle"
                    textAnchor="middle"
                    x="100"
                    y="80"
                >
                    {clampedValue}%
                </text>
            </svg>
        </div>
    );
}
