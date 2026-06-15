export interface Tier {
    id: string;
    tierName: string;
    pointRate: number;
    bookingWindow: number;
    level: string;
}

export interface CreateTierDto {
    tierName: string;
    pointRate: number;
    bookingWindow: number;
    level: string;
}

export interface UpdateTierDto {
    tierName: string;
    pointRate: number;
    bookingWindow: number;
    level: string;
}