export interface AdminTierResponseData {
    id: string;
    tierName: string;
    level: string;
    pointRate: number;
    bookingWindow: number;
    minPointsRequired: number;
    maintenancePoints: number;
    benefits: string[];
}

export interface CreateAdminTierInput {
    tierName: string;
    pointRate: number;
    bookingWindow: number;
    level: string;
    minPointsRequired: number;
    maintenancePoints: number;
}

export interface UpdateAdminTierInput extends CreateAdminTierInput {}
