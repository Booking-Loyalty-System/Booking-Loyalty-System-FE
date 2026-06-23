import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { toast } from 'sonner'; // Hoặc bất kỳ thư viện toast nào bạn dùng
import {
    LayoutDashboard, Car, Radio, Award, Gift, Megaphone, History, Bell, Search, Settings, LogOut
} from 'lucide-react';
import { SidebarItem } from '../components/SidebarItem';
import { ProfileDropdown } from '../components/ProfileDropdown';
import { TierUpgradeModal } from '../components/TierUpgradeModal';

// Đưa các Hook chuẩn kiến trúc của bạn vào đây
import { useAuth } from '../../application/useAuth.ts';
import { useBooking } from '../../application/useBooking.ts';

interface MenuItem {
    path: string;
    label: string;
    icon: (isActive: boolean) => React.ReactNode;
}

export const CustomerLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // 🌟 Lấy dữ liệu từ các Application Hook chuẩn của hệ thống
    const { logout, userId } = useAuth();
    const { myBookings, isLoading } = useBooking();

    // 🌟 Kiểm tra thời gian thực: Có lịch đặt nào đang được rửa (InProgress) hay không?
    const hasInProgressBooking = !isLoading && myBookings.some(booking => booking.status === 'InProgress');

    // 🌟 THIẾT LẬP SIGNALR ĐỂ ĐỒNG BỘ DATA REALTIME
    useEffect(() => {
        if (!userId) return;

        // Cấu hình endpoint kết nối tới cổng Hub của Backend
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
                // Đăng ký định danh Client vào Group riêng trên Server
                await connection.invoke('JoinCustomerGroup', userId);

                // Lắng nghe tín hiệu thay đổi trạng thái tự động từ Backend gửi về
                connection.on('BookingStatusChanged', (data: { bookingId: string, status: string }) => {
                    console.log("🔔 [SignalR] Nhận được tín hiệu thay đổi trạng thái:", data);
                    const currentStatus = data?.status;

                    if (currentStatus === 'InProgress') {
                        toast.success('Your vehicle has entered the service bay! Opening Live Tracking...', { icon: '🚗' });
                    } else {
                        toast.info(`Current order status: ${currentStatus}`, { icon: 'ℹ️' });
                    }
                    console.log("🔄 Ép React Query gọi lại API getMyBookings...");
                    queryClient.invalidateQueries({ queryKey: ['my_bookings'] });
                });
            } catch (err) {
                console.error('SignalR Connection Error: ', err);
            }
        };

        startSignalR();

        // Ngắt kết nối khi Component bị huỷ (Unmount) để tránh rò rỉ bộ nhớ
        return () => {
            connection.off('BookingStatusChanged');
            connection.stop();
        };
    }, [userId, queryClient]);

    // Mảng Menu gốc của bạn
    const rawMenuItems: MenuItem[] = [
        {
            path: '/dashboard',
            label: 'Dashboard',
            icon: (isActive) => (
                <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 ${isActive ? 'bg-[#1e6ffd] text-white shadow-sm' : 'bg-blue-50 text-[#1e6ffd]'}`}>
                    <LayoutDashboard className="w-4 h-4" />
                </div>
            )
        },
        {
            path: '/book-wash',
            label: 'Book Wash',
            icon: (isActive) => (
                <div className={`p-2 rounded-lg transition-all duration-300 group-hover:translate-x-1 ${isActive ? 'bg-[#10b981] text-white shadow-sm' : 'bg-emerald-50 text-[#10b981]'}`}>
                    <Car className="w-4 h-4" />
                </div>
            )
        },
        {
            path: '/live-tracking',
            label: 'Live Tracking',
            icon: (isActive) => (
                <div className={`p-2 rounded-lg ${isActive ? 'bg-red-500 text-white shadow-sm' : 'bg-red-50 text-red-500'}`}>
                    <Radio className="w-4 h-4 animate-pulse" />
                </div>
            )
        },
        {
            path: '/loyalty-tier',
            label: 'Loyalty & Tier',
            icon: (isActive) => (
                <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 ${isActive ? 'bg-[#f59e0b] text-white shadow-sm' : 'bg-amber-50 text-[#f59e0b]'}`}>
                    <Award className="w-4 h-4" />
                </div>
            )
        },
        {
            path: '/rewards',
            label: 'Rewards',
            icon: (isActive) => (
                <div className={`p-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-pink-500 text-white shadow-sm' : 'bg-pink-50 text-pink-500 group-hover:animate-bounce'}`}>
                    <Gift className="w-4 h-4" />
                </div>
            )
        },
        {
            path: '/promotions',
            label: 'Promotions',
            icon: (isActive) => (
                <div className={`p-2 rounded-lg transition-all duration-300 group-hover:-rotate-12 ${isActive ? 'bg-[#a855f7] text-white shadow-sm' : 'bg-purple-50 text-[#a855f7]'}`}>
                    <Megaphone className="w-4 h-4" />
                </div>
            )
        },
        {
            path: '/booking-history',
            label: 'Booking History',
            icon: (isActive) => (
                <div className={`p-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-[#06b6d4] text-white shadow-sm' : 'bg-cyan-50 text-[#06b6d4]'}`}>
                    <History className="w-4 h-4" />
                </div>
            )
        },
        {
            path: '/my-vehicles',
            label: 'My Vehicles',
            icon: (isActive) => (
                <div className={`p-2 rounded-lg transition-all duration-300 group-hover:translate-x-0.5 ${isActive ? 'bg-[#14b8a6] text-white shadow-sm' : 'bg-teal-50 text-[#14b8a6]'}`}>
                    <Car className="w-4 h-4" />
                </div>
            )
        },
        {
            path: '/notifications',
            label: 'Notifications',
            icon: (isActive) => (
                <div className={`p-2 rounded-lg transition-all duration-300 ${isActive ? 'bg-slate-700 text-white shadow-sm' : 'bg-slate-100 text-slate-600'}`}>
                    <Bell className="w-4 h-4" />
                </div>
            )
        },
        {
            path: '/settings',
            label: 'Settings',
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
        '/dashboard': 'Dashboard',
        '/book-wash': 'Book a Wash',
        '/live-tracking': 'Live Tracking Status',
        '/loyalty-tier': 'Your Loyalty & Tier',
        '/rewards': 'Available Rewards',
        '/promotions': 'Special Promotions',
        '/booking-history': 'Booking History',
        '/my-vehicles': 'My Garage / Vehicles',
        '/notifications': 'Notification Center',
        '/settings': 'Profile Settings',
    };

    const currentTitle = titleMap[location.pathname] || 'AutoWash Pro';

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="flex h-screen w-screen bg-[#f8fafc] overflow-hidden antialiased">
            {/* SIDEBAR */}
            <aside className="w-64 bg-white border-r border-[#e2e8f0] flex flex-col justify-between p-4 shrink-0 h-full">
                <div className="flex flex-col h-[calc(100vh-80px)]">
                    <div className="flex items-center gap-3 px-2 py-4 mb-4">
                        <div className="w-10 h-10 bg-[#1e6ffd] rounded-xl flex items-center justify-center text-white shadow-md">
                            <Radio className="w-5 h-5 text-white animate-pulse" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[#0f172a] leading-tight">AutoWash Pro</h2>
                            <p className="text-xs text-[#94a3b8] font-medium">Smart Car Wash</p>
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

                <div className="pt-2 border-t border-[#f1f5f9] space-y-2">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200 group"
                    >
                        <div className="p-2 rounded-lg bg-rose-50 text-rose-600 group-hover:scale-110 transition-transform">
                            <LogOut className="w-4 h-4" />
                        </div>
                        <span>Logout</span>
                    </button>
                    <div className="text-center text-[11px] text-[#94a3b8] font-medium">
                        © 2026 AutoWash Pro
                    </div>
                </div>
            </aside>

            {/* CONTENT */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <header className="h-16 bg-white border-b border-[#e2e8f0] flex items-center justify-between px-8 shrink-0">
                    <div className="animate-fade-in">
                        <h1 className="text-2xl font-bold text-[#0f172a]">{currentTitle}</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="w-72 relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full bg-[#f1f5f9] border border-transparent rounded-xl py-2 pl-4 pr-10 text-sm focus:outline-none focus:bg-white focus:border-[#1e6ffd] transition-all"
                            />
                            <Search className="w-4 h-4 text-[#94a3b8] absolute right-3 top-1/2 -translate-y-1/2" />
                        </div>

                        <button
                            onClick={() => navigate('/notifications')}
                            className={`relative p-2 rounded-xl transition-all duration-200 focus:outline-none ${location.pathname === '/notifications' ? 'bg-[#f1f5f9] text-[#0f172a]' : 'text-[#64748b] hover:text-[#0f172a] hover:bg-[#f1f5f9]'}`}
                        >
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        </button>

                        <ProfileDropdown />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
                    <Outlet />
                </main>
            </div>
            
            {/* Modal thông báo thăng hạng đặt ở Layout để luôn sẵn sàng */}
            <TierUpgradeModal />
        </div>
    );
};