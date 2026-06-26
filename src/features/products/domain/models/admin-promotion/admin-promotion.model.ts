export interface PromotionResponseData {
    id: string;
    code: string;
    description: string;
    discountType: 'Percentage' | 'FixedAmount';
    discountValue: number;
    startDate: string;
    endDate: string;
    maxUses: number | null;
    usedCount: number;
    minSpend: number | null;
    isActive: boolean;
    createdAt: string;
}

export interface CreatePromotionInput {
    code: string;
    description: string;
    discountType: 'Percentage' | 'FixedAmount';
    discountValue: number;
    startDate: string;
    endDate: string;
    maxUses: number | null;
    minSpend: number | null;
    isActive?: boolean;
}

export type UpdatePromotionInput = Partial<CreatePromotionInput>;