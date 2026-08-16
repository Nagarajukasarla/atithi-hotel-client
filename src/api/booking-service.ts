import { request } from "@/api/http-client";
import type { ApiResponse } from "@/api/auth-service";
import type { Room } from "@/types/rooms";

export interface CheckAvailabilityPayload {
    roomType: string;
    maxOccupancy: number;
    status: string;
}

export interface GuestPayload {
    name: string;
    aadhaarNumber: string;
    mobileNumber: string;
    age?: number;
    address?: string;
}

export interface CreateBookingPayload {
    roomId: string;
    isHourly: boolean;
    checkIn: string;
    checkOut: string;
    guests: GuestPayload[];
}

class BookingService {
    /**
     * Check room availability from backend.
     */
    checkAvailability(payload: CheckAvailabilityPayload) {
        return request<ApiResponse<Room[]>>("/hotel/rooms/available", {
            method: "POST",
            body: payload,
        }).then(res => {
            if (res.success && res.data) {
                res.data = res.data.map(room => ({
                    ...room,
                    id: String(room.id),
                }));
            }
            return res;
        });
    }

    /**
     * Create a new booking order.
     */
    createBooking(payload: CreateBookingPayload) {
        return request<ApiResponse<any>>("/hotel/bookings", {
            method: "POST",
            body: payload,
        });
    }

    /**
     * Get payment details by booking ID.
     */
    getPayment(bookingId: string) {
        return request<ApiResponse<any>>(`/hotel/bookings/${bookingId}/payment`);
    }

    /**
     * Create or update payment details for a booking.
     */
    createOrUpdatePayment(bookingId: string, payload: any) {
        return request<ApiResponse<any>>(`/hotel/bookings/${bookingId}/payment`, {
            method: "POST",
            body: payload,
        });
    }

    /**
     * Get the active booking for a room.
     */
    getActiveBookingForRoom(roomId: string) {
        return request<ApiResponse<any>>(`/hotel/bookings/active?roomId=${roomId}`);
    }

    getAllBookings() {
        return request<ApiResponse<any>>("/hotel/bookings");
    }

    updateBooking(bookingId: string, payload: any) {
        return request<ApiResponse<any>>(`/hotel/bookings/${bookingId}`, {
            method: "PUT",
            body: payload
        });
    }
}

export const bookingService = new BookingService();
