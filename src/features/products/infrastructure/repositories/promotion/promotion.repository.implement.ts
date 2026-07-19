import type { IPromotionRepository } from "./promotion.repository.interface.ts";
import type { Promotion, ValidatePromotionRequest, ValidatePromotionResponse } from "../../../domain/models/promotion/promotion.dto.ts";
import { httpClient } from "@/core/http/httpClient.ts";
import { ENDPOINTS } from "@/core/api/endpoints.ts";
import type { ApiResponse } from "@/features/products/domain/apiResponse.ts";

export class PromotionRepositoryImplement implements IPromotionRepository {
    async getPromotions(): Promise<Promotion[]> {
        const response = await httpClient.get<ApiResponse<Promotion[]>>(ENDPOINTS.PROMOTION.BASE);
        return response.data;
    }

    async validatePromotion(request: ValidatePromotionRequest): Promise<ValidatePromotionResponse> {
        const response = await httpClient.get<ApiResponse<ValidatePromotionResponse>>(
            `/promotions/${request.code}/preview`,
            {
                params: {
                    subtotal: request.subtotal,
                    branchId: request.branchId
                }
            }
        );
        return response.data;
    }

    async getEligiblePromotions(branchId: string): Promise<Promotion[]> {
        const response = await httpClient.get<ApiResponse<Promotion[]>>(
            ENDPOINTS.PROMOTION.ELIGIBLE,
            { params: { branchId } }
        );
        return (response.data || []).map(promo => {
            const typeStr = String(promo.discountType).toLowerCase();
            return {
                ...promo,
                discountType: (typeStr === '0' || typeStr === 'percentage')
                    ? 'Percentage'
                    : 'FixedAmount'
            };
        });
    }
}