export interface OverviewMetric {
    id: string;
    title: string;
    subtitle: string;
    value: number | string;
}

export interface RoomTypeMetric {
    id: string;
    title: string;
    active: number;
    total: number;
    hourlyPrice: number;
    dailyPrice: number;
    currency?: string;
}

export interface RoomStatusCategory {
    total: number;
    clean: number;
    dirty: number;
    inspected: number;
}

export interface RoomStatusData {
    occupied: RoomStatusCategory;
    available: RoomStatusCategory;
}

export interface FloorProgress {
    id: string;
    name: string;
    completedPercent: number;
}

export interface CustomerReview {
    id: string;
    name: string;
    roomNumber: string;
    message: string;
}

export interface OccupancyChartDatum {
    label: string;
    value: number;
}
