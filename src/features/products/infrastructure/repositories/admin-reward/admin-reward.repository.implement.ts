import { httpClient } from '@/core/http/httpClient';
import { ENDPOINTS } from "@/core/api/endpoints.ts";
import type { ApiResponse } from '../../../domain/apiResponse';
import type { IAdminRewardRepository } from './admin-reward.repository.interface';
import type { 
    RewardResponseData, 
    CreateRewardInput, 
    UpdateRewardInput 
} from '../../../domain/models/admin-reward/admin-reward.model';

export class AdminRewardRepositoryImplement implements IAdminRewardRepository {
    async getAll(): Promise<RewardResponseData[]> {
        const response = await httpClient.get<ApiResponse<RewardResponseData[]>>(
            ENDPOINTS.ADMIN.REWARDS
        );
        return response.data;
    }

    async getById(id: string): Promise<RewardResponseData> {
        const response = await httpClient.get<ApiResponse<RewardResponseData>>(
            ENDPOINTS.ADMIN.REWARD_DETAIL(id)
        );
        return response.data;
    }

    async create(data: CreateRewardInput): Promise<RewardResponseData> {
        const response = await httpClient.post<ApiResponse<RewardResponseData>>(
            ENDPOINTS.ADMIN.REWARDS,
            data
        );
        return response.data;
    }

    async update(id: string, data: UpdateRewardInput): Promise<RewardResponseData> {
        const response = await httpClient.put<ApiResponse<RewardResponseData>>(
            ENDPOINTS.ADMIN.REWARD_DETAIL(id),
            data
        );
        return response.data;
    }

    async delete(id: string): Promise<void> {
        await httpClient.delete<ApiResponse<unknown>>(
            ENDPOINTS.ADMIN.REWARD_DETAIL(id)
        );
    }

    async fulfillRedemption(redemptionId: string): Promise<void> {
        await httpClient.post<ApiResponse<unknown>>(
            ENDPOINTS.ADMIN.REWARD_FULFILL(redemptionId),
            {}
        );
    }
}