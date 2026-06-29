import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminBranchRepositoryImplement } from '../infrastructure/repositories/admin-branch/admin-branch.repository.implement';
import { toast } from 'sonner';

// 🌟 1. Import Models từ Domain
import type { 
    BranchResponseData, 
    CreateBranchInput, 
    UpdateBranchInput 
} from '../domain/models/admin-branch/admin-branch.model';

// 🌟 2. Export (chuyển tiếp) Models để UI import cho gọn
export type { BranchResponseData, CreateBranchInput, UpdateBranchInput };

const branchRepo = new AdminBranchRepositoryImplement();

export const useBranch = () => {
    const queryClient = useQueryClient();

    const { data: branches = [], isLoading, isError } = useQuery({
        queryKey: ['admin_branches'],
        queryFn: () => branchRepo.getAll(),
    });

    const createMutation = useMutation({
        mutationFn: (data: CreateBranchInput) => branchRepo.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_branches'] });
            toast.success("Thêm chi nhánh thành công!");
        },
        onError: (error: any) => toast.error("Lỗi khi thêm: " + error.message)
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateBranchInput }) => branchRepo.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_branches'] });
            toast.success("Cập nhật chi nhánh thành công!");
        },
        onError: (error: any) => toast.error("Lỗi cập nhật: " + error.message)
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => branchRepo.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_branches'] });
            toast.success("Xóa chi nhánh thành công!");
        },
        onError: (error: any) => toast.error("Lỗi xóa: " + error.message)
    });

    const toggleStatus = async (branch: BranchResponseData) => {
        await updateMutation.mutateAsync({
            id: branch.id,
            data: {
                branchName: branch.branchName,
                address: branch.address,
                hotline: branch.hotline,
                operatingHours: branch.operatingHours,
                status: branch.status === 'Active' ? 'Inactive' : 'Active'
            }
        });
    };

    return {
        branches,
        isLoading,
        isError,
        createBranch: createMutation.mutateAsync,
        updateBranch: updateMutation.mutateAsync,
        deleteBranch: deleteMutation.mutateAsync,
        toggleStatus,
    };
};

export { AdminBranchRepositoryImplement };
