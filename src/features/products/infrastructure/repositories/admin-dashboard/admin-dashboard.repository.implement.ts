import { httpClient } from '@/core/http/httpClient';
import { ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '../../../domain/apiResponse';
import type {
    AdminDashboardSummary,
    RecentBooking,
    TierConfig
} from '../../../domain/models/admin-dashboard/admin-dashboard.model';
import type { IAdminDashboardRepository } from './admin-dashboard.repository.interface';

// Lớp thực thi của IAdminDashboardRepository, chịu trách nhiệm gọi API thực tế.
// Ở đây chúng ta sử dụng httpClient được cấu hình sẵn để thực hiện các yêu cầu GET và PUT tới Backend.
export class AdminDashboardRepositoryImplement implements IAdminDashboardRepository {
    async getSummary(): Promise<AdminDashboardSummary> {
        const response = await httpClient.get<ApiResponse<AdminDashboardSummary>>(
            ENDPOINTS.ADMIN_DASHBOARD.SUMMARY
        );
        return response.data;
    }

    async getRecentBookings(): Promise<RecentBooking[]> {
        const response = await httpClient.get<ApiResponse<RecentBooking[]>>(
            ENDPOINTS.ADMIN_DASHBOARD.RECENT_BOOKINGS
        );
        return response.data;
    }

    async getTierConfig(): Promise<TierConfig> {
        const response = await httpClient.get<ApiResponse<TierConfig>>(
            ENDPOINTS.ADMIN_DASHBOARD.TIER_CONFIG
        );
        return response.data;
    }

    async updateTierConfig(config: TierConfig): Promise<TierConfig> {
        const response = await httpClient.put<ApiResponse<TierConfig>>(
            ENDPOINTS.ADMIN_DASHBOARD.TIER_CONFIG,
            config
        );
        return response.data;
    }

    async exportRbl(): Promise<Blob> {
        // Gửi request lấy file CSV dạng blob từ Backend
        const response = await httpClient.get<Blob>(
            ENDPOINTS.ADMIN_DASHBOARD.EXPORT_RBL,
            { responseType: 'blob' }
        );
        return response;
    }
}
