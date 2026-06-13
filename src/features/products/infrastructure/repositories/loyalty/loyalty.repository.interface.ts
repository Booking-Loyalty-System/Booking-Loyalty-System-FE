import type { LoyaltyInfo, LoyaltyTransaction } from '../../../domain/models/loyalty/loyalty.model';

export interface ILoyaltyRepository {
    // Lấy thông tin hạng và điểm hiện tại của user
    getLoyaltyInfo(): Promise<LoyaltyInfo>;
    
    // Lấy lịch sử giao dịch điểm
    getTransactionHistory(): Promise<LoyaltyTransaction[]>;
    
    // Đổi điểm lấy voucher (nếu có tính năng này)
    redeemPoints(points: number, rewardId: string): Promise<{ success: boolean; message: string }>;
}
