import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminTierRepository } from '../infrastructure/repositories/admin-tier/admin-tier.repository';
import { toast } from 'sonner';

const tierRepo = new AdminTierRepository();

export const useAdminTier = () => {
    const queryClient = useQueryClient();

    const { data: tiers = [], isLoading } = useQuery({
        queryKey: ['admin_tiers'],
        queryFn: () => tierRepo.getAll(),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string, data: any }) => tierRepo.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_tiers'] });
            toast.success("Cập nhật hạng thành viên thành công!");
        }
    });

    return { tiers, isLoading, updateTier: updateMutation.mutateAsync };
};