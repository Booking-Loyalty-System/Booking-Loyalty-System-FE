import { useMutation } from '@tanstack/react-query';
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

    return {
        submitFeedback: submitMutation.mutateAsync,
        isSubmitting: submitMutation.isPending,
    };
};