import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminUserRepository } from '../infrastructure/repositories/admin-user/admin-user.repository.implement';
import { toast } from 'sonner';

const userRepo = new AdminUserRepository();

export const useAdminUser = (role?: string) => {
    const queryClient = useQueryClient();

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['admin_users', role],
        queryFn: () => userRepo.getAll(role),
    });

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string, status: any }) => userRepo.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_users'] });
            toast.success("Cập nhật trạng thái thành công!");
        }
    });

    return { users, isLoading, updateStatus: statusMutation.mutateAsync };
};