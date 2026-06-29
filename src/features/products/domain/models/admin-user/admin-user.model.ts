export interface UserResponseData {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    role: 'Admin' | 'Staff' | 'Customer';
    status: 'Active' | 'Inactive';
    branchId?: string; // Tùy thuộc vào model của bạn
}