import { request } from "@/api/http-client";
import { API_ROUTES } from "@/constants/api-routes";
import type { ApiResponse } from "@/api/auth-service";
import type { RoomTypeConfig } from "@/pages/settings/room-types-dialog";

class RoomTypeService {
    /**
     * Fetch all room types configured for the active hotel.
     */
    getRoomTypes() {
        return request<ApiResponse<RoomTypeConfig[]>>(API_ROUTES.HOTEL_ROOM_TYPES, {
            method: "GET",
        }).then(res => {
            if (res.success && res.data) {
                res.data = res.data.map(rt => ({
                    ...rt,
                    id: String(rt.id),
                }));
            }
            return res;
        });
    }

    /**
     * Create a new room type.
     */
    createRoomType(payload: Omit<RoomTypeConfig, "id">) {
        return request<ApiResponse<RoomTypeConfig>>(API_ROUTES.HOTEL_ROOM_TYPES, {
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
     * Update an existing room type.
     */
    updateRoomType(id: string, payload: Omit<RoomTypeConfig, "id">) {
        return request<ApiResponse<RoomTypeConfig>>(`${API_ROUTES.HOTEL_ROOM_TYPES}/${id}`, {
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
     * Delete a room type configuration.
     */
    deleteRoomType(id: string) {
        return request<ApiResponse<void>>(`${API_ROUTES.HOTEL_ROOM_TYPES}/${id}`, {
            method: "DELETE",
        });
    }
}

export const roomTypeService = new RoomTypeService();
