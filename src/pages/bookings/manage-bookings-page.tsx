import * as React from "react";
import { 
    Search, 
    Sliders
} from "lucide-react";
import { bookingService } from "@/api/booking-service";
import { roomService } from "@/api/room-service";
import { roomTypeService } from "@/api/room-type-service";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { RecordPaymentDialog } from "@/components/feature/bookings/RecordPaymentDialog";
import { BookingDetailsDialog } from "@/components/feature/bookings/BookingDetailsDialog";
import { BookingsTable } from "@/components/feature/bookings/BookingsTable";

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

    // Modal state for editing booking
    const [editingBooking, setEditingBooking] = React.useState<any | null>(null);

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
    };

    const handleSavePayment = async (payload: any) => {
        if (!paymentModalBooking) return false;
        try {
            const res = await bookingService.createOrUpdatePayment(String(paymentModalBooking.id), payload);
            if (res.success) {
                toast("Payment recorded successfully!", "success");
                setPaymentModalBooking(null);
                void loadData();
                return true;
            } else {
                toast(res.message || "Failed to record payment.", "error");
                return false;
            }
        } catch (error) {
            console.error("Payment save error:", error);
            toast("An error occurred while saving payment details.", "error");
            return false;
        }
    };

    const openEditModal = (booking: any) => {
        setEditingBooking(booking);
    };

    const handleSaveEditBooking = async (payload: any) => {
        if (!editingBooking) return false;
        try {
            const res = await bookingService.updateBooking(String(editingBooking.id), payload);
            if (res.success) {
                toast("Booking updated successfully!", "success");
                setEditingBooking(null);
                void loadData();
                return true;
            } else {
                toast(res.message || "Failed to update booking.", "error");
                return false;
            }
        } catch (error) {
            console.error("Failed to update booking:", error);
            const errMsg = error instanceof Error ? error.message : "An error occurred";
            toast(`Failed to update booking: ${errMsg}`, "error");
            return false;
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
                <BookingsTable
                    bookings={filteredBookings}
                    onEdit={openEditModal}
                    onPay={openPaymentModal}
                    onCheckIn={handleCheckIn}
                    onCheckOut={handleCheckOut}
                />
            )}

            {/* Record Payment Dialog */}
            <RecordPaymentDialog
                isOpen={!!paymentModalBooking}
                booking={paymentModalBooking}
                onClose={() => setPaymentModalBooking(null)}
                onSave={handleSavePayment}
            />

            {/* Edit Booking Modal */}
            <BookingDetailsDialog
                isOpen={!!editingBooking}
                booking={editingBooking}
                rooms={rooms}
                roomTypes={roomTypes}
                onClose={() => setEditingBooking(null)}
                onSave={handleSaveEditBooking}
            />
        </main>
    );
}
