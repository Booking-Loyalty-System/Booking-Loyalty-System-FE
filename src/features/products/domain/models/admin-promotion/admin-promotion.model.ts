export type DiscountType = 'Percentage' | 'FixedAmount';

export interface AdminPromotionResponseData {
    id: string;
    code: string;
    name: string;
    description: string;
    discountType: DiscountType;
    discountValue: number;
    priorityLevel: number;
    startDate: string;
    endDate: string;
    maxUses: number | null;
    minSpend: number | null;
    maxDiscount: number | null;
    requiresBirthday: boolean;
    tierIds: string[];
    branchIds: string[];
    isActive: boolean;
    usedCount: number;
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
    maxDiscount?: number | null;
    requiresBirthday: boolean;
    tierIds: string[];
    branchIds: string[];
}
export interface UpdateAdminPromotionInput {
    name?: string;
    description: string;
    discountType: DiscountType;
    discountValue: number;
    startDate: string;
    endDate: string;
    maxUses?: number | null;
    minSpend?: number | null;
    maxDiscount?: number | null;
    isActive: boolean;
    branchIds?: string[];
    tierIds?: string[];
}
