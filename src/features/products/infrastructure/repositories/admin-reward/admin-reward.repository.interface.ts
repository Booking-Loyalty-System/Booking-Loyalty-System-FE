import type {
    AdminRewardResponseData,
    CreateAdminRewardInput,
    UpdateAdminRewardInput,
} from "@/features/products/domain/models/admin-reward/admin-reward.model.ts";

export interface IAdminRewardRepository {
    getAll(): Promise<AdminRewardResponseData[]>;
    getById(id: string): Promise<AdminRewardResponseData>;
    create(data: CreateAdminRewardInput): Promise<AdminRewardResponseData>;
    update(id: string, data: UpdateAdminRewardInput): Promise<AdminRewardResponseData>;
    delete(id: string): Promise<void>;
}
