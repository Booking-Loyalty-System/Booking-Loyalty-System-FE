import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminPromotionRepositoryImplement } from '../infrastructure/repositories/admin-promotion/admin-promotion.repository.implement';
import { toast } from 'sonner';
import type {
    AdminPromotionResponseData,
    CreateAdminPromotionInput,
    UpdateAdminPromotionInput,
} from '../domain/models/admin-promotion/admin-promotion.model';

export type { AdminPromotionResponseData, CreateAdminPromotionInput, UpdateAdminPromotionInput };

const promotionRepo = new AdminPromotionRepositoryImplement();

export const useAdminPromotion = () => {
    const queryClient = useQueryClient();

    const { data: promotions = [], isLoading, isError } = useQuery({
        queryKey: ['admin_promotions'],
        queryFn: () => promotionRepo.getAll(),
    });

    const createMutation = useMutation({
        mutationFn: (data: CreateAdminPromotionInput) => promotionRepo.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_promotions'] });
            toast.success('Thêm khuyến mãi thành công!');
        },
        onError: (error: Error) => toast.error('Lỗi khi thêm: ' + error.message),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateAdminPromotionInput }) =>
            promotionRepo.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_promotions'] });
            toast.success('Cập nhật khuyến mãi thành công!');
        },
        onError: (error: Error) => toast.error('Lỗi cập nhật: ' + error.message),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => promotionRepo.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_promotions'] });
            toast.success('Xóa khuyến mãi thành công!');
        },
        onError: (error: Error) => toast.error('Lỗi xóa: ' + error.message),
    });

    const toggleStatus = async (promotion: AdminPromotionResponseData) => {
        await updateMutation.mutateAsync({
            id: promotion.id,
            data: {
                description: promotion.description,
                discountType: promotion.discountType,
                discountValue: promotion.discountValue,
                startDate: promotion.startDate,
                endDate: promotion.endDate,
                maxUses: promotion.maxUses,
                minSpend: promotion.minSpend,
                isActive: !promotion.isActive,
            },
        });
    };

    return {
        promotions,
        isLoading,
        isError,
        createPromotion: createMutation.mutateAsync,
        updatePromotion: updateMutation.mutateAsync,
        deletePromotion: deleteMutation.mutateAsync,
        toggleStatus,
        isCreating: createMutation.isPending,
        isUpdating: updateMutation.isPending,
        isDeleting: deleteMutation.isPending,
    };
};
