import { httpClient } from "@/core/http/httpClient.ts";
import type { ApiResponse } from "@/features/products/domain/apiResponse.ts";
import { ENDPOINTS } from "@/core/api/endpoints.ts";
import type { Tier, CreateTierDto, UpdateTierDto } from "@/features/products/domain/models/tier/tier.dto.ts";
import type { ITierRepository } from "@/features/products/infrastructure/repositories/tier/tier.repository.interface.ts";

export class TierRepositoryImplement implements ITierRepository {
    async getAllTiers(): Promise<Tier[]> {
        const response = await httpClient.get<ApiResponse<Tier[]>>(
            ENDPOINTS.TIER.TIER
        );
        return response.data;
    }

    async getTierById(id: string): Promise<Tier> {
        const response = await httpClient.get<ApiResponse<Tier>>(
            `${ENDPOINTS.TIER.TIER}/${id}`
        );
        return response.data;
    }

    async createTier(data: CreateTierDto): Promise<Tier> {
        const response = await httpClient.post<ApiResponse<Tier>>(
            ENDPOINTS.TIER.TIER,
            data
        );
        return response.data;
    }

    async updateTier(id: string, data: UpdateTierDto): Promise<Tier> {
        const response = await httpClient.put<ApiResponse<Tier>>(
            `${ENDPOINTS.TIER.TIER}/${id}`,
            data
        );
        return response.data;
    }

    async deleteTier(id: string): Promise<void> {
        await httpClient.delete<ApiResponse<null>>(
            `${ENDPOINTS.TIER.TIER}/${id}`
        );
    }
}