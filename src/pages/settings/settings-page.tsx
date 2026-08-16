import * as React from "react";
import { LoaderCircle } from "lucide-react";
import { AVAILABLE_AMENITIES, AMENITY_ICONS } from "@/constants/amenities";
import { AmenitiesDialog } from "./amenities-dialog";
import { RoomTypesDialog, type RoomTypeConfig } from "./room-types-dialog";
import { BedsDialog } from "./beds-dialog";
import { useToast } from "@/hooks/use-toast";
import { amenityService } from "@/api/amenity-service";
import { bedService, type BedTypeConfig } from "@/api/bed-service";
import { TOAST_MESSAGES } from "@/constants/toast-messages";
import { roomTypeService } from "@/api/room-type-service";

const DEFAULT_BED_TYPES: BedTypeConfig[] = [
    {
        id: "bed-double",
        name: "Double Bed",
        description: "Standard double bed for two adults.",
        maxAdults: 2,
        maxChildren: 1,
        capacity: 3,
    },
    {
        id: "bed-maharani",
        name: "Maharani",
        description: "Queen size traditional luxury bedding.",
        maxAdults: 2,
        maxChildren: 0,
        capacity: 2,
    },
    {
        id: "bed-maharaja",
        name: "Maharaja",
        description: "King size royal luxury bedding.",
        maxAdults: 2,
        maxChildren: 0,
        capacity: 2,
    },
];

export function SettingsPage() {
    const { toast } = useToast();
    const [selectedAmenityIds, setSelectedAmenityIds] = React.useState<string[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [isAmenitiesDialogOpen, setIsAmenitiesDialogOpen] = React.useState<boolean>(false);

    // Room Types settings state (defaults to empty array, no mock data)
    const [roomTypes, setRoomTypes] = React.useState<RoomTypeConfig[]>(() => {
        const stored = localStorage.getItem("atithi_room_types");
        return stored ? JSON.parse(stored) : [];
    });
    const [isRoomTypesDialogOpen, setIsRoomTypesDialogOpen] = React.useState<boolean>(false);

    // Bed Types settings state
    const [beds, setBeds] = React.useState<BedTypeConfig[]>([]);
    const [isBedsDialogOpen, setIsBedsDialogOpen] = React.useState<boolean>(false);

    const fetchRoomTypes = async () => {
        try {
            const response = await roomTypeService.getRoomTypes();
            if (response.success && response.data) {
                setRoomTypes(response.data);
                localStorage.setItem("atithi_room_types", JSON.stringify(response.data));
            }
        } catch (error) {
            console.error("Failed to fetch hotel room types:", error);
        }
    };

    React.useEffect(() => {
        const fetchInitialData = async () => {
            try {
                setIsLoading(true);
                // Fetch amenities
                const amenityRes = await amenityService.getAmenities();
                if (amenityRes.success && amenityRes.data) {
                    setSelectedAmenityIds(amenityRes.data);
                    localStorage.setItem("atithi_hotel_amenities", JSON.stringify(amenityRes.data));
                }
            } catch (error) {
                console.error("Failed to fetch hotel amenities:", error);
                const stored = localStorage.getItem("atithi_hotel_amenities");
                if (stored) {
                    setSelectedAmenityIds(JSON.parse(stored));
                }
            }

            try {
                // Fetch beds
                const bedsRes = await bedService.getBeds();
                if (bedsRes.success && bedsRes.data) {
                    setBeds(bedsRes.data);
                    localStorage.setItem("atithi_bed_types", JSON.stringify(bedsRes.data));
                }
            } catch (error) {
                console.error("Failed to fetch hotel beds:", error);
                const stored = localStorage.getItem("atithi_bed_types");
                setBeds(stored ? JSON.parse(stored) : DEFAULT_BED_TYPES);
            }

            try {
                // Fetch room types
                const roomTypeRes = await roomTypeService.getRoomTypes();
                if (roomTypeRes.success && roomTypeRes.data) {
                    setRoomTypes(roomTypeRes.data);
                    localStorage.setItem("atithi_room_types", JSON.stringify(roomTypeRes.data));
                }
            } catch (error) {
                console.error("Failed to fetch hotel room types:", error);
                const stored = localStorage.getItem("atithi_room_types");
                if (stored) {
                    setRoomTypes(JSON.parse(stored));
                }
            } finally {
                setIsLoading(false);
            }
        };
        void fetchInitialData();
    }, []);

    const handleSaveAmenities = async (ids: string[]) => {
        const previousIds = selectedAmenityIds;
        setSelectedAmenityIds(ids);
        localStorage.setItem("atithi_hotel_amenities", JSON.stringify(ids));

        try {
            const response = await amenityService.updateAmenities(ids);
            if (response.success) {
                toast(TOAST_MESSAGES.AMENITIES_UPDATE_SUCCESS, "success");
            } else {
                throw new Error(response.message || "Failed to update hotel amenities");
            }
        } catch (error) {
            console.error("Failed to update hotel amenities:", error);
            // Revert state on failure
            setSelectedAmenityIds(previousIds);
            localStorage.setItem("atithi_hotel_amenities", JSON.stringify(previousIds));
            const message = error instanceof Error ? error.message : TOAST_MESSAGES.API_NOT_FOUND_ERROR;
            toast(message, "error");
        }
    };

    const handleSaveRoomTypes = async (newRoomTypes: RoomTypeConfig[]) => {
        setIsLoading(true);
        // Identify operations for toast messaging
        const deletedCount = roomTypes.filter(oldRt => !newRoomTypes.some(newRt => newRt.id === oldRt.id)).length;
        const createdCount = newRoomTypes.filter(rt => String(rt.id).startsWith("rt-")).length;
        
        let updatedCount = 0;
        for (const rt of newRoomTypes) {
            if (!String(rt.id).startsWith("rt-")) {
                const oldRt = roomTypes.find(o => String(o.id) === String(rt.id));
                if (oldRt && (
                    oldRt.name !== rt.name ||
                    oldRt.description !== rt.description ||
                    oldRt.basePrice !== rt.basePrice ||
                    oldRt.maxAdults !== rt.maxAdults ||
                    oldRt.maxChildren !== rt.maxChildren ||
                    oldRt.maxOccupancy !== rt.maxOccupancy ||
                    oldRt.bedType !== rt.bedType ||
                    oldRt.size !== rt.size ||
                    oldRt.status !== rt.status ||
                    oldRt.isPremium !== rt.isPremium ||
                    oldRt.premiumType !== rt.premiumType ||
                    JSON.stringify(oldRt.amenityIds.slice().sort()) !== JSON.stringify(rt.amenityIds.slice().sort())
                )) {
                    updatedCount++;
                }
            }
        }

        try {
            // 1. Identify deleted room types (items in previous state but not in new list)
            const deleted = roomTypes.filter(oldRt => !newRoomTypes.some(newRt => newRt.id === oldRt.id));
            for (const rt of deleted) {
                if (!String(rt.id).startsWith("rt-")) {
                    await roomTypeService.deleteRoomType(String(rt.id));
                }
            }

            // 2. Add or update items
            for (const rt of newRoomTypes) {
                const payload = {
                    name: rt.name,
                    description: rt.description,
                    basePrice: rt.basePrice,
                    maxAdults: rt.maxAdults,
                    maxChildren: rt.maxChildren,
                    maxOccupancy: rt.maxOccupancy,
                    bedType: rt.bedType,
                    size: rt.size,
                    amenityIds: rt.amenityIds,
                    status: rt.status,
                    isPremium: rt.isPremium,
                    premiumType: rt.premiumType,
                };

                if (String(rt.id).startsWith("rt-")) {
                    await roomTypeService.createRoomType(payload);
                } else {
                    await roomTypeService.updateRoomType(String(rt.id), payload);
                }
            }

            // Reload configurations from backend to keep fully synced
            await fetchRoomTypes();

            // Select proper user-friendly toast message
            let successMessage = "Room types settings updated successfully!";
            if (deletedCount > 0 && createdCount === 0 && updatedCount === 0) {
                successMessage = deletedCount === 1 
                    ? "Room type has been deleted successfully." 
                    : `${deletedCount} room types deleted successfully.`;
            } else if (createdCount > 0 && deletedCount === 0 && updatedCount === 0) {
                successMessage = createdCount === 1 
                    ? "Room type added successfully." 
                    : `${createdCount} room types added successfully.`;
            } else if (updatedCount > 0 && deletedCount === 0 && createdCount === 0) {
                successMessage = updatedCount === 1 
                    ? "Room type updated successfully." 
                    : `${updatedCount} room types updated successfully.`;
            }
            toast(successMessage, "success");
        } catch (error) {
            console.error("Failed to sync room types with backend:", error);
            const message = error instanceof Error ? error.message : TOAST_MESSAGES.API_NOT_FOUND_ERROR;
            toast(message, "error");
            // Revert state by refetching
            await fetchRoomTypes();
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveBeds = async (newBeds: BedTypeConfig[]) => {
        const previousBeds = beds;
        setBeds(newBeds);
        localStorage.setItem("atithi_bed_types", JSON.stringify(newBeds));

        // Identify operations for toast messaging
        const deletedCount = beds.filter(oldBed => !newBeds.some(newBed => newBed.id === oldBed.id)).length;
        const createdCount = newBeds.filter(b => String(b.id).startsWith("bed-")).length;
        
        let updatedCount = 0;
        for (const b of newBeds) {
            if (!String(b.id).startsWith("bed-")) {
                const oldBed = beds.find(o => String(o.id) === String(b.id));
                if (oldBed && (
                    oldBed.name !== b.name ||
                    oldBed.description !== b.description ||
                    oldBed.maxAdults !== b.maxAdults ||
                    oldBed.maxChildren !== b.maxChildren ||
                    oldBed.capacity !== b.capacity
                )) {
                    updatedCount++;
                }
            }
        }

        try {
            const response = await bedService.updateBeds(newBeds);
            if (response.success) {
                let successMessage = "Bed types settings updated successfully!";
                if (deletedCount > 0 && createdCount === 0 && updatedCount === 0) {
                    successMessage = deletedCount === 1 
                        ? "Bed type has been deleted successfully." 
                        : `${deletedCount} bed types deleted successfully.`;
                } else if (createdCount > 0 && deletedCount === 0 && updatedCount === 0) {
                    successMessage = createdCount === 1 
                        ? "Bed type added successfully." 
                        : `${createdCount} bed types added successfully.`;
                } else if (updatedCount > 0 && deletedCount === 0 && createdCount === 0) {
                    successMessage = updatedCount === 1 
                        ? "Bed type updated successfully." 
                        : `${updatedCount} bed types updated successfully.`;
                }
                toast(successMessage, "success");
            } else {
                throw new Error(response.message || "Failed to update bed types");
            }
        } catch (error) {
            console.error("Failed to update bed types:", error);
            setBeds(previousBeds);
            localStorage.setItem("atithi_bed_types", JSON.stringify(previousBeds));
            const message = error instanceof Error ? error.message : TOAST_MESSAGES.API_NOT_FOUND_ERROR;
            toast(message, "error");
        }
    };

    return (
        <div className="p-4 sm:p-6 w-full max-w-5xl mx-auto space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
                <h2 className="text-xl font-bold text-slate-800 mb-2">Hotel Settings</h2>
                <p className="text-sm text-slate-500 mb-6">
                    Configure property information, operational defaults, and staff permissions.
                </p>

                <div className="space-y-4">
                    {/* Property Name Row */}
                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                        <div>
                            <span className="font-semibold text-sm text-slate-800 block">Property Name</span>
                            <span className="text-xs text-slate-500">Atithi Grand Palace & Resort</span>
                        </div>
                        <button
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                            type="button"
                        >
                            Edit
                        </button>
                    </div>

                    {/* Amenities Row */}
                    <div className="flex items-start justify-between py-3.5 border-b border-slate-100">
                        <div className="space-y-1.5 flex-1 min-w-0 pr-4">
                            <span className="font-semibold text-sm text-slate-800 block">Amenities</span>
                            {isLoading ? (
                                <div className="flex items-center gap-2 py-1">
                                    <LoaderCircle className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />
                                    <span className="text-xs text-slate-500">Loading hotel amenities...</span>
                                </div>
                            ) : selectedAmenityIds.length === 0 ? (
                                <span className="text-xs text-slate-400 block italic">
                                    No amenities selected. Click Configure to add.
                                </span>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {selectedAmenityIds.map(id => {
                                        const amenity = AVAILABLE_AMENITIES.find(a => a.id === id);
                                        if (!amenity) return null;
                                        const IconComponent = AMENITY_ICONS[amenity.iconName];
                                        return (
                                            <div
                                                key={id}
                                                className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-full text-slate-700 text-xs font-medium animate-in fade-in zoom-in-95 duration-150"
                                            >
                                                <IconComponent className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                                                <span>{amenity.name}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                        <button
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer flex-shrink-0 mt-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => setIsAmenitiesDialogOpen(true)}
                            disabled={isLoading}
                            type="button"
                        >
                            Configure
                        </button>
                    </div>

                    {/* Room Types Row */}
                    <div className="flex items-start justify-between py-3.5 border-b border-slate-100">
                        <div className="space-y-1.5 flex-1 min-w-0 pr-4">
                            <span className="font-semibold text-sm text-slate-800 block">Room Types</span>
                            {roomTypes.length === 0 ? (
                                <span className="text-xs text-slate-400 block italic">
                                    No room types configured. Click Configure to add.
                                </span>
                            ) : (
                                <div className="flex flex-wrap gap-2.5">
                                    {roomTypes.map(rt => (
                                        <div
                                            key={rt.id}
                                            className="flex flex-col gap-0.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-semibold hover:border-slate-300 transition-all cursor-default"
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-slate-800 font-bold">{rt.name}</span>
                                                <span className="text-[10px] text-blue-600 bg-blue-50 px-1 rounded font-bold">
                                                    ₹{rt.basePrice}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-medium leading-none">
                                                Max: {rt.maxOccupancy} Guests · {rt.bedType}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer flex-shrink-0 mt-0.5"
                            onClick={() => setIsRoomTypesDialogOpen(true)}
                            type="button"
                        >
                            Configure
                        </button>
                    </div>

                    {/* Bed Types Row */}
                    <div className="flex items-start justify-between py-3.5 border-b border-slate-100">
                        <div className="space-y-1.5 flex-1 min-w-0 pr-4">
                            <span className="font-semibold text-sm text-slate-800 block">Bed Types</span>
                            {isLoading ? (
                                <div className="flex items-center gap-2 py-1">
                                    <LoaderCircle className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />
                                    <span className="text-xs text-slate-500">Loading bed types...</span>
                                </div>
                            ) : beds.length === 0 ? (
                                <span className="text-xs text-slate-400 block italic">
                                    No bed types configured. Click Configure to add.
                                </span>
                            ) : (
                                <div className="flex flex-wrap gap-2.5">
                                    {beds.map(b => (
                                        <div
                                            key={b.id}
                                            className="flex flex-col gap-0.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs font-semibold hover:border-slate-300 transition-all cursor-default"
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-slate-800 font-bold">{b.name}</span>
                                                <span className="text-[10px] text-blue-600 bg-blue-50 px-1 rounded font-bold">
                                                    Max: {b.capacity}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-slate-400 font-medium leading-none">
                                                {b.maxAdults} Adults · {b.maxChildren} Child
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer flex-shrink-0 mt-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => setIsBedsDialogOpen(true)}
                            disabled={isLoading}
                            type="button"
                        >
                            Configure
                        </button>
                    </div>

                    {/* Currency & Tax Row */}
                    <div className="flex items-center justify-between py-3 border-b border-slate-100">
                        <div>
                            <span className="font-semibold text-sm text-slate-800 block">Currency & Tax Settings</span>
                            <span className="text-xs text-slate-500">USD ($) · 12% Occupancy Tax</span>
                        </div>
                        <button
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                            type="button"
                        >
                            Configure
                        </button>
                    </div>

                    {/* Check-in Check-out Row */}
                    <div className="flex items-center justify-between py-3">
                        <div>
                            <span className="font-semibold text-sm text-slate-800 block">
                                Check-in / Check-out Policy
                            </span>
                            <span className="text-xs text-slate-500">Standard Check-in 14:00 · Check-out 11:00</span>
                        </div>
                        <button
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
                            type="button"
                        >
                            Manage
                        </button>
                    </div>
                </div>
            </div>

            {/* Amenities Selection Dialog */}
            <AmenitiesDialog
                isOpen={isAmenitiesDialogOpen}
                initialSelectedIds={selectedAmenityIds}
                onClose={() => setIsAmenitiesDialogOpen(false)}
                onSave={handleSaveAmenities}
            />

            {/* Room Types Selection & Edit Dialog */}
            <RoomTypesDialog
                isOpen={isRoomTypesDialogOpen}
                initialRoomTypes={roomTypes}
                availableAmenityIds={selectedAmenityIds}
                availableBeds={beds}
                onClose={() => setIsRoomTypesDialogOpen(false)}
                onSave={handleSaveRoomTypes}
            />

            {/* Bed Types Selection & Edit Dialog */}
            <BedsDialog
                isOpen={isBedsDialogOpen}
                initialBeds={beds}
                onClose={() => setIsBedsDialogOpen(false)}
                onSave={handleSaveBeds}
            />
        </div>
    );
}
