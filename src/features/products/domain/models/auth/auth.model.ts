export interface User {
    id: string;
    email: string;
    role: string;
    fullName: string;
}

// 📥 LAYER RESPONSE: Dữ liệu API trả về khi Auth thành công
export interface AuthResponseData {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiry: string;
    user: User;
}

// 📤 LAYER REQUEST: Dữ liệu gửi lên khi Login bằng Email/Password
export interface LoginRequest {
    email: string;
    password?: string; // Thêm dấu ? nếu password không bắt buộc, hoặc xóa ? đi nếu bắt buộc
}

export interface PhoneRegisterRequest {
    phoneNumber: string;
    idToken: string;
}

// 📤 LAYER REQUEST: Dữ liệu gửi lên khi cần refresh token
export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
    dateOfBirth: string;
    vehicleType: number;
    licensePlate?: string;
}

export interface ChangePasswordRequest {
    currentPassword?: string;
    newPassword?: string;
}