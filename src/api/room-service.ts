import { request } from "@/api/http-client";
import { API_ROUTES } from "@/constants/api-routes";
import type { ApiResponse } from "@/api/auth-service";
import type { Room } from "@/types/rooms";

class RoomService {
    /**
     * Fetch all rooms configured for the active hotel.
     */
    getRooms() {
        return request<ApiResponse<Room[]>>(API_ROUTES.HOTEL_ROOMS, {
            method: "GET",
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
     * Create a new room.
     */
    createRoom(payload: Omit<Room, "id" | "roomStatus" | "roomState">) {
        return request<ApiResponse<Room>>(API_ROUTES.HOTEL_ROOMS, {
            method: "POST",
            body: payload,
        }).then(res => {
            if (res.success && res.data) {
                res.data = {
                    ...res.data,
                    id: String(res.data.id),
                };
            }
            return res;
        });
    }

    /**
     * Update an existing room.
     */
    updateRoom(id: string, payload: Partial<Room>) {
        return request<ApiResponse<Room>>(`${API_ROUTES.HOTEL_ROOMS}/${id}`, {
            method: "PUT",
            body: payload,
        }).then(res => {
            if (res.success && res.data) {
                res.data = {
                    ...res.data,
                    id: String(res.data.id),
                };
            }
            return res;
        });
    }

    /**
     * Delete a room.
     */
    deleteRoom(id: string) {
        return request<ApiResponse<void>>(`${API_ROUTES.HOTEL_ROOMS}/${id}`, {
            method: "DELETE",
        });
    }

    /**
     * Fetch hotel overview statistics KPIs.
     */
    getOverviewStats() {
        return request<ApiResponse<{
            todayCheckInCount: number;
            todayCheckOutCount: number;
            totalGuestsInHotel: number;
            totalAvailableRooms: number;
        }>>(`${API_ROUTES.HOTEL_ROOMS}/overview-stats`, {
            method: "GET",
        });
    }
}

export const roomService = new RoomService();
