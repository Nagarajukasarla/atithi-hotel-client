import * as React from "react";
import { 
    Receipt, Search, Eye, Edit3, IndianRupee, RefreshCw, X, 
    Coins 
} from "lucide-react";
import { bookingService } from "@/api/booking-service";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface BookingRecord {
    id: number;
    hotelId: number;
    roomId: number;
    roomNumber: string;
    checkIn: string;
    checkOut: string;
    isHourly: boolean;
    totalPrice: number;
    status: string;
    guests: Array<{
        id: number;
        name: string;
        aadhaarNumber: string;
        mobileNumber: string;
        age: number;
        address: string;
    }>;
    payment?: {
        id: number;
        paymentMethod: "CASH" | "ONLINE";
        totalAmount: number;
        amountPaid: number;
        status: "COMPLETED" | "PENDING";
        paymentDate: string;
        transactionId?: string;
    };
}

export function PaymentsPage() {
    const { toast } = useToast();
    const [bookings, setBookings] = React.useState<BookingRecord[]>([]);
    const [filteredBookings, setFilteredBookings] = React.useState<BookingRecord[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [searchQuery, setSearchQuery] = React.useState<string>("");
    const [statusFilter, setStatusFilter] = React.useState<string>("ALL");
    const [notification, setNotification] = React.useState<string>("");

    // Modal view / edit states
    const [selectedBooking, setSelectedBooking] = React.useState<BookingRecord | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
    const [isEditMode, setIsEditMode] = React.useState<boolean>(false);
    const [isSaving, setIsSaving] = React.useState<boolean>(false);

    // Edit form states
    const [editTotalPrice, setEditTotalPrice] = React.useState<number>(0);
    const [editCheckIn, setEditCheckIn] = React.useState<string>("");
    const [editCheckOut, setEditCheckOut] = React.useState<string>("");
    const [editIsHourly, setEditIsHourly] = React.useState<boolean>(false);
    const [editGuests, setEditGuests] = React.useState<Array<{
        id?: number;
        name: string;
        aadhaarNumber: string;
        mobileNumber: string;
        age: string;
        address: string;
    }>>([]);

    // Payment edit states
    const [editPaymentMethod, setEditPaymentMethod] = React.useState<"CASH" | "ONLINE">("CASH");
    const [editPaymentTotalAmount, setEditPaymentTotalAmount] = React.useState<number>(0);
    const [editPaymentAmountPaid, setEditPaymentAmountPaid] = React.useState<number>(0);
    const [editIsPaymentCompleted, setEditIsPaymentCompleted] = React.useState<boolean>(true);
    const [editPaymentTransactionId, setEditPaymentTransactionId] = React.useState<string>("");

    const loadBookings = React.useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await bookingService.getAllBookings();
            if (res.success && res.data) {
                setBookings(res.data);
                setFilteredBookings(res.data);
            } else {
                setNotification(res.message || "Failed to load transaction history.");
            }
        } catch (error) {
            console.error("Failed to load bookings:", error);
            setNotification("Failed to fetch bookings list.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    React.useEffect(() => {
        void loadBookings();
    }, [loadBookings]);

    // Handle searching and filtering
    React.useEffect(() => {
        let results = bookings;

        if (searchQuery.trim() !== "") {
            const q = searchQuery.toLowerCase().trim();
            results = results.filter(b => 
                String(b.id).includes(q) ||
                b.roomNumber.toLowerCase().includes(q) ||
                b.guests.some(g => g.name.toLowerCase().includes(q) || g.mobileNumber.includes(q))
            );
        }

        if (statusFilter !== "ALL") {
            results = results.filter(b => {
                const status = b.payment ? b.payment.status : "PENDING";
                return status === statusFilter;
            });
        }

        setFilteredBookings(results);
    }, [searchQuery, statusFilter, bookings]);

    // Summary Card Metrics
    const metrics = React.useMemo(() => {
        let totalReceived = 0;
        let totalPending = 0;
        
        bookings.forEach(b => {
            if (b.payment) {
                totalReceived += b.payment.amountPaid;
                const pending = b.payment.totalAmount - b.payment.amountPaid;
                if (pending > 0) {
                    totalPending += pending;
                }
            } else {
                totalPending += b.totalPrice;
            }
        });

        return {
            totalReceived,
            totalPending,
            totalCount: bookings.length
        };
    }, [bookings]);

    const handleOpenModal = (booking: BookingRecord) => {
        setSelectedBooking(booking);
        setIsModalOpen(true);
        setIsEditMode(false);

        // Populate edit state
        setEditTotalPrice(booking.totalPrice);
        setEditCheckIn(booking.checkIn.substring(0, 16));
        setEditCheckOut(booking.checkOut.substring(0, 16));
        setEditIsHourly(booking.isHourly);
        
        setEditGuests(booking.guests.map(g => ({
            id: g.id,
            name: g.name,
            aadhaarNumber: g.aadhaarNumber,
            mobileNumber: g.mobileNumber,
            age: String(g.age || ""),
            address: g.address || ""
        })));

        if (booking.payment) {
            setEditPaymentMethod(booking.payment.paymentMethod);
            setEditPaymentTotalAmount(booking.payment.totalAmount);
            setEditPaymentAmountPaid(booking.payment.amountPaid);
            setEditIsPaymentCompleted(booking.payment.status === "COMPLETED");
            setEditPaymentTransactionId(booking.payment.transactionId || "");
        } else {
            setEditPaymentMethod("CASH");
            setEditPaymentTotalAmount(booking.totalPrice);
            setEditPaymentAmountPaid(booking.totalPrice);
            setEditIsPaymentCompleted(true);
            setEditPaymentTransactionId("");
        }
    };

    const handleSaveChanges = async () => {
        if (!selectedBooking) return;
        
        // Validation check
        if (editGuests.length === 0 || !editGuests[0].name.trim()) {
            toast("Primary guest name is required", "error");
            return;
        }

        setIsSaving(true);
        try {
            // 1. Save Booking & Guest updates
            const bookingPayload = {
                totalPrice: editTotalPrice,
                checkIn: editCheckIn,
                checkOut: editCheckOut,
                isHourly: editIsHourly,
                guests: editGuests.map(g => ({
                    name: g.name.trim(),
                    aadhaarNumber: g.aadhaarNumber.trim(),
                    mobileNumber: g.mobileNumber.trim(),
                    age: parseInt(g.age, 10) || 30,
                    address: g.address.trim() || null
                }))
            };

            const bookingRes = await bookingService.updateBooking(String(selectedBooking.id), bookingPayload);

            if (bookingRes.success) {
                // 2. Save Payment details
                const paymentPayload = {
                    paymentMethod: editPaymentMethod,
                    totalAmount: editPaymentTotalAmount,
                    amountPaid: editPaymentAmountPaid,
                    status: editIsPaymentCompleted ? "COMPLETED" : "PENDING",
                    transactionId: editPaymentMethod === "ONLINE" ? editPaymentTransactionId.trim() : null
                };

                const paymentRes = await bookingService.createOrUpdatePayment(String(selectedBooking.id), paymentPayload);
                
                if (paymentRes.success) {
                    toast("Transaction details successfully updated!", "success");
                    setIsModalOpen(false);
                    void loadBookings();
                } else {
                    toast(paymentRes.message || "Failed to update payment details", "error");
                }
            } else {
                toast(bookingRes.message || "Failed to update guest details", "error");
            }
        } catch (error) {
            console.error("Save failure:", error);
            toast("An error occurred while saving modifications.", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const formatDateTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    };

    return (
        <main aria-label="Payments Ledger Dashboard" className="min-h-full w-full bg-[#f2f8ff] text-slate-800 p-4 sm:p-5 space-y-5">
            {/* Top glassmorphic statistics widget card container */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Collected Amount widget */}
                <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white shadow-md relative overflow-hidden flex flex-col justify-between min-h-[120px]">
                    <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 text-white/10 select-none">
                        <IndianRupee className="h-32 w-32" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-100/90 block">Total Payments Received</span>
                    <div>
                        <div className="flex items-baseline gap-1 mt-2">
                            <span className="text-3xl font-extrabold">₹{metrics.totalReceived.toLocaleString("en-IN")}</span>
                        </div>
                        <p className="text-[10px] text-emerald-100/80 mt-1 font-medium">Accumulated across cleared transactions</p>
                    </div>
                </div>

                {/* Pending Amount widget */}
                <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-500 to-orange-600 p-5 text-white shadow-md relative overflow-hidden flex flex-col justify-between min-h-[120px]">
                    <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 text-white/10 select-none">
                        <Coins className="h-32 w-32" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-100/90 block">Pending Outstanding Payments</span>
                    <div>
                        <div className="flex items-baseline gap-1 mt-2">
                            <span className="text-3xl font-extrabold">₹{metrics.totalPending.toLocaleString("en-IN")}</span>
                        </div>
                        <p className="text-[10px] text-amber-100/80 mt-1 font-medium">To be settled by stays checking out</p>
                    </div>
                </div>

                {/* Total Bookings counter */}
                <div className="rounded-2xl border border-blue-100 bg-white p-5 text-slate-800 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[120px]">
                    <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 text-slate-100 select-none">
                        <Receipt className="h-32 w-32" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">Total Bookings Count</span>
                    <div>
                        <div className="flex items-baseline gap-1 mt-2">
                            <span className="text-3xl font-extrabold text-slate-800">{metrics.totalCount}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1 font-medium">Cumulative transactions in repository</p>
                    </div>
                </div>
            </div>

            {/* Filter and Search Bar row */}
            <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Search query input */}
                <div className="relative w-full sm:max-w-md">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                        <Search className="h-4 w-4" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search by Guest Name, Booking ID, or Room Number..."
                        className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <select
                        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 w-full sm:w-44"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        <option value="ALL">All Payments</option>
                        <option value="COMPLETED">Completed Status</option>
                        <option value="PENDING">Pending Status</option>
                    </select>

                    <button
                        type="button"
                        onClick={loadBookings}
                        disabled={isLoading}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                    >
                        <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
                    </button>
                </div>
            </div>

            {notification && (
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs font-semibold text-blue-700 flex items-center justify-between shadow-2xs">
                    <span>{notification}</span>
                    <button
                        className="text-blue-500 hover:text-blue-800 font-bold ml-2"
                        onClick={() => setNotification("")}
                        type="button"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Payments Table container */}
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <th className="py-3.5 px-4 font-extrabold">Booking ID</th>
                            <th className="py-3.5 px-3 font-extrabold">Room Number</th>
                            <th className="py-3.5 px-3 font-extrabold">Primary Guest</th>
                            <th className="py-3.5 px-3 font-extrabold">Total Price</th>
                            <th className="py-3.5 px-3 font-extrabold">Amount Paid</th>
                            <th className="py-3.5 px-3 font-extrabold">Method</th>
                            <th className="py-3.5 px-3 font-extrabold">Ref ID</th>
                            <th className="py-3.5 px-3 font-extrabold text-center">Status</th>
                            <th className="py-3.5 px-4 font-extrabold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-700 font-medium">
                        {isLoading ? (
                            <tr>
                                <td colSpan={9} className="text-center py-12">
                                    <div className="flex flex-col items-center justify-center gap-2.5">
                                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
                                        <span className="text-xs text-slate-450 font-semibold animate-pulse">Fetching ledger transactions...</span>
                                    </div>
                                </td>
                            </tr>
                        ) : filteredBookings.length === 0 ? (
                            <tr>
                                <td colSpan={9} className="text-center py-10 text-slate-400 italic">
                                    No transaction logs matching filters found.
                                </td>
                            </tr>
                        ) : (
                            filteredBookings.map(b => {
                                const guestName = b.guests && b.guests.length > 0 ? b.guests[0].name : "N/A";
                                const paymentStatus = b.payment ? b.payment.status : "PENDING";
                                const paymentMethodStr = b.payment ? b.payment.paymentMethod : "CASH";
                                const transId = b.payment?.transactionId || "-";
                                const paidAmount = b.payment ? b.payment.amountPaid : 0;
                                const originalAmount = b.payment ? b.payment.totalAmount : b.totalPrice;

                                return (
                                    <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-3 px-4 font-bold text-slate-800">#{b.id}</td>
                                        <td className="py-3 px-3">
                                            <div className="font-bold text-slate-800">Room {b.roomNumber}</div>
                                        </td>
                                        <td className="py-3 px-3 font-semibold text-slate-800">{guestName}</td>
                                        <td className="py-3 px-3 font-bold text-slate-800">₹{originalAmount.toLocaleString("en-IN")}</td>
                                        <td className="py-3 px-3 font-bold text-slate-800">₹{paidAmount.toLocaleString("en-IN")}</td>
                                        <td className="py-3 px-3">
                                            <span className="rounded-sm bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                                                {paymentMethodStr}
                                            </span>
                                        </td>
                                        <td className="py-3 px-3 font-mono text-[10px] text-slate-500 max-w-[120px] truncate" title={transId}>
                                            {transId}
                                        </td>
                                        <td className="py-3 px-3 text-center">
                                            <span className={cn(
                                                "rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider inline-block",
                                                paymentStatus === "COMPLETED"
                                                    ? "bg-green-100 text-green-700 border border-green-200"
                                                    : "bg-amber-100 text-amber-700 border border-amber-200"
                                            )}>
                                                {paymentStatus}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() => handleOpenModal(b)}
                                                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50/50 hover:bg-blue-50 border border-blue-200/50 px-2.5 py-1 rounded-md transition-all cursor-pointer outline-none"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                                View/Edit
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* View / Edit Ledger Modal */}
            {isModalOpen && selectedBooking && (
                <div
                    aria-modal="true"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto"
                    role="dialog"
                >
                    <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden bg-white">
                        {/* Header */}
                        <div className="relative flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50/50">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">
                                    {isEditMode ? `Edit Ledger - Booking #${selectedBooking.id}` : `Transaction Summary - Booking #${selectedBooking.id}`}
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Room #{selectedBooking.roomNumber} • Logged on {new Date(selectedBooking.checkIn).toLocaleDateString()}
                                </p>
                            </div>
                            <button
                                aria-label="Close dialog"
                                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                                onClick={() => setIsModalOpen(false)}
                                type="button"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                            {!isEditMode ? (
                                /* Read-only mode view details */
                                <div className="space-y-6 text-xs text-left bg-white">
                                    {/* Duration and Meta */}
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Stay Period</h3>
                                        <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-700">
                                            <div>
                                                <span className="text-slate-400 block text-[10px] uppercase font-bold text-left">Check-In</span>
                                                <span className="font-semibold text-slate-800 block text-left">{formatDateTime(selectedBooking.checkIn)}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 block text-[10px] uppercase font-bold text-left">Check-Out</span>
                                                <span className="font-semibold text-slate-800 block text-left">{formatDateTime(selectedBooking.checkOut)}</span>
                                            </div>
                                            <div className="col-span-2 pt-2 border-t border-slate-200/50 flex justify-between items-center">
                                                <span className="text-slate-400 block text-[10px] uppercase font-bold">Rate Type</span>
                                                <span className="font-bold text-slate-800">
                                                    {selectedBooking.isHourly ? "Hourly Rate Billing" : "Daily Rate Billing"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Guests */}
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Registered Guests ({selectedBooking.guests.length})</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {selectedBooking.guests.map((g, idx) => (
                                                <div key={g.id} className="p-3 border border-slate-200 rounded-xl bg-slate-50/30 space-y-2">
                                                    <div className="font-bold text-slate-800 border-b border-slate-200/50 pb-1 flex justify-between items-center">
                                                        <span>{g.name}</span>
                                                        <span className="text-[10px] text-slate-400">Guest #{idx + 1}</span>
                                                    </div>
                                                    <div className="space-y-1 text-slate-600">
                                                        <div className="flex justify-between"><span className="text-slate-400">Aadhaar:</span> <span className="font-medium text-slate-700">{g.aadhaarNumber}</span></div>
                                                        <div className="flex justify-between"><span className="text-slate-400">Mobile:</span> <span className="font-medium text-slate-700">{g.mobileNumber}</span></div>
                                                        <div className="flex justify-between"><span className="text-slate-400">Age:</span> <span className="font-medium text-slate-700">{g.age || "-"}</span></div>
                                                        {g.address && <div className="text-[11px] pt-1 border-t border-slate-200/50 text-slate-500 text-left"><span className="text-slate-400 block">Address:</span> {g.address}</div>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Payment details */}
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Settlement Ledger</h3>
                                            <span className={cn(
                                                "rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider",
                                                selectedBooking.payment?.status === "COMPLETED"
                                                    ? "bg-green-100 text-green-700 border border-green-200"
                                                    : "bg-amber-100 text-amber-700 border border-amber-200"
                                            )}>
                                                {selectedBooking.payment?.status || "PENDING"}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 text-xs font-medium text-slate-700">
                                            <div>
                                                <span className="text-slate-400 block text-[10px] uppercase font-bold text-left">Total Tariff Price</span>
                                                <span className="text-sm font-bold text-slate-800 block text-left">₹{selectedBooking.payment?.totalAmount.toLocaleString("en-IN") || selectedBooking.totalPrice.toLocaleString("en-IN")}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 block text-[10px] uppercase font-bold text-left">Total Paid Tariff</span>
                                                <span className="text-sm font-bold text-slate-800 block text-left">₹{selectedBooking.payment?.amountPaid.toLocaleString("en-IN") || "0"}</span>
                                            </div>
                                            <div>
                                                <span className="text-slate-400 block text-[10px] uppercase font-bold text-left">Method</span>
                                                <span className="font-semibold text-slate-800 block text-left">{selectedBooking.payment?.paymentMethod || "CASH"}</span>
                                            </div>
                                            {selectedBooking.payment?.transactionId && (
                                                <div>
                                                    <span className="text-slate-400 block text-[10px] uppercase font-bold text-left">Transaction Reference ID</span>
                                                    <span className="font-mono text-slate-800 select-all font-semibold block text-left">{selectedBooking.payment.transactionId}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Edit mode inputs */
                                <div className="space-y-6 text-xs text-left bg-white">
                                    {/* Booking parameters inputs */}
                                    <div className="p-4 rounded-xl bg-blue-50/20 border border-blue-100 space-y-4">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700"> Tariff Parameters</h3>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-semibold text-slate-500 uppercase block">Check-in Date & Time</label>
                                                <input
                                                    type="datetime-local"
                                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-blue-500"
                                                    value={editCheckIn}
                                                    onChange={e => setEditCheckIn(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-semibold text-slate-500 uppercase block">Check-out Date & Time</label>
                                                <input
                                                    type="datetime-local"
                                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-blue-500"
                                                    value={editCheckOut}
                                                    onChange={e => setEditCheckOut(e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-semibold text-slate-500 uppercase block">Tariff Price (₹)</label>
                                                <input
                                                    type="number"
                                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-blue-500"
                                                    value={editTotalPrice}
                                                    onChange={e => setEditTotalPrice(parseFloat(e.target.value) || 0)}
                                                />
                                            </div>
                                            <div className="flex items-center gap-2 pt-5">
                                                <input
                                                    type="checkbox"
                                                    id="edit-hourly-toggle"
                                                    checked={editIsHourly}
                                                    onChange={e => setEditIsHourly(e.target.checked)}
                                                    className="h-4 w-4 text-blue-600 rounded border-slate-300 cursor-pointer"
                                                />
                                                <label htmlFor="edit-hourly-toggle" className="text-xs font-semibold text-slate-700 cursor-pointer">
                                                    Hourly Rate Booking
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Guests inputs */}
                                    <div className="space-y-4">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Guests Information</h3>
                                        <div className="space-y-4">
                                            {editGuests.map((g, idx) => (
                                                <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3 relative">
                                                    <div className="font-bold text-slate-700 border-b border-slate-200/50 pb-2">
                                                        Guest #{idx + 1} {idx === 0 ? "(Primary Guest)" : ""}
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-slate-500 uppercase block">Name *</label>
                                                            <input
                                                                type="text"
                                                                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold focus:ring-1 focus:ring-blue-500"
                                                                value={g.name}
                                                                onChange={e => {
                                                                    const val = e.target.value;
                                                                    setEditGuests(prev => {
                                                                        const copy = [...prev];
                                                                        copy[idx] = { ...copy[idx], name: val };
                                                                        return copy;
                                                                    });
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-slate-500 uppercase block">Aadhaar (12 digits) *</label>
                                                            <input
                                                                type="text"
                                                                maxLength={12}
                                                                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold focus:ring-1 focus:ring-blue-500"
                                                                value={g.aadhaarNumber}
                                                                onChange={e => {
                                                                    const val = e.target.value;
                                                                    setEditGuests(prev => {
                                                                        const copy = [...prev];
                                                                        copy[idx] = { ...copy[idx], aadhaarNumber: val };
                                                                        return copy;
                                                                    });
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-slate-500 uppercase block">Mobile Number *</label>
                                                            <input
                                                                type="text"
                                                                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold focus:ring-1 focus:ring-blue-500"
                                                                value={g.mobileNumber}
                                                                onChange={e => {
                                                                    const val = e.target.value;
                                                                    setEditGuests(prev => {
                                                                        const copy = [...prev];
                                                                        copy[idx] = { ...copy[idx], mobileNumber: val };
                                                                        return copy;
                                                                    });
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[10px] font-bold text-slate-500 uppercase block">Age</label>
                                                            <input
                                                                type="number"
                                                                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold focus:ring-1 focus:ring-blue-500"
                                                                value={g.age}
                                                                onChange={e => {
                                                                    const val = e.target.value;
                                                                    setEditGuests(prev => {
                                                                        const copy = [...prev];
                                                                        copy[idx] = { ...copy[idx], age: val };
                                                                        return copy;
                                                                    });
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="space-y-1 sm:col-span-2">
                                                            <label className="text-[10px] font-bold text-slate-500 uppercase block">Address</label>
                                                            <input
                                                                type="text"
                                                                className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold focus:ring-1 focus:ring-blue-500"
                                                                value={g.address}
                                                                onChange={e => {
                                                                    const val = e.target.value;
                                                                    setEditGuests(prev => {
                                                                        const copy = [...prev];
                                                                        copy[idx] = { ...copy[idx], address: val };
                                                                        return copy;
                                                                    });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Payment Details update */}
                                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Payment Settlements</h3>
                                        
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-slate-600 block">Payment Method *</label>
                                                <select
                                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-blue-500"
                                                    value={editPaymentMethod}
                                                    onChange={e => setEditPaymentMethod(e.target.value as any)}
                                                >
                                                    <option value="CASH">Cash</option>
                                                    <option value="ONLINE">Online Payment (UPI/Card)</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-slate-600 block">Original Pricing Amount (₹)</label>
                                                <input
                                                    type="number"
                                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-blue-500"
                                                    value={editPaymentTotalAmount}
                                                    onChange={e => setEditPaymentTotalAmount(parseFloat(e.target.value) || 0)}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-semibold text-slate-600 block">Total Amount Paid (₹) *</label>
                                                <input
                                                    type="number"
                                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-blue-500"
                                                    value={editPaymentAmountPaid}
                                                    onChange={e => setEditPaymentAmountPaid(parseFloat(e.target.value) || 0)}
                                                />
                                            </div>
                                            {editPaymentMethod === "ONLINE" && (
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-slate-600 block">Transaction Reference ID</label>
                                                    <input
                                                        type="text"
                                                        placeholder="UPI Transaction ID"
                                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-blue-500"
                                                        value={editPaymentTransactionId}
                                                        onChange={e => setEditPaymentTransactionId(e.target.value)}
                                                    />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50">
                                            <input
                                                type="checkbox"
                                                id="edit-payment-status-toggle"
                                                checked={editIsPaymentCompleted}
                                                onChange={e => setEditIsPaymentCompleted(e.target.checked)}
                                                className="h-4 w-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                            />
                                            <label htmlFor="edit-payment-status-toggle" className="text-xs font-semibold text-slate-700 cursor-pointer">
                                                Mark Payment as Completed (COMPLETED status)
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-slate-200 bg-slate-50/50 p-4 sm:p-5 flex justify-end gap-3">
                            {!isEditMode ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer text-center outline-none"
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditMode(true)}
                                        className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-all cursor-pointer text-center outline-none flex items-center gap-1.5"
                                    >
                                        <Edit3 className="h-4 w-4" />
                                        Edit Details
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditMode(false)}
                                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer text-center outline-none"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSaveChanges}
                                        disabled={isSaving}
                                        className="rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-all cursor-pointer text-center outline-none disabled:opacity-50"
                                    >
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
