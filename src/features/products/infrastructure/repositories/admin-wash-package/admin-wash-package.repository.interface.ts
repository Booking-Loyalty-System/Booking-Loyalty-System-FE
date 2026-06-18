import type {
    CreateWashPackageInput,
    UpdateWashPackageInput, WashPackageResponseData
} from "@/features/products/domain/models/admin-wash-package/admin-wash-package.model.ts";

export interface IAdminWashPackageRepository {
    getAll(): Promise<WashPackageResponseData[]>;
    create(data: CreateWashPackageInput): Promise<WashPackageResponseData>;
    update(id: string, data: UpdateWashPackageInput): Promise<WashPackageResponseData>;
    delete(id: string): Promise<void>;
}