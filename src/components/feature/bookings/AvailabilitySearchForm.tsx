import * as React from "react";
import { UserRound } from "lucide-react";
import { DateTimeField } from "@/components/feature/bookings/DateTimeField";
import { GuestCountStepper } from "@/components/feature/bookings/GuestCountStepper";
import { RoomTypeSelector } from "@/components/feature/bookings/RoomTypeSelector";
import type { AvailabilityQuery, RoomTypeOption } from "@/types/bookings";
import { cn } from "@/lib/utils";

export interface AvailabilitySearchFormProps {
    onSearch: (query: AvailabilityQuery) => void;
    isSearching?: boolean;
    className?: string;
}

const toLocalISOString = (date: Date): string => {
    const tzOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
};

function getDefaultDates() {
    const now = new Date();
    
    const tomorrow = new Date();
    tomorrow.setDate(now.getDate() + 1);

    return {
        checkIn: toLocalISOString(now),
        checkOut: toLocalISOString(tomorrow),
    };
}

export function AvailabilitySearchForm({ onSearch, isSearching = false, className }: AvailabilitySearchFormProps) {
    const defaults = getDefaultDates();

    const [roomType, setRoomType] = React.useState<RoomTypeOption>("Standard");
    const [checkIn, setCheckIn] = React.useState<string>(defaults.checkIn);
    const [checkOut, setCheckOut] = React.useState<string>(defaults.checkOut);
    const [adults, setAdults] = React.useState<number>(1);
    const [children, setChildren] = React.useState<number>(0);
    const [error, setError] = React.useState<string>("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const inDate = new Date(checkIn);
        const outDate = new Date(checkOut);

        if (isNaN(inDate.getTime()) || isNaN(outDate.getTime())) {
            setError("Please select valid check-in and check-out dates.");
            return;
        }

        if (outDate <= inDate) {
            setError("Check-out date and time must be after check-in date and time.");
            return;
        }

        const query: AvailabilityQuery = {
            roomType,
            checkIn: toLocalISOString(inDate),
            checkOut: toLocalISOString(outDate),
            adults,
            teens: 0,
            children,
        };

        onSearch(query);
    };

    return (
        <form
            className={cn("rounded-xl border border-[#e2e8f0] bg-white p-4 sm:p-5 shadow-xs space-y-4", className)}
            onSubmit={handleSubmit}
        >
            {error && <div className="rounded-md bg-red-50 p-3 text-xs text-red-600 font-medium">{error}</div>}

            {/* Row 1: Room Type Selector */}
            <div>
                <RoomTypeSelector value={roomType} onChange={setRoomType} />
            </div>

            {/* Row 2: Check-in & Check-out Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DateTimeField label="Check in" value={checkIn} onChange={setCheckIn} />
                <DateTimeField label="Check out" min={checkIn} value={checkOut} onChange={setCheckOut} />
            </div>

            {/* Row 3: Guest Counts Steppers & Submit Action */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                    <GuestCountStepper
                        description="Older than 18 years"
                        label="Adults"
                        max={10}
                        min={1}
                        value={adults}
                        onChange={setAdults}
                    />
                    <GuestCountStepper
                        description="0–12 years"
                        label="Children"
                        max={10}
                        min={0}
                        value={children}
                        onChange={setChildren}
                    />
                </div>

                <button
                    className="flex h-11 min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#2563eb] px-6 text-sm font-semibold text-white shadow-xs hover:bg-[#1d4ed8] active:bg-[#1e40af] transition-colors cursor-pointer w-full lg:w-auto shrink-0"
                    disabled={isSearching}
                    type="submit"
                >
                    <UserRound className="h-4 w-4" />
                    <span>{isSearching ? "Searching..." : "Check availability"}</span>
                </button>
            </div>
        </form>
    );
}
