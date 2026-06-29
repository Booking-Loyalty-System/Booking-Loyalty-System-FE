import { httpClient } from '@/core/http/httpClient';
import type { ApiResponse } from '../../../domain/apiResponse';
import type { OverviewStats, RevenueDataPoint, TierDistribution } from '../../../domain/models/admin-statistics/admin-statistics.model';

export interface TopCustomer {
    customerId: string;
    fullName: string;
    totalSpent: number;
    tier: string;
}

export class AdminStatisticsRepository {
    async getOverview(): Promise<OverviewStats> {
        const res = await httpClient.get<ApiResponse<OverviewStats>>('/admin/statistics/overview');
        return res.data;
    }

    async getRevenue(groupBy: 'day' | 'month' = 'day'): Promise<RevenueDataPoint[]> {
        const res = await httpClient.get<ApiResponse<RevenueDataPoint[]>>(`/admin/statistics/revenue?groupBy=${groupBy}`);
        return res.data;
    }
    
    async getTierDistribution(): Promise<TierDistribution[]> {
        const res = await httpClient.get<ApiResponse<TierDistribution[]>>('/admin/statistics/tier-distribution');
        return res.data;
    }
    async getTopCustomers(limit: number = 10): Promise<TopCustomer[]> {
        const res = await httpClient.get<ApiResponse<TopCustomer[]>>(`/admin/statistics/top-customers?top=${limit}`);
        return res.data;
    }
}