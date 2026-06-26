export interface OverviewStats {
    totalRevenue: number;
    totalBookings: number;
    totalCustomers: number;
    completedBookings: number;
    cancelledBookings: number;
    noShowBookings: number;
    newCustomersThisMonth: number;
    avgRevenuePerBooking: number;
}

export interface RevenueDataPoint {
    date: string;
    revenue: number;
    bookingCount: number;
}

export interface TierDistribution {
    tierName: string;
    customerCount: number;
    percentage: number;
}
