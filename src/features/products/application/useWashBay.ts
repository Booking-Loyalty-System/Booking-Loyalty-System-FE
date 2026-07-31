// src/features/products/application/useWashBay.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { WashBayRepositoryImplement } from '../infrastructure/repositories/wash-bay/wash-bay.repository.implement';
import type { WashBay } from '../infrastructure/repositories/wash-bay/wash-bay.repository.interface';
import { toast } from 'sonner';

const washBayRepository = new WashBayRepositoryImplement();

export const useWashBay = (branchId?: string) => {
    const queryClient = useQueryClient();

    const {
        data: washBays = [],
        isLoading,
        error,
        refetch
    } = useQuery<WashBay[]>({
        queryKey: ['wash_bays', branchId],
        queryFn: () => {
            // Lọc theo chi nhánh nếu có branchId
            if (branchId) {
                return washBayRepository.getWashBaysByBranch(branchId);
            }
            // Gọi hàm lấy toàn bộ khoang rửa nếu không có branchId
            return washBayRepository.getAllWashBays();
        },
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });

    const createWashBayMutation = useMutation({
        mutationFn: (payload: { name: string; branchId: string }) => washBayRepository.createWashBay(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['wash_bays_by_branch', branchId] });
            toast.success('Tạo khoang rửa xe thành công!');
        },
        onError: (err: Error) => {
            toast.error('Lỗi khi tạo khoang rửa xe: ' + err.message);
        }
    });

    return {
        washBays,
        isLoading,
        error,
        refetch,
        createWashBay: createWashBayMutation.mutateAsync,
        isCreatingWashBay: createWashBayMutation.isPending
    };
};