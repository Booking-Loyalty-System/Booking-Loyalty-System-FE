import type { IPromotionRepository } from "./promotion.repository.interface.ts";
import type { Promotion, ValidatePromotionRequest, ValidatePromotionResponse } from "../../../domain/models/promotion/promotion.dto.ts";
import { apiClient } from "@/core/api/apiClient.ts";

export class PromotionRepositoryImplement implements IPromotionRepository {
    async getPromotions(): Promise<Promotion[]> {
        const response = await apiClient.get<{ data: Promotion[] }>('/api/promotions');
        return response.data.data;
    }

    async validatePromotion(request: ValidatePromotionRequest): Promise<ValidatePromotionResponse> {
        const response = await apiClient.post<{ data: ValidatePromotionResponse }>('/api/promotions/validate', request);
        return response.data.data;
    }
}
