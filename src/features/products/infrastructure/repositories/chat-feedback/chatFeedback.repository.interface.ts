import type { ChatFeedbackPayload } from '../../../domain/models/chat-feedback/chatFeedback.model';

export interface IChatFeedbackRepository {
    submitFeedback(payload: ChatFeedbackPayload): Promise<void>;
}