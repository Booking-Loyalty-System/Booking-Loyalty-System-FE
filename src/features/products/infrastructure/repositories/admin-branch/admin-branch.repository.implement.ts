import { httpClient } from '@/core/http/httpClient';
import { ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '../../../domain/apiResponse';
import type { 
    BranchResponseData, 
    CreateBranchInput, 
    UpdateBranchInput 
} from '../../../domain/models/admin-branch/admin-branch.model';

export class AdminBranchRepositoryImplement {
    async getAll(): Promise<BranchResponseData[]> {
        const response = await httpClient.get<ApiResponse<BranchResponseData[]>>(
            ENDPOINTS.ADMIN.BRANCHES
        );
        return response.data;
    }

    async create(data: CreateBranchInput): Promise<BranchResponseData> {
        const response = await httpClient.post<ApiResponse<BranchResponseData>>(
            ENDPOINTS.ADMIN.BRANCHES,
            data
        );
        return response.data;
    }

    async update(id: string, data: UpdateBranchInput): Promise<BranchResponseData> {
        const response = await httpClient.put<ApiResponse<BranchResponseData>>(
            ENDPOINTS.ADMIN.BRANCH_DETAIL(id),
            data
        );
        return response.data;
    }

    async delete(id: string): Promise<void> {
        await httpClient.delete<ApiResponse<unknown>>(
            ENDPOINTS.ADMIN.BRANCH_DETAIL(id)
        );
    }
}