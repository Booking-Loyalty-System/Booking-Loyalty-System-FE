import type { ApiResponse } from '../../../domain/apiResponse.ts';
import { httpClient } from '@/core/http/httpClient.ts';
import { ENDPOINTS } from '@/core/api/endpoints.ts';
import type { IRewardRepository } from './reward.repository.interface.ts';
import type { Voucher, RewardDto, RedemptionDto } from '../../../domain/models/voucher/voucher.model.ts';

export class RewardRepositoryImplement implements IRewardRepository {
    async getAvailableRewards(): Promise<RewardDto[]> {
        const response = await httpClient.get<ApiResponse<RewardDto[]>>(
            ENDPOINTS.REWARDS.BASE
        );
        return response.data;
    }

    async redeemReward(rewardId: string): Promise<Voucher> {
        const response = await httpClient.post<ApiResponse<Voucher>>(
            ENDPOINTS.REWARDS.REWARD_DETAIL(rewardId)
        );
        return response.data;
    }

    async getMyRedemptions(): Promise<RedemptionDto[]> {
        const response = await httpClient.get<ApiResponse<RedemptionDto[]>>(
            ENDPOINTS.REWARDS.REDEMPTION_HISTORY
        );
        return response.data;
    }
}
