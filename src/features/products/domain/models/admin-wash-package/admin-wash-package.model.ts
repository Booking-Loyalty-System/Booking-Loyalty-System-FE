export interface WashPackageResponseData {
    id: string;
    name: string;
    description: string;
    price: number;
    durationMinutes: number;
    features: string[];
    isActive: boolean;
    createdAt: string;
}

export interface CreateWashPackageInput {
    name: string;
    description: string;
    price: number;
    durationMinutes: number;
    features: string[];
}

export interface UpdateWashPackageInput extends CreateWashPackageInput {
    isActive: boolean;
}