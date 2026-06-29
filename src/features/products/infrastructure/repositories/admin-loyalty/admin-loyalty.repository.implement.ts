import { httpClient } from '@/core/http/httpClient';
import { ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '../../../domain/apiResponse';
import type {
    AdminTierResponseData,
    CreateAdminTierInput,
    UpdateAdminTierInput,
} from '../../../domain/models/admin-loyalty/admin-loyalty.model';
import type { IAdminLoyaltyRepository } from './admin-loyalty.repository.interface';

export class AdminLoyaltyRepositoryImplement implements IAdminLoyaltyRepository {
    async getAll(): Promise<AdminTierResponseData[]> {
        const response = await httpClient.get<ApiResponse<AdminTierResponseData[]>>(
            ENDPOINTS.ADMIN.TIERS
        );
        return response.data;
    }

    async getById(id: string): Promise<AdminTierResponseData> {
        const response = await httpClient.get<ApiResponse<AdminTierResponseData>>(
            ENDPOINTS.ADMIN.TIER_DETAIL(id)
        );
        return response.data;
    }

    async create(data: CreateAdminTierInput): Promise<AdminTierResponseData> {
        const response = await httpClient.post<ApiResponse<AdminTierResponseData>>(
            ENDPOINTS.ADMIN.TIERS,
            data
        );
        return response.data;
    }

    async update(id: string, data: UpdateAdminTierInput): Promise<AdminTierResponseData> {
        const response = await httpClient.put<ApiResponse<AdminTierResponseData>>(
            ENDPOINTS.ADMIN.TIER_DETAIL(id),
            data
        );
        return response.data;
    }

    async delete(id: string): Promise<void> {
        await httpClient.delete<ApiResponse<unknown>>(
            ENDPOINTS.ADMIN.TIER_DETAIL(id)
        );
    }
}
