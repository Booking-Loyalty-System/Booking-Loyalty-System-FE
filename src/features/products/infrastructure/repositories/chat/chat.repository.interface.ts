import type {
    CustomerSendRequest,
    CustomerSendResponse,
    ToggleStatusResponse,
    ChatSessionSummary,
    StaffSendRequest,
    StaffSendResponse,
} from '../../../domain/models/chat/chat.model';

export interface IChatRepository {
    customerSend(request: CustomerSendRequest): Promise<CustomerSendResponse>;
    customerToggleStatus(target: string): Promise<ToggleStatusResponse>;
    getCustomerHistory(): Promise<any[]>;

    staffWaitingList(): Promise<ChatSessionSummary[]>;
    staffActiveSession(): Promise<any>;
    staffAccept(sessionId: string): Promise<void>;
    staffSend(sessionId: string, request: StaffSendRequest): Promise<StaffSendResponse>;
    staffClose(sessionId: string): Promise<void>;
}
