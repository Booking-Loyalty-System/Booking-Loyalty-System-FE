// infrastructure/repositories/notification/notification.repository.implement.ts
import { httpClient } from '@/core/http/httpClient.ts';
import { ENDPOINTS } from '@/core/api/endpoints';
import type { INotificationRepository } from './notification.repository.interface.ts';
import type { PagedNotificationResponse } from '../../../domain/models/notification/notification.dto';

export class NotificationRepositoryImplement implements INotificationRepository {

    async getNotifications(page: number = 1, pageSize: number = 20): Promise<PagedNotificationResponse> {
        // Truyền thẳng PagedNotificationResponse, bỏ ApiResponse đi để khớp với JSON thực tế
        const response = await httpClient.get<PagedNotificationResponse>(
            ENDPOINTS.NOTIFICATION.BASE,
            { params: { page, pageSize } }
        );
        console.log(response);
        return response;
    }

    async markAsRead(id: string): Promise<void> {
        await httpClient.patch<void>(ENDPOINTS.NOTIFICATION.READ(id));
    }

    async getUnreadCount(): Promise<number> {
        const response = await httpClient.get<number>(ENDPOINTS.NOTIFICATION.UNREAD_COUNT);
        console.log(response);
        return response;
    }
}