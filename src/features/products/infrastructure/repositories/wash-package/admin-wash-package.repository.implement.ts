import { httpClient } from '@/core/http/httpClient';
import { ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '../../../domain/apiResponse';
import type { 
    WashPackageResponseData, 
    CreateWashPackageInput, 
    UpdateWashPackageInput 
} from '../../../domain/models/wash-package/admin-wash-package.model';

export class AdminWashPackageRepositoryImplement {
    async getAll(): Promise<WashPackageResponseData[]> {
        const response = await httpClient.get<ApiResponse<WashPackageResponseData[]>>(
            ENDPOINTS.ADMIN.WASH_PACKAGES
        );
        return response.data;
    }

    async create(data: CreateWashPackageInput): Promise<WashPackageResponseData> {
        const response = await httpClient.post<ApiResponse<WashPackageResponseData>>(
            ENDPOINTS.ADMIN.WASH_PACKAGES,
            data
        );
        return response.data;
    }

    async update(id: string, data: UpdateWashPackageInput): Promise<WashPackageResponseData> {
        const response = await httpClient.put<ApiResponse<WashPackageResponseData>>(
            ENDPOINTS.ADMIN.WASH_PACKAGE_DETAIL(id),
            data
        );
        return response.data;
    }

    async delete(id: string): Promise<void> {
        await httpClient.delete<ApiResponse<unknown>>(
            ENDPOINTS.ADMIN.WASH_PACKAGE_DETAIL(id)
        );
    }
}