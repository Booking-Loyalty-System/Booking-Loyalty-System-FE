import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AdminPromotionRepositoryImplement } from '../infrastructure/repositories/admin-promotion/admin-promotion.repository.implement';
import { toast } from 'sonner';

import type { 
    PromotionResponseData, 
    CreatePromotionInput, 
    UpdatePromotionInput 
} from '../domain/models/admin-promotion/admin-promotion.model';

export type { PromotionResponseData, CreatePromotionInput, UpdatePromotionInput };

const promotionRepo = new AdminPromotionRepositoryImplement();

export const useAdminPromotion = () => {
    const queryClient = useQueryClient();

    const { data: promotions = [], isLoading, isError } = useQuery({
        queryKey: ['admin_promotions'],
        queryFn: () => promotionRepo.getAll(),
    });

    const createMutation = useMutation({
        mutationFn: (data: CreatePromotionInput) => promotionRepo.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_promotions'] });
            toast.success("Tạo chiến dịch khuyến mãi thành công!");
        },
        onError: (error: any) => toast.error("Lỗi khi tạo: " + error.message)
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdatePromotionInput }) => promotionRepo.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_promotions'] });
            toast.success("Cập nhật khuyến mãi thành công!");
        },
        onError: (error: any) => toast.error("Lỗi cập nhật: " + error.message)
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => promotionRepo.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin_promotions'] });
            toast.success("Xóa khuyến mãi thành công!");
        },
        onError: (error: any) => toast.error("Lỗi xóa: " + error.message)
    });

    const toggleStatus = async (promo: PromotionResponseData) => {
        await updateMutation.mutateAsync({
            id: promo.id,
            data: { isActive: !promo.isActive }
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
    };
};