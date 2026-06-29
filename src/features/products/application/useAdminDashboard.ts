import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminDashboardRepositoryImplement } from '../infrastructure/repositories/admin-dashboard/admin-dashboard.repository.implement';
import { toast } from 'sonner';
import type { TierConfig } from '../domain/models/admin-dashboard/admin-dashboard.model';

// Khởi tạo Repository một lần duy nhất ngoài Hook để tránh việc khởi tạo lại đối tượng trong mỗi lần render.
const dashboardRepo = new AdminDashboardRepositoryImplement();

export const useAdminDashboard = () => {
    // Dùng QueryClient để quản lý việc cache và làm mới dữ liệu của React Query.
    const queryClient = useQueryClient();

    // 1. Lấy dữ liệu tổng quan (Metrics, Revenue Chart, Tier Distribution)
    // Dùng useQuery để tự động gọi API khi hook được mount và quản lý caching.
    const { 
        data: summary, 
        isLoading: isSummaryLoading, 
        isError: isSummaryError,
        refetch: refetchSummary
    } = useQuery({
        queryKey: ['admin_dashboard_summary'],
        queryFn: () => dashboardRepo.getSummary(),
    });

    // 2. Lấy danh sách booking gần đây
    // Dùng query riêng để có thể tải bất đồng bộ song song với summary, tránh chặn luồng render của UI.
    const { 
        data: recentBookings = [], 
        isLoading: isBookingsLoading, 
        isError: isBookingsError,
        refetch: refetchBookings
    } = useQuery({
        queryKey: ['admin_dashboard_recent_bookings'],
        queryFn: () => dashboardRepo.getRecentBookings(),
    });

    // 3. Lấy cấu hình Multiplier của các Tiers
    const { 
        data: tierConfig, 
        isLoading: isTierConfigLoading, 
        isError: isTierConfigError,
        refetch: refetchTierConfig
    } = useQuery({
        queryKey: ['admin_dashboard_tier_config'],
        queryFn: () => dashboardRepo.getTierConfig(),
    });

    // 4. Mutation cập nhật cấu hình Tier Multipliers
    // Dùng useMutation để xử lý hành động cập nhật trạng thái dữ liệu (PUT request) bất đồng bộ.
    const updateTierConfigMutation = useMutation({
        mutationFn: (config: TierConfig) => dashboardRepo.updateTierConfig(config),
        onSuccess: () => {
            // Khi cập nhật thành công, xoá cache (invalidate) để React Query tự động fetch lại dữ liệu mới nhất.
            queryClient.invalidateQueries({ queryKey: ['admin_dashboard_tier_config'] });
            toast.success("Cập nhật cấu hình hạng thành công!");
        },
        onError: (error: any) => {
            toast.error("Lỗi cập nhật cấu hình hạng: " + (error.response?.data?.message || error.message));
        }
    });

    // 5. Hàm tải file CSV Dataset RBL
    // Nhận dữ liệu nhị phân (Blob) từ API và thực hiện tạo URL tạm để download Client-side.
    const exportRbl = async () => {
        try {
            const blob = await dashboardRepo.exportRbl();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `RBL_Dataset_${new Date().toISOString().split("T")[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            toast.success("Xuất dữ liệu RBL thành công!");
        } catch (error: any) {
            toast.error("Lỗi xuất dữ liệu: " + (error.response?.data?.message || error.message));
        }
    };

    return {
        summary,
        recentBookings,
        tierConfig,
        isLoading: isSummaryLoading || isBookingsLoading || isTierConfigLoading,
        isError: isSummaryError || isBookingsError || isTierConfigError,
        updateTierConfig: updateTierConfigMutation.mutateAsync,
        isUpdatingTierConfig: updateTierConfigMutation.isPending,
        exportRbl,
        refetchAll: () => {
            refetchSummary();
            refetchBookings();
            refetchTierConfig();
        }
    };
};
