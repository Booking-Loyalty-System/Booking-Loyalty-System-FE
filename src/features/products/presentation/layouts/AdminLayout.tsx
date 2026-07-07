import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Building2,
    Package,
    Award,
    PieChart,
    FileSpreadsheet,
    Megaphone,
    Users,
    LogOut,
    ShieldCheck,
    MessageSquare,
    ChevronDown,
    Star,
    MessageCircle
} from 'lucide-react';

import { SidebarItem } from '../components/SidebarItem';
import { useAuth } from '../../application/useAuth.ts';

interface MenuItem {
    path?: string;
    label: string;
    icon: (isActive: boolean) => React.ReactNode;
    children?: {
        path: string;
        label: string;
        icon: React.ReactNode;
    }[];
}

export const AdminLayout: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    // Quản lý trạng thái đóng/mở của menu Feedback xổ xuống
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(
        location.pathname.startsWith('/admin/feedbacks') || location.pathname.startsWith('/admin/chat-feedbacks')
    );

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
            label: 'Analytics',
            icon: (isActive) => (
                <div className={`p-2 rounded-lg transition-all duration-300 group-hover:translate-x-1 ${isActive ? 'bg-[#8b5cf6] text-white shadow-md' : 'bg-violet-50 text-[#8b5cf6]'}`}>
                    <PieChart className="w-4 h-4" />
                </div>
            )
        },
        {
            path: '/admin/reports',
            label: 'Business Reports',
            icon: (isActive) => (
                <div className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 ${isActive ? 'bg-[#f43f5e] text-white shadow-md' : 'bg-rose-50 text-[#f43f5e]'}`}>
                    <FileSpreadsheet className="w-4 h-4" />
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
        },
        {
            label: 'Customer Feedbacks',
            icon: (isActive) => (
                <div className={`p-2 rounded-lg transition-all duration-300 group-hover:-translate-y-1 ${isActive ? 'bg-[#f59e0b] text-white shadow-md' : 'bg-amber-50 text-[#f59e0b]'}`}>
                    <MessageSquare className="w-4 h-4" />
                </div>
            ),
            children: [
                {
                    path: '/admin/feedbacks',
                    label: 'Booking Feedbacks',
                    icon: <Star className="w-3.5 h-3.5" />
                },
                {
                    path: '/admin/chat-feedbacks',
                    label: 'Chat Feedbacks',
                    icon: <MessageCircle className="w-3.5 h-3.5" />
                }
            ]
        }
    ];

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

                    <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 [&_span]:text-slate-300 hover:[&_span]:text-white [&_span]:transition-colors">
                        <div className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 mt-2">
                            Main Menu
                        </div>

                        {adminMenuItems.map((item, idx) => {
                            // Trường hợp menu có cấp con (Dropdown)
                            if (item.children) {
                                const isChildActive = item.children.some(child => location.pathname === child.path);
                                return (
                                    <div key={idx} className="flex flex-col w-full">
                                        <button
                                            onClick={() => setIsFeedbackOpen(!isFeedbackOpen)}
                                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-300 group ${isChildActive ? 'bg-slate-800/60 text-white' : 'text-slate-400 hover:bg-slate-800/40 hover:text-white'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                {item.icon(isChildActive)}
                                                <span className="text-sm font-semibold">{item.label}</span>
                                            </div>
                                            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isFeedbackOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {/* Container chứa sub-items với hiệu ứng trượt mở rộng */}
                                        <div className={`overflow-hidden transition-all duration-300 pl-11 space-y-1 mt-1 ${isFeedbackOpen ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
                                            {item.children.map((child) => {
                                                const isActive = location.pathname === child.path;
                                                return (
                                                    <Link
                                                        key={child.path}
                                                        to={child.path}
                                                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${isActive
                                                            ? 'text-amber-400 bg-amber-500/10'
                                                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                                                            }`}
                                                    >
                                                        {child.icon}
                                                        {child.label}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            }

                            // Trường hợp menu đơn bình thường
                            return (
                                <SidebarItem
                                    key={item.path}
                                    path={item.path!}
                                    label={item.label}
                                    icon={item.icon}
                                    isActive={location.pathname === item.path}
                                />
                            );
                        })}
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

            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <main className="flex-1 overflow-y-auto p-8 bg-slate-50 relative scroll-smooth">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};