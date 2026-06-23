export interface WashBay {
    id: string;
    name: string;
    status: 'Available' | 'Maintenance' | string;
    supportedTypes: string[];
    createdAt: string;
    branchId: string;
}

export interface IWashBayRepository {
    getWashBaysByBranch(branchId: string): Promise<WashBay[]>;
}