import { httpClient } from '@/core/http/httpClient';
import { ENDPOINTS } from '@/core/api/endpoints';
import type {
    CustomerSendRequest,
    CustomerSendResponse,
    ToggleStatusResponse,
    ChatSessionSummary,
    StaffSendRequest,
    StaffSendResponse,
} from '../../../domain/models/chat/chat.model';
import type { IChatRepository } from './chat.repository.interface';

export class ChatRepositoryImplement implements IChatRepository {
    async customerSend(request: CustomerSendRequest): Promise<CustomerSendResponse> {
        const response = await httpClient.post<CustomerSendResponse>(
            ENDPOINTS.CHAT.CUSTOMER_SEND,
            request
        );
        return response as unknown as CustomerSendResponse;
    }

    async customerToggleStatus(target: string): Promise<ToggleStatusResponse> {
        const response = await httpClient.put<ToggleStatusResponse>(
            ENDPOINTS.CHAT.CUSTOMER_TOGGLE_STATUS(target),
            {}
        );
        return response as unknown as ToggleStatusResponse;
    }

    async staffWaitingList(): Promise<ChatSessionSummary[]> {
        const response = await httpClient.get<ChatSessionSummary[]>(
            ENDPOINTS.CHAT.STAFF_WAITING_LIST
        );
        return response as unknown as ChatSessionSummary[];
    }

    async staffActiveSession(): Promise<any> {
        const response = await httpClient.get<any>(
            ENDPOINTS.CHAT.STAFF_ACTIVE_SESSION
        );
        return response;
    }

    async staffAccept(sessionId: string): Promise<void> {
        await httpClient.post(ENDPOINTS.CHAT.STAFF_ACCEPT(sessionId), {});
    }

    async staffSend(sessionId: string, request: StaffSendRequest): Promise<StaffSendResponse> {
        const response = await httpClient.post<StaffSendResponse>(
            ENDPOINTS.CHAT.STAFF_SEND(sessionId),
            request
        );
        return response as unknown as StaffSendResponse;
    }

    async staffClose(sessionId: string): Promise<void> {
        await httpClient.put(ENDPOINTS.CHAT.STAFF_CLOSE(sessionId), {});
    }

    async getCustomerHistory(): Promise<any[]> {
        const response = await httpClient.get<any[]>(
            ENDPOINTS.CHAT.CUSTOMER_HISTORY
        );
        return response as unknown as any[];
    }

    async customerClose(sessionId: string): Promise<void> {
        await httpClient.put(ENDPOINTS.CHAT.STAFF_CLOSE(sessionId), {});
    }
}
