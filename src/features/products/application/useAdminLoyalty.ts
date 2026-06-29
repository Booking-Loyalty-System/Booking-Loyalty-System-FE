import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminLoyaltyRepositoryImplement } from '../infrastructure/repositories/admin-loyalty/admin-loyalty.repository.implement';
import { toast } from 'sonner';
import type {
    AdminTierResponseData,
    CreateAdminTierInput,
    UpdateAdminTierInput,
} from '../domain/models/admin-loyalty/admin-loyalty.model';

export type { AdminTierResponseData, CreateAdminTierInput, UpdateAdminTierInput };

const loyaltyRepo = new AdminLoyaltyRepositoryImplement();

export const useAdminLoyalty = () => {
    const queryClient = useQueryClient();

    const { data: tiers = [], isLoading, isError } = useQuery({
        queryKey: ['admin_loyalty_tiers'],
        queryFn: () => loyaltyRepo.getAll(),
    });

    const createMutation = useMutation({
        mutationFn: (data: CreateAdminTierInput) => loyaltyRepo.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_loyalty_tiers'] });
            toast.success('Thêm hạng thành viên thành công!');
        },
        onError: (error: Error) => toast.error('Lỗi khi thêm: ' + error.message),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateAdminTierInput }) =>
            loyaltyRepo.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_loyalty_tiers'] });
            toast.success('Cập nhật hạng thành viên thành công!');
        },
        onError: (error: Error) => toast.error('Lỗi cập nhật: ' + error.message),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => loyaltyRepo.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_loyalty_tiers'] });
            toast.success('Xóa hạng thành viên thành công!');
        },
        onError: (error: Error) => toast.error('Lỗi xóa: ' + error.message),
    });

    return {
        tiers,
        isLoading,
        isError,
        createTier: createMutation.mutateAsync,
        updateTier: updateMutation.mutateAsync,
        deleteTier: deleteMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};
