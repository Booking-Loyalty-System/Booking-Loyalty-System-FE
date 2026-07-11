import { httpClient } from '@/core/http/httpClient';
import { ENDPOINTS } from '@/core/api/endpoints';
import type { IChatFeedbackRepository } from './chatFeedback.repository.interface';
import type { ChatFeedbackPayload } from '../../../domain/models/chat-feedback/chatFeedback.model';

export class ChatFeedbackRepositoryImplement implements IChatFeedbackRepository {
    async submitFeedback(payload: ChatFeedbackPayload): Promise<void> {
        await httpClient.post<void>(ENDPOINTS.CHAT_FEEDBACK.SUBMIT, payload);
    }
    async getLatestFeedbacks(count?: number) {
        return await httpClient.get<any>(ENDPOINTS.CHAT_FEEDBACK.LATEST(count));
    }

    async getStaffStatistics(topCount?: number) {
        return await httpClient.get<any>(ENDPOINTS.CHAT_FEEDBACK.STAFF_STATISTICS(topCount));
    }

    async getFeedbackDetail(id: string) {
        return await httpClient.get<any>(ENDPOINTS.CHAT_FEEDBACK.DETAIL(id));
    }
}