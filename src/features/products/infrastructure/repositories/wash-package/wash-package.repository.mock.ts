import type { IWashPackageRepository } from "./wash-package.repository.interface.ts";
import type { WashPackage } from "../../../domain/models/wash-package/wash-package.model.ts";

const MOCK_PACKAGES: WashPackage[] = [
    {
        id: "pkg_1",
        name: "Standard Wash",
        description: "Rửa sạch cơ bản, hút bụi và lau khô nội thất",
        price: 150000,
        durationMinutes: 30,
        features: ["Rửa vỏ xe", "Hút bụi", "Lau khô"],
        vehicleType: "Small",
        isActive: true
    },
    {
        id: "pkg_2",
        name: "Premium Wash",
        description: "Rửa sạch chuyên sâu, tẩy nhựa đường và làm bóng lốp",
        price: 250000,
        durationMinutes: 45,
        features: ["Rửa vỏ xe", "Hút bụi chuyên sâu", "Làm bóng lốp", "Tẩy nhựa đường"],
        vehicleType: "Medium",
        isActive: true
    },
    {
        id: "pkg_3",
        name: "Deluxe Coating",
        description: "Rửa cao cấp kết hợp phủ ceramic bảo vệ bề mặt sơn",
        price: 400000,
        durationMinutes: 60,
        features: ["Rửa vỏ xe", "Hút bụi chuyên sâu", "Phủ Ceramic", "Khử trùng Ozon"],
        vehicleType: "Large",
        isActive: true
    }
];

export class WashPackageRepositoryMock implements IWashPackageRepository {
    async getAllPackages(): Promise<WashPackage[]> {
        await new Promise(resolve => setTimeout(resolve, 200));
        return MOCK_PACKAGES;
    }

    async getPackageById(id: string): Promise<WashPackage> {
        await new Promise(resolve => setTimeout(resolve, 100));
        const found = MOCK_PACKAGES.find(p => p.id === id);
        if (!found) {
            throw new Error(`Wash package with id ${id} not found`);
        }
        return found;
    }
}
