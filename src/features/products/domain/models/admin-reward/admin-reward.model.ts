export interface AdminRewardResponseData {
    id: string;
    name: string;
    description: string;
    pointsCost: number;
    discountAmount: number;
    isActive: boolean;
    createdAt: string;
}

export interface CreateAdminRewardInput {
    name: string;
    description: string;
    pointsCost: number;
    discountAmount: number;
}

export interface UpdateAdminRewardInput extends CreateAdminRewardInput {
    isActive: boolean;
}
