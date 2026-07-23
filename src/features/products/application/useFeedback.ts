import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { FeedbackRepositoryImplement } from '../infrastructure/repositories/feedback/feedback.repository.implement';
import { useTranslation } from 'react-i18next';
import { AIRepositoryImplement } from '../infrastructure/repositories/ai/ai.repository.implement';
import type { SubmitFeedbackInput } from '../domain/models/feedback/feedback.model';

export type { SubmitFeedbackInput, FeedbackRecord } from '../domain/models/feedback/feedback.model';

const feedbackRepo = new FeedbackRepositoryImplement();
const aiRepo = new AIRepositoryImplement();

export const useFeedback = (options?: { isDescending?: boolean; topCount?: number }) => {
    const { t } = useTranslation('customer');
    const isDescending = options?.isDescending ?? true;
    const topCount = options?.topCount ?? 5;

    const { data: publicFeedbacks = [], isLoading: isLoadingFeedbacks } = useQuery({
        queryKey: ['feedback_public_all'],
        queryFn: () => feedbackRepo.getAllPublic(),
        staleTime: 5 * 60 * 1000 // cache 5 phút
    });

    const {
        data: filteredFeedbacks = [],
        isLoading: isLoadingFiltered,
        refetch: refetchFiltered
    } = useQuery({
        queryKey: ['feedback_admin_filter', isDescending],
        queryFn: () => feedbackRepo.getAdminFilteredFeedbacks(isDescending),
        staleTime: 1 * 60 * 1000 // cache 1 phút
    });

    const {
        data: statistics = null,
        isLoading: isLoadingStats,
        refetch: refetchStats
    } = useQuery({
        queryKey: ['feedback_admin_statistics', topCount],
        queryFn: () => feedbackRepo.getFeedbackStatistics(topCount),
        staleTime: 3 * 60 * 1000 // dữ liệu thống kê nặng hơn nên cache 3 phút
    });

    // Mutation gửi feedback kèm kiểm duyệt nội dung bằng AI trước khi submit
    const submitMutation = useMutation({
        mutationFn: async (input: SubmitFeedbackInput) => {
            // Bước 1: Gọi AI moderate-feedback để kiểm tra nội dung bình luận
            if (input.comment?.trim()) {
                const modResult = await aiRepo.moderateFeedback({ comment: input.comment });
                if (!modResult.isValid) {
                    throw new Error(modResult.reason || t('feedback.toast.invalid', { defaultValue: 'Nội dung bình luận không phù hợp, vui lòng chỉnh sửa lại.' }));
                }
                // Dùng nội dung đã được làm sạch từ AI
                input = { ...input, comment: modResult.cleanedComment };
            }
            // Bước 2: Submit feedback đã được kiểm duyệt
            await feedbackRepo.submitFeedback(input);
        },
        onSuccess: () => {
            toast.success(t('feedback.toast.success', { defaultValue: 'Cảm ơn bạn đã gửi đánh giá! 🌟' }));
        },
        onError: (error: Error) => {
            toast.error(error.message || t('feedback.toast.error', { defaultValue: 'Gửi đánh giá thất bại, vui lòng thử lại.' }));
        }
    });

    return {
        publicFeedbacks,
        isLoadingFeedbacks,
        filteredFeedbacks,
        statistics,
        submitFeedback: submitMutation.mutateAsync,
        isSubmitting: submitMutation.isPending,
        isLoadingFiltered,
        isLoadingStats,
        refreshAllAdminData: () => {
            refetchFiltered();
            refetchStats();
        }
    };
};

export const usePublicFeedbacks = (
    branchId?: string,
    pageIndex: number = 1,
    pageSize: number = 10
) => {
    return useQuery({
        queryKey: ['feedback_public_list', branchId, pageIndex, pageSize],
        queryFn: () => feedbackRepo.getPublicFeedbacks(branchId, pageIndex, pageSize),
        staleTime: 2 * 60 * 1000 // cache 2 mins
    });
};

