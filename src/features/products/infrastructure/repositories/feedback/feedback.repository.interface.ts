import type {
    SubmitFeedbackInput,
    FeedbackRecord,
    PublicFeedbackResponse
} from '@/features/products/domain/models/feedback/feedback.model';

export interface IFeedbackRepository {
    submitFeedback(input: SubmitFeedbackInput): Promise<void>;
    getAllPublic(): Promise<FeedbackRecord[]>;
    getPublicFeedbacks(
        branchId?: string,
        pageIndex?: number,
        pageSize?: number
    ): Promise<PublicFeedbackResponse>;
}
