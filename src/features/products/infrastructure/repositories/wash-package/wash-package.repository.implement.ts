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
        /* === START MOCK DATA ===
        console.log('[Mock] Fetching wash packages');
        return [
            {
                id: 'pkg-001',
                name: 'Basic Shine',
                description: 'Exterior wash, wheel cleaning, and tire shine.',
                price: 150000,
                durationMinutes: 30,
                imageUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=400&h=300&fit=crop'
            },
            {
                id: 'pkg-002',
                name: 'Premium Care',
                description: 'Basic Shine + interior vacuuming and dashboard wipe.',
                price: 300000,
                durationMinutes: 60,
                imageUrl: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=400&h=300&fit=crop'
            },
            {
                id: 'pkg-003',
                name: 'Ultimate Detail',
                description: 'Premium Care + wax coating and engine bay cleaning.',
                price: 550000,
                durationMinutes: 120,
                imageUrl: 'https://images.unsplash.com/photo-1552933529-e359b2477252?w=400&h=300&fit=crop'
            }
        ];
        === END MOCK DATA === */

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