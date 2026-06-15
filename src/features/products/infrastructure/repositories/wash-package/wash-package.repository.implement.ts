import type {WashPackage} from "@/features/products/domain/models/wash-package/wash-package.model.ts";
import {httpClient} from "@/core/http/httpClient.ts";
import type {ApiResponse} from "@/features/products/domain/apiResponse.ts";
import {ENDPOINTS} from "@/core/api/endpoints.ts";
import type {
    IWashPackageRepository
} from "@/features/products/infrastructure/repositories/wash-package/wash-package.repository.interface.ts";

export class WashPackageRepositoryImplement implements IWashPackageRepository{
    // 1. Lấy danh sách tất cả các gói dịch vụ
    async getAllPackages(): Promise<WashPackage[]> {
        const response = await httpClient.get<ApiResponse<WashPackage[]>>(
            ENDPOINTS.WASH_PACKAGES.WASH_PACKAGE
        );
        return response.data;
    }

    // 2. Lấy chi tiết một gói dịch vụ cụ thể theo ID
    async getPackageById(id: string): Promise<WashPackage> {
        const response = await httpClient.get<ApiResponse<WashPackage>>(
            ENDPOINTS.WASH_PACKAGES.WASH_PACKAGE_DETAIL(id)
        );
        return response.data;
    }
}