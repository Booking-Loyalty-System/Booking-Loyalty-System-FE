export interface BranchResponseData {
    id: string;
    branchName: string;
    address: string;
    hotline: string;
    operatingHours: string;
    status: 'Active' | 'Inactive'; // Giả sử status là string enum
    longitude: number;
    latitude: number;
}

export interface CreateBranchInput {
    branchName: string;
    address: string;
    hotline: string;
    operatingHours: string;
}

export interface UpdateBranchInput extends CreateBranchInput {
    // Thường update sẽ có thêm status, hoặc tùy theo Swagger của bạn
    status?: 'Active' | 'Inactive';
}