import type {WashPackage} from "@/features/products/domain/models/wash-package/wash-package.model.ts";

export interface IWashPackageRepository {
    getAllPackages(): Promise<WashPackage[]>;
    getPackageById(id: string): Promise<WashPackage>;
}