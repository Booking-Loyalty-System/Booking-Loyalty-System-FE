import type { LoyaltyHistoryResponse } from "@/features/products/domain/models/loyalty/loyalty.dto.ts";

export interface ILoyaltyRepository {
    getHistory(): Promise<LoyaltyHistoryResponse>;
}
