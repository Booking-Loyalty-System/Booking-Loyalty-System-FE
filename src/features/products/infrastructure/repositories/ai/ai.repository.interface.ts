import type {
    ChatRequest,
    ChatResponse,
    FeedbackModerationRequest,
    FeedbackModerationResponse
} from '@/features/products/domain/models/ai/ai.model';

export interface IAIRepository {
    chat(request: ChatRequest): Promise<ChatResponse>;
    moderateFeedback(request: FeedbackModerationRequest): Promise<FeedbackModerationResponse>;
}
