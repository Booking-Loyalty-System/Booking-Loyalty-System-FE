// Domain model đại diện cho dữ liệu của Admin Dashboard
// Dùng TypeScript interface để định nghĩa cấu trúc dữ liệu chặt chẽ từ API trả về, giúp việc mapping và render UI an toàn hơn.

export interface AdminDashboardMetrics {
    totalRevenue: number;
    totalBookings: number;
    activeCustomers: number;
    averageOrderValue: number;
}

export interface RevenueChartData {
    month: string;
    revenue: number;
}

export interface TierDistributionData {
    name: string;
    value: number;
    color: string;
}

export interface AdminDashboardSummary {
    metrics: AdminDashboardMetrics;
    revenueChart: RevenueChartData[];
    tierDistribution: TierDistributionData[];
}

export interface RecentBooking {
    id: string;
    customer: string;
    service: string;
    amount: number;
    status: string;
}

export interface TierConfig {
    memberMultiplier: number;
    silverMultiplier: number;
    goldMultiplier: number;
    platinumMultiplier: number;
}
