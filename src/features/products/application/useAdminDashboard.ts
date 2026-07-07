import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminDashboardRepositoryImplement } from '../infrastructure/repositories/admin-dashboard/admin-dashboard.repository.implement';
import { toast } from 'sonner';
import type { DashboardFilterRequest, TierConfig } from '../domain/models/admin-dashboard/admin-dashboard.model';
import { useState } from 'react';

// Khởi tạo Repository một lần duy nhất ngoài Hook để tránh việc khởi tạo lại đối tượng trong mỗi lần render.
const dashboardRepo = new AdminDashboardRepositoryImplement();

export const useAdminDashboard = (
    dateFilter?: { fromDate: string; toDate: string; compareFromDate: string; compareToDate: string },
) => {
    const queryClient = useQueryClient();;
    const [filters, setFilters] = useState<DashboardFilterRequest>({
        type: 'MONTH',
        year: new Date().getFullYear(),
        value: new Date().getMonth() + 1 // Mặc định lấy tháng hiện tại
    });

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['admin_revenue_analytics', filters],
        queryFn: () => dashboardRepo.getRevenueAnalytics(filters),
    });
    const getActiveChartData = () => {
        if (!data) return [];
        if (filters.type === 'MONTH') return data.monthlyRevenue;
        if (filters.type === 'QUARTER') return data.quarterlyRevenue;
        return data.yearlyRevenue;
    };
    const {
        data: summary,
        isLoading: isSummaryLoading,
        isError: isSummaryError,
        refetch: refetchSummary
    } = useQuery({
        queryKey: ['admin_dashboard_summary'],
        queryFn: () => dashboardRepo.getSummary(),
    });

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

    const updateTierConfigMutation = useMutation({
        mutationFn: (config: TierConfig) => dashboardRepo.updateTierConfig(config),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_dashboard_tier_config'] });
            toast.success("Cập nhật cấu hình hạng thành công!");
        },
        onError: (error: any) => {
            toast.error("Lỗi cập nhật cấu hình hạng: " + (error.response?.data?.message || error.message));
        }
    });

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

    const {
        data: revenueComparison,
        isLoading: isComparisonLoading,
        isError: isComparisonError,
        refetch: refetchComparison
    } = useQuery({
        queryKey: ['admin_dashboard_revenue_comparison', dateFilter],
        queryFn: async () => {
            if (!dateFilter) return null;
            const res = await dashboardRepo.getRevenueComparison(dateFilter);
            return res;
        },
        select: (data) => data ?? null
    });

    return {
        summary,
        recentBookings,
        tierConfig,
        revenueComparison,
        dateFilter,
        analyticsData: data,
        chartData: getActiveChartData(),
        filters,
        setFilters,
        refetch,
        isLoading: isSummaryLoading || isBookingsLoading || isTierConfigLoading || isComparisonLoading,
        isError: isSummaryError || isBookingsError || isTierConfigError || isComparisonError,
        updateTierConfig: updateTierConfigMutation.mutateAsync,
        isUpdatingTierConfig: updateTierConfigMutation.isPending,
        exportRbl,
        refetchAll: () => {
            refetchSummary();
            refetchBookings();
            refetchTierConfig();
            refetchComparison();
        }
    };
};
