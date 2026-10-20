import * as React from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export interface BookingDetailsDialogProps {
    isOpen: boolean;
    booking: any;
    rooms: any[];
    roomTypes: any[];
    onClose: () => void;
    onSave: (payload: {
        totalPrice: number;
        checkIn: string;
        checkOut: string;
        isHourly: boolean;
        guests: Array<{
            name: string;
            aadhaarNumber: string;
            mobileNumber: string;
            age?: number;
            address?: string;
        }>;
    }) => Promise<boolean>;
}

export function BookingDetailsDialog({
    isOpen,
    booking,
    rooms,
    roomTypes,
    onClose,
    onSave,
}: BookingDetailsDialogProps) {
    const { toast } = useToast();
    const [editCheckIn, setEditCheckIn] = React.useState<string>("");
    const [editCheckOut, setEditCheckOut] = React.useState<string>("");
    const [editIsHourly, setEditIsHourly] = React.useState<boolean>(false);
    const [editGuests, setEditGuests] = React.useState<any[]>([]);
    const [editValidationErrors, setEditValidationErrors] = React.useState<Record<string, string>>({});
    const [isSaving, setIsSaving] = React.useState<boolean>(false);

    const isReadOnly = booking && (booking.status === "CHECKED_OUT" || booking.status === "CANCELLED");

    const ensureDateTimeLocalString = (dateStr?: string, defaultTime = "12:00") => {
        if (!dateStr) return "";
        if (dateStr.includes("T")) {
            return dateStr.substring(0, 16);
        }
        return `${dateStr}T${defaultTime}`;
    };

    const toLocalISOString = (date: Date): string => {
        const tzOffset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
    };

    React.useEffect(() => {
        if (booking) {
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
        }
    }, [booking]);

    const calculatedEditPrice = React.useMemo(() => {
        if (!booking || !editCheckIn || !editCheckOut) return 0;
        const roomObj = rooms.find(r => String(r.id) === String(booking.roomId));
        if (!roomObj) return booking.totalPrice || 0;
        
        const rtConfig = roomTypes.find(type => type.name === roomObj.roomType);
        if (!rtConfig) return booking.totalPrice || 0;

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
    }, [booking, editCheckIn, editCheckOut, editIsHourly, rooms, roomTypes]);

    if (!isOpen || !booking) return null;

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
        setEditGuests(prev => [
            ...prev,
            { name: "", aadhaarNumber: "", mobileNumber: "", age: "", address: "" }
        ]);
    };

    const handleRemoveEditGuest = (index: number) => {
        setEditGuests(prev => prev.filter((_, idx) => idx !== index));
    };

    const validateEditForm = () => {
        const errors: Record<string, string> = {};
        
        if (!editCheckIn) {
            errors.checkIn = "Check-in date is required.";
        }
        if (!editCheckOut) {
            errors.checkOut = "Check-out date is required.";
        }
        
        if (editCheckIn && editCheckOut) {
            const inDate = new Date(editCheckIn);
            const outDate = new Date(editCheckOut);
            if (outDate <= inDate) {
                errors.checkOut = "Check-out must be after check-in.";
            }
        }
        
        editGuests.forEach((guest, index) => {
            const guestName = guest.name || "";
            const guestAadhaar = guest.aadhaarNumber || "";
            const guestMobile = guest.mobileNumber || "";
            
            if (!guestName.trim()) {
                errors[`guest-${index}-name`] = "Name is required.";
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

    const handleSave = async () => {
        if (!validateEditForm()) {
            toast("Please correct the validation errors in the form.", "error");
            return;
        }
        
        setIsSaving(true);
        try {
            const activeGuests = editGuests.filter((g, index) => {
                if (index === 0) return true;
                return !!((g.name || "").trim() || (g.aadhaarNumber || "").trim() || (g.mobileNumber || "").trim() || (g.age || "").trim() || (g.address || "").trim());
            });

            const payload = {
                totalPrice: calculatedEditPrice,
                checkIn: toLocalISOString(new Date(editCheckIn)),
                checkOut: toLocalISOString(new Date(editCheckOut)),
                isHourly: editIsHourly,
                guests: activeGuests.map(g => ({
                    name: (g.name || "").trim(),
                    aadhaarNumber: (g.aadhaarNumber || "").replace(/\D/g, ""),
                    mobileNumber: (g.mobileNumber || "").replace(/\D/g, ""),
                    age: g.age ? parseInt(g.age, 10) : undefined,
                    address: (g.address || "").trim() || undefined,
                })),
            };

            const success = await onSave(payload);
            if (success) {
                onClose();
            }
        } catch (error) {
            console.error("Save edit error:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
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
                            {isReadOnly ? `View Booking #${booking.id}` : `Edit Booking #${booking.id}`}
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {isReadOnly ? "View dates, hourly mode, and guests list." : "Update dates, hourly mode, or guests list."}
                        </p>
                    </div>
                    <button
                        aria-label="Close edit booking modal"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                        onClick={onClose}
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
                        
                        <div className={cn("grid grid-cols-1 gap-4", booking.actualCheckOut ? "sm:grid-cols-3" : "sm:grid-cols-2")}>
                            {/* Check-in input */}
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-600 block">Check-in Date & Time *</label>
                                <input
                                    type="datetime-local"
                                    disabled={isReadOnly}
                                    className={cn(
                                        "w-full rounded-lg border px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500",
                                        editValidationErrors.checkIn ? "border-red-400 ring-1 ring-red-400" : "border-slate-200",
                                        isReadOnly ? "bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed" : "bg-white"
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
                                <label className="text-xs font-semibold text-slate-600 block">
                                    {booking.actualCheckOut ? "Check-out (Scheduled) *" : "Check-out Date & Time *"}
                                </label>
                                <input
                                    type="datetime-local"
                                    disabled={isReadOnly}
                                    className={cn(
                                        "w-full rounded-lg border px-3 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500",
                                        editValidationErrors.checkOut ? "border-red-400 ring-1 ring-red-400" : "border-slate-200",
                                        isReadOnly ? "bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed" : "bg-white"
                                    )}
                                    value={editCheckOut}
                                    onChange={e => setEditCheckOut(e.target.value)}
                                />
                                {editValidationErrors.checkOut && (
                                    <p className="text-[10px] text-red-500 font-medium">{editValidationErrors.checkOut}</p>
                                )}
                            </div>

                            {/* Actual Check-out input */}
                            {booking.actualCheckOut && (
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-emerald-700 block">Actual Check-out</label>
                                    <input
                                        type="datetime-local"
                                        disabled
                                        className="w-full rounded-lg border bg-emerald-50/30 border-emerald-250 px-3 py-2 text-xs font-medium text-emerald-850 cursor-not-allowed"
                                        value={ensureDateTimeLocalString(booking.actualCheckOut)}
                                        onChange={() => {}}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Hourly Switch toggle */}
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50">
                            <input
                                type="checkbox"
                                id="edit-hourly-toggle"
                                disabled={isReadOnly}
                                checked={editIsHourly}
                                onChange={e => setEditIsHourly(e.target.checked)}
                                className={cn("h-4 w-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500", isReadOnly ? "cursor-not-allowed" : "cursor-pointer")}
                            />
                            <label htmlFor="edit-hourly-toggle" className="text-xs font-semibold text-slate-700 cursor-pointer selection:bg-transparent">
                                Enable Hourly Rate Booking (Calculates hourly billing based on durations)
                            </label>
                        </div>

                        {/* Billing Price Display */}
                        <div className="flex justify-between items-center bg-slate-100/50 rounded-lg p-2.5 border border-slate-200/60 mt-2">
                            <span className="font-semibold text-slate-700">{isReadOnly ? "Total Price:" : "Recalculated Price:"}</span>
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
                                        {!isReadOnly && index > 0 && (
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
                                                disabled={isReadOnly}
                                                className={cn(
                                                    "w-full rounded-md border px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500",
                                                    editValidationErrors[`guest-${index}-name`] ? "border-red-400 ring-1 ring-red-400" : "border-slate-200",
                                                    isReadOnly ? "bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed" : "bg-white"
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
                                                disabled={isReadOnly}
                                                className={cn(
                                                    "w-full rounded-md border px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500",
                                                    editValidationErrors[`guest-${index}-aadhaar`] ? "border-red-400 ring-1 ring-red-400" : "border-slate-200",
                                                    isReadOnly ? "bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed" : "bg-white"
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
                                                disabled={isReadOnly}
                                                className={cn(
                                                    "w-full rounded-md border px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500",
                                                    editValidationErrors[`guest-${index}-mobile`] ? "border-red-400 ring-1 ring-red-400" : "border-slate-200",
                                                    isReadOnly ? "bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed" : "bg-white"
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
                                                disabled={isReadOnly}
                                                className={cn(
                                                    "w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500",
                                                    isReadOnly ? "bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed" : "bg-white"
                                                )}
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
                                                disabled={isReadOnly}
                                                className={cn(
                                                    "w-full rounded-md border border-slate-200 px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-blue-500",
                                                    isReadOnly ? "bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed" : "bg-white"
                                                )}
                                                value={guest.address}
                                                onChange={e => handleEditGuestInputChange(index, "address", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {!isReadOnly && (
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
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-5 py-4 border-t border-slate-200 bg-slate-50/50">
                    {isReadOnly ? (
                        <button
                            type="button"
                            className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 py-2 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    ) : (
                        <>
                            <button
                                type="button"
                                className="flex-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 py-2 text-xs font-semibold text-slate-600 transition-all cursor-pointer"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={isSaving}
                                className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 py-2 text-xs font-semibold text-white shadow-sm transition-all cursor-pointer disabled:opacity-50"
                                onClick={handleSave}
                            >
                                {isSaving ? "Saving Changes..." : "Save Changes"}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
