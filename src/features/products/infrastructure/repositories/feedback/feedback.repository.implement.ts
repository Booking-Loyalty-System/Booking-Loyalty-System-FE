import { httpClient } from '@/core/http/httpClient';
import { ENDPOINTS } from '@/core/api/endpoints';
import type { ApiResponse } from '../../../domain/apiResponse';
import type {
    SubmitFeedbackInput,
    FeedbackRecord,
    AdminFeedbackFilterRecord,
    FeedbackStatisticsData
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

    async getAdminFilteredFeedbacks(isDescending: boolean = true): Promise<AdminFeedbackFilterRecord[]> {
        const response = await httpClient.get<ApiResponse<AdminFeedbackFilterRecord[]>>(
            `${ENDPOINTS.FEEDBACK.FILTER}?isDescending=${isDescending}`
        );
        return response.data ?? [];
    }

    async getFeedbackStatistics(topCount: number = 5): Promise<FeedbackStatisticsData> {
        const response = await httpClient.get<ApiResponse<FeedbackStatisticsData>>(
            `${ENDPOINTS.FEEDBACK.STATISTICS}?topCount=${topCount}`
        );
        return response.data; // trả về cục dữ liệu thống kê lớn chứa các mảng top/lowest
    }
}
