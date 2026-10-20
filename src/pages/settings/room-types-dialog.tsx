import * as React from "react";
import { X, Plus, Edit3, Trash2, Bed, Users, IndianRupee, Layers } from "lucide-react";
import { AVAILABLE_AMENITIES, AMENITY_ICONS } from "@/constants/amenities";
import type { BedTypeConfig } from "@/api/bed-service";

export interface RoomTypeConfig {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    maxAdults: number;
    maxChildren: number;
    maxOccupancy: number;
    bedType: string;
    size: string;
    amenityIds: string[];
    status: "ACTIVE" | "INACTIVE";
    isPremium?: boolean;
    premiumType?: "FEMALE" | "MALE" | "";
    isHourly?: boolean;
    hourlyPrice?: number;
    activeRoomsCount?: number;
    totalRoomsCount?: number;
}

export interface RoomTypesDialogProps {
    isOpen: boolean;
    initialRoomTypes: RoomTypeConfig[];
    availableAmenityIds: string[];
    availableBeds: BedTypeConfig[];
    onClose: () => void;
    onSave: (roomTypes: RoomTypeConfig[]) => void;
}

export function RoomTypesDialog({ isOpen, initialRoomTypes, availableAmenityIds, availableBeds, onClose, onSave }: RoomTypesDialogProps) {
    const filteredAmenities = AVAILABLE_AMENITIES.filter(amenity =>
        availableAmenityIds.includes(amenity.id)
    );
    const [roomTypes, setRoomTypes] = React.useState<RoomTypeConfig[]>([]);
    const [view, setView] = React.useState<"list" | "form">("list");
    const [editingRoomType, setEditingRoomType] = React.useState<RoomTypeConfig | null>(null);

    // Form States
    const [formName, setFormName] = React.useState("");
    const [formDescription, setFormDescription] = React.useState("");
    const [formBasePrice, setFormBasePrice] = React.useState(0);
    const [formMaxAdults, setFormMaxAdults] = React.useState(2);
    const [formMaxChildren, setFormMaxChildren] = React.useState(0);
    const [formMaxOccupancy, setFormMaxOccupancy] = React.useState(2);
    const [formBedType, setFormBedType] = React.useState("Double Bed");
    const [formSize, setFormSize] = React.useState("250 sq ft");
    const [formAmenityIds, setFormAmenityIds] = React.useState<string[]>([]);
    const [formStatus, setFormStatus] = React.useState<"ACTIVE" | "INACTIVE">("ACTIVE");
    const [formIsPremium, setFormIsPremium] = React.useState<boolean>(false);
    const [formPremiumType, setFormPremiumType] = React.useState<"FEMALE" | "MALE" | "">("");
    const [formIsHourly, setFormIsHourly] = React.useState<boolean>(false);
    const [formHourlyPrice, setFormHourlyPrice] = React.useState<number>(0);

    React.useEffect(() => {
        if (isOpen) {
            setRoomTypes(initialRoomTypes);
            setView("list");
            setEditingRoomType(null);
        }
    }, [isOpen, initialRoomTypes]);

    if (!isOpen) return null;

    const handleOpenAddForm = () => {
        setEditingRoomType(null);
        setFormName("");
        setFormDescription("");
        setFormBasePrice(2500);
        setFormMaxAdults(2);
        setFormMaxChildren(1);
        setFormMaxOccupancy(3);
        setFormBedType("Double Bed");
        setFormSize("220 sq ft");
        setFormAmenityIds([]);
        setFormStatus("ACTIVE");
        setFormIsPremium(false);
        setFormPremiumType("");
        setFormIsHourly(false);
        setFormHourlyPrice(0);
        setView("form");
    };

    const handleOpenEditForm = (rt: RoomTypeConfig) => {
        setEditingRoomType(rt);
        setFormName(rt.name);
        setFormDescription(rt.description);
        setFormBasePrice(rt.basePrice);
        setFormMaxAdults(rt.maxAdults);
        setFormMaxChildren(rt.maxChildren);
        setFormMaxOccupancy(rt.maxOccupancy);
        setFormBedType(rt.bedType);
        setFormSize(rt.size);
        setFormAmenityIds(rt.amenityIds);
        setFormStatus(rt.status);
        setFormIsPremium(rt.isPremium || false);
        setFormPremiumType(rt.premiumType || "");
        setFormIsHourly(rt.isHourly || false);
        setFormHourlyPrice(rt.hourlyPrice || 0);
        setView("form");
    };

    const handleDeleteRoomType = (id: string) => {
        setRoomTypes(prev => prev.filter(rt => rt.id !== id));
    };

    const handleToggleAmenity = (id: string) => {
        setFormAmenityIds(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]));
    };

    const handleSaveForm = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName.trim()) return;

        const newRoomType: RoomTypeConfig = {
            id: editingRoomType ? editingRoomType.id : `rt-${Date.now()}`,
            name: formName.trim(),
            description: formDescription.trim(),
            basePrice: formBasePrice,
            maxAdults: formMaxAdults,
            maxChildren: formMaxChildren,
            maxOccupancy: formMaxOccupancy,
            bedType: formBedType.trim(),
            size: formSize.trim(),
            amenityIds: formAmenityIds,
            status: formStatus,
            isPremium: formIsPremium,
            premiumType: formIsPremium ? formPremiumType : "",
            isHourly: formIsHourly,
            hourlyPrice: formIsHourly ? formHourlyPrice : undefined,
        };

        if (editingRoomType) {
            setRoomTypes(prev => prev.map(rt => (rt.id === editingRoomType.id ? newRoomType : rt)));
        } else {
            setRoomTypes(prev => [...prev, newRoomType]);
        }
        setView("list");
    };

    const handleSubmitAll = () => {
        onSave(roomTypes);
        onClose();
    };

    return (
        <div
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 animate-in fade-in duration-200"
            role="dialog"
        >
            <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl border border-slate-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">
                            {view === "list" ? "Configure Room Types" : editingRoomType ? "Edit Room Type" : "Add Room Type"}
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {view === "list"
                                ? "Manage configurations, prices, capacity limits, and included amenities for your rooms."
                                : "Define the quality parameters, pricing, and amenities included in this room type."}
                        </p>
                    </div>
                    <button
                        aria-label="Close dialog"
                        className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
                        onClick={onClose}
                        type="button"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content body */}
                {view === "list" ? (
                    <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin space-y-4">
                        {roomTypes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                                <Layers className="h-10 w-10 text-slate-300 mb-3" />
                                <span className="text-sm font-semibold text-slate-700">No room types defined</span>
                                <span className="text-xs text-slate-400 mt-1 mb-4 text-center px-4">
                                    Create room types to define different pricing and occupancy standards for your property.
                                </span>
                                <button
                                    onClick={handleOpenAddForm}
                                    className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
                                    type="button"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Add Your First Room Type
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
                                {roomTypes.map(rt => (
                                    <div
                                        key={rt.id}
                                        className="relative border border-slate-200 hover:border-slate-300 bg-white rounded-xl p-4 shadow-xs flex flex-col justify-between transition-all min-h-[180px]"
                                    >
                                        {/* Actions overlay */}
                                        <div className="absolute top-3.5 right-3.5 flex items-center gap-1">
                                            <button
                                                onClick={() => handleOpenEditForm(rt)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-all cursor-pointer"
                                                type="button"
                                                title="Edit room type"
                                            >
                                                <Edit3 className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteRoomType(rt.id)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-50 transition-all cursor-pointer"
                                                type="button"
                                                title="Delete room type"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>

                                        {/* Content details */}
                                        <div className="space-y-2">
                                            <div className="flex items-center flex-wrap gap-2">
                                                <span className="font-bold text-slate-800 text-base">{rt.name}</span>
                                                <span
                                                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                        rt.status === "ACTIVE"
                                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                                            : "bg-slate-100 text-slate-500 border border-slate-200"
                                                    }`}
                                                >
                                                    {rt.status}
                                                </span>
                                                {rt.isPremium && (
                                                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100 uppercase">
                                                        Premium ({rt.premiumType})
                                                    </span>
                                                )}
                                                {rt.isHourly && (
                                                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                                                        Hourly
                                                    </span>
                                                )}
                                            </div>

                                            {rt.description && (
                                                <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed">
                                                    {rt.description}
                                                </p>
                                            )}

                                            <div className="space-y-1">
                                                <div className="flex items-center text-lg font-bold text-slate-800 leading-none">
                                                    <IndianRupee className="w-4 h-4 text-slate-700" />
                                                    <span>{rt.basePrice.toLocaleString()}</span>
                                                    <span className="text-[10px] text-slate-400 font-normal ml-1">
                                                        / night
                                                    </span>
                                                </div>
                                                {rt.isHourly && rt.hourlyPrice !== undefined && (
                                                    <div className="flex items-center text-sm font-semibold text-blue-700 leading-none">
                                                        <IndianRupee className="w-3.5 h-3.5 text-blue-600" />
                                                        <span>{rt.hourlyPrice.toLocaleString()}</span>
                                                        <span className="text-[10px] text-blue-400 font-normal ml-1">
                                                            / hour
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-1 pt-1.5 border-t border-slate-100">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                    <Bed className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                                    <span>
                                                        {rt.bedType || "Standard Bed"} · {rt.size || "N/A"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                                    <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                                    <span>
                                                        Max: {rt.maxOccupancy} guest(s) ({rt.maxAdults}A /{" "}
                                                        {rt.maxChildren}C)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Included Amenities Badge Row */}
                                        <div className="flex flex-wrap gap-1 mt-3">
                                            {rt.amenityIds.filter(id => availableAmenityIds.includes(id)).length === 0 ? (
                                                <span className="text-[10px] italic text-slate-400">
                                                    No amenities selected
                                                </span>
                                            ) : (
                                                rt.amenityIds
                                                    .filter(id => availableAmenityIds.includes(id))
                                                    .map(amenityId => {
                                                        const amenity = AVAILABLE_AMENITIES.find(a => a.id === amenityId);
                                                        if (!amenity) return null;
                                                        const IconComponent = AMENITY_ICONS[amenity.iconName];
                                                        return (
                                                            <div
                                                                key={amenityId}
                                                                title={amenity.name}
                                                                className="flex items-center justify-center p-1 bg-slate-50 border border-slate-200 rounded text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                                                            >
                                                                <IconComponent className="w-3 h-3" />
                                                            </div>
                                                        );
                                                    })
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Dotted Add Box */}
                                <button
                                    onClick={handleOpenAddForm}
                                    className="border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/5 cursor-pointer rounded-xl flex flex-col items-center justify-center p-6 transition-all min-h-[180px] group"
                                    type="button"
                                >
                                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all mb-2 shadow-2xs">
                                        <Plus className="h-5 w-5" />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-500 group-hover:text-blue-600">
                                        Add Room Type
                                    </span>
                                </button>
                            </div>
                        )}

                        {/* Dialog Footer Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6 bg-white sticky bottom-0">
                            <button
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all cursor-pointer"
                                onClick={onClose}
                                type="button"
                            >
                                Cancel
                            </button>
                            <button
                                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 active:bg-blue-800 transition-all cursor-pointer"
                                onClick={handleSubmitAll}
                                type="button"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                ) : (
                    <form className="flex-1 overflow-y-auto pr-1 scrollbar-thin space-y-4" onSubmit={handleSaveForm}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Room Type Name */}
                            <div className="space-y-1.5 col-span-1">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Room Type Name *
                                </label>
                                <input
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    type="text"
                                    placeholder="e.g. Deluxe Suite"
                                    value={formName}
                                    onChange={e => setFormName(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Base Price */}
                            <div className="space-y-1.5 col-span-1">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Base Price (INR) *
                                </label>
                                <input
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    type="number"
                                    min="0"
                                    placeholder="e.g. 3500"
                                    value={formBasePrice}
                                    onChange={e => setFormBasePrice(Number(e.target.value))}
                                    required
                                />
                            </div>

                            {/* Bed Type */}
                            <div className="space-y-1.5 col-span-1">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Bedding Configuration
                                </label>
                                {availableBeds.length === 0 ? (
                                    <div className="text-xs text-rose-500 italic py-2">
                                        No bed types configured. Please configure beds first.
                                    </div>
                                ) : (
                                    <select
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        value={formBedType}
                                        onChange={e => setFormBedType(e.target.value)}
                                    >
                                        <option value="">-- Select Bed Type --</option>
                                        {availableBeds.map(bed => (
                                            <option key={bed.id} value={bed.name}>
                                                {bed.name} (Max: {bed.capacity} Guests)
                                            </option>
                                        ))}
                                        {formBedType && !availableBeds.some(b => b.name === formBedType) && (
                                            <option value={formBedType}>{formBedType} (Current)</option>
                                        )}
                                    </select>
                                )}
                            </div>

                            {/* Size */}
                            <div className="space-y-1.5 col-span-1">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Room Size
                                </label>
                                <input
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    type="text"
                                    placeholder="e.g. 350 sq ft"
                                    value={formSize}
                                    onChange={e => setFormSize(e.target.value)}
                                />
                            </div>

                            {/* Capacity Numbers Grid */}
                            <div className="grid grid-cols-3 gap-2 col-span-1 sm:col-span-2">
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                        Max Adults
                                    </label>
                                    <input
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        type="number"
                                        min="1"
                                        value={formMaxAdults}
                                        onChange={e => setFormMaxAdults(Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                        Max Children
                                    </label>
                                    <input
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        type="number"
                                        min="0"
                                        value={formMaxChildren}
                                        onChange={e => setFormMaxChildren(Number(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                        Total Occupancy
                                    </label>
                                    <input
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        type="number"
                                        min="1"
                                        value={formMaxOccupancy}
                                        onChange={e => setFormMaxOccupancy(Number(e.target.value))}
                                    />
                                </div>
                            </div>

                            {/* Status */}
                            <div className="space-y-1.5 col-span-1">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Status
                                </label>
                                <select
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={formStatus}
                                    onChange={e => setFormStatus(e.target.value as "ACTIVE" | "INACTIVE")}
                                >
                                    <option value="ACTIVE">ACTIVE</option>
                                    <option value="INACTIVE">INACTIVE</option>
                                </select>
                            </div>

                            {/* Is Premium */}
                            <div className="space-y-1.5 col-span-1 flex flex-col justify-end pb-1.5">
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        checked={formIsPremium}
                                        onChange={e => {
                                            setFormIsPremium(e.target.checked);
                                            if (e.target.checked && !formPremiumType) {
                                                setFormPremiumType("FEMALE");
                                            }
                                        }}
                                    />
                                    Is Premium
                                </label>
                            </div>

                            {/* Premium Options */}
                            {formIsPremium && (
                                <div className="space-y-1.5 col-span-1 sm:col-span-2 animate-in fade-in duration-200 pb-1">
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Premium Option Type
                                    </label>
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setFormPremiumType("FEMALE")}
                                            className={`px-4 py-2.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                                                formPremiumType === "FEMALE"
                                                    ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                                                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                            }`}
                                        >
                                            FEMALE Type
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormPremiumType("MALE")}
                                            className={`px-4 py-2.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                                                formPremiumType === "MALE"
                                                    ? "bg-blue-600 border-blue-600 text-white shadow-xs"
                                                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                            }`}
                                        >
                                            MALE Type
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Is Hourly */}
                            <div className="space-y-1.5 col-span-1 flex flex-col justify-end pb-1.5">
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        className="h-4.5 w-4.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                        checked={formIsHourly}
                                        onChange={e => {
                                            setFormIsHourly(e.target.checked);
                                            if (e.target.checked && !formHourlyPrice) {
                                                setFormHourlyPrice(500);
                                            }
                                        }}
                                    />
                                    Is Hourly
                                </label>
                            </div>

                            {/* Hourly Price */}
                            {formIsHourly && (
                                <div className="space-y-1.5 col-span-1 animate-in fade-in duration-200">
                                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Hourly Price (INR)
                                    </label>
                                    <input
                                        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        type="number"
                                        min="0"
                                        placeholder="e.g. 500"
                                        value={formHourlyPrice}
                                        onChange={e => setFormHourlyPrice(Number(e.target.value))}
                                        required={formIsHourly}
                                    />
                                </div>
                            )}

                            {/* Description */}
                            <div className="space-y-1.5 col-span-1 sm:col-span-2">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Description
                                </label>
                                <textarea
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none h-20"
                                    placeholder="Brief description of room type quality, features, etc."
                                    value={formDescription}
                                    onChange={e => setFormDescription(e.target.value)}
                                />
                            </div>

                            {/* Room Type Amenities Section */}
                            <div className="space-y-2 col-span-1 sm:col-span-2">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Included Amenities
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-50 border border-slate-100 rounded-xl p-3.5">
                                    {filteredAmenities.length === 0 ? (
                                        <span className="text-xs text-slate-400 italic col-span-2 py-2 text-center">
                                            No amenities configured for this hotel. Please configure hotel amenities first.
                                        </span>
                                    ) : (
                                        filteredAmenities.map(amenity => {
                                            const isSelected = formAmenityIds.includes(amenity.id);
                                            const Icon = AMENITY_ICONS[amenity.iconName];
                                            return (
                                                <div
                                                    key={amenity.id}
                                                    onClick={() => handleToggleAmenity(amenity.id)}
                                                    className={`flex items-center gap-3 p-2 px-3 rounded-lg border text-left cursor-pointer transition-all select-none hover:bg-white ${
                                                        isSelected
                                                            ? "border-blue-500 bg-white shadow-2xs"
                                                            : "border-transparent text-slate-600 hover:border-slate-200"
                                                    }`}
                                                >
                                                    <div
                                                        className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                                                            isSelected
                                                                ? "bg-blue-600 border-blue-600"
                                                                : "border-slate-300 bg-white"
                                                        }`}
                                                    >
                                                        {isSelected && (
                                                            <svg
                                                                className="w-3 h-3 text-white"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth="3.5"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    d="M5 13l4 4L19 7"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div className="p-1 rounded bg-slate-100 text-slate-500">
                                                        <Icon className="w-3.5 h-3.5" />
                                                    </div>
                                                    <span className="text-xs font-semibold text-slate-700">
                                                        {amenity.name}
                                                    </span>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Form Footer Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 mt-6 bg-white sticky bottom-0">
                            <button
                                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-all cursor-pointer"
                                onClick={() => setView("list")}
                                type="button"
                            >
                                Back to List
                            </button>
                            <button
                                className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 active:bg-blue-800 transition-all cursor-pointer"
                                type="submit"
                            >
                                {editingRoomType ? "Save Changes" : "Create Room Type"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
