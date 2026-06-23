import type { ILoyaltyRepository } from "./loyalty.repository.interface.ts";
import type { LoyaltyHistoryResponse } from "@/features/products/domain/models/loyalty/loyalty.dto.ts";
import { httpClient } from "@/core/http/httpClient.ts";
import { ENDPOINTS } from "@/core/api/endpoints.ts";
import type { ApiResponse } from "@/features/products/domain/apiResponse.ts";

export class LoyaltyRepositoryImplement implements ILoyaltyRepository {
    async getHistory(): Promise<LoyaltyHistoryResponse> {
        try {
            const response = await httpClient.get<ApiResponse<LoyaltyHistoryResponse>>(ENDPOINTS.LOYALTY.HISTORY);
            return response.data;
        } catch (error) {
            console.error("LoyaltyRepositoryImplement - getHistory error:", error);
            throw error;
        }
    }
}
