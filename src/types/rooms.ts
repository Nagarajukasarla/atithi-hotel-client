import type { PaymentResponse } from "./bookings";

export type RoomStatusType = "Vacant" | "Occupied" | "Stay Over" | "Check In" | "Check Out";

export type RoomStateType = "Clean" | "Dirty" | "Inspected" | "Out of Service" | "Out of Order";

export type RoomType = "Standard" | "Deluxe" | "Executive" | "VIP" | "Presidential";

export interface Guest {
    id: string;
    name: string;
    age?: number;
    phone: string;
    identityDocument: string;
}

export interface BookingOrder {
    id: string;
    roomId: string;
    isHourly: boolean;
    duration: {
        start: string;
        end: string;
    };
    guests?: Guest[];
    payment?: PaymentResponse;
    actualCheckOut?: string;
}

export interface Room {
    id: string;
    number: string;
    floor: string | number;
    roomType: string;
    capacity: number;
    roomStatus: RoomStatusType;
    roomState: RoomStateType;
    lastCleaned?: string;
    notes?: string;
    isPremium?: boolean;
    premiumType?: "FEMALE" | "MALE" | "";
    basePrice?: number;
}
