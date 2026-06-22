import type { IAuthRepository } from './auth.repository.interface.ts';
import type { AuthResponseData, LoginRequest, RefreshTokenRequest, RegisterRequest } from '../../../domain/models/auth/auth.model.ts';

// Chú thích chi tiết bằng tiếng Việt:
// Lớp AuthRepositoryMock dùng để giả lập các hành vi đăng nhập, đăng xuất, đăng ký, và refresh token.
// Việc tạo token giả lập (Mock JWT) giúp phần frontend giải mã chính xác các claim về vai trò (Role),
// Email, và ID của User mà không cần kết nối với backend API thật trong quá trình phát triển UI/UX.
export class AuthRepositoryMock implements IAuthRepository {
    async login(credentials: LoginRequest): Promise<AuthResponseData> {
        // Giả lập độ trễ mạng 300ms
        await new Promise(resolve => setTimeout(resolve, 300));

        let role = "Customer";
        let fullName = "Nguyễn Minh Bằng";
        const email = credentials.email;

        if (email.toLowerCase().includes("admin")) {
            role = "Admin";
            fullName = "Quản Trị Viên Mock";
        } else if (email.toLowerCase().includes("staff")) {
            role = "Staff";
            fullName = "Nhân Viên Mock";
        }

        const claims = {
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": `mock_${role.toLowerCase()}_id_01`,
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": email,
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": role,
            "exp": Math.floor(Date.now() / 1000) + 86400,
            "iss": "mock_issuer",
            "aud": "mock_audience"
        };

        const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
        const payload = btoa(unescape(encodeURIComponent(JSON.stringify(claims))))
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
        const accessToken = `${header}.${payload}.mocksignature`;

        return {
            accessToken,
            refreshToken: "mock_refresh_token_xyz123",
            accessTokenExpiry: new Date(Date.now() + 86400 * 1000).toISOString(),
            user: {
                id: `mock_${role.toLowerCase()}_id_01`,
                email,
                role,
                fullName
            }
        };
    }

    async logout(): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    async refreshToken(data: RefreshTokenRequest): Promise<AuthResponseData> {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Trả về mock token cho refresh
        const claims = {
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "mock_customer_id_01",
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": "customer@autowash.com",
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "Customer",
            "exp": Math.floor(Date.now() / 1000) + 86400,
            "iss": "mock_issuer",
            "aud": "mock_audience"
        };

        const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
        const payload = btoa(unescape(encodeURIComponent(JSON.stringify(claims))))
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
        const accessToken = `${header}.${payload}.mocksignature`;

        return {
            accessToken,
            refreshToken: data.refreshToken,
            accessTokenExpiry: new Date(Date.now() + 86400 * 1000).toISOString(),
            user: {
                id: "mock_customer_id_01",
                email: "customer@autowash.com",
                role: "Customer",
                fullName: "Nguyễn Minh Bằng"
            }
        };
    }

    async register(data: RegisterRequest): Promise<AuthResponseData> {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const claims = {
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "mock_customer_id_01",
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": data.email,
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "Customer",
            "exp": Math.floor(Date.now() / 1000) + 86400,
            "iss": "mock_issuer",
            "aud": "mock_audience"
        };

        const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
        const payload = btoa(unescape(encodeURIComponent(JSON.stringify(claims))))
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
        const accessToken = `${header}.${payload}.mocksignature`;

        return {
            accessToken,
            refreshToken: "mock_refresh_token_xyz123",
            accessTokenExpiry: new Date(Date.now() + 86400 * 1000).toISOString(),
            user: {
                id: "mock_customer_id_01",
                email: data.email,
                role: "Customer",
                fullName: data.fullName
            }
        };
    }

    async registerWithPhone(data: { phoneNumber: string; idToken: string }): Promise<AuthResponseData> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const claims = {
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": "mock_customer_id_01",
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": "phone_customer@autowash.com",
            "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "Customer",
            "exp": Math.floor(Date.now() / 1000) + 86400,
            "iss": "mock_issuer",
            "aud": "mock_audience"
        };

        const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
        const payload = btoa(unescape(encodeURIComponent(JSON.stringify(claims))))
            .replace(/=/g, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
        const accessToken = `${header}.${payload}.mocksignature`;

        return {
            accessToken,
            refreshToken: "mock_refresh_token_xyz123",
            accessTokenExpiry: new Date(Date.now() + 86400 * 1000).toISOString(),
            user: {
                id: "mock_customer_id_01",
                email: "phone_customer@autowash.com",
                role: "Customer",
                fullName: "Khách hàng SĐT " + data.phoneNumber
            }
        };
    }
}
