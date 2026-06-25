export interface LoyaltyTransaction {
    id: string;
    date: string;
    description: string;
    type: 'Earned' | 'Redeemed';
    points: number;
}

export interface LoyaltyHistoryResponse {
    transactions: LoyaltyTransaction[];
    totalEarnedThisMonth: number;
    totalRedeemedThisMonth: number;
    totalBookingsThisMonth: number;
}
