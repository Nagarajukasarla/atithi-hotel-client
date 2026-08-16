import * as React from "react";
import { RoomBedBadge } from "@/components/feature/bookings/RoomBedBadge";
import { TablePagination } from "@/components/feature/bookings/TablePagination";
import type { ChannelReservation } from "@/types/bookings";
import { cn } from "@/lib/utils";

export interface OnlinePlatformBookingsViewProps {
    reservations: ChannelReservation[];
    className?: string;
}

export function OnlinePlatformBookingsView({ reservations, className }: OnlinePlatformBookingsViewProps) {
    const [page, setPage] = React.useState<number>(1);
    const [pageSize, setPageSize] = React.useState<number>(10);

    const paginatedReservations = React.useMemo(() => {
        const start = (page - 1) * pageSize;
        return reservations.slice(start, start + pageSize);
    }, [reservations, page, pageSize]);

    const formatShortDate = (dateStr: string) => {
        try {
            const d = new Date(dateStr);
            return d.toLocaleDateString([], {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch {
            return dateStr;
        }
    };

    const getStatusBadgeStyle = (status: string) => {
        switch (status) {
            case "Confirmed":
                return "bg-green-50 text-green-700 border-green-200";
            case "Checked In":
                return "bg-blue-50 text-blue-700 border-blue-200";
            case "Pending":
                return "bg-amber-50 text-amber-700 border-amber-200";
            case "Cancelled":
                return "bg-red-50 text-red-700 border-red-200";
            default:
                return "bg-slate-50 text-slate-700 border-slate-200";
        }
    };

    const getChannelBadgeStyle = (channel: string) => {
        switch (channel) {
            case "Booking.com":
                return "bg-blue-900 text-white";
            case "Agoda":
                return "bg-emerald-600 text-white";
            case "Expedia":
                return "bg-amber-500 text-slate-900 font-bold";
            case "Airbnb":
                return "bg-rose-500 text-white";
            default:
                return "bg-slate-800 text-white";
        }
    };

    return (
        <div className={cn("space-y-4", className)}>
            <div className="rounded-xl border border-slate-200 bg-blue-50/40 p-3 text-xs text-slate-600 font-medium flex items-center justify-between">
                <span>External Online Platform Allocations (OTAs & Direct Web Reservations)</span>
                <span className="text-slate-500 text-[11px]">Live Channel Feed</span>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block rounded-xl border border-[#e2e8f0] bg-white shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-[#f8fafc] text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-[#e2e8f0]">
                            <tr>
                                <th className="py-3 px-4">Booking Ref</th>
                                <th className="py-3 px-4">Channel</th>
                                <th className="py-3 px-4">Guest Name</th>
                                <th className="py-3 px-4">Room & Type</th>
                                <th className="py-3 px-4">Check-in / Check-out</th>
                                <th className="py-3 px-4">Amount</th>
                                <th className="py-3 px-4 text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e2e8f0]">
                            {paginatedReservations.length === 0 ? (
                                <tr>
                                    <td className="py-8 text-center text-slate-400 font-medium" colSpan={7}>
                                        Online platform reservations will appear here.
                                    </td>
                                </tr>
                            ) : (
                                paginatedReservations.map(res => (
                                    <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                                            {res.bookingNumber}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span
                                                className={cn(
                                                    "px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase",
                                                    getChannelBadgeStyle(res.channel)
                                                )}
                                            >
                                                {res.channel}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 font-medium text-slate-800">
                                            {res.guestName}
                                            <span className="block text-[11px] text-slate-400 font-normal">
                                                {res.guestCount} {res.guestCount === 1 ? "Guest" : "Guests"}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-1.5">
                                                <span className="font-bold text-slate-800">
                                                    {res.roomNumber ? `#${res.roomNumber}` : "Unassigned"}
                                                </span>
                                                <RoomBedBadge bedType={res.bedType} />
                                            </div>
                                            <span className="text-[11px] text-slate-500">
                                                {res.roomType} (Fl {res.floor})
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-slate-600">
                                            <div>In: {formatShortDate(res.checkIn)}</div>
                                            <div>Out: {formatShortDate(res.checkOut)}</div>
                                        </td>
                                        <td className="py-3.5 px-4 font-semibold text-slate-900">${res.amount}</td>
                                        <td className="py-3.5 px-4 text-right">
                                            <span
                                                className={cn(
                                                    "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
                                                    getStatusBadgeStyle(res.status)
                                                )}
                                            >
                                                {res.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-3 border-t border-[#e2e8f0] bg-slate-50/50">
                    <TablePagination
                        itemLabel="reservations"
                        page={page}
                        pageSize={pageSize}
                        total={reservations.length}
                        onChange={(p, ps) => {
                            setPage(p);
                            setPageSize(ps);
                        }}
                    />
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="block md:hidden space-y-3">
                {paginatedReservations.map(res => (
                    <div
                        key={res.id}
                        className="rounded-lg border border-slate-200 bg-white p-4 shadow-xs space-y-2 text-xs"
                    >
                        <div className="flex items-center justify-between">
                            <span
                                className={cn(
                                    "px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase",
                                    getChannelBadgeStyle(res.channel)
                                )}
                            >
                                {res.channel}
                            </span>
                            <span className="font-mono text-xs font-bold text-slate-800">{res.bookingNumber}</span>
                        </div>

                        <div className="flex justify-between items-baseline pt-1">
                            <span className="text-sm font-bold text-slate-800">{res.guestName}</span>
                            <span className="font-semibold text-slate-900 text-sm">${res.amount}</span>
                        </div>

                        <div className="flex items-center justify-between text-slate-600">
                            <span>
                                Room: {res.roomNumber ? `#${res.roomNumber}` : "Unassigned"} ({res.roomType})
                            </span>
                            <RoomBedBadge bedType={res.bedType} />
                        </div>

                        <div className="flex justify-between items-center text-slate-500 pt-1 border-t border-slate-100 text-[11px]">
                            <span>In: {formatShortDate(res.checkIn)}</span>
                            <span>Out: {formatShortDate(res.checkOut)}</span>
                        </div>

                        <div className="flex justify-end pt-1">
                            <span
                                className={cn(
                                    "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
                                    getStatusBadgeStyle(res.status)
                                )}
                            >
                                {res.status}
                            </span>
                        </div>
                    </div>
                ))}

                <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
                    <TablePagination
                        itemLabel="reservations"
                        page={page}
                        pageSize={pageSize}
                        total={reservations.length}
                        onChange={(p, ps) => {
                            setPage(p);
                            setPageSize(ps);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
