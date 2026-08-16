import { cn } from "@/lib/utils";

export interface CustomerReviewCardProps {
    name: string;
    roomNumber: string;
    message: string;
    className?: string;
}

export function CustomerReviewCard({ name, roomNumber, message, className }: CustomerReviewCardProps) {
    return (
        <div
            className={cn(
                "py-[10px] border-b border-[#eeeeee] last:border-b-0 flex flex-col justify-center",
                className
            )}
        >
            <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-[#1e293b]">{name}</span>
                <span className="text-xs font-semibold text-[#2f80ed] bg-[#f2f8ff] px-2 py-0.5 rounded-full shrink-0">
                    {roomNumber}
                </span>
            </div>
            <p className="text-[13px] text-[#666666] leading-normal mt-1">{message}</p>
        </div>
    );
}
