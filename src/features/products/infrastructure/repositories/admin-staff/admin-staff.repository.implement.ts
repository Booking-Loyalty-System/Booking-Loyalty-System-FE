import { apiClient } from '@/core/api/apiClient';
import { ENDPOINTS } from '@/core/api/endpoints';

import type {
    AdminStaffResponseData,
    CreateAdminStaffInput,
    UpdateAdminStaffInput,
} from '../../../domain/models/admin-staff/admin-staff.model';

import type { IAdminStaffRepository } from './admin-staff.repository.interface';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export class AdminStaffRepositoryImplement
    implements IAdminStaffRepository
{
    async getAll(): Promise<AdminStaffResponseData[]> {
        const response = await apiClient.get<
            unknown,
            ApiResponse<AdminStaffResponseData[]>
        >(ENDPOINTS.ADMIN.STAFF);

        return response.data;
    }

    async getById(
        id: string
    ): Promise<AdminStaffResponseData> {
        const response = await apiClient.get<
            unknown,
            ApiResponse<AdminStaffResponseData>
        >(ENDPOINTS.ADMIN.STAFF_DETAIL(id));

        return response.data;
    }

    async create(
        data: CreateAdminStaffInput
    ): Promise<AdminStaffResponseData> {
        const response = await apiClient.post<
            unknown,
            ApiResponse<AdminStaffResponseData>
        >(
            ENDPOINTS.ADMIN.STAFF,
            data
        );

        return response.data;
    }

    async update(
        id: string,
        data: UpdateAdminStaffInput
    ): Promise<AdminStaffResponseData> {
        const response = await apiClient.put<
            unknown,
            ApiResponse<AdminStaffResponseData>
        >(
            ENDPOINTS.ADMIN.STAFF_DETAIL(id),
            data
        );

        return response.data;
    }

    async delete(id: string): Promise<void> {
        await apiClient.delete(
            ENDPOINTS.ADMIN.STAFF_DETAIL(id)
        );
    }
}