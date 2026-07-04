import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { FeedbackRepositoryImplement } from '../infrastructure/repositories/feedback/feedback.repository.implement';
import { AIRepositoryImplement } from '../infrastructure/repositories/ai/ai.repository.implement';
import type { SubmitFeedbackInput } from '../domain/models/feedback/feedback.model';

export type { SubmitFeedbackInput, FeedbackRecord } from '../domain/models/feedback/feedback.model';

const feedbackRepo = new FeedbackRepositoryImplement();
const aiRepo = new AIRepositoryImplement();

export const useFeedback = () => {
    // Query lấy toàn bộ public feedback
    const { data: publicFeedbacks = [], isLoading: isLoadingFeedbacks } = useQuery({
        queryKey: ['feedback_public_all'],
        queryFn: () => feedbackRepo.getAllPublic(),
        staleTime: 5 * 60 * 1000 // cache 5 phút
    });

    // Mutation gửi feedback kèm kiểm duyệt nội dung bằng AI trước khi submit
    const submitMutation = useMutation({
        mutationFn: async (input: SubmitFeedbackInput) => {
            // Bước 1: Gọi AI moderate-feedback để kiểm tra nội dung bình luận
            if (input.comment?.trim()) {
                const modResult = await aiRepo.moderateFeedback({ comment: input.comment });
                if (!modResult.isValid) {
                    throw new Error(modResult.reason || 'Nội dung bình luận không phù hợp, vui lòng chỉnh sửa lại.');
                }
                // Dùng nội dung đã được làm sạch từ AI
                input = { ...input, comment: modResult.cleanedComment };
            }
            // Bước 2: Submit feedback đã được kiểm duyệt
            await feedbackRepo.submitFeedback(input);
        },
        onSuccess: () => {
            toast.success('Cảm ơn bạn đã gửi đánh giá! 🌟');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Gửi đánh giá thất bại, vui lòng thử lại.');
        }
    });

    return {
        publicFeedbacks,
        isLoadingFeedbacks,
        submitFeedback: submitMutation.mutateAsync,
        isSubmitting: submitMutation.isPending
    };
};
