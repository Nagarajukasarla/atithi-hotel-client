/**
 * API paths relative to VITE_API_BASE_URL.
 *
 * Keep endpoint paths here so services do not duplicate route strings.
 */
export const API_ROUTES = {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    LOGOUT: "/auth/logout",
    CURRENT_USER: "/auth/me",
    HOTEL_AMENITIES: "/hotel/amenities",
    HOTEL_BEDS: "/hotel/beds",
    HOTEL_ROOM_TYPES: "/hotel/room-types",
    HOTEL_ROOMS: "/hotel/rooms",
} as const;
