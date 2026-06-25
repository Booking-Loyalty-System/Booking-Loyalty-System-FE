import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { VoucherRepositoryImplement } from '../infrastructure/repositories/voucher/voucher.repository.implement.ts';

import type { Voucher, RewardDto } from '../domain/models/voucher/voucher.model.ts';

const voucherRepository = new VoucherRepositoryImplement();

export const useVoucher = () => {
    const queryClient = useQueryClient();

    // 1. Query danh sách Voucher của khách hàng
    const myVouchersQuery = useQuery<Voucher[]>({
        queryKey: ['my_vouchers'],
        queryFn: () => voucherRepository.getMyVouchers(),
        staleTime: 1000 * 60 * 5, // Cache trong 5 phút
    });

    // 2. Mutation đổi voucher từ điểm tích lũy
    const redeemVoucherMutation = useMutation({
        mutationFn: (rewardId: string) => voucherRepository.redeemVoucher(rewardId),
        onSuccess: () => {
            // Invalidate cache để cập nhật danh sách voucher và số điểm
            queryClient.invalidateQueries({ queryKey: ['my_vouchers'] });
            queryClient.invalidateQueries({ queryKey: ['customer_me'] });
        }
    });

    // 3. Mutation sử dụng voucher
    const useVoucherMutation = useMutation({
        mutationFn: (voucherId: string) => voucherRepository.useVoucher(voucherId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my_vouchers'] });
        }
    });

    // Lắng nghe sự kiện đổi điểm bên ngoài để cập nhật thông tin thành viên (nếu có)
    useEffect(() => {
        const handlePointsChanged = () => {
            queryClient.invalidateQueries({ queryKey: ['customer_me'] });
            queryClient.invalidateQueries({ queryKey: ['my_vouchers'] });
        };
        window.addEventListener('customer_points_changed', handlePointsChanged);
        return () => {
            window.removeEventListener('customer_points_changed', handlePointsChanged);
        };
    }, [queryClient]);

    // 4. Query danh sách phần thưởng có thể đổi
    const availableRewardsQuery = useQuery<RewardDto[]>({
        queryKey: ['available_rewards'],
        queryFn: () => voucherRepository.getAvailableRewards(),
        staleTime: 1000 * 60 * 5, // Cache trong 5 phút
    });

    return {
        vouchers: myVouchersQuery.data || [],
        activeVouchers: (myVouchersQuery.data || []).filter(v => v.status === 'Active'),
        isLoading: myVouchersQuery.isLoading,
        redeemVoucher: redeemVoucherMutation.mutateAsync,
        isRedeeming: redeemVoucherMutation.isPending,
        useVoucher: useVoucherMutation.mutateAsync,
        isUsing: useVoucherMutation.isPending,
        availableRewards: availableRewardsQuery.data || [],
        isLoadingRewards: availableRewardsQuery.isLoading
    };
};
