// hooks/useNotification.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationRepositoryImplement } from '../infrastructure/repositories/notification/notification.repository.implement';

const repo = new NotificationRepositoryImplement();

export const useNotification = () => {
    const queryClient = useQueryClient();

    // Lấy danh sách thông báo
    const { data, isLoading } = useQuery({
        queryKey: ['notifications'],
        queryFn: () => repo.getNotifications(),
    });

    // Lấy số lượng chưa đọc
    const { data: unreadCount } = useQuery({
        queryKey: ['unread_count'],
        queryFn: () => repo.getUnreadCount(),
    });

    // Đánh dấu đã đọc
    const markAsReadMutation = useMutation({
        mutationFn: (id: string) => repo.markAsRead(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
            queryClient.invalidateQueries({ queryKey: ['unread_count'] });
        }
    });

    return {
        notifications: data?.items || [],
        totalCount: data?.totalCount || 0,
        unreadCount: unreadCount || 0,
        isLoading,
        markAsRead: markAsReadMutation.mutate
    };
};