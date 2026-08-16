import { BaseService } from "@/api/base-service";
import { API_ROUTES } from "@/constants/api-routes";
import type { ApiResponse } from "@/api/auth-service";

export interface BedTypeConfig {
    id: string;
    name: string;
    description: string;
    maxAdults: number;
    maxChildren: number;
    capacity: number;
}

class BedService extends BaseService {
    /**
     * Fetch configured bed types for the active hotel.
     */
    getBeds() {
        return this.get<ApiResponse<BedTypeConfig[]>>(API_ROUTES.HOTEL_BEDS);
    }

    /**
     * Update configured bed types for the active hotel.
     */
    updateBeds(beds: BedTypeConfig[]) {
        return this.post<ApiResponse<void>>(API_ROUTES.HOTEL_BEDS, {
            beds: beds,
        });
    }
}

export const bedService = new BedService();
