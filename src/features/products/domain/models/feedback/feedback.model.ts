// Model đại diện cho các request và response liên quan đến phản hồi (Feedback) của khách hàng
export interface SubmitFeedbackInput {
    bookingId: string;
    serviceRating: number;
    staffRating: number;
    priceRating: number;
    comment: string;
}

export interface FeedbackRecord {
    id: string;
    bookingId: string;
    customerName?: string;
    serviceRating: number;
    staffRating: number;
    priceRating: number;
    comment: string;
    createdAt: string;
}

export interface AdminFeedbackFilterRecord {
    id: string;
    bookingCode: string;
    bookingId: string;    // Bổ sung
    customerId: string;   // Bổ sung
    customerName: string;
    overallRating: number;
    comment: string | null;
    createdAt: string;
}

export interface RatingStatDto {
    staffId?: string;
    serviceId?: string;
    staffName?: string;
    serviceName?: string;
    averageRating: number;
    totalFeedbacks: number;
}

export interface FeedbackStatisticsData {
    topStaffs: RatingStatDto[];
    lowestStaffs: RatingStatDto[];
    topServices: RatingStatDto[];
    lowestServices: RatingStatDto[];
    topChatStaffs: RatingStatDto[];
    lowestChatStaffs: RatingStatDto[];
}
