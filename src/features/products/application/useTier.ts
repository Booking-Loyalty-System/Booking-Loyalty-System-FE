import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TierRepositoryImplement } from '../infrastructure/repositories/tier/tier.repository.implement.ts';
import type { Tier, CreateTierDto, UpdateTierDto } from '../domain/models/tier/tier.dto.ts';

const tierRepository = new TierRepositoryImplement();

export const useTier = (tierId?: string) => {
    const queryClient = useQueryClient();

    const {
        data: tiers = [],
        isLoading: isLoadingTiers,
        error: fetchTiersError
    } = useQuery<Tier[]>({
        queryKey: ['tiers'],
        queryFn: () => tierRepository.getAllTiers(),
        staleTime: 1000 * 60 * 5, // Cache trong 5 phút
    });

    // 2. Lấy chi tiết 1 Tier
    const {
        data: tierDetail = null,
        isLoading: isLoadingDetail,
        error: fetchDetailError
    } = useQuery<Tier | null>({
        queryKey: ['tier_detail', tierId],
        queryFn: () => tierRepository.getTierById(tierId!),
        enabled: !!tierId, // Chỉ chạy khi có ID
    });

    // 3. Mutations (Thêm, Sửa, Xóa)
    const createTierMutation = useMutation({
        mutationFn: (data: CreateTierDto) => tierRepository.createTier(data),
        onSuccess: () => {
            // Refresh lại danh sách sau khi tạo thành công
            queryClient.invalidateQueries({ queryKey: ['tiers'] });
        }
    });

    const updateTierMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateTierDto }) => tierRepository.updateTier(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tiers'] });
            queryClient.invalidateQueries({ queryKey: ['tier_detail', tierId] });
        }
    });

    const deleteTierMutation = useMutation({
        mutationFn: (id: string) => tierRepository.deleteTier(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tiers'] });
        }
    });

    return {
        tiers,
        tierDetail,
        isLoading: isLoadingTiers || isLoadingDetail,
        error: fetchTiersError || fetchDetailError,

        createTier: createTierMutation.mutateAsync,
        updateTier: updateTierMutation.mutateAsync,
        deleteTier: deleteTierMutation.mutateAsync,

        isCreating: createTierMutation.isPending,
        isUpdating: updateTierMutation.isPending,
        isDeleting: deleteTierMutation.isPending,
    };
};