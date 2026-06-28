export interface RewardResponseData {
    id: string;
    name: string;
    description: string;
    pointsCost: number;
    discountAmount: number;
    isActive: boolean;
    createdAt: string;
}

export interface CreateRewardInput {
    name: string;
    description: string;
    pointsCost: number;
    discountAmount: number;
    isActive?: boolean;
}

export type UpdateRewardInput = Partial<CreateRewardInput>;