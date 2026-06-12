import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LoyaltyRepositoryImplement } from '../infrastructure/repositories/loyalty/loyalty.repository.implement';

const loyaltyRepository = new LoyaltyRepositoryImplement();

export const useLoyalty = () => {
    const queryClient = useQueryClient();

    // Hook lấy thông tin hạng và điểm
    const useGetLoyaltyInfo = () => {
        return useQuery({
            queryKey: ['loyalty-info'],
            queryFn: () => loyaltyRepository.getLoyaltyInfo(),
        });
    };

    // Hook lấy lịch sử giao dịch
    const useGetTransactionHistory = () => {
        return useQuery({
            queryKey: ['loyalty-transactions'],
            queryFn: () => loyaltyRepository.getTransactionHistory(),
        });
    };

    // Hook đổi điểm (Mutation vì đây là hành động thay đổi dữ liệu)
    const useRedeemPoints = () => {
        return useMutation({
            mutationFn: ({ points, rewardId }: { points: number; rewardId: string }) =>
                loyaltyRepository.redeemPoints(points, rewardId),
            onSuccess: () => {
                // Sau khi đổi điểm thành công, làm mới thông tin điểm để UI cập nhật số dư mới
                queryClient.invalidateQueries({ queryKey: ['loyalty-info'] });
                queryClient.invalidateQueries({ queryKey: ['loyalty-transactions'] });
            },
        });
    };

    return {
        useGetLoyaltyInfo,
        useGetTransactionHistory,
        useRedeemPoints,
    };
};
