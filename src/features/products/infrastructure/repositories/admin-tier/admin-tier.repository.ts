import { httpClient } from '@/core/http/httpClient';
import { ENDPOINTS } from "@/core/api/endpoints.ts";
import type { TierResponseData, UpdateTierInput } from '../../../domain/models/admin-tier/admin-tier.model';

export class AdminTierRepository {
    async getAll(): Promise<TierResponseData[]> {
        const res = await httpClient.get<any>(ENDPOINTS.TIER.TIER);
        return res.data;
    }

    async update(id: string, data: UpdateTierInput): Promise<TierResponseData> {
        const res = await httpClient.put<any>(`/admin/tiers/${id}`, data);
        return res.data;
    }
}