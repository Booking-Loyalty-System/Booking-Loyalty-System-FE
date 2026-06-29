import { httpClient } from '@/core/http/httpClient';
import { ENDPOINTS } from "@/core/api/endpoints.ts";
import type { ApiResponse } from '../../../domain/apiResponse';
import type { UserResponseData } from '../../../domain/models/admin-user/admin-user.model'; 

export class AdminUserRepository {
    async getAll(role?: string): Promise<UserResponseData[]> {
        const url = role ? `${ENDPOINTS.ADMIN.USERS}?role=${role}` : ENDPOINTS.ADMIN.USERS;
        
        const res = await httpClient.get<ApiResponse<UserResponseData[]>>(url);
        
        return res.data;
    }

    async updateStatus(id: string, status: 'Active' | 'Inactive'): Promise<void> {
        // Nếu API chỉ trả về thành công không cần data, bạn có thể dùng unknown hoặc không cần gán res
        await httpClient.put<ApiResponse<unknown>>(ENDPOINTS.ADMIN.USER_STATUS(id), { status });
    }

    async updateRole(id: string, role: string): Promise<void> {
        await httpClient.put<ApiResponse<unknown>>(ENDPOINTS.ADMIN.USER_ROLE(id), { role });
    }
}