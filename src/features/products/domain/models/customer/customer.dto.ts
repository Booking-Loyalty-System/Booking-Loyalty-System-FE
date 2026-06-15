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
    createdAt: string;     
}