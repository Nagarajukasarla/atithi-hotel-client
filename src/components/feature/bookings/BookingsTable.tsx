
import { User, Coins, Check, LogOut, Edit2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BookingsTableProps {
    bookings: any[];
    onEdit: (booking: any) => void;
    onPay: (booking: any) => void;
    onCheckIn: (bookingId: string) => void;
    onCheckOut: (bookingId: string) => void;
}

export function BookingsTable({
    bookings,
    onEdit,
    onPay,
    onCheckIn,
    onCheckOut,
}: BookingsTableProps) {
    const formatDateTime = (dateStr?: string) => {
        if (!dateStr) return "N/A";
        const d = new Date(dateStr);
        return d.toLocaleString([], {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-3">Room</th>
                            <th className="px-4 py-3">Guests</th>
                            <th className="px-4 py-3">Duration</th>
                            <th className="px-4 py-3">Billing</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {bookings.map((booking) => {
                            const roomNum = booking.room?.roomNumber || booking.roomNumber || "N/A";
                            const primaryGuest = booking.guests?.[0] || { name: "Guest" };
                            const guestCount = booking.guests?.length || 1;
                            
                            const isPaid = booking.payment?.status === "COMPLETED";
                            const amountOwed = booking.totalPrice - (booking.payment?.amountPaid || 0);

                            return (
                                <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                                    {/* Room Info */}
                                    <td className="px-4 py-4.5">
                                        <div className="font-bold text-slate-800 text-sm">
                                            Room {roomNum}
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                                            ID: #{booking.id} {booking.isHourly ? "(Hourly)" : "(Daily)"}
                                        </div>
                                    </td>

                                    {/* Guest Info */}
                                    <td className="px-4 py-4.5">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                                                <User className="h-3.5 w-3.5" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-800">
                                                    {primaryGuest.name}
                                                </div>
                                                <div className="text-[10px] text-slate-500 mt-0.5">
                                                    {primaryGuest.mobileNumber} {guestCount > 1 && `(+${guestCount - 1} other)`}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Duration Info */}
                                    <td className="px-4 py-4.5">
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-1.5 text-slate-600">
                                                <span className="font-medium text-slate-800">In:</span>
                                                <span>{formatDateTime(booking.checkIn)}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-600">
                                                <span className="font-medium text-slate-800">Out (Sch):</span>
                                                <span>{formatDateTime(booking.checkOut)}</span>
                                            </div>
                                            {booking.actualCheckOut && (
                                                <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                                                    <span className="font-bold text-emerald-800">Out (Act):</span>
                                                    <span>{formatDateTime(booking.actualCheckOut)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    {/* Billing and Payments */}
                                    <td className="px-4 py-4.5">
                                        <div>
                                            <div className="font-bold text-slate-800">
                                                ₹{booking.totalPrice.toLocaleString()}
                                            </div>
                                            <div className="mt-1 flex items-center gap-1.5">
                                                <span className={cn(
                                                    "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider",
                                                    isPaid 
                                                        ? "bg-green-50 text-green-700 border border-green-200"
                                                        : "bg-amber-50 text-amber-750 border border-amber-250"
                                                )}>
                                                    {isPaid ? "Paid" : "Pending"}
                                                </span>
                                                {!isPaid && amountOwed > 0 && (
                                                    <span className="text-[10px] font-semibold text-rose-600">
                                                        (Owes ₹{amountOwed.toLocaleString()})
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Booking Status */}
                                    <td className="px-4 py-4.5">
                                        <span className={cn(
                                            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                                            booking.status === "CONFIRMED" && "bg-blue-50 border-blue-200 text-blue-700",
                                            booking.status === "CHECKED_IN" && "bg-emerald-50 border-emerald-250 text-emerald-850",
                                            booking.status === "CHECKED_OUT" && "bg-slate-100 border-slate-200 text-slate-500",
                                            booking.status === "CANCELLED" && "bg-rose-50 border-rose-250 text-rose-750"
                                        )}>
                                            {booking.status.replace("_", " ")}
                                        </span>
                                    </td>

                                    {/* Action Panel */}
                                    <td className="px-4 py-4.5 text-right space-x-1.5 whitespace-nowrap">
                                        {/* Edit Booking Button */}
                                        {(booking.status === "CONFIRMED" || booking.status === "CHECKED_IN") && (
                                            <button
                                                type="button"
                                                onClick={() => onEdit(booking)}
                                                className="inline-flex items-center gap-1 rounded-[6px] border border-blue-200 bg-blue-50/50 hover:bg-blue-100/50 px-2.5 py-1.5 text-[10px] font-bold text-blue-700 transition-all cursor-pointer outline-none"
                                                title="Edit booking parameters and guest information"
                                            >
                                                <Edit2 className="h-3 w-3" />
                                                Edit
                                            </button>
                                        )}

                                        {/* View Booking Button */}
                                        {(booking.status === "CHECKED_OUT" || booking.status === "CANCELLED") && (
                                            <button
                                                type="button"
                                                onClick={() => onEdit(booking)}
                                                className="inline-flex items-center gap-1 rounded-[6px] border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1.5 text-[10px] font-bold text-slate-700 transition-all cursor-pointer outline-none"
                                                title="View booking details"
                                            >
                                                <Eye className="h-3 w-3" />
                                                View
                                            </button>
                                        )}

                                        {/* Record Payment Button */}
                                        {!isPaid && (booking.status === "CONFIRMED" || booking.status === "CHECKED_IN") && (
                                            <button
                                                type="button"
                                                onClick={() => onPay(booking)}
                                                className="inline-flex items-center gap-1 rounded-[6px] border border-amber-200 bg-amber-50 hover:bg-amber-100/70 px-2.5 py-1.5 text-[10px] font-bold text-amber-800 transition-all cursor-pointer outline-none"
                                                title="Record guest payment"
                                            >
                                                <Coins className="h-3 w-3" />
                                                Pay
                                            </button>
                                        )}

                                        {/* Check-in Actions */}
                                        {booking.status === "CONFIRMED" && (
                                            <button
                                                type="button"
                                                onClick={() => onCheckIn(String(booking.id))}
                                                className="inline-flex items-center gap-1 rounded-[6px] bg-blue-600 hover:bg-blue-700 px-3 py-1.5 text-[10px] font-bold text-white shadow-2xs hover:-translate-y-0.5 transition-all cursor-pointer outline-none"
                                            >
                                                <Check className="h-3 w-3" />
                                                Check In
                                            </button>
                                        )}

                                        {/* Check-out Actions */}
                                        {booking.status === "CHECKED_IN" && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (!isPaid && !confirm(`Warning: This booking has an outstanding payment of ₹${amountOwed.toLocaleString()}.\nDo you still want to check out?`)) {
                                                        return;
                                                    }
                                                    void onCheckOut(String(booking.id));
                                                }}
                                                className="inline-flex items-center gap-1 rounded-[6px] bg-rose-600 hover:bg-rose-700 px-3 py-1.5 text-[10px] font-bold text-white shadow-2xs hover:-translate-y-0.5 transition-all cursor-pointer outline-none"
                                            >
                                                <LogOut className="h-3 w-3" />
                                                Check Out
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
