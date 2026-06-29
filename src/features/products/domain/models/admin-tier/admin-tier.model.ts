export interface TierResponseData {
    id: string;
    tierName: string;
    level: string;
    pointRate: number;
    bookingWindow: number;
    minPointsRequired: number;
    maintenancePoints: number;
    benefits: string[];
}
export interface RewardResponseData {
    id: string;
    name: string;
    description: string;
    pointsCost: number;
    category: string;
}
export type UpdateTierInput = Omit<TierResponseData, 'id'>;