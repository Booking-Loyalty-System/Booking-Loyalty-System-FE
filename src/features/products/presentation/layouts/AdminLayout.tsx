import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Building2,
    Package,
    Award,
    PieChart,
    Megaphone,
    Users,
    Settings,
    LogOut,
    Bell,
    Search,
    ShieldCheck
} from 'lucide-react';

import { SidebarItem } from '../components/SidebarItem';
import { ProfileDropdown } from '../components/ProfileDropdown';

import { useAuth } from '../../application/useAuth.ts';
import { useNotification } from '@/features/products/application/useNotification.ts';

interface MenuItem {
    path: string;
    label: string;
    icon: (isActive: boolean) => React.ReactNode;
}

export const AdminLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { unreadCount } = useNotification();

    const adminMenuItems: MenuItem[] = [
        {
            path: '/admin',
            label: 'Overview',
            icon: (isActive) => (
                <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 ${isActive ? 'bg-[#1e6ffd] text-white shadow-md' : 'bg-blue-50 text-[#1e6ffd]'}`}>
                    <LayoutDashboard className="w-4 h-4" />
                </div>
            )
        },
        {
            path: '/admin/branches',
            label: 'Branches',
            icon: (isActive) => (
                <div className={`p-2 rounded-lg transition-all duration-300 group-hover:-translate-y-1 ${isActive ? 'bg-[#6366f1] text-white shadow-md' : 'bg-indigo-50 text-[#6366f1]'}`}>
                    <Building2 className="w-4 h-4" />
                </div>
            )
        },
        {
            path: '/admin/packages',
            label: 'Wash Packages',
            icon: (isActive) => (
                <div className={`p-2 rounded-lg transition-all duration-300 group-hover:rotate-12 ${isActive ? 'bg-[#14b8a6] text-white shadow-md' : 'bg-teal-50 text-[#14b8a6]'}`}>
                    <Package className="w-4 h-4" />
                </div>
            )
        },
        {
            path: '/admin/loyalty',
            label: 'Loyalty Tiers',
            icon: (isActive) => (
                <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 ${isActive ? 'bg-[#f59e0b] text-white shadow-md' : 'bg-amber-50 text-[#f59e0b]'}`}>
                    <Award className="w-4 h-4" />
                </div>
            )
        },
        {
            path: '/admin/analytics',
            label: 'Analytics & Reports',
            icon: (isActive) => (
                <div className={`p-2 rounded-lg transition-all duration-300 group-hover:translate-x-1 ${isActive ? 'bg-[#8b5cf6] text-white shadow-md' : 'bg-violet-50 text-[#8b5cf6]'}`}>
                    <PieChart className="w-4 h-4" />
                </div>
            )
        },
        {
            path: '/admin/promotions',
            label: 'Promotions',
            icon: (isActive) => (
                <div className={`p-2 rounded-lg transition-all duration-300 group-hover:-rotate-12 ${isActive ? 'bg-[#ec4899] text-white shadow-md' : 'bg-pink-50 text-[#ec4899]'}`}>
                    <Megaphone className="w-4 h-4" />
                </div>
            )
        },
        {
            path: '/admin/staff',
            label: 'Staff Management',
            icon: (isActive) => (
                <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 ${isActive ? 'bg-[#10b981] text-white shadow-md' : 'bg-emerald-50 text-[#10b981]'}`}>
                    <Users className="w-4 h-4" />
                </div>
            )
        }
    ];

    const titleMap: Record<string, string> = {
        '/admin': 'Admin Dashboard',
        '/admin/branches': 'Branch Management',
        '/admin/packages': 'Service Packages',
        '/admin/loyalty': 'Loyalty Programs',
        '/admin/reports': 'System Reports',
        '/admin/analytics': 'Business Analytics',
        '/admin/promotions': 'Marketing Campaigns',
        '/admin/staff': 'Staff & HR Management',
    };

    const currentTitle = titleMap[location.pathname] || 'Admin Portal';

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="flex h-screen w-screen bg-[#f8fafc] overflow-hidden antialiased">
            {/* SIDEBAR BÊN TRÁI */}
            <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0 h-full">
                <div className="flex flex-col h-[calc(100vh-80px)]">

                    <div className="flex items-center gap-3 px-2 py-4 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white leading-tight tracking-wide">AutoWash</h2>
                            <p className="text-[11px] text-blue-400 font-bold uppercase tracking-widest mt-0.5">Admin Portal</p>
                        </div>
                    </div>

                    {/* Mẹo Tailwind ở đây: Sử dụng `[&_span]:text-slate-300` và `hover:[&_span]:text-white`
                        để đổi màu văn bản bên trong SidebarItem mà không cần truyền className */}
                    <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 [&_span]:text-slate-300 hover:[&_span]:text-white [&_span]:transition-colors">
                        <div className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 mt-2">
                            Main Menu
                        </div>
                        {adminMenuItems.map((item) => (
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

                <div className="pt-4 border-t border-slate-800/50 space-y-2 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-3 text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl transition-all duration-300 group"
                    >
                        <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 group-hover:scale-110 transition-transform">
                            <LogOut className="w-4 h-4" />
                        </div>
                        <span>Secure Logout</span>
                    </button>
                    <div className="text-center text-[10px] text-slate-500 font-medium tracking-wide">
                        © 2026 AUTOWASH HQ
                    </div>
                </div>
            </aside>

            {/* KHU VỰC NỘI DUNG CHÍNH */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-10">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{currentTitle}</h1>
                        <p className="text-sm text-slate-500 font-medium mt-0.5">Manage your business operations</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="w-80 relative hidden md:block">
                            <input
                                type="text"
                                placeholder="Search users, bookings, or branches..."
                                className="w-full bg-slate-100 border border-transparent rounded-full py-2.5 pl-5 pr-10 text-sm font-medium focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                            />
                            <Search className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
                        </div>

                        <button
                            onClick={() => navigate('/admin/notifications')}
                            className="relative p-2.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-all duration-200 focus:outline-none"
                        >
                            <Bell className="w-5 h-5" />
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white border-2 border-white shadow-sm animate-bounce">
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </span>
                            )}
                        </button>

                        <button className="p-2.5 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-all duration-200">
                            <Settings className="w-5 h-5 hover:rotate-90 transition-transform duration-500" />
                        </button>

                        <div className="h-8 w-px bg-slate-200 mx-2"></div>
                        <ProfileDropdown />
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-8 bg-slate-50 relative scroll-smooth">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};