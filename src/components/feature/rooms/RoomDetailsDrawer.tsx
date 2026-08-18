import * as React from "react";
import { X, Edit2, Trash2 } from "lucide-react";
import { GuestItem } from "@/components/feature/rooms/GuestItem";
import type { BookingOrder, Room, RoomStateType, RoomStatusType } from "@/types/rooms";
import { cn } from "@/lib/utils";

export interface RoomDetailsDrawerProps {
    room: Room | null;
    bookingOrder?: BookingOrder;
    onClose: () => void;
    onUpdateRoom?: (roomId: string, updates: Partial<Room>) => void;
    onDeleteRoom?: (roomId: string) => void;
    onEditRoom?: (room: Room) => void;
    onUpdatePayment?: (bookingId: string, payload: any) => Promise<boolean>;
}

const ALL_ROOM_STATUSES: RoomStatusType[] = ["Occupied", "Vacant", "Stay Over", "Check Out", "Check In"];

const ALL_ROOM_STATES: RoomStateType[] = ["Clean", "Dirty", "Inspected", "Out of Service", "Out of Order"];

const statusStyles: Record<RoomStatusType, { bg: string; border: string; text: string }> = {
    Vacant: { bg: "bg-white", border: "border-[#e2e8f0]", text: "text-[#1a202c]" },
    Occupied: { bg: "bg-[#ebf5ff]", border: "border-[#3b82f6]", text: "text-[#1e3a8a]" },
    "Stay Over": { bg: "bg-[#fff7ed]", border: "border-[#f97316]", text: "text-[#9a3412]" },
    "Check In": { bg: "bg-[#f0fdf4]", border: "border-[#10b981]", text: "text-[#065f46]" },
    "Check Out": { bg: "bg-[#fef2f2]", border: "border-[#ef4444]", text: "text-[#991b1b]" },
};

const stateStyles: Record<RoomStateType, { bg: string; border: string; text: string }> = {
    Clean: { bg: "bg-[#f0fdf4]", border: "border-[#10b981]", text: "text-[#065f46]" },
    Dirty: { bg: "bg-[#fef2f2]", border: "border-[#ef4444]", text: "text-[#991b1b]" },
    Inspected: { bg: "bg-[#ebf5ff]", border: "border-[#3b82f6]", text: "text-[#1e3a8a]" },
    "Out of Service": { bg: "bg-slate-100", border: "border-slate-300", text: "text-slate-700" },
    "Out of Order": { bg: "bg-slate-400", border: "border-slate-600", text: "text-white" },
};

export function RoomDetailsDrawer({
    room,
    bookingOrder,
    onClose,
    onUpdateRoom,
    onDeleteRoom,
    onEditRoom,
    onUpdatePayment,
}: RoomDetailsDrawerProps) {
    // Payment editing states
    const [isEditingPayment, setIsEditingPayment] = React.useState<boolean>(false);
    const [paymentMethod, setPaymentMethod] = React.useState<"CASH" | "ONLINE">("CASH");
    const [paymentTotalAmount, setPaymentTotalAmount] = React.useState<number>(0);
    const [paymentAmountPaid, setPaymentAmountPaid] = React.useState<number>(0);
    const [isPaymentCompleted, setIsPaymentCompleted] = React.useState<boolean>(true);
    const [paymentTransactionId, setPaymentTransactionId] = React.useState<string>("");
    const [isSavingPayment, setIsSavingPayment] = React.useState<boolean>(false);

    // Sync payment details when bookingOrder updates
    React.useEffect(() => {
        if (bookingOrder) {
            if (bookingOrder.payment) {
                setPaymentMethod(bookingOrder.payment.paymentMethod);
                setPaymentTotalAmount(bookingOrder.payment.totalAmount);
                setPaymentAmountPaid(bookingOrder.payment.amountPaid);
                setIsPaymentCompleted(bookingOrder.payment.status === "COMPLETED");
                setPaymentTransactionId(bookingOrder.payment.transactionId || "");
            } else {
                setPaymentMethod("CASH");
                setPaymentTotalAmount(room?.basePrice || 0);
                setPaymentAmountPaid(room?.basePrice || 0);
                setIsPaymentCompleted(true);
                setPaymentTransactionId("");
            }
            setIsEditingPayment(false);
        }
    }, [bookingOrder, room]);

    // Listen for Escape key to close drawer
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    if (!room) return null;

    const formatDateTime = (dateStr?: string) => {
        if (!dateStr) return "N/A";
        const d = new Date(dateStr);
        return d.toLocaleString([], {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatLastCleaned = (dateStr?: string) => {
        if (!dateStr) return "";
        const parsed = Date.parse(dateStr);
        if (isNaN(parsed)) {
            return dateStr;
        }
        // Only format string if it contains ISO date-like characters
        const isIsoOrTimestamp = /[-T:]/.test(dateStr);
        if (!isIsoOrTimestamp) {
            return dateStr;
        }
        const d = new Date(parsed);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        const hh = String(d.getHours()).padStart(2, "0");
        const min = String(d.getMinutes()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
    };

    return (
        <aside
            aria-label={`Room ${room.number} Details`}
            className={cn(
                "fixed right-0 top-[66px] bottom-0 z-30 w-full sm:w-[400px] bg-white shadow-[-4px_0_15px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-in-out flex flex-col border-l border-slate-200",
                room ? "translate-x-0" : "translate-x-full"
            )}
        >
            {/* Header */}
            <div className="relative flex items-center justify-between px-[15px] py-4 border-b border-slate-200">
                <h2 className="text-xl font-semibold text-slate-800">Room {room.number} Details</h2>
                <button
                    aria-label="Close details"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                    onClick={onClose}
                    type="button"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-[15px] py-[20px] space-y-5">
                {/* Basic Meta */}
                <div className="space-y-2 text-sm">
                    {room.lastCleaned && (
                        <div className="flex items-center">
                            <span className="w-[100px] text-slate-500 font-medium shrink-0">Last Cleaned</span>
                            <span className="text-slate-800 font-medium">{formatLastCleaned(room.lastCleaned)}</span>
                        </div>
                    )}

                    {room.basePrice !== undefined && (
                        <div className="flex items-center">
                            <span className="w-[100px] text-slate-500 font-medium shrink-0">Price</span>
                            <span className="text-slate-800 font-medium">₹{room.basePrice.toLocaleString()}</span>
                        </div>
                    )}

                    {room.notes && (
                        <div className="rounded-[6px] bg-slate-50 border border-slate-200/80 p-3 text-xs text-slate-700">
                            <span className="font-semibold text-slate-800 block mb-1">Notes:</span>
                            {room.notes}
                        </div>
                    )}
                </div>

                {/* Booking Duration */}
                {bookingOrder && (
                    <div className="rounded-md border border-slate-200 bg-slate-50 p-3.5 space-y-2 text-xs">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                            <span className="font-semibold text-slate-800 text-sm">Booking Duration</span>
                            {bookingOrder.isHourly && (
                                <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600">
                                    Hourly
                                </span>
                            )}
                        </div>
                        <div className="flex justify-between items-center text-slate-600">
                            <span>Check-in</span>
                            <span className="font-medium text-slate-800">
                                {formatDateTime(bookingOrder.duration.start)}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600">
                            <span>Check-out</span>
                            <span className="font-medium text-slate-800">
                                {formatDateTime(bookingOrder.duration.end)}
                            </span>
                        </div>
                        {bookingOrder.actualCheckOut && (
                            <div className="flex justify-between items-center text-emerald-600 font-semibold pt-1 border-t border-slate-200/50">
                                <span>Actual Checkout</span>
                                <span className="font-bold text-emerald-800">
                                    {formatDateTime(bookingOrder.actualCheckOut)}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Payment Details Section */}
                {bookingOrder && (
                    <div className="rounded-md border border-slate-200 bg-slate-50 p-3.5 space-y-3 text-xs">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                            <span className="font-semibold text-slate-800 text-sm">Payment Status</span>
                            {bookingOrder.payment ? (
                                <span className={cn(
                                    "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                                    bookingOrder.payment.status === "COMPLETED"
                                        ? "bg-green-100 text-green-700 border border-green-200"
                                        : "bg-amber-100 text-amber-700 border border-amber-200"
                                )}>
                                    {bookingOrder.payment.status}
                                </span>
                            ) : (
                                <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-600 border border-red-200">
                                    UNPAID / PENDING
                                </span>
                            )}
                        </div>

                        {!isEditingPayment ? (
                            <div className="space-y-2">
                                {bookingOrder.payment ? (
                                    <>
                                        <div className="flex justify-between items-center text-slate-600">
                                            <span>Original Amount</span>
                                            <span className="font-semibold text-slate-800">
                                                ₹{bookingOrder.payment.totalAmount.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-slate-600">
                                            <span>Amount Paid</span>
                                            <span className="font-semibold text-slate-800">
                                                ₹{bookingOrder.payment.amountPaid.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-slate-600">
                                            <span>Payment Method</span>
                                            <span className="font-medium text-slate-800">
                                                {bookingOrder.payment.paymentMethod}
                                            </span>
                                        </div>
                                        {bookingOrder.payment.transactionId && (
                                            <div className="flex justify-between items-center text-slate-600 text-[11px] pt-0.5">
                                                <span>Ref ID</span>
                                                <span className="font-mono text-slate-700 select-all font-medium">
                                                    {bookingOrder.payment.transactionId}
                                                </span>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <p className="text-slate-500 italic py-1">No payment details recorded yet.</p>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setIsEditingPayment(true)}
                                    className="w-full text-center mt-2 rounded bg-white border border-slate-200 hover:bg-slate-50 py-1.5 text-[11px] font-bold text-blue-600 transition-colors cursor-pointer outline-none"
                                >
                                    {bookingOrder.payment ? "Update Payment Details" : "Record Payment"}
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3 pt-1">
                                <div className="space-y-2">
                                    {/* Payment Method */}
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-500 block">Method *</label>
                                        <select
                                            className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-xs"
                                            value={paymentMethod}
                                            onChange={e => setPaymentMethod(e.target.value as any)}
                                        >
                                            <option value="CASH">Cash</option>
                                            <option value="ONLINE">Online</option>
                                        </select>
                                    </div>

                                    {/* Original Amount */}
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-500 block">Total Original (₹) *</label>
                                        <input
                                            type="number"
                                            className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-xs"
                                            value={paymentTotalAmount}
                                            onChange={e => setPaymentTotalAmount(parseFloat(e.target.value) || 0)}
                                        />
                                    </div>

                                    {/* Amount Paid */}
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase text-slate-500 block">Amount Paid (₹) *</label>
                                        <input
                                            type="number"
                                            className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-xs"
                                            value={paymentAmountPaid}
                                            onChange={e => setPaymentAmountPaid(parseFloat(e.target.value) || 0)}
                                        />
                                    </div>

                                    {/* Transaction ID */}
                                    {paymentMethod === "ONLINE" && (
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold uppercase text-slate-500 block">Reference ID</label>
                                            <input
                                                type="text"
                                                placeholder="UPI/Reference Number"
                                                className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-xs"
                                                value={paymentTransactionId}
                                                onChange={e => setPaymentTransactionId(e.target.value)}
                                            />
                                        </div>
                                    )}

                                    {/* Mark Done checkbox */}
                                    <div className="flex items-center gap-1.5 pt-1">
                                        <input
                                            type="checkbox"
                                            id="drawer-payment-completed"
                                            checked={isPaymentCompleted}
                                            onChange={e => setIsPaymentCompleted(e.target.checked)}
                                            className="h-3.5 w-3.5 cursor-pointer text-blue-600 rounded-xs border-slate-300"
                                        />
                                        <label htmlFor="drawer-payment-completed" className="text-[11px] font-semibold text-slate-700 cursor-pointer selection:bg-transparent">
                                            Mark Payment as Completed
                                        </label>
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2 border-t border-slate-200/50 mt-1">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingPayment(false)}
                                        className="flex-1 rounded border border-slate-200 bg-white hover:bg-slate-50 py-1 font-bold text-slate-600 transition-all cursor-pointer text-center outline-none"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        disabled={isSavingPayment}
                                        onClick={async () => {
                                            if (!onUpdatePayment) return;
                                            setIsSavingPayment(true);
                                            const success = await onUpdatePayment(bookingOrder.id, {
                                                paymentMethod,
                                                totalAmount: paymentTotalAmount,
                                                amountPaid: paymentAmountPaid,
                                                status: isPaymentCompleted ? "COMPLETED" : "PENDING",
                                                transactionId: paymentMethod === "ONLINE" ? paymentTransactionId.trim() : undefined,
                                            });
                                            setIsSavingPayment(false);
                                            if (success) {
                                                setIsEditingPayment(false);
                                            }
                                        }}
                                        className="flex-1 rounded bg-blue-600 hover:bg-blue-700 py-1 font-bold text-white transition-all cursor-pointer text-center outline-none disabled:opacity-50"
                                    >
                                        {isSavingPayment ? "Saving..." : "Save"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Guests Section */}
                {bookingOrder?.guests && bookingOrder.guests.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="text-xs font-semibold uppercase tracking-[0.5px] text-slate-500">
                            Guests ({bookingOrder.guests.length})
                        </h3>
                        <div className="space-y-2">
                            {bookingOrder.guests.map(guest => (
                                <GuestItem key={guest.id} guest={guest} />
                            ))}
                        </div>
                    </div>
                )}

                <hr className="border-slate-200 my-4" />

                {/* Reference Group 1: ROOM STATUS */}
                <div className="space-y-2">
                    <h3 className="text-[13px] font-semibold uppercase tracking-[0.5px] text-slate-500">ROOM STATUS</h3>
                    <div className="flex flex-wrap gap-1.5">
                        {ALL_ROOM_STATUSES.map(status => {
                            const active = room.roomStatus === status;
                            const style = statusStyles[status];
                            return (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => onUpdateRoom?.(room.id, { roomStatus: status })}
                                    className={cn(
                                        "rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer outline-none",
                                        active
                                            ? `${style.bg} ${style.border} ${style.text} font-semibold shadow-xs`
                                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                    )}
                                >
                                    {status}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Reference Group 2: ROOM CONDITION */}
                <div className="space-y-2">
                    <h3 className="text-[13px] font-semibold uppercase tracking-[0.5px] text-slate-500">
                        ROOM CONDITION
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                        {ALL_ROOM_STATES.map(state => {
                            const active = room.roomState === state;
                            const style = stateStyles[state];
                            return (
                                <button
                                    key={state}
                                    type="button"
                                    onClick={() => onUpdateRoom?.(room.id, { roomState: state })}
                                    className={cn(
                                        "rounded-full border px-3 py-1 text-xs font-medium transition-colors cursor-pointer outline-none",
                                        active
                                            ? `${style.bg} ${style.border} ${style.text} font-semibold shadow-xs`
                                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                    )}
                                >
                                    {state}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Reference Group 3: ROOM TYPE */}
                <div className="space-y-2">
                    <h3 className="text-[13px] font-semibold uppercase tracking-[0.5px] text-slate-500">ROOM CATEGORY</h3>
                    <div className="flex flex-wrap pt-0.5">
                        <span className="rounded-full bg-slate-50 border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700">
                            {room.roomType} (Capacity: {room.capacity} Guests)
                        </span>
                    </div>
                </div>

                {/* Edit & Delete Action Panel */}
                <div className="pt-6 border-t border-slate-100 mt-6 flex gap-3">
                    <button
                        type="button"
                        onClick={() => onEditRoom?.(room)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-blue-200 text-blue-600 bg-blue-50/10 px-3.5 py-2.5 text-xs font-bold hover:bg-blue-50/30 transition-all cursor-pointer text-center outline-none"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit Room
                    </button>
                    <button
                        type="button"
                        onClick={() => onDeleteRoom?.(room.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-rose-200 text-rose-600 bg-rose-50/10 px-3.5 py-2.5 text-xs font-bold hover:bg-rose-50/30 transition-all cursor-pointer text-center outline-none"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Room
                    </button>
                </div>
            </div>
        </aside>
    );
}
