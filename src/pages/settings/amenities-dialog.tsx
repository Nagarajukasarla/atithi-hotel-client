import * as React from "react";
import { X } from "lucide-react";
import { AVAILABLE_AMENITIES, AMENITY_ICONS } from "@/constants/amenities";

export interface AmenitiesDialogProps {
    isOpen: boolean;
    initialSelectedIds: string[];
    onClose: () => void;
    onSave: (selectedIds: string[]) => void;
}

export function AmenitiesDialog({ isOpen, initialSelectedIds, onClose, onSave }: AmenitiesDialogProps) {
    const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

    React.useEffect(() => {
        if (isOpen) {
            setSelectedIds(initialSelectedIds);
        }
    }, [isOpen, initialSelectedIds]);

    if (!isOpen) return null;

    const handleToggle = (id: string) => {
        setSelectedIds(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(selectedIds);
        onClose();
    };

    return (
        <div
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 animate-in fade-in duration-200"
            role="dialog"
        >
            <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl border border-slate-200 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Configure Amenities</h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Select the features and services available at your property.
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
                <form className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-1">
                        {AVAILABLE_AMENITIES.map(amenity => {
                            const isSelected = selectedIds.includes(amenity.id);
                            const IconComponent = AMENITY_ICONS[amenity.iconName];

                            return (
                                <div
                                    key={amenity.id}
                                    onClick={() => handleToggle(amenity.id)}
                                    className={`flex gap-3 p-3.5 rounded-xl border-2 text-left cursor-pointer transition-all duration-200 select-none hover:shadow-xs ${
                                        isSelected
                                            ? "border-blue-500 bg-blue-50/20"
                                            : "border-slate-200 hover:border-slate-300 bg-white"
                                    }`}
                                >
                                    {/* Custom Checkbox */}
                                    <div className="flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <div
                                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                                                isSelected ? "bg-blue-600 border-blue-600" : "border-slate-300 bg-white"
                                            }`}
                                        >
                                            {isSelected && (
                                                <svg
                                                    className="w-3.5 h-3.5 text-white"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="3"
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
                                    </div>

                                    {/* Icon Container */}
                                    <div
                                        className={`flex items-center justify-center p-2 rounded-lg flex-shrink-0 w-10 h-10 ${
                                            isSelected ? "bg-blue-100/60 text-blue-600" : "bg-slate-50 text-slate-500"
                                        }`}
                                    >
                                        <IconComponent className="w-5 h-5" />
                                    </div>

                                    {/* Text Details */}
                                    <div className="space-y-0.5 min-w-0">
                                        <span className="block text-sm font-semibold text-slate-800 truncate">
                                            {amenity.name}
                                        </span>
                                        <span className="block text-xs text-slate-400 leading-normal line-clamp-2">
                                            {amenity.description}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer Actions */}
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
                            type="submit"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
