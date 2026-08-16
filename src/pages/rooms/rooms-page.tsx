import * as React from "react";
import { Plus, X, BedDouble, Crown, Gem } from "lucide-react";
import { CreateOrEditRoomDialog } from "@/components/feature/rooms/CreateOrEditRoomDialog";
import { RoomBox } from "@/components/feature/rooms/RoomBox";
import { RoomDetailsDrawer } from "@/components/feature/rooms/RoomDetailsDrawer";
import { INITIAL_BOOKING_ORDERS } from "@/features/rooms/rooms-data";
import type { BookingOrder, Room } from "@/types/rooms";
import { roomService } from "@/api/room-service";
import { roomTypeService } from "@/api/room-type-service";
import { bookingService } from "@/api/booking-service";
import type { RoomTypeConfig } from "@/pages/settings/room-types-dialog";
import { useToast } from "@/hooks/use-toast";
import { TOAST_MESSAGES } from "@/constants/toast-messages";

export function RoomsPage() {
    const { toast } = useToast();
    const [rooms, setRooms] = React.useState<Room[]>([]);
    const [availableRoomTypes, setAvailableRoomTypes] = React.useState<RoomTypeConfig[]>([]);
    const [bookingOrders] = React.useState<Record<string, BookingOrder>>(INITIAL_BOOKING_ORDERS);
    const [selectedRoom, setSelectedRoom] = React.useState<Room | null>(null);
    const [activeBooking, setActiveBooking] = React.useState<BookingOrder | undefined>(undefined);
    const [isAddDialogOpen, setIsAddDialogOpen] = React.useState<boolean>(false);
    const [isLegendOpen, setIsLegendOpen] = React.useState<boolean>(false);
    const [editingRoom, setEditingRoom] = React.useState<Room | null>(null);

    React.useEffect(() => {
        const loadInitialData = async () => {
            try {
                const roomsRes = await roomService.getRooms();
                if (roomsRes.success && roomsRes.data) {
                    setRooms(roomsRes.data);
                }
            } catch (error) {
                console.error("Failed to load rooms:", error);
            }

            try {
                const typesRes = await roomTypeService.getRoomTypes();
                if (typesRes.success && typesRes.data) {
                    setAvailableRoomTypes(typesRes.data);
                }
            } catch (error) {
                console.error("Failed to load room types:", error);
            }
        };
        void loadInitialData();
    }, []);

    const handleCardClick = (room: Room) => {
        if (selectedRoom?.id === room.id) {
            setSelectedRoom(null);
        } else {
            setSelectedRoom(room);
        }
    };

    React.useEffect(() => {
        const fetchActiveBooking = async () => {
            if (selectedRoom && selectedRoom.roomStatus !== "Vacant") {
                try {
                    const res = await bookingService.getActiveBookingForRoom(selectedRoom.id);
                    if (res.success && res.data) {
                        const b = res.data;
                        setActiveBooking({
                            id: String(b.id),
                            roomId: String(b.roomId),
                            isHourly: b.isHourly,
                            duration: {
                                start: b.checkIn,
                                end: b.checkOut,
                            },
                            guests: b.guests ? b.guests.map((g: any) => ({
                                id: String(g.id),
                                name: g.name,
                                age: g.age,
                                phone: g.mobileNumber,
                                identityDocument: g.aadhaarNumber,
                            })) : [],
                            payment: b.payment,
                        });
                    } else {
                        setActiveBooking(undefined);
                    }
                } catch (error) {
                    console.error("Failed to fetch active booking:", error);
                    setActiveBooking(undefined);
                }
            } else {
                setActiveBooking(undefined);
            }
        };
        void fetchActiveBooking();
    }, [selectedRoom]);

    const handleUpdatePayment = async (bookingId: string, payload: any) => {
        try {
            const res = await bookingService.createOrUpdatePayment(bookingId, payload);
            if (res.success) {
                toast("Payment details updated successfully!", "success");
                if (selectedRoom) {
                    const activeRes = await bookingService.getActiveBookingForRoom(selectedRoom.id);
                    if (activeRes.success && activeRes.data) {
                        const b = activeRes.data;
                        setActiveBooking({
                            id: String(b.id),
                            roomId: String(b.roomId),
                            isHourly: b.isHourly,
                            duration: {
                                start: b.checkIn,
                                end: b.checkOut,
                            },
                            guests: b.guests ? b.guests.map((g: any) => ({
                                id: String(g.id),
                                name: g.name,
                                age: g.age,
                                phone: g.mobileNumber,
                                identityDocument: g.aadhaarNumber,
                            })) : [],
                            payment: b.payment,
                        });
                    }
                }
                return true;
            } else {
                toast(res.message || "Failed to update payment details.", "error");
                return false;
            }
        } catch (error) {
            console.error("Failed to update payment details:", error);
            toast("Failed to update payment details.", "error");
            return false;
        }
    };

    const handleSaveRoom = async (roomData: Omit<Room, "id" | "roomStatus" | "roomState">) => {
        try {
            if (editingRoom) {
                const res = await roomService.updateRoom(editingRoom.id, roomData);
                if (res.success && res.data) {
                    const updatedRoom = res.data;
                    setRooms(prev => prev.map(r => r.id === editingRoom.id ? updatedRoom : r));
                    // Keep selected room in sync
                    if (selectedRoom?.id === editingRoom.id) {
                        setSelectedRoom(updatedRoom);
                    }
                    toast(TOAST_MESSAGES.ROOM_UPDATE_SUCCESS, "success");
                }
            } else {
                const payload = {
                    ...roomData,
                    roomStatus: "Vacant" as const,
                    roomState: "Clean" as const,
                    lastCleaned: "Just created",
                };
                const res = await roomService.createRoom(payload);
                if (res.success && res.data) {
                    const newRoom = res.data;
                    setRooms(prev => [newRoom, ...prev]);
                    toast(TOAST_MESSAGES.ROOM_ADD_SUCCESS, "success");
                }
            }
            setIsAddDialogOpen(false);
            setEditingRoom(null);
        } catch (error) {
            console.error("Failed to save room:", error);
            const message = error instanceof Error ? error.message : TOAST_MESSAGES.ROOM_SAVE_ERROR;
            toast(message, "error");
        }
    };

    const handleUpdateRoom = async (roomId: string, updates: Partial<Room>) => {
        try {
            const res = await roomService.updateRoom(roomId, updates);
            if (res.success && res.data) {
                const updatedRoom = res.data;
                setRooms(prev => prev.map(r => r.id === roomId ? updatedRoom : r));
                if (selectedRoom?.id === roomId) {
                    setSelectedRoom(updatedRoom);
                }
                toast(TOAST_MESSAGES.ROOM_CONDITION_UPDATE_SUCCESS, "success");
            }
        } catch (error) {
            console.error("Failed to update room details:", error);
            const message = error instanceof Error ? error.message : TOAST_MESSAGES.ROOM_CONDITION_UPDATE_ERROR;
            toast(message, "error");
        }
    };

    const handleDeleteRoom = async (roomId: string) => {
        if (!confirm("Are you sure you want to delete this room?")) return;
        try {
            const res = await roomService.deleteRoom(roomId);
            if (res.success) {
                setRooms(prev => prev.filter(r => r.id !== roomId));
                setSelectedRoom(null);
                toast(TOAST_MESSAGES.ROOM_DELETE_SUCCESS, "success");
            }
        } catch (error) {
            console.error("Failed to delete room:", error);
            const message = error instanceof Error ? error.message : TOAST_MESSAGES.ROOM_DELETE_ERROR;
            toast(message, "error");
        }
    };

    const handleTriggerEdit = (room: Room) => {
        setEditingRoom(room);
        setIsAddDialogOpen(true);
    };

    const enrichedRooms = React.useMemo(() => {
        return rooms.map(room => {
            const rtConfig = availableRoomTypes.find(type => type.name === room.roomType);
            return {
                ...room,
                isPremium: rtConfig?.isPremium,
                premiumType: rtConfig?.premiumType,
                basePrice: rtConfig?.basePrice,
            };
        });
    }, [rooms, availableRoomTypes]);

    const enrichedSelectedRoom = React.useMemo(() => {
        if (!selectedRoom) return null;
        const rtConfig = availableRoomTypes.find(type => type.name === selectedRoom.roomType);
        return {
            ...selectedRoom,
            isPremium: rtConfig?.isPremium,
            premiumType: rtConfig?.premiumType,
            basePrice: rtConfig?.basePrice,
        };
    }, [selectedRoom, availableRoomTypes]);

    return (
        <main
            aria-label="Hotel Room Operations"
            className="relative min-h-full w-full bg-white p-4 sm:p-5 text-slate-800"
        >
            {/* Top bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <h1 className="text-2xl font-bold text-slate-800 leading-tight">Rooms</h1>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <button
                        className="flex items-center justify-center gap-1.5 rounded-[6px] bg-[#f3f4f6] border border-[#e5e7eb] px-4 py-2 text-sm font-medium text-[#4b5563] shadow-2xs hover:bg-[#e5e7eb] transition-all flex-1 sm:flex-none cursor-pointer"
                        onClick={() => setIsLegendOpen(true)}
                        type="button"
                    >
                        Legend
                    </button>
                    <button
                        className="flex items-center justify-center gap-1.5 rounded-[6px] bg-[#3b82f6] px-4 py-2 text-sm font-medium text-white shadow-2xs hover:bg-[#2563eb] hover:-translate-y-[1px] transition-all flex-1 sm:flex-none cursor-pointer"
                        onClick={() => {
                            setEditingRoom(null);
                            setIsAddDialogOpen(true);
                        }}
                        type="button"
                    >
                        <Plus className="h-4 w-4" />
                        Add Room
                    </button>
                </div>
            </div>

            {/* Room Grid */}
            <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-4 mb-4">
                {enrichedRooms.map(room => (
                    <RoomBox
                        key={room.id}
                        bookingOrder={bookingOrders[room.id]}
                        room={room}
                        selectedRoom={enrichedSelectedRoom}
                        onClick={() => handleCardClick(room)}
                    />
                ))}
            </div>

            {/* Grid Count Footer */}
            <div className="flex justify-end pt-2 text-sm text-slate-500 font-normal">
                Displaying {rooms.length} of {rooms.length} rooms
            </div>

            {/* Room Details Overlay Drawer */}
            <RoomDetailsDrawer
                bookingOrder={activeBooking}
                room={enrichedSelectedRoom}
                onClose={() => setSelectedRoom(null)}
                onUpdateRoom={handleUpdateRoom}
                onDeleteRoom={handleDeleteRoom}
                onEditRoom={handleTriggerEdit}
                onUpdatePayment={handleUpdatePayment}
            />

            {/* Add Room Dialog */}
            <CreateOrEditRoomDialog
                isOpen={isAddDialogOpen}
                editingRoom={editingRoom}
                availableRoomTypes={availableRoomTypes}
                onClose={() => {
                    setIsAddDialogOpen(false);
                    setEditingRoom(null);
                }}
                onSave={handleSaveRoom}
            />

            {/* Legend Modal */}
            {isLegendOpen && (
                <div
                    aria-modal="true"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 animate-in fade-in duration-200"
                    role="dialog"
                >
                    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                            <div>
                                <h2 className="text-base font-bold text-slate-800">Rooms Map Legend</h2>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Understand room types, conditions, and occupancy statuses.
                                </p>
                            </div>
                            <button
                                aria-label="Close legend"
                                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
                                onClick={() => setIsLegendOpen(false)}
                                type="button"
                            >
                                <X className="h-4.5 w-4.5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="space-y-5 overflow-y-auto pr-1 scrollbar-thin text-sm text-slate-700">
                            {/* Room Categories */}
                            <div className="space-y-2.5">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Room Categories & Icons
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-150">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400">
                                            <BedDouble className="h-4.5 w-4.5" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-800 text-xs">Standard Room</div>
                                            <div className="text-[10px] text-slate-500">Standard bedding configuration and regular pricing rules.</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-150">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-blue-500">
                                            <Crown className="h-4.5 w-4.5" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-800 text-xs">Premium Male Room (King)</div>
                                            <div className="text-[10px] text-slate-500">Premium king suite designated or optimized for male occupancy.</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg border border-slate-150">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-rose-500">
                                            <Gem className="h-4.5 w-4.5" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-800 text-xs">Premium Female Room (Queen)</div>
                                            <div className="text-[10px] text-slate-500">Premium queen suite designated or optimized for female occupancy.</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Room Statuses */}
                            <div className="space-y-2.5">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Occupancy Status (Card Theme)
                                </h3>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 text-slate-800">
                                        <span className="h-2.5 w-2.5 rounded-full border border-slate-300 bg-white" />
                                        <span>Vacant</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-[#ebf5ff] border border-[#3b82f6]/20 text-[#1e3a8a] font-medium">
                                        <span className="h-2.5 w-2.5 rounded-full bg-[#3b82f6]" />
                                        <span>Occupied</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-[#fff7ed] border border-[#f97316]/20 text-[#9a3412] font-medium">
                                        <span className="h-2.5 w-2.5 rounded-full bg-[#f97316]" />
                                        <span>Stay Over</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-[#f0fdf4] border border-[#10b981]/20 text-[#065f46] font-medium">
                                        <span className="h-2.5 w-2.5 rounded-full bg-[#10b981]" />
                                        <span>Check In</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-2 rounded-lg bg-[#fef2f2] border border-[#ef4444]/20 text-[#991b1b] font-medium">
                                        <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
                                        <span>Check Out</span>
                                    </div>
                                </div>
                            </div>

                            {/* Room Conditions */}
                            <div className="space-y-2.5">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    Room Condition (Badge)
                                </h3>
                                <div className="flex flex-wrap gap-2 text-[10px]">
                                    <span className="rounded-full bg-[#f0fdf4] border border-[#10b981] px-2 py-0.5 font-bold text-[#065f46]">
                                        Clean
                                    </span>
                                    <span className="rounded-full bg-[#fef2f2] border border-[#ef4444] px-2 py-0.5 font-bold text-[#991b1b]">
                                        Dirty
                                    </span>
                                    <span className="rounded-full bg-[#ebf5ff] border border-[#3b82f6] px-2 py-0.5 font-bold text-[#1e3a8a]">
                                        Inspected
                                    </span>
                                    <span className="rounded-full bg-slate-100 border border-slate-300 px-2 py-0.5 font-bold text-slate-700">
                                        Out of Service
                                    </span>
                                    <span className="rounded-full bg-slate-400 border border-slate-600 px-2 py-0.5 font-bold text-white">
                                        Out of Order
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end pt-4 border-t border-slate-100 mt-5">
                            <button
                                className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
                                onClick={() => setIsLegendOpen(false)}
                                type="button"
                            >
                                Got it
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
