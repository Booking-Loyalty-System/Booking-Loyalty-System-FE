export interface StaffBranch {
    id: string;
    branchName: string;
    address: string;
    hotline: string;
}

export interface AdminStaffResponseData {
    id: string;
    userId: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    isAvailable: boolean;
    role: string;
    branch: StaffBranch | null;
}

export interface CreateAdminStaffInput {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
    branchId: string;
}

export interface UpdateAdminStaffInput {
    fullName: string;
    phoneNumber: string;
    branchId: string;
    isAvailable: boolean;
}