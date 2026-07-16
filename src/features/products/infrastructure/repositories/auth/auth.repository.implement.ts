import type { IAuthRepository } from './auth.repository.interface.ts';
import type {AuthResponseData, RefreshTokenRequest, RegisterRequest, VerifyEmailRequest} from '../../../domain/models/auth/auth.model';
import type { ApiResponse } from '../../../domain/apiResponse.ts';
import type { LoginRequest } from '@/features/products/domain/models/auth/auth.model.ts';
import { httpClient } from '@/core/http/httpClient.ts';
import { ENDPOINTS } from '@/core/api/endpoints';
import type {PhoneRegisterRequest, ChangePasswordRequest} from "@/features/products/domain/models/auth/auth.model.ts";

export class AuthRepositoryImplement implements IAuthRepository {
    async login(credentials: LoginRequest): Promise<AuthResponseData> {
        // Vì apiClient interceptor của bạn đã return response.data,
        // nên httpClient.post ở đây sẽ nhận về object chứa { statusCode, message, data }
        const response = await httpClient.post<ApiResponse<AuthResponseData>>(
            ENDPOINTS.AUTH.LOGIN,
            credentials
        );

        return response.data;
    }

    async logout(): Promise<void> {
         await httpClient.post<ApiResponse<null>>(
            ENDPOINTS.AUTH.LOGOUT
        );
    }

    async refreshToken(data: RefreshTokenRequest): Promise<AuthResponseData> {
        const response = await httpClient.post<ApiResponse<AuthResponseData>>(
            ENDPOINTS.AUTH.REFRESH_TOKEN,
            data
        );
        return response.data;
    }

    // Bước 1: Đăng ký - API chỉ trả về userId (string), chưa có token
    async register(data: RegisterRequest): Promise<string> {
        const response = await httpClient.post<ApiResponse<string>>(
            ENDPOINTS.AUTH.REGISTER,
            data
        );
        // response.data chính là userId (string)
        return response.data;
    }

    // Bước 2: Xác thực email bằng OTP - API trả về token đầy đủ
    async verifyEmail(data: VerifyEmailRequest): Promise<AuthResponseData> {
        const response = await httpClient.post<ApiResponse<AuthResponseData>>(
            ENDPOINTS.AUTH.VERIFY_EMAIL,
            data
        );
        return response.data;
    }

    async registerWithPhone(data: PhoneRegisterRequest): Promise<AuthResponseData> {
        const response = await httpClient.post<ApiResponse<AuthResponseData>>(
            ENDPOINTS.AUTH.REGISTER_WITH_PHONE,
            {
                phoneNumber: data.phoneNumber,
                otpCode: data.idToken
            }
        );

        return response.data;
    }

    async changePassword(data: ChangePasswordRequest): Promise<void> {
        await httpClient.put<ApiResponse<void>>(
            ENDPOINTS.AUTH.CHANGE_PASSWORD,
            data
        );
    }
}