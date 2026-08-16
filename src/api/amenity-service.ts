import { BaseService } from "@/api/base-service";
import { API_ROUTES } from "@/constants/api-routes";
import type { ApiResponse } from "@/api/auth-service";

class AmenityService extends BaseService {
    /**
     * Fetch configured amenity IDs for the active hotel.
     */
    getAmenities() {
        return this.get<ApiResponse<string[]>>(API_ROUTES.HOTEL_AMENITIES);
    }

    /**
     * Update configured amenities for the active hotel.
     */
    updateAmenities(amenityIds: string[]) {
        return this.post<ApiResponse<void>>(API_ROUTES.HOTEL_AMENITIES, {
            amenities: amenityIds,
        });
    }
}

export const amenityService = new AmenityService();
