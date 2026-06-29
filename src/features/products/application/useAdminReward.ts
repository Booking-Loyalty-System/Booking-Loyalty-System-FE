import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminRewardRepositoryImplement } from '../infrastructure/repositories/admin-reward/admin-reward.repository.implement';
import { toast } from 'sonner';
import type {
    AdminRewardResponseData,
    CreateAdminRewardInput,
    UpdateAdminRewardInput,
} from '../domain/models/admin-reward/admin-reward.model';

export type { AdminRewardResponseData, CreateAdminRewardInput, UpdateAdminRewardInput };

const rewardRepo = new AdminRewardRepositoryImplement();

export const useAdminReward = () => {
    const queryClient = useQueryClient();

    const { data: rewards = [], isLoading, isError } = useQuery({
        queryKey: ['admin_rewards'],
        queryFn: () => rewardRepo.getAll(),
    });

    const createMutation = useMutation({
        mutationFn: (data: CreateAdminRewardInput) => rewardRepo.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_rewards'] });
            toast.success('Thêm phần thưởng thành công!');
        },
        onError: (error: Error) => toast.error('Lỗi khi thêm: ' + error.message),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateAdminRewardInput }) =>
            rewardRepo.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_rewards'] });
            toast.success('Cập nhật phần thưởng thành công!');
        },
        onError: (error: Error) => toast.error('Lỗi cập nhật: ' + error.message),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => rewardRepo.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_rewards'] });
            toast.success('Xóa phần thưởng thành công!');
        },
        onError: (error: Error) => toast.error('Lỗi xóa: ' + error.message),
    });

    const toggleStatus = async (reward: AdminRewardResponseData) => {
        await updateMutation.mutateAsync({
            id: reward.id,
            data: {
                name: reward.name,
                description: reward.description,
                pointsCost: reward.pointsCost,
                discountAmount: reward.discountAmount,
                isActive: !reward.isActive,
            },
        });
    };

    return {
        rewards,
        isLoading,
        isError,
        createReward: createMutation.mutateAsync,
        updateReward: updateMutation.mutateAsync,
        deleteReward: deleteMutation.mutateAsync,
        toggleStatus,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};
