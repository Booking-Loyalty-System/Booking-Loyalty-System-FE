import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { toast } from 'sonner';
import {
    LayoutDashboard, Car, Radio, Award, Gift, Megaphone, History, Bell, Search, Settings, LogOut, Sun, Moon
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SidebarItem } from '../components/SidebarItem';
import { ProfileDropdown } from '../components/ProfileDropdown';
import { TierUpgradeModal } from '../components/TierUpgradeModal';
import { useLanguage } from '@/core/context/LanguageContext.tsx';
import { useTheme } from '@/core/context/ThemeContext.tsx';

// Đưa các Hook chuẩn kiến trúc của bạn vào đây
import { useAuth } from '../../application/useAuth.ts';
import { useBooking } from '../../application/useBooking.ts';
import {useNotification} from "@/features/products/application/useNotification.ts";

interface MenuItem {
    path: string;
    label: string;
    icon: (isActive: boolean) => React.ReactNode;
}

export const CustomerLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { t } = useTranslation('common');
    const { language, toggleLanguage } = useLanguage();
    const { toggleTheme, isDark } = useTheme();

    // 🌟 Lấy dữ liệu từ các Application Hook chuẩn của hệ thống
    const { logout, userId } = useAuth();
    const { myBookings, isLoading } = useBooking();
    const { unreadCount } = useNotification();
    // 🌟 Kiểm tra thời gian thực: Có lịch đặt nào đang được rửa (InProgress) hay không?
    const hasInProgressBooking = !isLoading && myBookings.some(booking => booking.status === 'InProgress');

    // 🌟 THIẾT LẬP SIGNALR ĐỂ ĐỒNG BỘ DATA REALTIME
    useEffect(() => {
        if (!userId) return;

        const connection = new HubConnectionBuilder()
            .withUrl('https://localhost:7001/hubs/booking', {
                accessTokenFactory: () => localStorage.getItem('access_token') || ''
            })
            .configureLogging(LogLevel.Warning)
            .withAutomaticReconnect()
            .build();

        const startSignalR = async () => {
            try {
                await connection.start();
                await connection.invoke('JoinCustomerGroup', userId);

                connection.on('BookingStatusChanged', (data: { bookingId: string, status: string }) => {
                    console.log("🔔 [SignalR] Nhận được tín hiệu thay đổi trạng thái:", data);
                    const currentStatus = data?.status;

                    if (currentStatus === 'InProgress') {
                        toast.success('Your vehicle has entered the service bay! Opening Live Tracking...', { icon: '🚗' });
                    } else {
                        toast.info(`Current order status: ${currentStatus}`, { icon: 'ℹ️' });
                    }
                    queryClient.invalidateQueries({ queryKey: ['my_bookings'] });
                });
            } catch (err) {
                if (err instanceof Error) {
                    if (err.name === 'AbortError' || err.message.includes('stopped during negotiation')) {
                        console.log("⏱️ [SignalR] Tiến trình bắt tay cũ bị hủy do React Remount (Strict Mode), đang kết nối lại...");
                    } else {
                        console.error('❌ SignalR Connection Error thực sự: ', err);
                    }
                } else {
                    console.error('❌ SignalR gặp lỗi lạ: ', err);
                }
            }
        };

        startSignalR();

        return () => {
            connection.off('BookingStatusChanged');
            // 🔥 CHỈ GỌI STOP KHI ĐANG TRONG TRẠNG THÁI KẾT NỐI HỢP LỆ
            if (connection.state === 'Connected' || connection.state === 'Connecting') {
                connection.stop().catch(() => {});
            }
        };
    }, [userId, queryClient]);

    // Mảng Menu gốc của bạn
    const rawMenuItems: MenuItem[] = [
        {
            path: '/dashboard',
            label: t('sidebar.dashboard'),
            icon: (isActive) => (
                <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 ${isActive ? 'bg-[#1e6ffd] text-white shadow-sm' : 'bg-blue-50 text-[#1e6ffd]'}`}>
                    <LayoutDashboard className="w-4 h-4" />
                </div>
            )
        },
        {
            path: '/book-wash',
            label: t('sidebar.bookWash'),
            icon: (isActive) => (
                <div className={`p-2 rounded-lg transition-all duration-300 group-hover:translate-x-1 ${isActive ? 'bg-[#10b981] text-white shadow-sm' : 'bg-emerald-50 text-[#10b981]'}`}>
                    <Car className="w-4 h-4" />
                </div>
            )
        },
        {
            path: '/live-tracking',
            label: t('sidebar.liveTracking'),
            icon: (isActive) => (
                <div className={`p-2 rounded-lg ${isActive ? 'bg-red-500 text-white shadow-sm' : 'bg-red-50 text-red-500'}`}>
                    <Radio className="w-4 h-4 animate-pulse" />
                </div>
            )
        },
        {
            path: '/loyalty-tier',
            label: t('sidebar.loyaltyTier'),
            icon: (isActive) => (
                <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 ${isActive ? 'bg-[#f59e0b] text-white shadow-sm' : 'bg-amber-50 text-[#f59e0b]'}`}>
                    <Award className="w-4 h-4" />
                </div>
            )
        },
        {
            path: '/rewards',
            label: t('sidebar.rewards'),
            icon: (isActive) => (
                <div className={`p-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-pink-500 text-white shadow-sm' : 'bg-pink-50 text-pink-500 group-hover:animate-bounce'}`}>
                    <Gift className="w-4 h-4" />
                </div>
            )
        },
        {
            path: '/promotions',
            label: t('sidebar.promotions'),
            icon: (isActive) => (
                <div className={`p-2 rounded-lg transition-all duration-300 group-hover:-rotate-12 ${isActive ? 'bg-[#a855f7] text-white shadow-sm' : 'bg-purple-50 text-[#a855f7]'}`}>
                    <Megaphone className="w-4 h-4" />
                </div>
            )
        },
        {
            path: '/booking-history',
            label: t('sidebar.bookingHistory'),
            icon: (isActive) => (
                <div className={`p-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-[#06b6d4] text-white shadow-sm' : 'bg-cyan-50 text-[#06b6d4]'}`}>
                    <History className="w-4 h-4" />
                </div>
            )
        },
        {
            path: '/my-vehicles',
            label: t('sidebar.myVehicles'),
            icon: (isActive) => (
                <div className={`p-2 rounded-lg transition-all duration-300 group-hover:translate-x-0.5 ${isActive ? 'bg-[#14b8a6] text-white shadow-sm' : 'bg-teal-50 text-[#14b8a6]'}`}>
                    <Car className="w-4 h-4" />
                </div>
            )
        },
        {
            path: '/notifications',
            label: t('sidebar.notifications'),
            icon: (isActive) => (
                <div className={`p-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-slate-700 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}>
                    <Bell className="w-4 h-4" />
                </div>
            )
        },
        {
            path: '/settings',
            label: t('sidebar.settings'),
            icon: (isActive) => (
                <div className={`p-2 rounded-lg transition-all duration-300 group-hover:rotate-45 ${isActive ? 'bg-blue-600 text-white shadow-sm' : 'bg-blue-50 text-blue-600'}`}>
                    <Settings className="w-4 h-4" />
                </div>
            )
        }
    ];

    // 🌟 LỌC MENU: Nếu không có lịch InProgress, loại bỏ hẳn mục Live Tracking khỏi thanh Sidebar
    const menuItems = rawMenuItems.filter(item => item.path !== '/live-tracking' || hasInProgressBooking);

    const titleMap: Record<string, string> = {
        '/dashboard': t('header.dashboard'),
        '/book-wash': t('header.bookAWash'),
        '/live-tracking': t('header.liveTracking'),
        '/loyalty-tier': t('header.loyaltyTier'),
        '/rewards': t('header.rewards'),
        '/promotions': t('header.promotions'),
        '/booking-history': t('header.bookingHistory'),
        '/my-vehicles': t('header.myVehicles'),
        '/notifications': t('header.notificationCenter'),
        '/settings': t('header.profileSettings'),
    };

    const currentTitle = titleMap[location.pathname] || 'AutoWash Pro';

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="flex h-screen w-screen bg-[#f8fafc] dark:bg-slate-950 overflow-hidden antialiased">
            {/* SIDEBAR */}
            <aside className="w-64 bg-white dark:bg-slate-900 border-r border-[#e2e8f0] dark:border-slate-800 flex flex-col justify-between p-4 shrink-0 h-full">
                <div className="flex flex-col h-[calc(100vh-80px)]">
                    <div className="flex items-center gap-3 px-2 py-4 mb-4">
                        <div className="w-10 h-10 bg-[#1e6ffd] rounded-xl flex items-center justify-center text-white shadow-md">
                            <Radio className="w-5 h-5 text-white animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[#0f172a] dark:text-white leading-tight">{t('sidebar.appName')}</h2>
                            <p className="text-xs text-[#94a3b8] font-medium">{t('sidebar.tagline')}</p>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
                        {menuItems.map((item) => (
                            <SidebarItem
                                key={item.path}
                                path={item.path}
                                label={item.label}
                                icon={item.icon}
                                isActive={location.pathname === item.path}
                            />
                        ))}
                    </nav>
                </div>

                <div className="pt-2 border-t border-[#f1f5f9] dark:border-slate-800 space-y-2">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all duration-200 group"
                    >
                        <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-600 group-hover:scale-110 transition-transform">
                            <LogOut className="w-4 h-4" />
                        </div>
                        <span>{t('sidebar.logout')}</span>
                    </button>
                    <div className="text-center text-[11px] text-[#94a3b8] font-medium">
                        {t('sidebar.copyright')}
                    </div>
                </div>
            </aside>

            {/* CONTENT */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="h-16 bg-white dark:bg-slate-900 border-b border-[#e2e8f0] dark:border-slate-800 flex items-center justify-between px-8 shrink-0">
                    <div className="animate-fade-in">
                        <h1 className="text-2xl font-bold text-[#0f172a] dark:text-white">{currentTitle}</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="w-72 relative">
                            <input
                                type="text"
                                placeholder={t('header.searchPlaceholder')}
                                className="w-full bg-[#f1f5f9] dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500 border border-transparent dark:border-slate-700 rounded-xl py-2 pl-4 pr-10 text-sm focus:outline-none focus:bg-white dark:focus:bg-slate-700 focus:border-[#1e6ffd] transition-all"
                            />
                            <Search className="w-4 h-4 text-[#94a3b8] absolute right-3 top-1/2 -translate-y-1/2" />
                        </div>

                        {/* Theme Toggle Button */}
                        <button
                            id="theme-toggle-header"
                            onClick={toggleTheme}
                            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                            className="flex items-center justify-center p-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-all duration-200 cursor-pointer"
                        >
                            {isDark ? (
                                <Sun className="w-4 h-4 text-amber-500" />
                            ) : (
                                <Moon className="w-4 h-4 text-blue-600" />
                            )}
                        </button>

                        {/* Language Toggle Button */}
                        <button
                            id="language-toggle-header"
                            onClick={toggleLanguage}
                            title={`${t('language.switchTo')} ${language === 'en' ? t('language.vi') : t('language.en')}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-all duration-200"
                        >
                            <span className="text-base leading-none">{language === 'en' ? '🇺🇸' : '🇻🇳'}</span>
                            <span className="uppercase tracking-wide">{language === 'en' ? 'EN' : 'VI'}</span>
                        </button>

                        <button
                            onClick={() => navigate('/notifications')}
                            className={`relative p-2 rounded-xl transition-all duration-200 focus:outline-none ${location.pathname === '/notifications' ? 'bg-[#f1f5f9] text-[#0f172a]' : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]'}`}
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white shadow-sm">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                        </button>

                        <ProfileDropdown />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 bg-[#f8fafc] dark:bg-slate-950">
                    <Outlet />
                </main>
            </div>

            {/* Modal thông báo thăng hạng đặt ở Layout để luôn sẵn sàng */}
            <TierUpgradeModal />
        </div>
    );
};