import type {
    RewardResponseData,
    CreateRewardInput,
    UpdateRewardInput
} from "../../../domain/models/admin-reward/admin-reward.model";

export interface IAdminRewardRepository {
    getAll(): Promise<RewardResponseData[]>;
    getById(id: string): Promise<RewardResponseData>;
    create(data: CreateRewardInput): Promise<RewardResponseData>;
    update(id: string, data: UpdateRewardInput): Promise<RewardResponseData>;
    delete(id: string): Promise<void>;
    fulfillRedemption(redemptionId: string): Promise<void>;
}