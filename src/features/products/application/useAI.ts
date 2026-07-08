import { useState, useCallback } from 'react';
import { AIRepositoryImplement } from '../infrastructure/repositories/ai/ai.repository.implement';
import type {
    FeedbackModerationRequest,
    FeedbackModerationResponse
} from '../domain/models/ai/ai.model';

// Message interface cho UI chat - mỗi tin nhắn có role và nội dung text
export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const aiRepo = new AIRepositoryImplement();

export const useAI = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: 'assistant',
            content: 'Xin chào! Tôi là trợ lý của AutoWash Pro 🚗 Tôi có thể giúp bạn tìm hiểu về các gói dịch vụ, chi nhánh, hoặc giải đáp mọi thắc mắc liên quan. Bạn cần hỗ trợ gì ạ?',
            timestamp: new Date()
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);

    // historyContext: Nối lịch sử hội thoại thành chuỗi để gửi kèm lên API,
    // giúp AI hiểu ngữ cảnh cuộc trò chuyện trước đó
    const buildHistoryContext = useCallback((msgs: ChatMessage[]) => {
        return msgs
            .slice(-8) // Giữ tối đa 8 tin nhắn gần nhất để tránh payload quá lớn
            .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
            .join('\n');
    }, []);

    const sendMessage = useCallback(async (userMessage: string) => {
        if (!userMessage.trim() || isLoading) return;

        // Thêm tin nhắn người dùng vào danh sách trước khi gọi API
        const userMsg: ChatMessage = {
            role: 'user',
            content: userMessage.trim(),
            timestamp: new Date()
        };

        setMessages(prev => {
            const updated = [...prev, userMsg];
            return updated;
        });
        setIsLoading(true);

        try {
            setMessages(prev => {
                const historyContext = buildHistoryContext(prev);
                // Gọi API song song với việc cập nhật state
                aiRepo.chat({ message: userMessage.trim(), historyContext }).then(data => {
                    const assistantMsg: ChatMessage = {
                        role: 'assistant',
                        content: data.reply,
                        timestamp: new Date()
                    };
                    setMessages(m => [...m, assistantMsg]);
                    setIsLoading(false);
                }).catch(() => {
                    const errorMsg: ChatMessage = {
                        role: 'assistant',
                        content: 'Xin lỗi, tôi gặp sự cố kết nối. Vui lòng thử lại sau.',
                        timestamp: new Date()
                    };
                    setMessages(m => [...m, errorMsg]);
                    setIsLoading(false);
                });
                return prev;
            });
        } catch {
            setIsLoading(false);
        }
    }, [isLoading, buildHistoryContext]);

    const clearMessages = useCallback(() => {
        setMessages([{
            role: 'assistant',
            content: 'Xin chào! Tôi là trợ lý của AutoWash Pro 🚗 Bạn cần hỗ trợ gì ạ?',
            timestamp: new Date()
        }]);
    }, []);

    // Hàm kiểm duyệt nội dung feedback trước khi gửi lên server
    const moderateFeedback = useCallback(async (
        request: FeedbackModerationRequest
    ): Promise<FeedbackModerationResponse> => {
        return await aiRepo.moderateFeedback(request);
    }, []);

    return {
        messages,
        isLoading,
        sendMessage,
        clearMessages,
        moderateFeedback
    };
};
