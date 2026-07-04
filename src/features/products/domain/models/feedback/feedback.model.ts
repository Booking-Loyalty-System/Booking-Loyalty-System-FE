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
