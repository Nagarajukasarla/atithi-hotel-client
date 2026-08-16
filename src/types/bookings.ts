//@TODO
export type RoomTypeOption = "Standard" | "Deluxe" | "Premium" | "VIP" | "Executive" | "Presidential";

export type BedType = "King" | "Queen" | "Single" | "Double" | "Twin" | "Maharaja" | "Maharani";

export type OperationalStatus = "Vacant" | "Occupied" | "Stay Over" | "Check In" | "Check Out";

export interface AvailabilityQuery {
    roomType: RoomTypeOption;
    checkIn: string;
    checkOut: string;
    adults: number;
    teens: number;
    children: number;
}

export interface CandidateRoom {
    id: string;
    number: string;
    floor: number;
    roomType: RoomTypeOption;
    bedType: BedType;
    capacity: number;
    facilities: string;
    status: OperationalStatus;
    hourlyRate: number;
    dailyRate: number;
}

export type ReservationChannel = "Booking.com" | "Agoda" | "Expedia" | "Hotel Website" | "Airbnb";

export type ReservationStatus = "Confirmed" | "Checked In" | "Cancelled" | "Pending";

export interface ChannelReservation {
    id: string;
    bookingNumber: string;
    channel: ReservationChannel;
    roomNumber?: string;
    roomType: RoomTypeOption;
    bedType: BedType;
    floor: number;
    facilities: string;
    guestName: string;
    guestCount: number;
    checkIn: string;
    checkOut: string;
    status: ReservationStatus;
    amount: number;
}

export type SortField = "number" | "bedType" | "floor";
export type SortDirection = "asc" | "desc";

export interface SortConfig {
    field: SortField;
    direction: SortDirection;
}

export interface PaymentResponse {
    id: number;
    bookingId: number;
    paymentMethod: "CASH" | "ONLINE";
    totalAmount: number;
    amountPaid: number;
    status: "PENDING" | "COMPLETED";
    paymentDate?: string;
    transactionId?: string;
}
