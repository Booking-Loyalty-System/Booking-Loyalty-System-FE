export interface StaffBranch {
    id: string;
    branchName: string;
    address: string;
    hotline: string;
}

export interface StaffProfile {
    id: string;
    userId: string;
    email: string;
    fullName: string;
    phoneNumber: string | null;
    isAvailable: boolean;
    branchId : string;
    role: string;
    branch: StaffBranch;
}