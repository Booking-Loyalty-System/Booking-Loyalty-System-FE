export interface Promotion {
    id: string;
    title: string;
    description: string;
    code: string;
    discountType: 'Percentage' | 'FixedAmount';
    discountValue: number;
    startDate: string;
    endDate: string;
    conditions: string[];
    isActive: boolean;
    bannerImage?: string;
    targetTiers: string[]; // e.g., ['All', 'Gold', 'Silver']
}

export interface PromotionResponse {
    promotions: Promotion[];
}

export interface ValidatePromotionRequest {
    code: string;
    serviceId: string;
}

export interface ValidatePromotionResponse {
    isValid: boolean;
    promotion?: Promotion;
    errorMessage?: string;
}
