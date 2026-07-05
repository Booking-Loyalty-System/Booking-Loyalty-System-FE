// Model đại diện cho các request và response liên quan đến AI Chatbot và kiểm duyệt
export interface ChatRequest {
    message: string;
    historyContext?: string;
}

export interface ChatResponse {
    reply: string;
    chatSessionId?: string;
}

export interface FeedbackModerationRequest {
    comment: string;
}

export interface FeedbackModerationResponse {
    isValid: boolean;
    reason: string;
    cleanedComment: string;
}
