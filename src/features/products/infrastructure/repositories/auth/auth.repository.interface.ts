import type { LoginRequest } from '../../../application/useAuth';
import type { AuthResponseData } from '../../../domain/models/auth/auth.model.ts';

export interface IAuthRepository {
    login(credentials: LoginRequest): Promise<AuthResponseData>;
}