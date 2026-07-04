import { httpClient } from '@/core/http/httpClient';
import { ENDPOINTS } from '@/core/api/endpoints';
import type { IChatFeedbackRepository } from './chatFeedback.repository.interface';
import type { ChatFeedbackPayload } from '../../../domain/models/chat-feedback/chatFeedback.model';

export class ChatFeedbackRepositoryImplement implements IChatFeedbackRepository {
    async submitFeedback(payload: ChatFeedbackPayload): Promise<void> {
        await httpClient.post<void>(ENDPOINTS.CHAT_FEEDBACK.SUBMIT, payload);
    }
}