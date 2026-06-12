export interface LoyaltyInfo {
    totalPoints: number;
    currentTier: 'Member' | 'Silver' | 'Gold' | 'Platinum';
    nextTierPoints: number; // Số điểm cần để lên hạng tiếp theo
    multiplier: number; // Hệ số tích điểm (ví dụ: 1.0, 1.2, 1.5...)
}

export interface LoyaltyTransaction {
    id: string;
    amount: number; // Số điểm thay đổi (+ hoặc -)
    type: 'Earned' | 'Redeemed' | 'Expired';
    description: string;
    createdAt: string;
}

export interface Voucher {
    id: string;
    code: string;
    description: string;
    discountValue: number;
    discountType: 'Percentage' | 'FixedAmount';
    minOrderValue?: number;
    pointCost?: number; // Nếu dùng điểm để đổi voucher này
}
