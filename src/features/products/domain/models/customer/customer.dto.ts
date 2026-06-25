export interface Customer {
    id: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    dateOfBirth: string | null;
    tier: string;
    totalPoints: number;
    totalWashes: number;
    totalSpent: number;
    totalSaved: number;
    createdAt: string;     
}

export interface UpdateCustomerInput {
    fullName?: string;
    phoneNumber?: string;
    dateOfBirth?: string | null;
}