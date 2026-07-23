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
    LogOut,
    ShieldCheck,
    MessageSquare,
    ChevronDown,
    Star,
    MessageCircle
} from 'lucide-react';

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

    const [isFeedbackOpen, setIsFeedbackOpen] = useState(
        location.pathname.startsWith('/admin/feedbacks') || location.pathname.startsWith('/admin/chat-feedbacks')
    );

    const adminMenuItems: MenuItem[] = [
        {
            path: '/admin',
            label: 'Overview',
            icon: (isActive) => (
                <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-white/20" : "bg-slate-100 dark:bg-white/5 group-hover:bg-white dark:group-hover:bg-white/10"}`}>
                    <LayoutDashboard className="w-4 h-4" />
                </div>
            )
        },
        {
            path: '/admin/branches',
            label: 'Branches',
            icon: (isActive) => (
                <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-white/20" : "bg-slate-100 dark:bg-white/5 group-hover:bg-white dark:group-hover:bg-white/10"}`}>
                    <Building2 className="w-4 h-4" />
                </div>
            )
        },
        {
            path: '/admin/packages',
            label: 'Wash Packages',
            icon: (isActive) => (
                <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-white/20" : "bg-slate-100 dark:bg-white/5 group-hover:bg-white dark:group-hover:bg-white/10"}`}>
                    <Package className="w-4 h-4" />
                </div>
            )
        },
        {
            path: '/admin/loyalty',
            label: 'Loyalty Tiers',
            icon: (isActive) => (
                <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-white/20" : "bg-slate-100 dark:bg-white/5 group-hover:bg-white dark:group-hover:bg-white/10"}`}>
                    <Award className="w-4 h-4" />
                </div>
            )
        },
        {
            path: '/admin/analytics',
            label: 'Analytics',
            icon: (isActive) => (
                <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-white/20" : "bg-slate-100 dark:bg-white/5 group-hover:bg-white dark:group-hover:bg-white/10"}`}>
                    <PieChart className="w-4 h-4" />
                </div>
            )
        },
        {
            path: '/admin/reports',
            label: 'Business Reports',
            icon: (isActive) => (
                <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-white/20" : "bg-slate-100 dark:bg-white/5 group-hover:bg-white dark:group-hover:bg-white/10"}`}>
                    <FileSpreadsheet className="w-4 h-4" />
                </div>
            )
        },
        {
            path: '/admin/promotions',
            label: 'Promotions',
            icon: (isActive) => (
                <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-white/20" : "bg-slate-100 dark:bg-white/5 group-hover:bg-white dark:group-hover:bg-white/10"}`}>
                    <Megaphone className="w-4 h-4" />
                </div>
            )
        },
        {
            label: 'Customer Feedbacks',
            icon: (isActive) => (
                <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-white/20" : "bg-slate-100 dark:bg-white/5 group-hover:bg-white dark:group-hover:bg-white/10"}`}>
                    <MessageSquare className="w-4 h-4" />
                </div>
            ),
            children: [
                {
                    path: '/admin/feedbacks',
                    label: 'Booking Feedbacks',
                    icon: <Star className="w-4 h-4" />
                },
                {
                    path: '/admin/chat-feedbacks',
                    label: 'Chat Feedbacks',
                    icon: <MessageCircle className="w-4 h-4" />
                }
            ]
        }
    ];

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="flex h-screen w-screen bg-[#fafafa] dark:bg-[#050505] overflow-hidden antialiased font-sans">
            {/* Background Glow */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten z-0"></div>

            {/* SIDEBAR BÊN TRÁI - Premium Glassmorphic (Staff Style) */}
            <aside className="w-72 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-2xl border-r border-slate-200/60 dark:border-white/5 flex flex-col p-5 shrink-0 h-full relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)] transition-all duration-300">
                <div className="flex flex-col flex-1 min-h-0">
                    {/* Logo Section */}
                    <div className="flex items-center gap-4 px-2 py-3 mb-6 shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 tracking-tight leading-none">
                                AutoWash
                            </h1>
                            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest mt-1">
                                Admin Portal
                            </p>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
                        <div className="px-3 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-3 mt-1">
                            Management
                        </div>

                        {adminMenuItems.map((item, idx) => {
                            if (item.children) {
                                const isChildActive = item.children.some(child => location.pathname === child.path);
                                return (
                                    <div key={idx} className="flex flex-col w-full">
                                        <button
                                            onClick={() => setIsFeedbackOpen(!isFeedbackOpen)}
                                            className={`w-full flex items-center justify-between px-3 py-3 rounded-2xl transition-all duration-300 font-bold text-sm group ${isChildActive ? 'bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 text-white shadow-lg shadow-slate-900/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-blue-950 dark:hover:text-white'}`}
                                        >
                                            <div className="flex items-center gap-3.5">
                                                {item.icon(isChildActive)}
                                                <span>{item.label}</span>
                                            </div>
                                            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isFeedbackOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        <div className={`overflow-hidden transition-all duration-300 pl-11 space-y-1 mt-1.5 ${isFeedbackOpen ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'}`}>
                                            {item.children.map((child) => {
                                                const isActive = location.pathname === child.path;
                                                return (
                                                    <Link
                                                        key={child.path}
                                                        to={child.path}
                                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${isActive
                                                            ? 'text-blue-600 bg-blue-50 dark:bg-blue-500/10'
                                                            : 'text-slate-500 hover:text-blue-950 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5'
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

                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path!}
                                    className={`group flex items-center gap-3.5 px-3 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${
                                        isActive
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                                            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-blue-950 dark:hover:text-white'
                                    }`}
                                >
                                    {item.icon(isActive)}
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Logout Button */}
                <div className="pt-4 border-t border-slate-100 dark:border-white/5 shrink-0 mt-2">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center gap-3 px-4 py-3.5 text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 rounded-2xl transition-all font-bold text-sm group"
                    >
                        <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        Logout
                    </button>
                    <div className="text-center text-[10px] text-slate-400 font-black tracking-widest uppercase mt-4">
                        © 2026 AUTOWASH HQ
                    </div>
                </div>
            </aside>

            {/* Main Content View */}
            <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
                <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 relative scroll-smooth custom-scrollbar">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};