import { httpClient } from '@/core/http/httpClient';
import { ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '../../../domain/apiResponse';
import type {
    AdminPromotionResponseData,
    CreateAdminPromotionInput,
    UpdateAdminPromotionInput,
} from '../../../domain/models/admin-promotion/admin-promotion.model';
import type { IAdminPromotionRepository } from './admin-promotion.repository.interface';

export class AdminPromotionRepositoryImplement implements IAdminPromotionRepository {
    async getAll(): Promise<AdminPromotionResponseData[]> {
        const response = await httpClient.get<ApiResponse<AdminPromotionResponseData[]>>(
            ENDPOINTS.ADMIN.PROMOTIONS
        );
        return response.data;
    }

    async getById(id: string): Promise<AdminPromotionResponseData> {
        const response = await httpClient.get<ApiResponse<AdminPromotionResponseData>>(
            ENDPOINTS.ADMIN.PROMOTION_DETAIL(id)
        );
        return response.data;
    }

    async create(data: CreateAdminPromotionInput): Promise<AdminPromotionResponseData> {
        const response = await httpClient.post<ApiResponse<AdminPromotionResponseData>>(
            ENDPOINTS.ADMIN.PROMOTIONS,
            data
        );
        return response.data;
    }

    async update(id: string, data: UpdateAdminPromotionInput): Promise<AdminPromotionResponseData> {
        const response = await httpClient.put<ApiResponse<AdminPromotionResponseData>>(
            ENDPOINTS.ADMIN.PROMOTION_DETAIL(id),
            data
        );
        return response.data;
    }

    async delete(id: string): Promise<void> {
        await httpClient.delete<ApiResponse<unknown>>(
            ENDPOINTS.ADMIN.PROMOTION_DETAIL(id)
        );
    }
}
