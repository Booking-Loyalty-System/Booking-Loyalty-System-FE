import type { IWashPackageRepository } from "./wash-package.repository.interface.ts";
import type { WashPackage } from "../../../domain/models/wash-package/wash-package.model.ts";

const MOCK_PACKAGES: WashPackage[] = [
    {
        id: "pkg_1",
        name: "Standard Wash",
        description: "Basic wash, interior vacuuming and drying",
        price: 150000,
        durationMinutes: 30,
        features: ["Exterior wash", "Vacuuming", "Drying"],
        vehicleType: "Small",
        isActive: true
    },
    {
        id: "pkg_2",
        name: "Premium Wash",
        description: "Deep clean, tar removal and tire shining",
        price: 250000,
        durationMinutes: 45,
        features: ["Exterior wash", "Deep vacuuming", "Tire shining", "Tar removal"],
        vehicleType: "Medium",
        isActive: true
    },
    {
        id: "pkg_3",
        name: "Deluxe Coating",
        description: "Premium wash with ceramic coating for paint protection",
        price: 400000,
        durationMinutes: 60,
        features: ["Exterior wash", "Deep vacuuming", "Ceramic coating", "Ozone disinfection"],
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
