export type DiscountType = 'Percentage' | 'FixedAmount';

export interface AdminPromotionResponseData {
    id: string;
    code: string;
    description: string;
    discountType: DiscountType;
    discountValue: number;
    startDate: string;
    endDate: string;
    maxUses: number | null;
    usedCount: number;
    minSpend: number | null;
    isActive: boolean;
    createdAt: string;
}

export interface CreateAdminPromotionInput {
    code: string;
    name: string;
    description: string;
    discountType: string;
    discountValue: number;
    priorityLevel: number;
    startDate: string;
    endDate: string;
    maxUses?: number | null;
    minSpend?: number | null;
    requiresBirthday: boolean;
    tierIds: string[];
    branchIds: string[];
}
export interface UpdateAdminPromotionInput {
    description: string;
    discountType: DiscountType;
    discountValue: number;
    startDate: string;
    endDate: string;
    maxUses?: number | null;
    minSpend?: number | null;
    isActive: boolean;
}
