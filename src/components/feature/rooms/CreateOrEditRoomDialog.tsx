import * as React from "react";
import { X, Layers, Hash, Users, BookOpen } from "lucide-react";
import type { Room } from "@/types/rooms";
import type { RoomTypeConfig } from "@/pages/settings/room-types-dialog";

export interface CreateOrEditRoomDialogProps {
    isOpen: boolean;
    editingRoom?: Room | null;
    availableRoomTypes: RoomTypeConfig[];
    onClose: () => void;
    onSave: (roomData: Omit<Room, "id" | "roomStatus" | "roomState">) => void;
}

export function CreateOrEditRoomDialog({
    isOpen,
    editingRoom,
    availableRoomTypes,
    onClose,
    onSave,
}: CreateOrEditRoomDialogProps) {
    const [floor, setFloor] = React.useState<string>("");
    const [number, setNumber] = React.useState<string>("");
    const [roomType, setRoomType] = React.useState<string>("");
    const [capacity, setCapacity] = React.useState<number>(2);
    const [error, setError] = React.useState<string>("");

    React.useEffect(() => {
        if (isOpen) {
            if (editingRoom) {
                setFloor(String(editingRoom.floor));
                setNumber(editingRoom.number);
                setRoomType(editingRoom.roomType);
                setCapacity(editingRoom.capacity);
            } else {
                setFloor("1st Floor");
                setNumber("");
                // Default to the first configured room type if available
                if (availableRoomTypes.length > 0) {
                    setRoomType(availableRoomTypes[0].name);
                    setCapacity(availableRoomTypes[0].maxOccupancy);
                } else {
                    setRoomType("");
                    setCapacity(2);
                }
            }
            setError("");
        }
    }, [isOpen, editingRoom, availableRoomTypes]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!number.trim()) {
            setError("Room number is required.");
            return;
        }
        if (!floor.trim()) {
            setError("Floor layout is required.");
            return;
        }
        if (!roomType) {
            setError("Room type is required. Please configure room types first.");
            return;
        }
        if (capacity < 1) {
            setError("Capacity must be at least 1 guest.");
            return;
        }

        onSave({
            floor: floor.trim(),
            number: number.trim(),
            roomType,
            capacity,
        });
        onClose();
    };

    return (
        <div
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 animate-in fade-in duration-200"
            role="dialog"
        >
            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                    <div>
                        <h2 className="text-base font-bold text-slate-800">
                            {editingRoom ? "Edit Room Details" : "Add Room to Inventory"}
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Set up room floor position, type configurations, and maximum capacity.
                        </p>
                    </div>
                    <button
                        aria-label="Close dialog"
                        className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
                        onClick={onClose}
                        type="button"
                    >
                        <X className="h-4.5 w-4.5" />
                    </button>
                </div>

                {/* Form Body */}
                <form className="space-y-4 overflow-y-auto pr-1 scrollbar-thin flex-1" onSubmit={handleSubmit}>
                    {error && (
                        <div className="rounded-lg bg-rose-50 border border-rose-100 p-3 text-xs text-rose-600 font-semibold animate-in shake">
                            {error}
                        </div>
                    )}

                    {/* Room Number */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                            <Hash className="w-3.5 h-3.5 text-slate-400" />
                            Room Number *
                        </label>
                        <input
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="e.g. 101, Deluxe-A"
                            required
                            type="text"
                            value={number}
                            onChange={e => setNumber(e.target.value)}
                        />
                    </div>

                    {/* Floor */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                            <Layers className="w-3.5 h-3.5 text-slate-400" />
                            Floor Position *
                        </label>
                        <input
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="e.g. 1st Floor, Ground Floor"
                            required
                            type="text"
                            value={floor}
                            onChange={e => setFloor(e.target.value)}
                        />
                    </div>

                    {/* Room Type Selector (Segmented buttons) */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                            Room Category *
                        </label>
                        {availableRoomTypes.length === 0 ? (
                            <p className="text-xs text-rose-500 italic py-1">
                                No room types configured. Please configure room types in Settings first.
                            </p>
                        ) : (
                            <div className="flex flex-wrap gap-2 pt-0.5">
                                {availableRoomTypes.map(rt => {
                                    const isSelected = roomType === rt.name;
                                    return (
                                        <button
                                            key={rt.id}
                                            type="button"
                                            onClick={() => {
                                                setRoomType(rt.name);
                                                setCapacity(rt.maxOccupancy);
                                            }}
                                            className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                                                isSelected
                                                    ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                                                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300"
                                            }`}
                                        >
                                            {rt.name}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Room Capacity */}
                    <div className="space-y-1.5">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            Maximum Capacity (Guests) *
                        </label>
                        <input
                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            min="1"
                            required
                            type="number"
                            value={capacity}
                            onChange={e => setCapacity(Number(e.target.value))}
                        />
                        <p className="text-[10px] text-slate-400 leading-normal">
                            Prefilled from category default settings. Customize if this specific room has different bedding or occupancy rules.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6 sticky bottom-0 bg-white">
                        <button
                            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all cursor-pointer"
                            onClick={onClose}
                            type="button"
                        >
                            Cancel
                        </button>
                        <button
                            className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 active:bg-blue-800 transition-all cursor-pointer"
                            type="submit"
                        >
                            {editingRoom ? "Save Room Details" : "Create Room"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
