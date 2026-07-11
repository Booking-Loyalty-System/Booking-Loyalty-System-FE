import React from 'react';
import { Bell, CheckCircle, Clock, Info } from 'lucide-react';
import { useNotification } from '../../application/useNotification';
import { useTranslation } from 'react-i18next';

interface NotificationItem {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    type: 'Booking' | 'System' | string;
    createdAt: string | Date;
}

export const NotificationCenter: React.FC = () => {
    const { t } = useTranslation('customer');
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
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('notifications.title')}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{t('notifications.markAllRead')}</p>
                </div>
            </div>

            <div className="space-y-4">
                {notifications.length === 0 ? (
                    <div className="bg-white dark:bg-[#111] rounded-[2.5rem] p-12 text-center border border-slate-200 dark:border-white/5 shadow-sm">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100 dark:border-white/10">
                            <Bell className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300">{t('notifications.empty.title')}</h3>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">{t('notifications.empty.description')}</p>
                    </div>
                ) : (
                    notifications.map((notification: NotificationItem) => (
                        <div
                            key={notification.id}
                            className={`relative p-5 rounded-[2rem] border transition-all duration-300 flex gap-4 items-start ${
                                notification.isRead
                                    ? 'bg-white dark:bg-[#111] border-gray-100 dark:border-white/5 opacity-75'
                                    : 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-500/20 shadow-sm'
                            }`}
                        >
                            {/* Icon dựa trên trạng thái */}
                            <div className={`p-3 rounded-xl shrink-0 ${notification.isRead ? 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400' : 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'}`}>
                                {notification.type === 'Booking' ? <Clock className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                            </div>

                            <div className="flex-1 pt-1">
                                <div className="flex justify-between items-start gap-2">
                                    <h4 className={`text-base font-bold tracking-tight ${notification.isRead ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                                        {notification.title}
                                    </h4>
                                    <span className="text-xs font-medium text-gray-400 dark:text-gray-500 whitespace-nowrap bg-white/50 dark:bg-black/20 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-white/5">
                                        {new Date(notification.createdAt).toLocaleString('vi-VN', {
                                            hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <p className={`text-sm mt-1.5 leading-relaxed ${notification.isRead ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                    {notification.message}
                                </p>
                            </div>

                            {/* Nút đánh dấu đã đọc */}
                            {!notification.isRead && (
                                <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 transition-colors mt-1"
                                    title={t('notifications.markAsRead')}
                                >
                                    <CheckCircle className="w-5 h-5" />
                                </button>
                            )}

                            {/* Chấm xanh biểu thị chưa đọc */}
                            {!notification.isRead && (
                                <span className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-blue-600 dark:bg-blue-500 rounded-full border-2 border-white dark:border-[#111]"></span>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};