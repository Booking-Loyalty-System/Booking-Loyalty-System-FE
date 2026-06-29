import type {
    AdminTierResponseData,
    CreateAdminTierInput,
    UpdateAdminTierInput,
} from "@/features/products/domain/models/admin-loyalty/admin-loyalty.model.ts";

export interface IAdminLoyaltyRepository {
    getAll(): Promise<AdminTierResponseData[]>;
    getById(id: string): Promise<AdminTierResponseData>;
    create(data: CreateAdminTierInput): Promise<AdminTierResponseData>;
    update(id: string, data: UpdateAdminTierInput): Promise<AdminTierResponseData>;
    delete(id: string): Promise<void>;
}
