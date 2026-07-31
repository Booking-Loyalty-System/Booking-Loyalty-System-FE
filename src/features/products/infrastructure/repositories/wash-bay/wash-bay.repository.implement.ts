import { httpClient } from '@/core/http/httpClient';
import { ENDPOINTS } from '@/core/api/endpoints';
import type { IWashBayRepository, WashBay } from './wash-bay.repository.interface';
import type { ApiResponse } from '../../../domain/apiResponse';

export class WashBayRepositoryImplement implements IWashBayRepository {
    async getAllWashBays(): Promise<WashBay[]> {
        const response = await httpClient.get<ApiResponse<WashBay[]>>(
            ENDPOINTS.ADMIN.WASH_BAYS
        );
        return response.data;
    }

    async getWashBaysByBranch(branchId: string): Promise<WashBay[]> {
        const response = await httpClient.get<ApiResponse<WashBay[]>>(
            // Đảm bảo ENDPOINTS.WASH_BAY.BY_BRANCH(branchId) đã được cấu hình đúng
            ENDPOINTS.WASH_BAY.BY_BRANCH(branchId)
        );
        // Trả về data (mảng WashBay) từ ApiResponse
        return response.data;
    }

    async createWashBay(payload: { name: string; branchId: string }): Promise<WashBay> {
        const response = await httpClient.post<ApiResponse<WashBay>>(
            ENDPOINTS.ADMIN.WASH_BAYS,
            payload
        );
        return response.data;
    }
}