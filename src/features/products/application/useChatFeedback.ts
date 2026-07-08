import { useMutation, useQuery } from '@tanstack/react-query';
import { ChatFeedbackRepositoryImplement } from '../infrastructure/repositories/chat-feedback/chatFeedback.repository.implement';
import type { ChatFeedbackPayload } from '../domain/models/chat-feedback/chatFeedback.model';

const chatFeedbackRepo = new ChatFeedbackRepositoryImplement();

export const useChatFeedback = () => {
    const submitMutation = useMutation({
        mutationFn: (payload: ChatFeedbackPayload) => chatFeedbackRepo.submitFeedback(payload),
        onSuccess: () => {
            console.log("Cảm ơn bạn đã gửi đánh giá!");
        },
        onError: (error) => {
            console.error("Lỗi khi gửi feedback:", error);
        }
    });

    const useLatestFeedbacks = (count = 10) => useQuery({
        queryKey: ['chatFeedbacks', 'latest', count],
        queryFn: () => chatFeedbackRepo.getLatestFeedbacks(count)
    });

    // Hook lấy thống kê staff tốt / tệ nhất
    const useStaffStatistics = (topCount = 5) => useQuery({
        queryKey: ['chatFeedbacks', 'statistics', topCount],
        queryFn: () => chatFeedbackRepo.getStaffStatistics(topCount)
    });

    // Hook lấy chi tiết cuộc chat log kèm tin nhắn
    const useFeedbackDetail = (id: string | null) => useQuery({
        queryKey: ['chatFeedbacks', 'detail', id],
        queryFn: () => chatFeedbackRepo.getFeedbackDetail(id!),
        enabled: !!id // Chỉ kích hoạt khi id khác null
    });

    return {
        submitFeedback: submitMutation.mutateAsync,
        isSubmitting: submitMutation.isPending,
        useLatestFeedbacks,
        useStaffStatistics,
        useFeedbackDetail
    };
};