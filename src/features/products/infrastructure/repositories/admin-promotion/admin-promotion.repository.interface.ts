import type {
    AdminPromotionResponseData,
    CreateAdminPromotionInput,
    UpdateAdminPromotionInput,
} from "@/features/products/domain/models/admin-promotion/admin-promotion.model.ts";

export interface IAdminPromotionRepository {
    getAll(): Promise<AdminPromotionResponseData[]>;
    getById(id: string): Promise<AdminPromotionResponseData>;
    create(data: CreateAdminPromotionInput): Promise<AdminPromotionResponseData>;
    update(id: string, data: UpdateAdminPromotionInput): Promise<AdminPromotionResponseData>;
    delete(id: string): Promise<void>;
}
