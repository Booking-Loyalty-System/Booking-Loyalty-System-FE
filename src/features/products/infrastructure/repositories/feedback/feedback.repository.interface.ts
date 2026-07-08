import type {
    SubmitFeedbackInput,
    FeedbackRecord
} from '@/features/products/domain/models/feedback/feedback.model';

export interface IFeedbackRepository {
    submitFeedback(input: SubmitFeedbackInput): Promise<void>;
    getAllPublic(): Promise<FeedbackRecord[]>;
}
