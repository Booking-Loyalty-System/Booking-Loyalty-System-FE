import { LoginRequest } from '../../application/useLogin';
import type { AuthResponseData } from '../../../domain/models/auth/auth.model.ts';

export interface IAuthRepository {
    login(credentials: LoginRequest): Promise<AuthResponseData>;
}