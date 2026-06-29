import { httpClient } from '@/core/http/httpClient';
import { ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '../../../domain/apiResponse';
import type {
    AdminRewardResponseData,
    CreateAdminRewardInput,
    UpdateAdminRewardInput,
} from '../../../domain/models/admin-reward/admin-reward.model';
import type { IAdminRewardRepository } from './admin-reward.repository.interface';

export class AdminRewardRepositoryImplement implements IAdminRewardRepository {
    async getAll(): Promise<AdminRewardResponseData[]> {
        const response = await httpClient.get<ApiResponse<AdminRewardResponseData[]>>(
            ENDPOINTS.ADMIN.REWARDS
        );
        return response.data;
    }

    async getById(id: string): Promise<AdminRewardResponseData> {
        const response = await httpClient.get<ApiResponse<AdminRewardResponseData>>(
            ENDPOINTS.ADMIN.REWARD_DETAIL(id)
        );
        return response.data;
    }

    async create(data: CreateAdminRewardInput): Promise<AdminRewardResponseData> {
        const response = await httpClient.post<ApiResponse<AdminRewardResponseData>>(
            ENDPOINTS.ADMIN.REWARDS,
            data
        );
        return response.data;
    }

    async update(id: string, data: UpdateAdminRewardInput): Promise<AdminRewardResponseData> {
        const response = await httpClient.put<ApiResponse<AdminRewardResponseData>>(
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
