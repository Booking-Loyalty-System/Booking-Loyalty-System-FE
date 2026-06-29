import type {
    AdminDashboardSummary,
    RecentBooking,
    TierConfig
} from "@/features/products/domain/models/admin-dashboard/admin-dashboard.model.ts";

// Interface định nghĩa các phương thức để tương tác với dữ liệu Admin Dashboard.
// Việc dùng Interface giúp tách biệt phần định nghĩa (Domain/Contract) và phần thực thi (Infrastructure/Implementation).
export interface IAdminDashboardRepository {
    getSummary(): Promise<AdminDashboardSummary>;
    getRecentBookings(): Promise<RecentBooking[]>;
    getTierConfig(): Promise<TierConfig>;
    updateTierConfig(config: TierConfig): Promise<TierConfig>;
    exportRbl(): Promise<Blob>;
}
