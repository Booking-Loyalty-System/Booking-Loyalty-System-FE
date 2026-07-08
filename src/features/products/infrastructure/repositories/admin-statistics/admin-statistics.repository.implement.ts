import { httpClient } from '@/core/http/httpClient';
import { ENDPOINTS } from '../../../../../core/api/endpoints';
import type { ApiResponse } from '../../../domain/apiResponse';
import type { OverviewStats, RevenueDataPoint, TierDistribution } from '../../../domain/models/admin-statistics/admin-statistics.model';

export interface TopCustomer {
    customerId: string;
    fullName: string;
    totalSpent: number;
    tier: string;
}

// Định nghĩa Interface dữ liệu nhận về từ API mới
export interface TierStatisticsRequest {
    criteria: 'month' | 'quarter' | 'year';
    year: number;
}

export interface TierCountDetail {
    tierId: string;
    tierName: string;
    count: number;
    percentage: number;
    percentageChangeFromPrevious: number;
}

export interface TierPeriodReport {
    periodLabel: string;
    totalCustomersInPeriod: number;
    tiers: TierCountDetail[];
}

export class AdminStatisticsRepository {
    async getOverview(): Promise<OverviewStats> {
        const res = await httpClient.get<ApiResponse<OverviewStats>>(ENDPOINTS.ADMIN.STATISTICS.OVERVIEW);
        return res.data;
    }

    async getRevenue(groupBy: 'day' | 'month' = 'day'): Promise<RevenueDataPoint[]> {
        const res = await httpClient.get<ApiResponse<RevenueDataPoint[]>>(`${ENDPOINTS.ADMIN.STATISTICS.REVENUE}?groupBy=${groupBy}`);
        return res.data;
    }

    async getTierDistribution(): Promise<TierDistribution[]> {
        const res = await httpClient.get<ApiResponse<TierDistribution[]>>(ENDPOINTS.ADMIN.STATISTICS.TIER_DISTRIBUTION);
        return res.data;
    }

    async getTopCustomers(limit: number = 10): Promise<TopCustomer[]> {
        const res = await httpClient.get<ApiResponse<TopCustomer[]>>(`${ENDPOINTS.ADMIN.STATISTICS.TOP_CUSTOMERS}?top=${limit}`);
        return res.data;
    }

    async getTierStatistics(params: TierStatisticsRequest): Promise<TierPeriodReport[]> {
        const res = await httpClient.get<ApiResponse<TierPeriodReport[]>>(ENDPOINTS.ADMIN.STATISTICS.TIER_STATISTICS, {
            params: {
                Criteria: params.criteria,
                Year: params.year
            }
        });
        return res.data;
    }
}