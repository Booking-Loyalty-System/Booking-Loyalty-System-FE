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

export interface RevenueComparison {
    currentRevenue: number;
    previousRevenue: number;
    revenueDifference: number;
    growthRate: number;
}

export interface RevenueComparisonParams {
    fromDate: string;
    toDate: string;
    compareFromDate: string;
    compareToDate: string;
}

export interface BranchRevenue {
    branchId: string;
    branchName: string;
    revenue: number;
}

export interface RevenueChartResponse {
    label: string;
    currentPeriodRevenue: number;
    previousPeriodRevenue: number;
    differenceAmount: number;
    growthPercentage: number;
    branchRevenues: BranchRevenue[];
}

export interface DashboardFilterRequest {
    type: 'MONTH' | 'QUARTER' | 'YEAR';
    year: number;
    value?: number;
}

export interface DashboardAnalyticResponse {
    totalRevenue: number;
    monthlyRevenue: RevenueChartResponse[];
    quarterlyRevenue: RevenueChartResponse[];
    yearlyRevenue: RevenueChartResponse[];
}