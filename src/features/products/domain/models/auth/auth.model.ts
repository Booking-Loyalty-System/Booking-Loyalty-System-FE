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
    user: User;
}

// 📤 LAYER REQUEST: Dữ liệu gửi lên khi Login bằng Email/Password
export interface LoginRequest {
    email: string;
    password?: string; // Thêm dấu ? nếu password không bắt buộc, hoặc xóa ? đi nếu bắt buộc
}

// 📤 LAYER REQUEST: Dữ liệu gửi lên khi Register bằng số điện thoại (nếu có dùng lại)
export interface PhoneRegisterRequest {
    phoneNumber: string;
    idToken: string; // hoặc otpCode tùy Swagger
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
}