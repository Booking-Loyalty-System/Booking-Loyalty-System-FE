export interface WashBay {
    id: string;
    name: string;
    status: 'Available' | 'Maintenance' | string;
    supportedTypes: string[];
    createdAt: string;
    branchId: string;
}

export interface IWashBayRepository {
    getAllWashBays(): Promise<WashBay[]>;
    getWashBaysByBranch(branchId: string): Promise<WashBay[]>;
    createWashBay(payload: { name: string; branchId: string }): Promise<WashBay>;
}