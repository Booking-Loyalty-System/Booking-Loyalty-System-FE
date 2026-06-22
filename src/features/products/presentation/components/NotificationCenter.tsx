import React, { useState } from 'react';
import { Calendar, Sparkles, Gift, ShieldAlert, Check, X } from 'lucide-react';

interface NotificationItem {
    id: string;
    type: 'booking' | 'loyalty' | 'promotion' | 'system';
    title: string;
    message: string;
    timeAgo: string;
    isUnread: boolean;
    actionLabel?: string;
}

export const NotificationCenter: React.FC = () => {
    const [activeTab, setActiveTab] = useState('All (8)');

    const tabs = [
        { label: 'All (8)', key: 'all' },
        { label: 'Bookings (3)', key: 'booking' },
        { label: 'Loyalty (3)', key: 'loyalty' },
        { label: 'Promotions (1)', key: 'promotion' },
        { label: 'System (1)', key: 'system' }
    ];

    const [notifications, setNotifications] = useState<NotificationItem[]>(
        [
            {
                id: 'BK12355',
                type: 'booking',
                title: 'Booking Confirmed',
                message: 'Your Premium Wash for Mon May 26 at 10:00 AM has been confirmed. Booking ID: BK12355',
                timeAgo: '6d ago',
                isUnread: true,
                actionLabel: 'View Booking'
            },
            {
                id: 'LY7721',
                type: 'loyalty',
                title: 'Points Expiring Soon!',
                message: '150 loyalty points worth 100.000đ will expire on June 1, 2026. Redeem them before they expire!',
                timeAgo: '5/25/2026',
                isUnread: true,
                actionLabel: 'Redeem Now'
            },
            {
                id: 'PR9910',
                type: 'promotion',
                title: 'Exclusive Gold Member Deal',
                message: 'Get 25% off Ceramic Wash this weekend! Use code GOLD25 at checkout.',
                timeAgo: '5/24/2026',
                isUnread: true
            }
        ]
    );

    const handleMarkAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isUnread: false } : n));
    };

    const handleDismiss = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className="w-full space-y-6 font-sans text-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <p className="text-sm text-slate-500 font-medium mt-1">You have 3 unread notifications</p>
                </div>
                <button className="bg-blue-600 text-white font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-blue-700 active:scale-95 transition shadow-sm">
                    Mark All as Read
                </button>
            </div>

            {/* Tabs Danh Mục */}
            <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.label}
                        onClick={() => setActiveTab(tab.label)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                            activeTab === tab.label
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Danh sách Thẻ Thông Báo */}
            <div className="space-y-4">
                {notifications.map((item) => (
                    <div
                        key={item.id}
                        className={`bg-white rounded-2xl p-5 border transition-all relative flex gap-4 ${
                            item.isUnread ? 'border-blue-400 ring-2 ring-blue-500/5 shadow-sm' : 'border-slate-100 shadow-none'
                        }`}
                    >
                        {/* Cột Icon phân biệt loại thông báo */}
                        <div className="shrink-0">
                            {item.type === 'booking' && (
                                <div className="w-11 h-11 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                                    <Calendar className="w-5 h-5" />
                                </div>
                            )}
                            {item.type === 'loyalty' && (
                                <div className="w-11 h-11 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                            )}
                            {item.type === 'promotion' && (
                                <div className="w-11 h-11 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                                    <Gift className="w-5 h-5" />
                                </div>
                            )}
                            {item.type === 'system' && (
                                <div className="w-11 h-11 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
                                    <ShieldAlert className="w-5 h-5" />
                                </div>
                            )}
                        </div>

                        {/* Nội dung text thông tin */}
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                                    {item.isUnread && <span className="w-2 h-2 bg-blue-600 rounded-full"></span>}
                                </div>
                                <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                  <span className="opacity-60">🕒</span> {item.timeAgo}
                </span>
                            </div>

                            <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-4xl">{item.message}</p>

                            {/* Thanh hành động đi kèm nếu có */}
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                {item.actionLabel && (
                                    <button className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-blue-700 transition">
                                        {item.actionLabel}
                                    </button>
                                )}
                                {item.isUnread && (
                                    <button
                                        onClick={() => handleMarkAsRead(item.id)}
                                        className="border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 text-xs font-bold px-4 py-2 rounded-xl transition inline-flex items-center gap-1"
                                    >
                                        <Check className="w-3.5 h-3.5 text-slate-400" />
                                        <span>Mark as Read</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Nút đóng/gỡ bỏ thông báo */}
                        <button
                            onClick={() => handleDismiss(item.id)}
                            className="absolute right-4 bottom-4 sm:top-5 sm:bottom-auto text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};