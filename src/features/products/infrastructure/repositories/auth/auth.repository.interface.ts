import type {
    LoginRequest,
    RefreshTokenRequest,
    RegisterRequest,
    ChangePasswordRequest
} from '@/features/products/domain/models/auth/auth.model.ts';
import type { AuthResponseData } from '../../../domain/models/auth/auth.model.ts';
// import type {PhoneRegisterRequest} from "@/features/products/application/requests/PhoneRegisterRequest.ts";

export interface IAuthRepository {
    login(credentials: LoginRequest): Promise<AuthResponseData>;
    logout(): Promise<void>;
    refreshToken(data: RefreshTokenRequest): Promise<AuthResponseData>;
    // registerWithPhone(data: PhoneRegisterRequest): Promise<AuthResponseData>;

    register(data: RegisterRequest): Promise<AuthResponseData>;
    changePassword(data: ChangePasswordRequest): Promise<void>;
}