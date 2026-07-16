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

// 📤 LAYER REQUEST: Đăng ký tài khoản theo backend RegisterRequest
export interface RegisterRequest {
    email: string;
    password: string;
    fullName: string;
    phoneNumber?: string;    // optional theo backend
    dateOfBirth?: string;    // optional theo backend (DateTime?)
}

// 📥 LAYER RESPONSE: Register chỉ trả về userId (string), không trả về token ngay
export interface RegisterResponse {
    userId: string; // chính là data field từ API response
}

// 📤 LAYER REQUEST: Xác thực email bằng OTP sau khi đăng ký
export interface VerifyEmailRequest {
    id: string;     // userId nhận được từ register
    otpCode: string;
}

export interface ChangePasswordRequest {
    currentPassword?: string;
    newPassword?: string;
}