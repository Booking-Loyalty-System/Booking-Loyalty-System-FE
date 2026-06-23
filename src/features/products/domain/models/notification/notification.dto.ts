// domain/models/notification/notification.dto.ts (hoặc notification.model.ts)
export interface NotificationResponse {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: string;
    referenceId?: string | null; // <-- Thêm trường này từ JSON
    isRead: boolean;
    createdAt: string;
}

export interface PagedNotificationResponse {
    items: NotificationResponse[];
    totalCount: number;
}