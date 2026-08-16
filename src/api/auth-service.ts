import { BaseService } from "@/api/base-service";
import { API_ROUTES } from "@/constants/api-routes";

export interface UserDto {
    id: number;
    hotelId: number | null;
    name: string;
    email: string;
    phone?: string;
    role: string;
    status: string;
}

export interface HotelDto {
    id: number;
    name: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    status: string;
}

export interface AuthResponse {
    message?: string;
    token?: string;
    user?: UserDto;
    hotel?: HotelDto;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data?: T;
}

export interface SignInPayload {
    email: string;
    password: string;
}

export interface SignUpPayload {
    hotelName: string;
    ownerName: string;
    email: string;
    password: string;
    phone?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
}

class AuthService extends BaseService {
    signIn(payload: SignInPayload) {
        return this.post<AuthResponse>(API_ROUTES.LOGIN, payload);
    }

    signUp(payload: SignUpPayload) {
        return this.post<AuthResponse>(API_ROUTES.SIGNUP, payload);
    }

    logout() {
        return this.post<ApiResponse<void>>(API_ROUTES.LOGOUT);
    }

    getCurrentUser() {
        return this.get<ApiResponse<UserDto>>(API_ROUTES.CURRENT_USER);
    }
}

export const authService = new AuthService();
