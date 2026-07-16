import type { ILoyaltyRepository } from "./loyalty.repository.interface.ts";
import type { LoyaltyHistoryResponse } from "@/features/products/domain/models/loyalty/loyalty.dto.ts";
import { httpClient } from "@/core/http/httpClient.ts";
import { ENDPOINTS } from "@/core/api/endpoints.ts";
import type { ApiResponse } from "@/features/products/domain/apiResponse.ts";

export class LoyaltyRepositoryImplement implements ILoyaltyRepository {
    async getHistory(): Promise<LoyaltyHistoryResponse> {
        try {
            // Note: The backend returns an array of transactions in response.data directly, not an object.
            const response = await httpClient.get<ApiResponse<any[]>>(ENDPOINTS.LOYALTY.HISTORY);
            
            const rawTransactions = response.data || [];
            
            // Map backend data to frontend DTO
            const mappedTransactions = rawTransactions.map((tx: any) => ({
                id: tx.id,
                date: tx.createdAt, // Giữ nguyên ISO string để các component khác có thể parse lại
                description: tx.description || (tx.type === "Earn" ? "Earned from booking" : "Redeemed points"),
                type: tx.type === "Earn" ? "Earned" : "Redeemed",
                points: Math.abs(tx.points) // frontend component might expect absolute or relative depending on logic, but in LoyaltyTier.tsx it handles positive/negative based on "type"
            }));

            // Calculate totals from history
            const totalRedeemed = rawTransactions
                .filter((tx: any) => tx.type === "Redeem" || tx.type === "Redeemed")
                .reduce((sum: number, tx: any) => sum + Math.abs(tx.points), 0);

            const totalEarned = rawTransactions
                .filter((tx: any) => tx.type === "Earn" || tx.type === "Earned")
                .reduce((sum: number, tx: any) => sum + Math.abs(tx.points), 0);

            return {
                transactions: mappedTransactions,
                totalEarnedThisMonth: totalEarned, // Computed from all-time history for now
                totalRedeemedThisMonth: totalRedeemed,
                totalBookingsThisMonth: 0
            } as LoyaltyHistoryResponse;
        } catch (error) {
            console.error("LoyaltyRepositoryImplement - getHistory error:", error);
            throw error;
        }
    }
}
