import { useQuery } from '@tanstack/react-query';
import { LoyaltyRepositoryImplement } from '../infrastructure/repositories/loyalty/loyalty.repository.implement.ts';
import type { LoyaltyHistoryResponse } from '../domain/models/loyalty/loyalty.dto.ts';

const loyaltyRepository = new LoyaltyRepositoryImplement();

export const useLoyaltyHistory = () => {
    return useQuery<LoyaltyHistoryResponse>({
        queryKey: ['loyalty_history'],
        queryFn: () => loyaltyRepository.getHistory(),
        staleTime: 1000 * 60 * 5, // Cache trong 5 phút
    });
};
