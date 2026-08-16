import { Wifi, Wind, Tv, Coffee, Car, Utensils, Bell } from "lucide-react";

export interface Amenity {
    id: string;
    name: string;
    iconName: "Wifi" | "Wind" | "Tv" | "Coffee" | "Car" | "Utensils" | "Bell";
    description: string;
}

export const AVAILABLE_AMENITIES: Amenity[] = [
    {
        id: "wifi",
        name: "Wi-Fi",
        iconName: "Wifi",
        description: "High-speed wireless internet access",
    },
    {
        id: "ac",
        name: "Air Conditioning",
        iconName: "Wind",
        description: "Climate-controlled cooling system",
    },
    {
        id: "tv",
        name: "TV",
        iconName: "Tv",
        description: "Flat-screen television with satellite channels",
    },
    {
        id: "minibar",
        name: "Mini Bar",
        iconName: "Coffee",
        description: "Small in-room refrigerator stocked with refreshments",
    },
    {
        id: "parking",
        name: "Parking",
        iconName: "Car",
        description: "On-site secure parking space for vehicles",
    },
    {
        id: "breakfast",
        name: "Breakfast",
        iconName: "Utensils",
        description: "Freshly prepared morning breakfast service",
    },
    {
        id: "roomservice",
        name: "Room Service",
        iconName: "Bell",
        description: "In-room food, drinks, and housekeeping service request",
    },
];

// Icon mapper to easily render the correct Lucide icon component dynamically
export const AMENITY_ICONS = {
    Wifi,
    Wind,
    Tv,
    Coffee,
    Car,
    Utensils,
    Bell,
} as const;
