import * as React from "react";
import { X, Plus, Edit3, Trash2, Bed, Users } from "lucide-react";
import type { BedTypeConfig } from "@/api/bed-service";

export interface BedsDialogProps {
    isOpen: boolean;
    initialBeds: BedTypeConfig[];
    onClose: () => void;
    onSave: (beds: BedTypeConfig[]) => void;
}

export function BedsDialog({ isOpen, initialBeds, onClose, onSave }: BedsDialogProps) {
    const [beds, setBeds] = React.useState<BedTypeConfig[]>([]);
    const [view, setView] = React.useState<"list" | "form">("list");
    const [editingBed, setEditingBed] = React.useState<BedTypeConfig | null>(null);

    // Form States
    const [formName, setFormName] = React.useState("");
    const [formDescription, setFormDescription] = React.useState("");
    const [formMaxAdults, setFormMaxAdults] = React.useState(2);
    const [formMaxChildren, setFormMaxChildren] = React.useState(0);
    const [formCapacity, setFormCapacity] = React.useState(2);

    // Auto-calculate capacity when adults/children change, but allow override
    React.useEffect(() => {
        setFormCapacity(formMaxAdults + formMaxChildren);
    }, [formMaxAdults, formMaxChildren]);

    React.useEffect(() => {
        if (isOpen) {
            setBeds(initialBeds);
            setView("list");
            setEditingBed(null);
        }
    }, [isOpen, initialBeds]);

    if (!isOpen) return null;

    const handleOpenAddForm = () => {
        setEditingBed(null);
        setFormName("");
        setFormDescription("");
        setFormMaxAdults(2);
        setFormMaxChildren(0);
        setFormCapacity(2);
        setView("form");
    };

    const handleOpenEditForm = (b: BedTypeConfig) => {
        setEditingBed(b);
        setFormName(b.name);
        setFormDescription(b.description);
        setFormMaxAdults(b.maxAdults);
        setFormMaxChildren(b.maxChildren);
        setFormCapacity(b.capacity);
        setView("form");
    };

    const handleDeleteBed = (id: string) => {
        setBeds(prev => prev.filter(b => b.id !== id));
    };

    const handleSaveForm = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formName.trim()) return;

        const newBed: BedTypeConfig = {
            id: editingBed ? editingBed.id : `bed-${Date.now()}`,
            name: formName.trim(),
            description: formDescription.trim(),
            maxAdults: formMaxAdults,
            maxChildren: formMaxChildren,
            capacity: formCapacity,
        };

        if (editingBed) {
            setBeds(prev => prev.map(b => (b.id === editingBed.id ? newBed : b)));
        } else {
            setBeds(prev => [...prev, newBed]);
        }
        setView("list");
    };

    const handleSubmitAll = () => {
        onSave(beds);
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
                        <h2 className="text-lg font-bold text-slate-800">
                            {view === "list" ? "Configure Bed Types" : editingBed ? "Edit Bed Type" : "Add Bed Type"}
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {view === "list"
                                ? "Manage bedding options and capacity rules for room selection."
                                : "Define bedding name, description, and guest capacity limits."}
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
                        {beds.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 animate-in fade-in duration-150">
                                <Bed className="h-10 w-10 text-slate-300 mb-3" />
                                <span className="text-sm font-semibold text-slate-700">No bed types defined</span>
                                <span className="text-xs text-slate-400 mt-1 mb-4 text-center px-4">
                                    Configure customized bedding configurations for your rooms.
                                </span>
                                <button
                                    onClick={handleOpenAddForm}
                                    className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
                                    type="button"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    Add Your First Bed Type
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-1">
                                {beds.map(b => (
                                    <div
                                        key={b.id}
                                        className="relative border border-slate-200 hover:border-slate-300 bg-white rounded-xl p-4 shadow-xs flex flex-col justify-between transition-all min-h-[140px]"
                                    >
                                        {/* Actions */}
                                        <div className="absolute top-3.5 right-3.5 flex items-center gap-1">
                                            <button
                                                onClick={() => handleOpenEditForm(b)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-all cursor-pointer"
                                                type="button"
                                                title="Edit bed type"
                                            >
                                                <Edit3 className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteBed(b.id)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-50 transition-all cursor-pointer"
                                                type="button"
                                                title="Delete bed type"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>

                                        {/* Info */}
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2">
                                                <Bed className="h-4 w-4 text-blue-600 flex-shrink-0" />
                                                <span className="font-bold text-slate-800 text-sm">{b.name}</span>
                                            </div>
                                            {b.description && (
                                                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                                                    {b.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Capacity Detail */}
                                        <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-2.5 border-t border-slate-100 mt-3">
                                            <Users className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                            <span>
                                                Capacity: <strong>{b.capacity}</strong> (Max: {b.maxAdults} Adults / {b.maxChildren} Child)
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {/* Dotted Add Card */}
                                <button
                                    onClick={handleOpenAddForm}
                                    className="border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50/5 cursor-pointer rounded-xl flex flex-col items-center justify-center p-6 transition-all min-h-[140px] group animate-in fade-in"
                                    type="button"
                                >
                                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-all mb-2 shadow-2xs">
                                        <Plus className="h-5 w-5" />
                                    </div>
                                    <span className="text-xs font-semibold text-slate-500 group-hover:text-blue-600">
                                        Add Bed Type
                                    </span>
                                </button>
                            </div>
                        )}

                        {/* Footer */}
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
                            {/* Bed Type Name */}
                            <div className="space-y-1.5 col-span-1 sm:col-span-2">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Bed Type Name *
                                </label>
                                <input
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    type="text"
                                    placeholder="e.g. Double bed, Maharaja"
                                    value={formName}
                                    onChange={e => setFormName(e.target.value)}
                                    required
                                />
                            </div>

                            {/* Max Adults */}
                            <div className="space-y-1.5 col-span-1">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Max Adults
                                </label>
                                <input
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    type="number"
                                    min="0"
                                    value={formMaxAdults}
                                    onChange={e => setFormMaxAdults(Number(e.target.value))}
                                />
                            </div>

                            {/* Max Children */}
                            <div className="space-y-1.5 col-span-1">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
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

                            {/* Total Capacity */}
                            <div className="space-y-1.5 col-span-1 sm:col-span-2">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Total Capacity
                                </label>
                                <input
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 bg-slate-50 focus:outline-none"
                                    type="number"
                                    min="0"
                                    value={formCapacity}
                                    onChange={e => setFormCapacity(Number(e.target.value))}
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5 col-span-1 sm:col-span-2">
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                                    Description
                                </label>
                                <textarea
                                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none h-20"
                                    placeholder="Brief description of bedding configuration, details, etc."
                                    value={formDescription}
                                    onChange={e => setFormDescription(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Form Actions */}
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
                                {editingBed ? "Save Changes" : "Create Bed Type"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
