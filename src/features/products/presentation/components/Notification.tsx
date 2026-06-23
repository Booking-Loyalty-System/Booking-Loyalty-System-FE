import React from 'react';
import { Bell, CheckCircle, Clock, Info } from 'lucide-react';
import { useNotification } from '../../application/useNotification';

interface NotificationItem {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    type: 'Booking' | 'System' | string;
    createdAt: string | Date;
}

export const NotificationCenter: React.FC = () => {
    const { notifications, isLoading, markAsRead } = useNotification();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto w-full animate-fade-in">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-[#0f172a]">Thông báo</h2>
                    <p className="text-sm text-[#64748b] mt-1">Cập nhật mới nhất về dịch vụ của bạn</p>
                </div>
            </div>

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-[#e2e8f0]">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700">Không có thông báo nào</h3>
                        <p className="text-slate-500 mt-2 text-sm">Bạn đã xem hết tất cả các thông báo.</p>
                    </div>
                ) : (
                    notifications.map((notification: NotificationItem) => (
                        <div
                            key={notification.id}
                            className={`relative p-5 rounded-2xl border transition-all duration-300 flex gap-4 items-start ${
                                notification.isRead
                                    ? 'bg-white border-gray-100 opacity-75'
                                    : 'bg-blue-50/50 border-blue-100 shadow-sm'
                            }`}
                        >
                            {/* Icon dựa trên trạng thái */}
                            <div className={`p-3 rounded-full shrink-0 ${notification.isRead ? 'bg-gray-100 text-gray-500' : 'bg-blue-100 text-blue-600'}`}>
                                {notification.type === 'Booking' ? <Clock className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start gap-2">
                                    <h4 className={`text-base font-semibold ${notification.isRead ? 'text-gray-700' : 'text-gray-900'}`}>
                                        {notification.title}
                                    </h4>
                                    <span className="text-xs font-medium text-gray-400 whitespace-nowrap">
                                        {new Date(notification.createdAt).toLocaleString('vi-VN', {
                                            hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <p className={`text-sm mt-1 leading-relaxed ${notification.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                                    {notification.message}
                                </p>
                            </div>

                            {/* Nút đánh dấu đã đọc */}
                            {!notification.isRead && (
                                <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"
                                    title="Đánh dấu đã đọc"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                </button>
                            )}

                            {/* Chấm xanh biểu thị chưa đọc */}
                            {!notification.isRead && (
                                <span className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded-full border-2 border-white"></span>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};