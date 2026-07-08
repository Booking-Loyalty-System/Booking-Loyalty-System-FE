import { httpClient } from '@/core/http/httpClient';
import { ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '../../../domain/apiResponse';
import type {
    ChatRequest,
    ChatResponse,
    FeedbackModerationRequest,
    FeedbackModerationResponse
} from '../../../domain/models/ai/ai.model';
import type { IAIRepository } from './ai.repository.interface';

export class AIRepositoryImplement implements IAIRepository {
    async chat(request: ChatRequest): Promise<ChatResponse> {
        const response = await httpClient.post<ApiResponse<ChatResponse>>(
            ENDPOINTS.AI.CHAT,
            request
        );
        return response.data;
    }

    async moderateFeedback(request: FeedbackModerationRequest): Promise<FeedbackModerationResponse> {
        const response = await httpClient.post<ApiResponse<FeedbackModerationResponse>>(
            ENDPOINTS.AI.MODERATE_FEEDBACK,
            request
        );
        return response.data;
    }
}
