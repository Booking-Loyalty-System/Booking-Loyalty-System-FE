import type { Tier, CreateTierDto, UpdateTierDto } from "@/features/products/domain/models/tier/tier.dto.ts";

export interface ITierRepository {
    getAllTiers(): Promise<Tier[]>;
    getTierById(id: string): Promise<Tier>;
    createTier(data: CreateTierDto): Promise<Tier>;
    updateTier(id: string, data: UpdateTierDto): Promise<Tier>;
    deleteTier(id: string): Promise<void>;
}