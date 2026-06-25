import type { Promotion, ValidatePromotionRequest, ValidatePromotionResponse } from "../../../domain/models/promotion/promotion.dto.ts";

export interface IPromotionRepository {
    getPromotions(): Promise<Promotion[]>;
    validatePromotion(request: ValidatePromotionRequest): Promise<ValidatePromotionResponse>;
}
