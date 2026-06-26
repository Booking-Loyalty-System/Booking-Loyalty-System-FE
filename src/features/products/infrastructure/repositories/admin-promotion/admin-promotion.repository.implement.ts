import { httpClient } from '@/core/http/httpClient';
import type { ApiResponse } from '../../../domain/apiResponse';
import type { IAdminPromotionRepository } from './admin-promotion.repository.interface';
import type { 
    PromotionResponseData, 
    CreatePromotionInput, 
    UpdatePromotionInput 
} from '../../../domain/models/admin-promotion/admin-promotion.model';

export class AdminPromotionRepositoryImplement implements IAdminPromotionRepository {
    async getAll(): Promise<PromotionResponseData[]> {
        const response = await httpClient.get<ApiResponse<PromotionResponseData[]>>(
            '/admin/promotions'
        );
        return response.data;
    }

    async getById(id: string): Promise<PromotionResponseData> {
        const response = await httpClient.get<ApiResponse<PromotionResponseData>>(
            `/admin/promotions/${id}`
        );
        return response.data;
    }

    async create(data: CreatePromotionInput): Promise<PromotionResponseData> {
        const response = await httpClient.post<ApiResponse<PromotionResponseData>>(
            '/admin/promotions',
            data
        );
        return response.data;
    }

    async update(id: string, data: UpdatePromotionInput): Promise<PromotionResponseData> {
        const response = await httpClient.put<ApiResponse<PromotionResponseData>>(
            `/admin/promotions/${id}`,
            data
        );
        return response.data;
    }

    async delete(id: string): Promise<void> {
        await httpClient.delete<ApiResponse<unknown>>(
            `/admin/promotions/${id}`
        );
    }
}