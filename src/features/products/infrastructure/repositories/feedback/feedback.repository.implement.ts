import { httpClient } from '@/core/http/httpClient';
import { ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '../../../domain/apiResponse';
import type {
    SubmitFeedbackInput,
    FeedbackRecord
} from '../../../domain/models/feedback/feedback.model';
import type { IFeedbackRepository } from './feedback.repository.interface';

export class FeedbackRepositoryImplement implements IFeedbackRepository {
    async submitFeedback(input: SubmitFeedbackInput): Promise<void> {
        await httpClient.post<ApiResponse<unknown>>(
            ENDPOINTS.FEEDBACK.SUBMIT,
            input
        );
    }

    async getAllPublic(): Promise<FeedbackRecord[]> {
        const response = await httpClient.get<ApiResponse<FeedbackRecord[]>>(
            ENDPOINTS.FEEDBACK.PUBLIC_ALL
        );
        return response.data ?? [];
    }
}
