import * as React from "react";
import { BookingTabs, type BookingTabValue } from "@/components/feature/bookings/BookingTabs";
import { FrontDeskBookingView } from "@/components/feature/bookings/FrontDeskBookingView";
import { OnlinePlatformBookingsView } from "@/components/feature/bookings/OnlinePlatformBookingsView";
import { MOCK_CHANNEL_RESERVATIONS } from "@/features/bookings/bookings-data";
import type { AvailabilityQuery, CandidateRoom, ChannelReservation } from "@/types/bookings";
import { roomService } from "@/api/room-service";
import { roomTypeService } from "@/api/room-type-service";
import { bookingService } from "@/api/booking-service";
import type { RoomTypeConfig } from "@/pages/settings/room-types-dialog";
import { Plus, X, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function BookingPage() {
    const [activeTab, setActiveTab] = React.useState<BookingTabValue>("frontDesk");
    const [allRooms, setAllRooms] = React.useState<CandidateRoom[]>([]);
    const [filteredRooms, setFilteredRooms] = React.useState<CandidateRoom[]>([]);
    const [roomTypesList, setRoomTypesList] = React.useState<RoomTypeConfig[]>([]);
    const [reservations] = React.useState<ChannelReservation[]>(MOCK_CHANNEL_RESERVATIONS);
    const [isSearching, setIsSearching] = React.useState(false);
    const [notification, setNotification] = React.useState<string>("");

    // Search Query State
    const [searchQuery, setSearchQuery] = React.useState<AvailabilityQuery | null>(null);

    // Booking Modal State
    const [selectedBookingRoom, setSelectedBookingRoom] = React.useState<CandidateRoom | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
    const [checkIn, setCheckIn] = React.useState<string>("");
    const [checkOut, setCheckOut] = React.useState<string>("");
    const [isHourly, setIsHourly] = React.useState<boolean>(false);
    const [guests, setGuests] = React.useState<Array<{
        name: string;
        aadhaarNumber: string;
        mobileNumber: string;
        age: string;
        address: string;
    }>>([
        { name: "", aadhaarNumber: "", mobileNumber: "", age: "", address: "" },
        { name: "", aadhaarNumber: "", mobileNumber: "", age: "", address: "" }
    ]);
    const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false);
    const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});

    // Payment State
    const [modalStep, setModalStep] = React.useState<"form" | "payment">("form");
    const [createdBooking, setCreatedBooking] = React.useState<any | null>(null);
    const [paymentMethod, setPaymentMethod] = React.useState<"CASH" | "ONLINE">("CASH");
    const [paymentTotalAmount, setPaymentTotalAmount] = React.useState<number>(0);
    const [paymentAmountPaid, setPaymentAmountPaid] = React.useState<number>(0);
    const [isPaymentCompleted, setIsPaymentCompleted] = React.useState<boolean>(true);
    const [paymentTransactionId, setPaymentTransactionId] = React.useState<string>("");

    const loadInitialData = React.useCallback(async () => {
        try {
            const [roomsRes, typesRes] = await Promise.all([
                roomService.getRooms(),
                roomTypeService.getRoomTypes(),
            ]);

            if (roomsRes.success && roomsRes.data && typesRes.success && typesRes.data) {
                const roomTypes = typesRes.data;
                setRoomTypesList(roomTypes);
                
                const mappedRooms: CandidateRoom[] = roomsRes.data.map(room => {
                    const rtConfig = roomTypes.find(type => type.name === room.roomType);
                    
                    return {
                        id: room.id,
                        number: room.number,
                        floor: typeof room.floor === 'number' ? room.floor : parseInt(String(room.floor), 10) || 1,
                        roomType: room.roomType as any,
                        bedType: (rtConfig?.bedType || "Double Bed") as any,
                        capacity: room.capacity,
                        facilities: rtConfig?.description || "WiFi, TV, AC",
                        status: room.roomStatus as any,
                        hourlyRate: rtConfig ? Math.round(rtConfig.basePrice / 10) : 250,
                        dailyRate: rtConfig ? rtConfig.basePrice : 1800,
                    };
                });

                const sortedVacantRooms = mappedRooms
                    .filter(room => room.status === "Vacant")
                    .sort((a, b) => {
                        const numA = parseInt(a.number, 10);
                        const numB = parseInt(b.number, 10);
                        if (!isNaN(numA) && !isNaN(numB)) {
                            return numA - numB;
                        }
                        return a.number.localeCompare(b.number, undefined, { numeric: true });
                    });

                setAllRooms(mappedRooms);
                setFilteredRooms(sortedVacantRooms);
            }
        } catch (error) {
            console.error("Failed to fetch initial rooms/room-types configurations for booking:", error);
        }
    }, []);

    React.useEffect(() => {
        void loadInitialData();
    }, [loadInitialData]);

    const ensureDateTimeLocalString = (dateStr?: string, defaultTime = "12:00") => {
        if (!dateStr) return "";
        if (dateStr.includes("T")) {
            return dateStr.substring(0, 16);
        }
        return `${dateStr}T${defaultTime}`;
    };

    const handleSearch = async (query: AvailabilityQuery) => {
        setIsSearching(true);
        setNotification("");
        setSearchQuery(query);

        const requiredCapacity = query.adults + query.children;

        try {
            const response = await bookingService.checkAvailability({
                roomType: query.roomType,
                maxOccupancy: requiredCapacity,
                status: "Vacant",
            });

            if (response.success && response.data) {
                const mappedResults: CandidateRoom[] = response.data.map(room => {
                    const rtConfig = roomTypesList.find(type => type.name === room.roomType);
                    return {
                        id: room.id,
                        number: room.number,
                        floor: typeof room.floor === 'number' ? room.floor : parseInt(String(room.floor), 10) || 1,
                        roomType: room.roomType as any,
                        bedType: (rtConfig?.bedType || "Double Bed") as any,
                        capacity: room.capacity,
                        facilities: rtConfig?.description || "WiFi, TV, AC",
                        status: room.roomStatus as any,
                        hourlyRate: rtConfig ? Math.round(rtConfig.basePrice / 10) : 250,
                        dailyRate: rtConfig ? rtConfig.basePrice : 1800,
                    };
                });

                const sortedMappedResults = mappedResults.sort((a, b) => {
                    const numA = parseInt(a.number, 10);
                    const numB = parseInt(b.number, 10);
                    if (!isNaN(numA) && !isNaN(numB)) {
                        return numA - numB;
                    }
                    return a.number.localeCompare(b.number, undefined, { numeric: true });
                });

                setFilteredRooms(sortedMappedResults);
                setIsSearching(false);
                setNotification(
                    `Availability check complete: Found ${mappedResults.length} available room(s) for ${query.roomType} (${requiredCapacity} guest(s)).`
                );
                return;
            }
        } catch (error) {
            console.warn("Check availability API failed (Backend not refactored yet). Falling back to client-side filtering.", error);
        }

        // Client-side fallback filtering
        const results = allRooms.filter(r => {
            const matchesType = query.roomType === "Premium"
                ? r.roomType.toLowerCase().includes("premium")
                : r.roomType === query.roomType;
            const matchesCapacity = r.capacity >= requiredCapacity;
            const isVacant = r.status === "Vacant";
            return matchesType && matchesCapacity && isVacant;
        }).sort((a, b) => {
            const numA = parseInt(a.number, 10);
            const numB = parseInt(b.number, 10);
            if (!isNaN(numA) && !isNaN(numB)) {
                return numA - numB;
            }
            return a.number.localeCompare(b.number, undefined, { numeric: true });
        });

        setFilteredRooms(results);
        setIsSearching(false);
        setNotification(
            `Availability check complete: Found ${results.length} available room(s) for ${query.roomType} (${requiredCapacity} guest(s)).`
        );
    };

    const handleBookNow = async (room: CandidateRoom) => {
        setSelectedBookingRoom(room);
        setGuests([
            { name: "", aadhaarNumber: "", mobileNumber: "", age: "", address: "" },
            { name: "", aadhaarNumber: "", mobileNumber: "", age: "", address: "" }
        ]);
        setIsHourly(false);
        setValidationErrors({});
        setCreatedBooking(null);
        setPaymentMethod("CASH");
        setPaymentTotalAmount(0);
        setPaymentAmountPaid(0);
        setIsPaymentCompleted(true);
        setPaymentTransactionId("");

        if (room.status !== "Vacant") {
            setIsSubmitting(true);
            try {
                const res = await bookingService.getActiveBookingForRoom(room.id);
                if (res.success && res.data) {
                    setCreatedBooking(res.data);
                    setPaymentTotalAmount(res.data.totalPrice || 0);
                    setPaymentAmountPaid(res.data.totalPrice || 0);
                    if (res.data.payment) {
                        setPaymentMethod(res.data.payment.paymentMethod);
                        setPaymentTotalAmount(res.data.payment.totalAmount);
                        setPaymentAmountPaid(res.data.payment.amountPaid);
                        setIsPaymentCompleted(res.data.payment.status === "COMPLETED");
                        setPaymentTransactionId(res.data.payment.transactionId || "");
                    }
                    setModalStep("payment");
                    setIsModalOpen(true);
                } else {
                    setNotification(res.message || "Failed to load active booking.");
                }
            } catch (error) {
                console.error("Failed to load active booking:", error);
                setNotification("Failed to load active booking details.");
            } finally {
                setIsSubmitting(false);
            }
            return;
        }

        const now = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(now.getDate() + 1);
        
        const formatForInput = (d: Date) => {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            const hh = String(d.getHours()).padStart(2, '0');
            const min = String(d.getMinutes()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
        };
        
        setCheckIn(formatForInput(now));

        if (searchQuery) {
            setCheckOut(ensureDateTimeLocalString(searchQuery.checkOut, "11:00"));
        } else {
            setCheckOut(formatForInput(tomorrow));
        }
        setModalStep("form");
        setIsModalOpen(true);
    };

    const validateForm = () => {
        const errors: Record<string, string> = {};
        
        if (!checkIn) errors.checkIn = "Check-in is required.";
        if (!checkOut) errors.checkOut = "Check-out is required.";
        if (checkIn && checkOut && new Date(checkOut) <= new Date(checkIn)) {
            errors.checkOut = "Check-out must be after check-in.";
        }
        
        guests.forEach((guest, index) => {
            // If it is index > 0 and all fields are empty, skip validation for this guest
            if (index > 0) {
                const isEmpty = !guest.name.trim() && 
                                !guest.aadhaarNumber.trim() && 
                                !guest.mobileNumber.trim() && 
                                !guest.age.trim() && 
                                !guest.address.trim();
                if (isEmpty) return;
            }

            if (!guest.name.trim()) {
                errors[`guest-${index}-name`] = "Guest name is required.";
            }
            
            const cleanAadhaar = guest.aadhaarNumber.replace(/\s/g, "");
            if (!cleanAadhaar) {
                errors[`guest-${index}-aadhaar`] = "Aadhaar is required.";
            } else if (!/^\d{12}$/.test(cleanAadhaar)) {
                errors[`guest-${index}-aadhaar`] = "Aadhaar must be exactly 12 digits.";
            }
            
            const cleanMobile = guest.mobileNumber.replace(/\s/g, "");
            if (!cleanMobile) {
                errors[`guest-${index}-mobile`] = "Mobile number is required.";
            } else if (!/^\d{10}$/.test(cleanMobile)) {
                errors[`guest-${index}-mobile`] = "Mobile number must be exactly 10 digits.";
            }
            
            if (guest.age && (parseInt(guest.age, 10) <= 0 || parseInt(guest.age, 10) > 120)) {
                errors[`guest-${index}-age`] = "Invalid age (1-120).";
            }
        });
        
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleConfirmBooking = async () => {
        if (!validateForm() || !selectedBookingRoom) return;
        
        setIsSubmitting(true);
        try {
            const activeGuests = guests.filter((g, index) => {
                if (index === 0) return true;
                return !!(g.name.trim() || g.aadhaarNumber.trim() || g.mobileNumber.trim() || g.age.trim() || g.address.trim());
            });

            const payload = {
                roomId: selectedBookingRoom.id,
                isHourly,
                checkIn: new Date(checkIn).toISOString(),
                checkOut: new Date(checkOut).toISOString(),
                guests: activeGuests.map(g => ({
                    name: g.name.trim(),
                    aadhaarNumber: g.aadhaarNumber.replace(/\s/g, ""),
                    mobileNumber: g.mobileNumber.replace(/\s/g, ""),
                    age: g.age ? parseInt(g.age, 10) : undefined,
                    address: g.address.trim() || undefined,
                })),
            };
            
            const res = await bookingService.createBooking(payload);
            if (res.success && res.data) {
                setCreatedBooking(res.data);
                setPaymentTotalAmount(res.data.totalPrice || 0);
                setPaymentAmountPaid(res.data.totalPrice || 0);
                setNotification(`Booking successfully confirmed for Room #${selectedBookingRoom.number}! Now enter payment details.`);
                setModalStep("payment");
                void loadInitialData();
            } else {
                setNotification(res.message || "Failed to confirm booking.");
            }
        } catch (error) {
            console.error("Booking failed:", error);
            setNotification(error instanceof Error ? error.message : "Failed to create booking.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleConfirmPayment = async () => {
        if (!createdBooking) return;
        setIsSubmitting(true);
        try {
            const payload = {
                paymentMethod,
                totalAmount: paymentTotalAmount,
                amountPaid: paymentAmountPaid,
                status: isPaymentCompleted ? "COMPLETED" : "PENDING",
                transactionId: paymentMethod === "ONLINE" ? paymentTransactionId.trim() : undefined,
            };
            const res = await bookingService.createOrUpdatePayment(String(createdBooking.id), payload);
            if (res.success) {
                setNotification(`Payment details successfully saved for booking #${createdBooking.id}!`);
                setIsModalOpen(false);
                void loadInitialData();
            } else {
                setNotification(res.message || "Failed to save payment details.");
            }
        } catch (error) {
            console.error("Payment failed:", error);
            setNotification(error instanceof Error ? error.message : "Failed to record payment.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePayLater = () => {
        setNotification(`Booking #${createdBooking?.id || ""} registered successfully. Payment will be settled later.`);
        setIsModalOpen(false);
        void loadInitialData();
    };

    const handleInputChange = (index: number, field: string, value: string) => {
        let cleanValue = value;
        if (field === "aadhaarNumber") {
            cleanValue = value.replace(/\D/g, "").substring(0, 12);
        } else if (field === "mobileNumber") {
            cleanValue = value.replace(/\D/g, "").substring(0, 10);
        }

        setGuests(prev => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: cleanValue };
            return next;
        });
        if (validationErrors[`guest-${index}-${field}`]) {
            setValidationErrors(prev => {
                const next = { ...prev };
                delete next[`guest-${index}-${field}`];
                return next;
            });
        }
    };

    const handleAddGuest = () => {
        setGuests(prev => [...prev, { name: "", aadhaarNumber: "", mobileNumber: "", age: "", address: "" }]);
    };

    const handleRemoveGuest = (index: number) => {
        setGuests(prev => prev.filter((_, idx) => idx !== index));
    };

    const calculatedPrice = React.useMemo(() => {
        if (!selectedBookingRoom || !checkIn || !checkOut) return 0;
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
        
        const diffMs = end.getTime() - start.getTime();
        if (diffMs <= 0) return 0;
        
        if (isHourly) {
            const diffHours = diffMs / (1000 * 60 * 60);
            const hours = Math.max(1, Math.ceil(diffHours));
            return hours * selectedBookingRoom.hourlyRate;
        } else {
            const diffDays = diffMs / (1000 * 60 * 60 * 24);
            const days = Math.max(1, Math.ceil(diffDays));
            return days * selectedBookingRoom.dailyRate;
        }
    }, [selectedBookingRoom, checkIn, checkOut, isHourly]);



    return (
        <main aria-label="Hotel Bookings Workspace" className="min-h-full w-full bg-[#f2f8ff] text-slate-800">
            {/* Top Tab Shell */}
            <BookingTabs
                frontDeskCount={filteredRooms.length}
                onlineCount={reservations.length}
                value={activeTab}
                onValueChange={setActiveTab}
            />

            {/* Main Working Area */}
            <div className="p-4 sm:p-5 space-y-4">
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

                {activeTab === "frontDesk" ? (
                    <FrontDeskBookingView
                        isSearching={isSearching}
                        rooms={filteredRooms}
                        onBookNow={handleBookNow}
                        onSearch={handleSearch}
                    />
                ) : (
                    <OnlinePlatformBookingsView reservations={reservations} />
                )}
            </div>

            {/* Walk-in Booking Modal */}
            {isModalOpen && selectedBookingRoom && (
                <div
                    aria-modal="true"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200"
                    role="dialog"
                >
                    <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="relative flex items-center justify-between px-5 py-4 border-b border-slate-200 bg-slate-50/50">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">
                                    {modalStep === "payment" ? `Payment Details - Room #${selectedBookingRoom.number}` : `Book Room #${selectedBookingRoom.number}`}
                                </h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    {modalStep === "payment" && createdBooking
                                        ? `Booking ID: #${createdBooking.id} • ${selectedBookingRoom.roomType} Room`
                                        : `${selectedBookingRoom.roomType} Room (Capacity: ${selectedBookingRoom.capacity} Guests)`
                                    }
                                </p>
                            </div>
                            <button
                                aria-label="Close booking modal"
                                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                                onClick={() => setIsModalOpen(false)}
                                type="button"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Form Body with slide-fade transition wrapper */}
                        <div className="flex-1 overflow-hidden relative min-h-[400px]">
                            {/* Step 1: Booking Form */}
                            <div className={cn(
                                "absolute inset-0 overflow-y-auto p-5 sm:p-6 space-y-6 transition-all duration-300 transform",
                                modalStep === "form"
                                    ? "translate-x-0 opacity-100 pointer-events-auto"
                                    : "-translate-x-full opacity-0 pointer-events-none"
                            )}>
                                {/* Booking Parameters (Dates & Rate Mode) */}
                                <div className="p-4 rounded-xl bg-blue-50/30 border border-blue-100 space-y-4">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700">Booking Parameters</h3>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Check-in input */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-600 block">Check-in Date & Time *</label>
                                            <input
                                                type="datetime-local"
                                                className={cn(
                                                    "w-full rounded-lg border bg-white px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500",
                                                    validationErrors.checkIn ? "border-red-400 ring-1 ring-red-400" : "border-slate-200"
                                                )}
                                                value={checkIn}
                                                onChange={e => {
                                                    setCheckIn(e.target.value);
                                                    if (validationErrors.checkIn) {
                                                        setValidationErrors(prev => {
                                                            const next = { ...prev };
                                                            delete next.checkIn;
                                                            return next;
                                                        });
                                                    }
                                                }}
                                            />
                                            {validationErrors.checkIn && (
                                                <p className="text-[10px] text-red-500 font-medium">{validationErrors.checkIn}</p>
                                            )}
                                        </div>

                                        {/* Check-out input */}
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-slate-600 block">Check-out Date & Time *</label>
                                            <input
                                                type="datetime-local"
                                                className={cn(
                                                    "w-full rounded-lg border bg-white px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500",
                                                    validationErrors.checkOut ? "border-red-400 ring-1 ring-red-400" : "border-slate-200"
                                                )}
                                                value={checkOut}
                                                onChange={e => {
                                                    setCheckOut(e.target.value);
                                                    if (validationErrors.checkOut) {
                                                        setValidationErrors(prev => {
                                                            const next = { ...prev };
                                                            delete next.checkOut;
                                                            return next;
                                                        });
                                                    }
                                                }}
                                            />
                                            {validationErrors.checkOut && (
                                                <p className="text-[10px] text-red-500 font-medium">{validationErrors.checkOut}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Hourly Switch toggle */}
                                    <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50">
                                        <input
                                            type="checkbox"
                                            id="hourly-toggle"
                                            checked={isHourly}
                                            onChange={e => setIsHourly(e.target.checked)}
                                            className="h-4 w-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        />
                                        <label htmlFor="hourly-toggle" className="text-xs font-semibold text-slate-700 cursor-pointer selection:bg-transparent">
                                            Enable Hourly Rate Booking (Calculates hourly billing based on durations)
                                        </label>
                                    </div>
                                </div>

                                {/* Guest details list */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Guests Details</h3>
                                    </div>

                                    <div className="space-y-4">
                                        {guests.map((guest, index) => (
                                            <div
                                                key={index}
                                                className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3 relative"
                                            >
                                                <div className="flex justify-between items-center pb-2 border-b border-slate-200/50">
                                                    <span className="text-xs font-bold text-slate-700">
                                                        Guest #{index + 1} {index === 0 ? "(Primary Guest)" : ""}
                                                    </span>
                                                    {index > 0 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveGuest(index)}
                                                            className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                                                            aria-label={`Remove guest ${index + 1}`}
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
                                                                validationErrors[`guest-${index}-name`] ? "border-red-400 ring-1 ring-red-400" : "border-slate-200"
                                                            )}
                                                            value={guest.name}
                                                            onChange={e => handleInputChange(index, "name", e.target.value)}
                                                        />
                                                        {validationErrors[`guest-${index}-name`] && (
                                                            <p className="text-[10px] text-red-500 font-medium">
                                                                {validationErrors[`guest-${index}-name`]}
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
                                                                validationErrors[`guest-${index}-aadhaar`] ? "border-red-400 ring-1 ring-red-400" : "border-slate-200"
                                                            )}
                                                            value={guest.aadhaarNumber}
                                                            onChange={e => handleInputChange(index, "aadhaarNumber", e.target.value)}
                                                        />
                                                        {validationErrors[`guest-${index}-aadhaar`] && (
                                                            <p className="text-[10px] text-red-500 font-medium">
                                                                {validationErrors[`guest-${index}-aadhaar`]}
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
                                                                validationErrors[`guest-${index}-mobile`] ? "border-red-400 ring-1 ring-red-400" : "border-slate-200"
                                                            )}
                                                            value={guest.mobileNumber}
                                                            onChange={e => {
                                                                const val = e.target.value.replace(/\D/g, '');
                                                                handleInputChange(index, "mobileNumber", val);
                                                            }}
                                                        />
                                                        {validationErrors[`guest-${index}-mobile`] && (
                                                            <p className="text-[10px] text-red-500 font-medium">
                                                                {validationErrors[`guest-${index}-mobile`]}
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
                                                            className={cn(
                                                                "w-full rounded-md border bg-white px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500",
                                                                validationErrors[`guest-${index}-age`] ? "border-red-400 ring-1 ring-red-400" : "border-slate-200"
                                                            )}
                                                            value={guest.age}
                                                            onChange={e => handleInputChange(index, "age", e.target.value)}
                                                        />
                                                        {validationErrors[`guest-${index}-age`] && (
                                                            <p className="text-[10px] text-red-500 font-medium">
                                                                {validationErrors[`guest-${index}-age`]}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Address */}
                                                    <div className="space-y-1 sm:col-span-2">
                                                        <label className="text-[10px] font-semibold text-slate-500 uppercase block">Address (Optional)</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Residential Address"
                                                            className="w-full rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                            value={guest.address}
                                                            onChange={e => handleInputChange(index, "address", e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-end pt-1">
                                        <button
                                            type="button"
                                            onClick={handleAddGuest}
                                            className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 shadow-3xs"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Guest
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2: Payment Details */}
                            <div className={cn(
                                "absolute inset-0 overflow-y-auto p-5 sm:p-6 space-y-6 transition-all duration-300 transform bg-white",
                                modalStep === "payment"
                                    ? "translate-x-0 opacity-100 pointer-events-auto"
                                    : "translate-x-full opacity-0 pointer-events-none"
                            )}>
                                {createdBooking && (
                                    <div className="space-y-6 text-xs">
                                        {/* Booking summary box */}
                                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 shadow-xs">
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Booking Summary</h3>
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                                                <div>
                                                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Primary Guest</span>
                                                    <span className="font-semibold text-slate-800">
                                                        {createdBooking.guests && createdBooking.guests.length > 0
                                                            ? createdBooking.guests[0].name
                                                            : "N/A"}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Booking Type</span>
                                                    <span className="font-semibold text-slate-800">
                                                        {createdBooking.isHourly ? "Hourly Rate Booking" : "Daily Rate Booking"}
                                                    </span>
                                                </div>
                                                <div className="col-span-2 pt-1 border-t border-slate-200/50">
                                                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Check-in / Check-out</span>
                                                    <span className="font-semibold text-slate-800">
                                                        {new Date(createdBooking.checkIn).toLocaleString()} to{" "}
                                                        {new Date(createdBooking.checkOut).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Payment fields form */}
                                        <div className="space-y-4">
                                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Payment Details</h3>
                                            
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {/* Payment Method select */}
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-slate-600 block">Payment Method *</label>
                                                    <select
                                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        value={paymentMethod}
                                                        onChange={e => setPaymentMethod(e.target.value as any)}
                                                    >
                                                        <option value="CASH">Cash</option>
                                                        <option value="ONLINE">Online Payment (UPI/Card)</option>
                                                    </select>
                                                </div>

                                                {/* Original Total Amount */}
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-slate-600 block">Original Price (₹)</label>
                                                    <input
                                                        type="number"
                                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        value={paymentTotalAmount}
                                                        onChange={e => setPaymentTotalAmount(parseFloat(e.target.value) || 0)}
                                                    />
                                                </div>

                                                {/* Amount Paid */}
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-slate-600 block">Amount Paid (₹) *</label>
                                                    <input
                                                        type="number"
                                                        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        value={paymentAmountPaid}
                                                        onChange={e => setPaymentAmountPaid(parseFloat(e.target.value) || 0)}
                                                    />
                                                </div>

                                                {/* Transaction ID (Online only) */}
                                                {paymentMethod === "ONLINE" && (
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-semibold text-slate-600 block">Transaction Reference ID</label>
                                                        <input
                                                            type="text"
                                                            placeholder="UPI / Card reference key"
                                                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                            value={paymentTransactionId}
                                                            onChange={e => setPaymentTransactionId(e.target.value)}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Completed checkmark */}
                                            <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50">
                                                <input
                                                    type="checkbox"
                                                    id="payment-status-toggle"
                                                    checked={isPaymentCompleted}
                                                    onChange={e => setIsPaymentCompleted(e.target.checked)}
                                                    className="h-4 w-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                />
                                                <label htmlFor="payment-status-toggle" className="text-xs font-semibold text-slate-700 cursor-pointer selection:bg-transparent">
                                                    Mark Payment as Completed (Status: {isPaymentCompleted ? "COMPLETED" : "PENDING"})
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t border-slate-200 bg-slate-50/50 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                            {modalStep === "form" ? (
                                <>
                                    <div className="text-left w-full sm:w-auto">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Estimated Rate</span>
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-xl font-extrabold text-slate-800">₹{calculatedPrice.toLocaleString()}</span>
                                            <span className="text-xs font-medium text-slate-500 font-semibold">
                                                (₹{isHourly ? `${selectedBookingRoom.hourlyRate}/hr` : `${selectedBookingRoom.dailyRate}/day`})
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex w-full sm:w-auto gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="flex-1 sm:flex-none rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer text-center outline-none"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleConfirmBooking}
                                            disabled={isSubmitting}
                                            className="flex-1 sm:flex-none rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 hover:-translate-y-[1px] transition-all cursor-pointer text-center outline-none disabled:opacity-50 disabled:pointer-events-none"
                                        >
                                            {isSubmitting ? "Confirming..." : "Confirm Booking"}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="text-left w-full sm:w-auto">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Payment Status</span>
                                        <div className="flex items-baseline gap-1.5 mt-0.5">
                                            {isPaymentCompleted ? (
                                                <span className="rounded-full bg-green-100 border border-green-200 px-3 py-0.5 text-xs font-bold text-green-700 uppercase">
                                                    Completed: ₹{paymentAmountPaid.toLocaleString()}
                                                </span>
                                            ) : (
                                                <span className="rounded-full bg-amber-100 border border-amber-200 px-3 py-0.5 text-xs font-bold text-amber-700 uppercase">
                                                    Pending: ₹{paymentAmountPaid.toLocaleString()}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex w-full sm:w-auto gap-3">
                                        <button
                                            type="button"
                                            onClick={handlePayLater}
                                            className="flex-1 sm:flex-none rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer text-center outline-none"
                                        >
                                            Pay Later (Skip)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleConfirmPayment}
                                            disabled={isSubmitting}
                                            className="flex-1 sm:flex-none rounded-lg bg-blue-600 px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 hover:-translate-y-[1px] transition-all cursor-pointer text-center outline-none disabled:opacity-50 disabled:pointer-events-none"
                                        >
                                            {isSubmitting ? "Saving..." : "Confirm Payment"}
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
