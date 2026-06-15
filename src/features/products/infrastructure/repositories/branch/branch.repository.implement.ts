import type {Branch} from "@/features/products/domain/models/branch/branch.model.ts";
import {httpClient} from "@/core/http/httpClient.ts";
import type {ApiResponse} from "@/features/products/domain/apiResponse.ts";
import {ENDPOINTS} from "@/core/api/endpoints.ts";
import type {
    IBranchRepository
} from "@/features/products/infrastructure/repositories/branch/branch.repository.interface.ts";

export class BranchRepositoryImplement implements IBranchRepository{
    async getAllBranch(): Promise<Branch[]> {
        const response = await httpClient.get<ApiResponse<Branch[]>>(
            ENDPOINTS.BRANCH.BRANCH
        );
        return response.data;
    }

    // 2. Lấy chi tiết một gói dịch vụ cụ thể theo ID
    async getBranchById(id: string): Promise<Branch> {
        const response = await httpClient.get<ApiResponse<Branch>>(
            ENDPOINTS.WASH_PACKAGES.WASH_PACKAGE_DETAIL(id)
        );
        return response.data;
    }
}