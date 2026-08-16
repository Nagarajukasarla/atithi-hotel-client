import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import type { Guest } from "@/types/rooms";

export interface GuestItemProps {
    guest: Guest;
}

export function GuestItem({ guest }: GuestItemProps) {
    const [showDoc, setShowDoc] = React.useState(false);

    const maskDocument = (doc: string) => {
        if (doc.length <= 4) return "****";
        return "*".repeat(doc.length - 4) + doc.slice(-4);
    };

    return (
        <div className="flex flex-col gap-1.5 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">
            <div className="flex items-center justify-between font-semibold text-slate-800 text-sm">
                <span>{guest.name}</span>
                {guest.age !== undefined && (
                    <span className="text-slate-500 font-normal text-xs">Age: {guest.age}</span>
                )}
            </div>
            <div className="text-slate-600">Phone: {guest.phone}</div>
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-200/60 mt-1">
                <span className="font-mono text-slate-600">
                    ID: {showDoc ? guest.identityDocument : maskDocument(guest.identityDocument)}
                </span>
                <button
                    aria-label={showDoc ? "Hide identity document" : "Show identity document"}
                    className="flex h-6 w-6 items-center justify-center rounded hover:bg-slate-200 text-slate-500 transition-colors"
                    onClick={() => setShowDoc(prev => !prev)}
                    type="button"
                >
                    {showDoc ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
            </div>
        </div>
    );
}
