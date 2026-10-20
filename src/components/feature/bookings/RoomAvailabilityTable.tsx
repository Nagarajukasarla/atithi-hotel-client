import * as React from "react";
import { ChevronsUpDown } from "lucide-react";
import { BookRoomAction } from "@/components/feature/bookings/BookRoomAction";
import { RoomAvailabilityCard } from "@/components/feature/bookings/RoomAvailabilityCard";
import { RoomBedBadge } from "@/components/feature/bookings/RoomBedBadge";
import { TablePagination } from "@/components/feature/bookings/TablePagination";
import type { CandidateRoom, SortConfig, SortField } from "@/types/bookings";
import { cn } from "@/lib/utils";

export interface RoomAvailabilityTableProps {
    rooms: CandidateRoom[];
    onBookNow: (room: CandidateRoom) => void;
    isLoading?: boolean;
    className?: string;
}

export function RoomAvailabilityTable({ rooms, onBookNow, isLoading = false, className }: RoomAvailabilityTableProps) {
    const [sort, setSort] = React.useState<SortConfig>({
        field: "number",
        direction: "asc",
    });
    const [page, setPage] = React.useState<number>(1);
    const [pageSize, setPageSize] = React.useState<number>(10);

    const handleSort = (field: SortField) => {
        setSort(prev => ({
            field,
            direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    // Sort candidate rooms
    const sortedRooms = React.useMemo(() => {
        return [...rooms].sort((a, b) => {
            const dir = sort.direction === "asc" ? 1 : -1;
            if (sort.field === "number") {
                return (parseInt(a.number, 10) - parseInt(b.number, 10)) * dir;
            }
            if (sort.field === "floor") {
                return (a.floor - b.floor) * dir;
            }
            if (sort.field === "bedType") {
                return a.bedType.localeCompare(b.bedType) * dir;
            }
            return 0;
        });
    }, [rooms, sort]);

    // Paginate candidate rooms
    const paginatedRooms = React.useMemo(() => {
        const start = (page - 1) * pageSize;
        return sortedRooms.slice(start, start + pageSize);
    }, [sortedRooms, page, pageSize]);

    return (
        <div className={cn("space-y-4", className)}>
            {/* Desktop Table View (>=768px) */}
            <div className="hidden md:block rounded-xl border border-[#e2e8f0] bg-white shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-[#f8fafc] text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-[#e2e8f0]">
                            <tr>
                                <th className="py-3 px-4">
                                    <button
                                        aria-label="Sort by room number"
                                        className="flex items-center gap-1 hover:text-slate-900 transition-colors font-semibold uppercase cursor-pointer"
                                        onClick={() => handleSort("number")}
                                        type="button"
                                    >
                                        <span>Room Number</span>
                                        <ChevronsUpDown className="h-3.5 w-3.5 text-slate-400" />
                                    </button>
                                </th>
                                <th className="py-3 px-4">
                                    <button
                                        aria-label="Sort by bed type"
                                        className="flex items-center gap-1 hover:text-slate-900 transition-colors font-semibold uppercase cursor-pointer"
                                        onClick={() => handleSort("bedType")}
                                        type="button"
                                    >
                                        <span>Bed Type</span>
                                        <ChevronsUpDown className="h-3.5 w-3.5 text-slate-400" />
                                    </button>
                                </th>
                                <th className="py-3 px-4">
                                    <button
                                        aria-label="Sort by floor"
                                        className="flex items-center gap-1 hover:text-slate-900 transition-colors font-semibold uppercase cursor-pointer"
                                        onClick={() => handleSort("floor")}
                                        type="button"
                                    >
                                        <span>Room Floor</span>
                                        <ChevronsUpDown className="h-3.5 w-3.5 text-slate-400" />
                                    </button>
                                </th>
                                <th className="py-3 px-4">Room Facility</th>
                                <th className="py-3 px-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e2e8f0]">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, idx) => (
                                    <tr key={idx} className="animate-pulse">
                                        <td className="py-3.5 px-4">
                                            <div className="h-4 w-12 bg-slate-200 rounded-md" />
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <div className="h-5 w-24 bg-slate-200 rounded-full" />
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <div className="h-4 w-20 bg-slate-200 rounded-md" />
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <div className="h-3.5 w-48 bg-slate-200 rounded-md" />
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <div className="h-8 w-20 ml-auto bg-slate-200 rounded-md" />
                                        </td>
                                    </tr>
                                ))
                            ) : paginatedRooms.length === 0 ? (
                                <tr>
                                    <td className="py-8 text-center text-slate-400 font-medium" colSpan={5}>
                                        No candidate rooms available for the selected criteria.
                                    </td>
                                </tr>
                            ) : (
                                paginatedRooms.map(room => (
                                    <tr key={room.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-3.5 px-4 font-bold text-slate-800">#{room.number}</td>
                                        <td className="py-3.5 px-4">
                                            <RoomBedBadge bedType={room.bedType} />
                                        </td>
                                        <td className="py-3.5 px-4 font-medium text-slate-700">Floor - {room.floor}</td>
                                        <td className="py-3.5 px-4 max-w-[280px] text-slate-600 truncate">
                                            {room.facilities}
                                        </td>
                                        <td className="py-3.5 px-4 text-right">
                                            <BookRoomAction onBookNow={onBookNow} room={room} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="p-3 border-t border-[#e2e8f0] bg-slate-50/50">
                    <TablePagination
                        page={page}
                        pageSize={pageSize}
                        total={sortedRooms.length}
                        onChange={(p, ps) => {
                            setPage(p);
                            setPageSize(ps);
                        }}
                    />
                </div>
            </div>

            {/* Mobile Card List View (<768px) */}
            <div className="block md:hidden space-y-3">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, idx) => (
                        <div key={idx} className="rounded-lg border border-slate-200 bg-white p-4 space-y-3 animate-pulse shadow-xs">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                                <div className="h-4.5 w-16 bg-slate-200 rounded-md" />
                                <div className="h-5 w-24 bg-slate-200 rounded-full" />
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 w-28 bg-slate-200 rounded-md" />
                                <div className="h-3.5 w-48 bg-slate-200 rounded-md" />
                            </div>
                            <div className="pt-2 border-t border-slate-100 flex justify-end">
                                <div className="h-8 w-20 bg-slate-200 rounded-md" />
                            </div>
                        </div>
                    ))
                ) : paginatedRooms.length === 0 ? (
                    <div className="rounded-lg border border-slate-200 bg-white p-6 text-center text-xs text-slate-400 font-medium">
                        No candidate rooms available.
                    </div>
                ) : (
                    paginatedRooms.map(room => <RoomAvailabilityCard key={room.id} onBookNow={onBookNow} room={room} />)
                )}

                <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
                    <TablePagination
                        page={page}
                        pageSize={pageSize}
                        total={sortedRooms.length}
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
