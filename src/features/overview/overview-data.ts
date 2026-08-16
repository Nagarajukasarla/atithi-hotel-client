import type {
    CustomerReview,
    FloorProgress,
    OccupancyChartDatum,
    OverviewMetric,
    RoomStatusData,
    RoomTypeMetric,
} from "@/types/overview";

export const INITIAL_OVERVIEW_METRICS: OverviewMetric[] = [
    {
        id: "check-in",
        title: "Today's",
        subtitle: "Check-in",
        value: 23,
    },
    {
        id: "check-out",
        title: "Today's",
        subtitle: "Check-out",
        value: 13,
    },
    {
        id: "in-hotel",
        title: "Total",
        subtitle: "In hotel",
        value: 60,
    },
    {
        id: "available-room",
        title: "Total",
        subtitle: "Available room",
        value: 10,
    },
];

export const INITIAL_ROOM_TYPE_METRICS: RoomTypeMetric[] = [
    {
        id: "standard",
        title: "Standard",
        active: 6,
        total: 16,
        hourlyPrice: 250,
        dailyPrice: 1800,
    },
    {
        id: "deluxe",
        title: "Deluxe",
        active: 4,
        total: 12,
        hourlyPrice: 350,
        dailyPrice: 2400,
    },
    {
        id: "executive",
        title: "Executive",
        active: 3,
        total: 8,
        hourlyPrice: 500,
        dailyPrice: 3500,
    },
    {
        id: "vip",
        title: "VIP",
        active: 2,
        total: 4,
        hourlyPrice: 800,
        dailyPrice: 5500,
    },
];

export const INITIAL_ROOM_STATUS_DATA: RoomStatusData = {
    occupied: {
        total: 104,
        clean: 80,
        dirty: 18,
        inspected: 6,
    },
    available: {
        total: 20,
        clean: 15,
        dirty: 3,
        inspected: 2,
    },
};

export const INITIAL_FLOOR_PROGRESS: FloorProgress[] = [
    {
        id: "floor-1",
        name: "Floor 1",
        completedPercent: 80,
    },
    {
        id: "floor-2",
        name: "Floor 2",
        completedPercent: 65,
    },
    {
        id: "floor-3",
        name: "Floor 3",
        completedPercent: 90,
    },
];

export const INITIAL_OCCUPANCY_DATA: OccupancyChartDatum[] = [
    { label: "Jan", value: 88 },
    { label: "Feb", value: 99 },
    { label: "Mar", value: 95 },
    { label: "Apr", value: 100 },
    { label: "May", value: 60 },
    { label: "Jun", value: 118 },
    { label: "Jul", value: 60 },
    { label: "Aug", value: 123 },
    { label: "Sep", value: 64 },
    { label: "Oct", value: 91 },
    { label: "Nov", value: 97 },
    { label: "Apr", value: 60 }, // Parity: Duplicate Apr preserved as specified in brief
    { label: "Dec", value: 108 },
];

export const INITIAL_CUSTOMER_REVIEWS: CustomerReview[] = [
    {
        id: "rev-1",
        name: "Yudhishthira Pandava",
        roomNumber: "A101",
        message: "The room was clean and service was prompt.",
    },
    {
        id: "rev-2",
        name: "Draupadi",
        roomNumber: "A102",
        message: "Great ambiance and excellent room service.",
    },
    {
        id: "rev-3",
        name: "Arjuna",
        roomNumber: "A201",
        message: "Smooth check-in process and comfortable bed.",
    },
    {
        id: "rev-4",
        name: "Bhima",
        roomNumber: "A301",
        message: "Spacious room, loved the dining options.",
    },
    {
        id: "rev-5",
        name: "Nakula",
        roomNumber: "A405",
        message: "Quiet room with nice views. Overall great stay.",
    },
];
