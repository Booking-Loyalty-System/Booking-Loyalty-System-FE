import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { AdminStatisticsRepository, type TierStatisticsRequest } from '../infrastructure/repositories/admin-statistics/admin-statistics.repository.implement';


const statisticsRepo = new AdminStatisticsRepository();

export const useAdminTierStatistic = () => {
    const [filters, setFilters] = useState<TierStatisticsRequest>({
        criteria: 'month',
        year: new Date().getFullYear(),
    });

    const { data: tierStats = [], isLoading, isError, refetch } = useQuery({
        queryKey: ['admin_tier_period_statistics', filters],
        queryFn: () => statisticsRepo.getTierStatistics(filters),
    });

    return {
        tierStats,
        filters,
        setFilters,
        isLoading,
        isError,
        refetch
    };
};