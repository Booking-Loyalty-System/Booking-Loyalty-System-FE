import type {
    CreatePromotionInput,
    UpdatePromotionInput,
    PromotionResponseData
} from "../../../domain/models/admin-promotion/admin-promotion.model"; 

export interface IAdminPromotionRepository {
    getAll(): Promise<PromotionResponseData[]>;
    getById(id: string): Promise<PromotionResponseData>;
    create(data: CreatePromotionInput): Promise<PromotionResponseData>;
    update(id: string, data: UpdatePromotionInput): Promise<PromotionResponseData>;
    delete(id: string): Promise<void>;
}