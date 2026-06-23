// src/features/products/application/useWashBay.ts
import { useQuery } from '@tanstack/react-query';
import { WashBayRepositoryImplement } from '../infrastructure/repositories/wash-bay/wash-bay.repository.implement';
import type { WashBay } from '../infrastructure/repositories/wash-bay/wash-bay.repository.interface';

const washBayRepository = new WashBayRepositoryImplement();

export const useWashBay = (branchId?: string) => {
    const {
        data: washBays = [],
        isLoading,
        error,
        refetch
    } = useQuery<WashBay[]>({
        queryKey: ['wash_bays_by_branch', branchId],
        queryFn: () => washBayRepository.getWashBaysByBranch(branchId!),
        enabled: !!branchId,
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });

    return {
        washBays,
        isLoading,
        error,
        refetch
    };
};