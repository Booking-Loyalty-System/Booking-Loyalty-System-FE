import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminRewardRepositoryImplement } from '../infrastructure/repositories/admin-reward/admin-reward.repository.implement';
import { toast } from 'sonner';

import type { 
    RewardResponseData, 
    CreateRewardInput, 
    UpdateRewardInput 
} from '../domain/models/admin-reward/admin-reward.model';

export type { RewardResponseData, CreateRewardInput, UpdateRewardInput };

const rewardRepo = new AdminRewardRepositoryImplement();

export const useAdminReward = () => {
    const queryClient = useQueryClient();

    const { data: rewards = [], isLoading, isError } = useQuery({
        queryKey: ['admin_rewards'],
        queryFn: () => rewardRepo.getAll(),
    });

    const createMutation = useMutation({
        mutationFn: (data: CreateRewardInput) => rewardRepo.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_rewards'] });
            toast.success("Thêm phần thưởng thành công!");
        },
        onError: (error: any) => toast.error("Lỗi khi thêm: " + error.message)
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateRewardInput }) => rewardRepo.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_rewards'] });
            toast.success("Cập nhật phần thưởng thành công!");
        },
        onError: (error: any) => toast.error("Lỗi cập nhật: " + error.message)
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => rewardRepo.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_rewards'] });
            toast.success("Xóa phần thưởng thành công!");
        },
        onError: (error: any) => toast.error("Lỗi xóa: " + error.message)
    });

    const toggleStatus = async (reward: RewardResponseData) => {
        await updateMutation.mutateAsync({
            id: reward.id,
            data: { isActive: !reward.isActive }
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
    };
};