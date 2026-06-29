import type { Voucher, RewardDto, RedemptionDto } from "../../../domain/models/voucher/voucher.model.ts";

export interface IRewardRepository {
    getAvailableRewards(): Promise<RewardDto[]>;
    redeemReward(rewardId: string): Promise<Voucher>;
    getMyRedemptions(): Promise<RedemptionDto[]>;
}
