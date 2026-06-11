import type { IAuthRepository } from './auth.repository.interface.ts';
import type { AuthResponseData, RefreshTokenRequest, RegisterRequest } from '../../../domain/models/auth/auth.model';
import type { ApiResponse } from '../../../domain/apiResponse.ts';
import type { LoginRequest } from '@/features/products/domain/models/auth/auth.model.ts';
import { httpClient } from '@/core/http/httpClient.ts';
import { ENDPOINTS } from '@/core/api/endpoints';
// import type {PhoneRegisterRequest} from "@/features/products/application/requests/PhoneRegisterRequest.ts";

export class AuthRepositoryImplement implements IAuthRepository {
    async login(credentials: LoginRequest): Promise<AuthResponseData> {
        //MOCK LOGIN FOR QUICK TESTING - COMMENTED OUT
        const testAccounts: Record<string, { role: string; fullName: string; pass: string }> = {
            'customer@system.com': { role: 'Customer', fullName: 'Test Customer', pass: 'customer' },
            'staff@system.com': { role: 'Staff', fullName: 'Test Staff', pass: 'staff' },
            'admin@system.com': { role: 'Admin', fullName: 'Test Admin', pass: 'admin' },
        };

        const testAccount = testAccounts[credentials.email];
        if (testAccount && testAccount.pass === credentials.password) {
            console.log(`[MockLogin] Logging in as ${testAccount.role}`);
            return {
                accessToken: 'mock-access-token-' + Math.random().toString(36).substring(7),
                refreshToken: 'mock-refresh-token',
                user: {
                    id: `mock-${testAccount.role.toLowerCase()}-id`,
                    email: credentials.email,
                    role: testAccount.role,
                    fullName: testAccount.fullName
                }
            };
        }


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

    async register(data: RegisterRequest): Promise<AuthResponseData> {
        const response = await httpClient.post<ApiResponse<AuthResponseData>>(
            ENDPOINTS.AUTH.REGISTER, // Đảm bảo bạn đã khai báo endpoint này trong file ENDPOINTS
            data
        );
        return response.data;
    }

    // async registerWithPhone(data: PhoneRegisterRequest): Promise<AuthResponseData> {
    //     const response = await httpClient.post<ApiResponse<AuthResponseData>>(
    //         ENDPOINTS.AUTH.REGISTER_WITH_PHONE,
    //         {
    //             phoneNumber: data.phoneNumber,
    //             otpCode: data.idToken
    //         }
    //     );
    //
    //     return response.data;
    // }
}