import type { ILoyaltyRepository } from './loyalty.repository.interface';
import type { LoyaltyInfo, LoyaltyTransaction } from '../../../domain/models/loyalty/loyalty.model';
import { httpClient } from '@/core/http/httpClient';
import { ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '../../../domain/apiResponse';

export class LoyaltyRepositoryImplement implements ILoyaltyRepository {
    async getLoyaltyInfo(): Promise<LoyaltyInfo> {
        const response = await httpClient.get<ApiResponse<LoyaltyInfo>>(ENDPOINTS.LOYALTY.INFO);
        return response.data;
    }

    async getTransactionHistory(): Promise<LoyaltyTransaction[]> {
        const response = await httpClient.get<ApiResponse<LoyaltyTransaction[]>>(ENDPOINTS.LOYALTY.TRANSACTIONS);
        return response.data;
    }

    async redeemPoints(points: number, rewardId: string): Promise<{ success: boolean; message: string }> {
        const response = await httpClient.post<ApiResponse<{ success: boolean; message: string }>>(
            ENDPOINTS.LOYALTY.REDEEM,
            { points, rewardId }
        );
        return response.data;
    }
}
