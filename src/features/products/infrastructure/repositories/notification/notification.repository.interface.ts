import type { PagedNotificationResponse } from '../../../domain/models/notification/notification.dto';

export interface INotificationRepository {
    getNotifications(page: number, pageSize: number): Promise<PagedNotificationResponse>;
    markAsRead(id: string): Promise<void>;
    getUnreadCount(): Promise<number>;
}