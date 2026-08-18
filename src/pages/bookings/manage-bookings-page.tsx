import * as React from "react";
import { 
    Search, 
    User, 
    Sliders,
    Coins,
    LogOut,
    Check,
    X,
    QrCode,
    Plus,
    Trash2,
    Edit2
} from "lucide-react";
import { bookingService } from "@/api/booking-service";
import { roomService } from "@/api/room-service";
import { roomTypeService } from "@/api/room-type-service";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type BookingStatusFilter = "ALL" | "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELLED";

export function ManageBookingsPage() {
    const { toast } = useToast();
    const [bookings, setBookings] = React.useState<any[]>([]);
    const [rooms, setRooms] = React.useState<any[]>([]);
    const [roomTypes, setRoomTypes] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState<boolean>(true);
    const [searchQuery, setSearchQuery] = React.useState<string>("");
    const [statusFilter, setStatusFilter] = React.useState<BookingStatusFilter>("ALL");

    // Modal state for recording payment
    const [paymentModalBooking, setPaymentModalBooking] = React.useState<any | null>(null);
    const [paymentMethod, setPaymentMethod] = React.useState<"CASH" | "ONLINE">("CASH");
    const [paymentAmountPaid, setPaymentAmountPaid] = React.useState<number>(0);
    const [paymentTotalAmount, setPaymentTotalAmount] = React.useState<number>(0);
    const [paymentTransactionId, setPaymentTransactionId] = React.useState<string>("");
    const [isSavingPayment, setIsSavingPayment] = React.useState<boolean>(false);

    // Modal state for editing booking
    const [editingBooking, setEditingBooking] = React.useState<any | null>(null);
    const [editCheckIn, setEditCheckIn] = React.useState<string>("");
    const [editCheckOut, setEditCheckOut] = React.useState<string>("");
    const [editIsHourly, setEditIsHourly] = React.useState<boolean>(false);
    const [editGuests, setEditGuests] = React.useState<any[]>([]);
    const [editValidationErrors, setEditValidationErrors] = React.useState<Record<string, string>>({});
    const [isSavingEdit, setIsSavingEdit] = React.useState<boolean>(false);

    const loadData = React.useCallback(async () => {
        setLoading(true);
        try {
            const [bookingsRes, roomsRes, typesRes] = await Promise.all([
                bookingService.getAllBookings(),
                roomService.getRooms(),
                roomTypeService.getRoomTypes()
            ]);
            if (bookingsRes.success && bookingsRes.data) {
                setBookings(bookingsRes.data);
            }
            if (roomsRes.success && roomsRes.data) {
                setRooms(roomsRes.data);
            }
            if (typesRes.success && typesRes.data) {
                setRoomTypes(typesRes.data);
            }
        } catch (error) {
            console.error("Failed to load dashboard data:", error);
            toast("Failed to load dashboard data.", "error");
        } finally {
            setLoading(false);
        }
    }, [toast]);

    React.useEffect(() => {
        void loadData();
    }, [loadData]);

    const handleCheckIn = async (bookingId: string) => {
        try {
            const res = await bookingService.checkInBooking(bookingId);
            if (res.success) {
                toast("Guest checked in successfully!", "success");
                void loadData();
            } else {
                toast(res.message || "Failed to check-in.", "error");
            }
        } catch (error) {
            console.error("Check-in error:", error);
            toast("An error occurred during check-in.", "error");
        }
    };

    const handleCheckOut = async (bookingId: string) => {
        try {
            const res = await bookingService.checkOutBooking(bookingId);
            if (res.success) {
                toast("Guest checked out successfully! Room status set to Clean/Vacant.", "success");
                void loadData();
            } else {
                toast(res.message || "Failed to check-out.", "error");
            }
        } catch (error) {
            console.error("Check-out error:", error);
            toast("An error occurred during check-out.", "error");
        }
    };

    const openPaymentModal = (booking: any) => {
        setPaymentModalBooking(booking);
        setPaymentMethod(booking.payment?.paymentMethod || "CASH");
        setPaymentTotalAmount(booking.payment?.totalAmount || booking.totalPrice || 0);
        setPaymentAmountPaid(booking.payment?.amountPaid || booking.totalPrice || 0);
        setPaymentTransactionId(booking.payment?.transactionId || "");
    };

    const handleSavePayment = async () => {
        if (!paymentModalBooking) return;
        setIsSavingPayment(true);
        try {
            const payload = {
                paymentMethod,
                totalAmount: paymentTotalAmount,
                amountPaid: paymentAmountPaid,
                status: paymentAmountPaid >= paymentTotalAmount ? "COMPLETED" : "PENDING",
                transactionId: paymentMethod === "ONLINE" ? paymentTransactionId.trim() : undefined,
            };
            const res = await bookingService.createOrUpdatePayment(String(paymentModalBooking.id), payload);
            if (res.success) {
                toast("Payment recorded successfully!", "success");
                setPaymentModalBooking(null);
                void loadData();
            } else {
                toast(res.message || "Failed to record payment.", "error");
            }
        } catch (error) {
            console.error("Payment save error:", error);
            toast("An error occurred while saving payment details.", "error");
        } finally {
            setIsSavingPayment(false);
        }
    };

    const ensureDateTimeLocalString = (dateStr?: string, defaultTime = "12:00") => {
        if (!dateStr) return "";
        if (dateStr.includes("T")) {
            return dateStr.substring(0, 16);
        }
        return `${dateStr}T${defaultTime}`;
    };

    const calculatedEditPrice = React.useMemo(() => {
        if (!editingBooking || !editCheckIn || !editCheckOut) return 0;
        const roomObj = rooms.find(r => String(r.id) === String(editingBooking.roomId));
        if (!roomObj) return editingBooking.totalPrice || 0;
        
        const rtConfig = roomTypes.find(type => type.name === roomObj.roomType);
        if (!rtConfig) return editingBooking.totalPrice || 0;

        const start = new Date(editCheckIn);
        const end = new Date(editCheckOut);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;

        const diffSeconds = (end.getTime() - start.getTime()) / 1000;
        if (diffSeconds <= 0) return 0;

        const basePrice = rtConfig.basePrice;

        if (editIsHourly) {
            const hours = Math.ceil(diffSeconds / 3600.0);
            const hourlyRate = Math.round(basePrice / 10.0);
            return hours * hourlyRate;
        } else {
            const days = Math.ceil(diffSeconds / 86400.0);
            return days * basePrice;
        }
    }, [editingBooking, editCheckIn, editCheckOut, editIsHourly, rooms, roomTypes]);

    const openEditModal = (booking: any) => {
        setEditingBooking(booking);
        setEditCheckIn(ensureDateTimeLocalString(booking.checkIn));
        setEditCheckOut(ensureDateTimeLocalString(booking.checkOut));
        setEditIsHourly(booking.isHourly || false);
        setEditGuests(booking.guests ? booking.guests.map((g: any) => ({
            id: String(g.id),
            name: g.name || "",
            aadhaarNumber: g.aadhaarNumber || "",
            mobileNumber: g.mobileNumber || "",
            age: g.age !== undefined && g.age !== null ? String(g.age) : "",
            address: g.address || "",
        })) : [
            { name: "", aadhaarNumber: "", mobileNumber: "", age: "", address: "" }
        ]);
        setEditValidationErrors({});
    };

    const handleEditGuestInputChange = (index: number, field: string, value: string) => {
        let cleanValue = value;
        if (field === "aadhaarNumber") {
            cleanValue = value.replace(/\D/g, "").substring(0, 12);
        } else if (field === "mobileNumber") {
            cleanValue = value.replace(/\D/g, "").substring(0, 10);
        }

        setEditGuests(prev => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: cleanValue };
            return next;
        });

        if (editValidationErrors[`guest-${index}-${field}`]) {
            setEditValidationErrors(prev => {
                const next = { ...prev };
                delete next[`guest-${index}-${field}`];
                return next;
            });
        }
    };

    const handleAddEditGuest = () => {
        setEditGuests(prev => [...prev, { name: "", aadhaarNumber: "", mobileNumber: "", age: "", address: "" }]);
    };

    const handleRemoveEditGuest = (index: number) => {
        setEditGuests(prev => prev.filter((_, idx) => idx !== index));
    };

    const validateEditForm = () => {
        const errors: Record<string, string> = {};
        
        if (!editCheckIn) errors.checkIn = "Check-in is required.";
        if (!editCheckOut) errors.checkOut = "Check-out is required.";
        if (editCheckIn && editCheckOut && new Date(editCheckOut) <= new Date(editCheckIn)) {
            errors.checkOut = "Check-out must be after check-in.";
        }
        
        editGuests.forEach((guest, index) => {
            const guestName = guest.name || "";
            const guestAadhaar = guest.aadhaarNumber || "";
            const guestMobile = guest.mobileNumber || "";
            const guestAge = guest.age || "";
            const guestAddress = guest.address || "";

            if (index > 0) {
                const isEmpty = !guestName.trim() && 
                                !guestAadhaar.trim() && 
                                !guestMobile.trim() && 
                                !guestAge.trim() && 
                                !guestAddress.trim();
                if (isEmpty) return;
            }

            if (!guestName.trim()) {
                errors[`guest-${index}-name`] = "Guest name is required.";
            }
            
            const cleanAadhaar = guestAadhaar.replace(/\D/g, "");
            if (!cleanAadhaar) {
                errors[`guest-${index}-aadhaar`] = "Aadhaar is required.";
            } else if (cleanAadhaar.length !== 12) {
                errors[`guest-${index}-aadhaar`] = "Aadhaar must be exactly 12 digits.";
            }
            
            const cleanMobile = guestMobile.replace(/\D/g, "");
            if (index === 0) {
                if (!cleanMobile) {
                    errors[`guest-${index}-mobile`] = "Mobile number is required.";
                } else if (cleanMobile.length !== 10) {
                    errors[`guest-${index}-mobile`] = "Mobile number must be exactly 10 digits.";
                }
            } else if (cleanMobile && cleanMobile.length !== 10) {
                errors[`guest-${index}-mobile`] = "Mobile number must be exactly 10 digits.";
            }
        });
        
        setEditValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSaveEditBooking = async () => {
        if (!editingBooking) return;
        if (!validateEditForm()) {
            toast("Please correct the validation errors in the form.", "error");
            return;
        }
        setIsSavingEdit(true);
        try {
            const activeGuests = editGuests.filter((g, index) => {
                if (index === 0) return true;
                return !!((g.name || "").trim() || (g.aadhaarNumber || "").trim() || (g.mobileNumber || "").trim() || (g.age || "").trim() || (g.address || "").trim());
            });

            const payload = {
                totalPrice: calculatedEditPrice,
                checkIn: new Date(editCheckIn).toISOString(),
                checkOut: new Date(editCheckOut).toISOString(),
                isHourly: editIsHourly,
                guests: activeGuests.map(g => ({
                    name: (g.name || "").trim(),
                    aadhaarNumber: (g.aadhaarNumber || "").replace(/\D/g, ""),
                    mobileNumber: (g.mobileNumber || "").replace(/\D/g, ""),
                    age: g.age ? parseInt(g.age, 10) : undefined,
                    address: (g.address || "").trim() || undefined,
                })),
            };

            const res = await bookingService.updateBooking(String(editingBooking.id), payload);
            if (res.success) {
                toast("Booking updated successfully!", "success");
                setEditingBooking(null);
                void loadData();
            } else {
                toast(res.message || "Failed to update booking.", "error");
            }
        } catch (error) {
            console.error("Failed to update booking:", error);
            const errMsg = error instanceof Error ? error.message : "An error occurred";
            toast(`Failed to update booking: ${errMsg}`, "error");
        } finally {
            setIsSavingEdit(false);
        }
    };

    const filteredBookings = React.useMemo(() => {
        return bookings.filter(b => {
            // Status filter
            if (statusFilter !== "ALL" && b.status !== statusFilter) {
                return false;
            }

            // Search query (Guest names, room number, Aadhaar)
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase().trim();
                const roomNum = b.roomNumber ? String(b.roomNumber).toLowerCase() : "";
                const roomNumberRaw = b.room?.roomNumber ? String(b.room.roomNumber).toLowerCase() : "";
                
                const matchesGuest = b.guests && b.guests.some((g: any) => 
                    g.name.toLowerCase().includes(query) || 
                    g.aadhaarNumber.includes(query) ||
                    g.mobileNumber.includes(query)
                );

                const matchesRoom = roomNum.includes(query) || roomNumberRaw.includes(query);
                const matchesId = String(b.id).includes(query);

                return matchesGuest || matchesRoom || matchesId;
            }

            return true;
        });
    }, [bookings, statusFilter, searchQuery]);

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
        <main aria-label="Manage Hotel Bookings" className="min-h-full w-full bg-[#f2f8ff] p-4 sm:p-6 text-slate-800">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 leading-tight">Manage Bookings</h1>
                    <p className="text-xs text-slate-500 mt-1">
                        Check-in guests, collect payments, and manage checkouts for all reservations.
                    </p>
                </div>
                
                {/* Search input */}
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search guest, room or phone..."
                        className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-2xs transition-all"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-200 pb-3">
                {(["ALL", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"] as BookingStatusFilter[]).map(tab => {
                    const isActive = statusFilter === tab;
                    return (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setStatusFilter(tab)}
                            className={cn(
                                "px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer",
                                isActive
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                            )}
                        >
                            {tab === "ALL" ? "All Bookings" : tab.replace("_", " ")}
                        </button>
                    );
                })}
            </div>

            {/* Bookings table */}
            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
                </div>
            ) : filteredBookings.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-2xs">
                    <Sliders className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-sm font-bold text-slate-700">No bookings found</h3>
                    <p className="text-xs text-slate-400 mt-1">Try resetting the status filter or searching for another term.</p>
                </div>
            ) : (
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
                                {filteredBookings.map((booking) => {
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
                                                        onClick={() => openEditModal(booking)}
                                                        className="inline-flex items-center gap-1 rounded-[6px] border border-blue-200 bg-blue-50/50 hover:bg-blue-100/50 px-2.5 py-1.5 text-[10px] font-bold text-blue-700 transition-all cursor-pointer outline-none"
                                                        title="Edit booking parameters and guest information"
                                                    >
                                                        <Edit2 className="h-3 w-3" />
                                                        Edit
                                                    </button>
                                                )}

                                                {/* Record Payment Button */}
                                                {!isPaid && (booking.status === "CONFIRMED" || booking.status === "CHECKED_IN") && (
                                                    <button
                                                        type="button"
                                                        onClick={() => openPaymentModal(booking)}
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
                                                        onClick={() => handleCheckIn(String(booking.id))}
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
                                                            void handleCheckOut(String(booking.id));
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
            )}

            {/* Record Payment Dialog */}
            {paymentModalBooking && (
                <div 
                    aria-modal="true" 
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 animate-in fade-in duration-200"
                    role="dialog"
                >
                    <div className="w-full max-w-sm rounded-xl bg-white p-5 border border-slate-200 shadow-xl flex flex-col animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                            <div>
                                <h3 className="font-bold text-slate-800 text-sm">
                                    Record Payment - Room {paymentModalBooking.roomNumber || paymentModalBooking.room?.roomNumber}
                                </h3>
                                <p className="text-[10px] text-slate-400 mt-0.5">Booking ID: #{paymentModalBooking.id}</p>
                            </div>
                            <button
                                type="button"
                                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-650 transition-colors cursor-pointer"
                                onClick={() => setPaymentModalBooking(null)}
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="space-y-3.5 text-xs text-slate-700">
                            {/* Method select */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-500 block">Payment Method *</label>
                                <select
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
                                    value={paymentMethod}
                                    onChange={e => setPaymentMethod(e.target.value as any)}
                                >
                                    <option value="CASH">Cash</option>
                                    <option value="ONLINE">Online UPI / Card</option>
                                </select>
                            </div>

                            {/* Total Price */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-500 block">Total Price (₹)</label>
                                <input
                                    type="number"
                                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700"
                                    value={paymentTotalAmount}
                                    readOnly
                                />
                            </div>

                            {/* Amount Paid */}
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold uppercase text-slate-500 block">Amount Paid (₹) *</label>
                                <input
                                    type="number"
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    value={paymentAmountPaid}
                                    onChange={e => setPaymentAmountPaid(parseFloat(e.target.value) || 0)}
                                    max={paymentTotalAmount}
                                />
                            </div>

                            {/* Transaction ID Reference */}
                            {paymentMethod === "ONLINE" && (
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold uppercase text-slate-500 block">Transaction Reference ID</label>
                                    <div className="relative">
                                        <QrCode className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="UPI Ref / Transaction Number"
                                            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            value={paymentTransactionId}
                                            onChange={e => setPaymentTransactionId(e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 pt-4 border-t border-slate-100 mt-5">
                            <button
                                type="button"
                                className="flex-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 py-2 text-xs font-semibold text-slate-600 transition-all cursor-pointer"
                                onClick={() => setPaymentModalBooking(null)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isSavingPayment}
                                className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 py-2 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer disabled:opacity-50"
                                onClick={handleSavePayment}
                            >
                                {isSavingPayment ? "Saving..." : "Save Payment"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Booking Modal */}
            {editingBooking && (
                <div
                    aria-modal="true"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200"
                    role="dialog"
                >
                    <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="relative flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50/50">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">
                                    Edit Booking #{editingBooking.id}
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Update dates, hourly mode, or guests list.
                                </p>
                            </div>
                            <button
                                aria-label="Close edit booking modal"
                                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                                onClick={() => setEditingBooking(null)}
                                type="button"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                            {/* Booking parameters */}
                            <div className="p-4 rounded-xl bg-blue-50/30 border border-blue-100 space-y-4 text-xs">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700">Booking Parameters</h3>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Check-in input */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-600 block">Check-in Date & Time *</label>
                                        <input
                                            type="datetime-local"
                                            className={cn(
                                                "w-full rounded-lg border bg-white px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500",
                                                editValidationErrors.checkIn ? "border-red-400 ring-1 ring-red-400" : "border-slate-200"
                                            )}
                                            value={editCheckIn}
                                            onChange={e => setEditCheckIn(e.target.value)}
                                        />
                                        {editValidationErrors.checkIn && (
                                            <p className="text-[10px] text-red-500 font-medium">{editValidationErrors.checkIn}</p>
                                        )}
                                    </div>

                                    {/* Check-out input */}
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-slate-600 block">Check-out Date & Time *</label>
                                        <input
                                            type="datetime-local"
                                            className={cn(
                                                "w-full rounded-lg border bg-white px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500",
                                                editValidationErrors.checkOut ? "border-red-400 ring-1 ring-red-400" : "border-slate-200"
                                            )}
                                            value={editCheckOut}
                                            onChange={e => setEditCheckOut(e.target.value)}
                                        />
                                        {editValidationErrors.checkOut && (
                                            <p className="text-[10px] text-red-500 font-medium">{editValidationErrors.checkOut}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Hourly Switch toggle */}
                                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50">
                                    <input
                                        type="checkbox"
                                        id="edit-hourly-toggle"
                                        checked={editIsHourly}
                                        onChange={e => setEditIsHourly(e.target.checked)}
                                        className="h-4 w-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                    />
                                    <label htmlFor="edit-hourly-toggle" className="text-xs font-semibold text-slate-700 cursor-pointer selection:bg-transparent">
                                        Enable Hourly Rate Booking (Calculates hourly billing based on durations)
                                    </label>
                                </div>

                                {/* Billing Price Display */}
                                <div className="flex justify-between items-center bg-slate-100/50 rounded-lg p-2.5 border border-slate-200/60 mt-2">
                                    <span className="font-semibold text-slate-700">Recalculated Price:</span>
                                    <span className="font-extrabold text-blue-700 text-sm">₹{calculatedEditPrice.toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Guests List */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Guests Details</h3>
                                </div>

                                <div className="space-y-4">
                                    {editGuests.map((guest, index) => (
                                        <div
                                            key={index}
                                            className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3 relative text-xs"
                                        >
                                            <div className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                                                <span className="text-xs font-bold text-slate-700">
                                                    Guest #{index + 1} {index === 0 ? "(Primary Guest)" : ""}
                                                </span>
                                                {index > 0 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveEditGuest(index)}
                                                        className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                {/* Guest Name */}
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-semibold text-slate-500 uppercase block">Name *</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Full Name"
                                                        className={cn(
                                                            "w-full rounded-md border bg-white px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500",
                                                            editValidationErrors[`guest-${index}-name`] ? "border-red-400 ring-1 ring-red-400" : "border-slate-200"
                                                        )}
                                                        value={guest.name}
                                                        onChange={e => handleEditGuestInputChange(index, "name", e.target.value)}
                                                    />
                                                    {editValidationErrors[`guest-${index}-name`] && (
                                                        <p className="text-[10px] text-red-500 font-medium">
                                                            {editValidationErrors[`guest-${index}-name`]}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Aadhaar Number */}
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-semibold text-slate-500 uppercase block">Aadhaar (12 Digits) *</label>
                                                    <input
                                                        type="text"
                                                        placeholder="0000 0000 0000"
                                                        maxLength={12}
                                                        className={cn(
                                                            "w-full rounded-md border bg-white px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500",
                                                            editValidationErrors[`guest-${index}-aadhaar`] ? "border-red-400 ring-1 ring-red-400" : "border-slate-200"
                                                        )}
                                                        value={guest.aadhaarNumber}
                                                        onChange={e => handleEditGuestInputChange(index, "aadhaarNumber", e.target.value)}
                                                    />
                                                    {editValidationErrors[`guest-${index}-aadhaar`] && (
                                                        <p className="text-[10px] text-red-500 font-medium">
                                                            {editValidationErrors[`guest-${index}-aadhaar`]}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Mobile Number */}
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-semibold text-slate-500 uppercase block">
                                                        Mobile Number {index === 0 ? "*" : "(Optional)"}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Phone Number"
                                                        maxLength={10}
                                                        className={cn(
                                                            "w-full rounded-md border bg-white px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500",
                                                            editValidationErrors[`guest-${index}-mobile`] ? "border-red-400 ring-1 ring-red-400" : "border-slate-200"
                                                        )}
                                                        value={guest.mobileNumber}
                                                        onChange={e => handleEditGuestInputChange(index, "mobileNumber", e.target.value)}
                                                    />
                                                    {editValidationErrors[`guest-${index}-mobile`] && (
                                                        <p className="text-[10px] text-red-500 font-medium">
                                                            {editValidationErrors[`guest-${index}-mobile`]}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                {/* Age */}
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-semibold text-slate-500 uppercase block">Age (Optional)</label>
                                                    <input
                                                        type="number"
                                                        placeholder="Age"
                                                        className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        value={guest.age}
                                                        onChange={e => handleEditGuestInputChange(index, "age", e.target.value)}
                                                    />
                                                </div>

                                                {/* Address */}
                                                <div className="space-y-1 sm:col-span-2">
                                                    <label className="text-[10px] font-semibold text-slate-500 uppercase block">Address (Optional)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="Residential Address"
                                                        className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        value={guest.address}
                                                        onChange={e => handleEditGuestInputChange(index, "address", e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end pt-1">
                                    <button
                                        type="button"
                                        onClick={handleAddEditGuest}
                                        className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 shadow-3xs"
                                    >
                                        <Plus className="h-4 w-4" />
                                        Add Guest
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex gap-3 px-5 py-4 border-t border-slate-200 bg-slate-50/50">
                            <button
                                type="button"
                                className="flex-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 py-2 text-xs font-semibold text-slate-600 transition-all cursor-pointer"
                                onClick={() => setEditingBooking(null)}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isSavingEdit}
                                className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 py-2 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer disabled:opacity-50"
                                onClick={handleSaveEditBooking}
                            >
                                {isSavingEdit ? "Saving Changes..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
