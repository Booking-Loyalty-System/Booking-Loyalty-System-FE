// ─── Customer Chat ────────────────────────────────────────────────────────────
export interface CustomerSendRequest {
    message: string;
}

export interface CustomerSendResponse {
    reply: string;
    chatSessionId?: string;
}

export interface ToggleStatusResponse {
    id?: string;
    success: boolean;
    message: string;
    data: {
        currentStatus: number;
    };
}

// ─── Staff Chat ───────────────────────────────────────────────────────────────
export interface ChatSessionSummary {
    id: string;
    customerId: string;
    customerName: string;
    lastMessage: string;
    startedAt: string;
}

export interface StaffSendRequest {
    message: string;
}

export interface StaffSendResponse {
    reply?: string;
}

// ─── Shared UI message shape ──────────────────────────────────────────────────
export interface LiveChatMessage {
    role: 'customer' | 'staff';
    content: string;
    timestamp: Date;
}

export interface StaffActiveSessionMessage {
    id: string;
    senderType: 'User' | 'Staff';
    message: string;
    senderName: string;
    createdAt: string;
}

export interface StaffActiveSessionDetails {
    id: string;
    customerId: string;
    customerName: string;
    status: string;
    staffId: string;
    staffName: string;
    createdAt: string;
    messages: StaffActiveSessionMessage[];
}

export interface StaffActiveSessionResponse {
    success: boolean;
    message: string;
    data: StaffActiveSessionDetails[];
}
