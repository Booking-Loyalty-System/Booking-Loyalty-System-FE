export interface WashPackageResponseData {
    id: string;
    name: string;
    description: string;
    price: number;
    durationMinutes: number;
    features: string[];
    vehicleType: string | null;
    isActive: boolean;
    createdAt: string;
}

export interface CreateWashPackageInput {
    name: string;
    description: string;
    price: number;
    durationMinutes: number;
    features: string[];
    vehicleType: string | null;
}

export interface UpdateWashPackageInput extends CreateWashPackageInput {
    isActive: boolean;
}