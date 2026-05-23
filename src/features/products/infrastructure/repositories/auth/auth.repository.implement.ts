import type { IAuthRepository } from './auth.repository.interface.ts';
import type { AuthResponseData } from '../../../domain/models/auth/auth.model';
import type { ApiResponse } from '../../../domain/apiResponse.ts';
import type { LoginRequest } from '../../../application/useAuth.ts';
import { httpClient } from '@/core/http/httpClient.ts';
import { ENDPOINTS } from '@/core/api/endpoints';

export class AuthRepositoryImplement implements IAuthRepository {
    async login(credentials: LoginRequest): Promise<AuthResponseData> {
        // Vì apiClient interceptor của bạn đã return response.data,
        // nên httpClient.post ở đây sẽ nhận về object chứa { statusCode, message, data }
        const response = await httpClient.post<ApiResponse<AuthResponseData>>(
            ENDPOINTS.AUTH.LOGIN,
            credentials
        );

        // Trả về đúng cục data chứa accessToken và user cho tầng Application dùng
        return response.data;
    }
}