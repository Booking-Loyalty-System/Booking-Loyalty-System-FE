import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';
import { RewardRepositoryImplement } from '../infrastructure/repositories/reward/reward.repository.implement.ts';
import type { RewardDto, RedemptionDto, MappedVoucher } from '../domain/models/voucher/voucher.model.ts';

const rewardRepository = new RewardRepositoryImplement();

export const useReward = () => {
    const queryClient = useQueryClient();

    // Query danh sách phần thưởng có thể đổi (tại quầy / bằng điểm)
    const availableRewardsQuery = useQuery<RewardDto[]>({
        queryKey: ['available_rewards'],
        queryFn: async () => {
            const data = await rewardRepository.getAvailableRewards();
            return Array.isArray(data) ? data : [];
        },
        staleTime: 1000 * 60 * 5,
    });

    // Query lịch sử đổi thưởng - Đã cập nhật Type khớp 100% với JSON mẫu
    const myRedemptionsQuery = useQuery<RedemptionDto[]>({
        queryKey: ['my_redemptions'],
        queryFn: async () => {
            const data = await rewardRepository.getMyRedemptions();
            return Array.isArray(data) ? data : [];
        },
        staleTime: 1000 * 60 * 5,
    });

    // Mutation đổi reward lấy voucher
    const redeemRewardMutation = useMutation({
        mutationFn: (rewardId: string) => rewardRepository.redeemReward(rewardId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my_redemptions'] });
            queryClient.invalidateQueries({ queryKey: ['my_vouchers'] });
            queryClient.invalidateQueries({ queryKey: ['customer_me'] });
            queryClient.invalidateQueries({ queryKey: ['available_rewards'] });
        }
    });

    // Lắng nghe sự kiện cập nhật điểm từ hệ thống
    useEffect(() => {
        const handlePointsChanged = () => {
            queryClient.invalidateQueries({ queryKey: ['customer_me'] });
            queryClient.invalidateQueries({ queryKey: ['my_redemptions'] });
            queryClient.invalidateQueries({ queryKey: ['available_rewards'] });
        };
        window.addEventListener('customer_points_changed', handlePointsChanged);
        return () => window.removeEventListener('customer_points_changed', handlePointsChanged);
    }, [queryClient]);

    const availableRewards = availableRewardsQuery.data ?? [];
    const redemptions = myRedemptionsQuery.data ?? [];

    // 🌟 MAPPING DATA SANG FORMAT VOUCHER DÀNH RIÊNG CHO ĐẶT LỊCH
    // Dựa vào JSON bạn cung cấp, trạng thái khả dụng để dùng là 'Pending' hoặc 'Active'
    const redeemedVouchersOnly = useMemo<MappedVoucher[]>(() => {
        return redemptions
            .filter(item => item && (item.status === 'Pending' || item.status === 'Active'))
            .map(item => {
                // Tự động bóc tách số tiền từ text (Ví dụ: "Voucher 50k" -> 50000) để tính toán hóa đơn
                const digitMatch = item.rewardName.match(/\d+/);
                const discountAmount = digitMatch
                    ? parseInt(digitMatch[0], 10) * (item.rewardName.toLowerCase().includes('k') ? 1000 : 1)
                    : 0;

                return {
                    id: item.id, // ID của bản ghi giao dịch đổi thưởng dùng để truyền lên API đặt lịch
                    code: `REDEEM-${item.pointsSpent}PTS`,
                    title: item.rewardName,
                    description: `Đã đổi thành công bằng ${item.pointsSpent} điểm`,
                    status: item.status,
                    discountValue: discountAmount,
                    expiryDate: 'Khả dụng',
                    isRewardItem: true
                };
            });
    }, [redemptions]);

    return {
        availableRewards,
        isLoadingRewards: availableRewardsQuery.isLoading || availableRewardsQuery.isFetching,

        redemptions, // Dữ liệu thô từ API (tiện dùng cho trang Lịch Sử Đổi Thưởng nếu cần)
        redeemedVouchersOnly, // 🌟 Danh sách đã convert chuẩn chỉnh, ném thẳng vào <VoucherSelection /> ở BookWash
        isLoadingRedemptions: myRedemptionsQuery.isLoading,

        redeemReward: redeemRewardMutation.mutateAsync,
        isRedeeming: redeemRewardMutation.isPending,
    };
};