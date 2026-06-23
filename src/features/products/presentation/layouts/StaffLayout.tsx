import React, { useState } from 'react';
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import {
    LayoutDashboard,
    Car,
    Droplets,
    LogOut,
    Bell,
    CheckCircle2,
    Coffee,
    ClipboardList,
    LayoutGrid
} from 'lucide-react';
import { useAuth } from '../../application/useAuth';
import { useNotification } from "@/features/products/application/useNotification.ts";

export const StaffLayout: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isOnline, setIsOnline] = useState(true);
    const { unreadCount } = useNotification();

    // Đã rút gọn: Chỉ giữ lại 1 cổng quản lý Bookings chung (Filter sẽ xử lý trong trang con)
    const staffLinks = [
        { to: '/staff/dashboard', icon: LayoutDashboard, label: 'Overview' },
        { to: '/staff/monitor', icon: LayoutGrid, label: "Queue Monitor" },
        { to: '/staff/queue', icon: Car, label: "Live Queue" },
        { to: '/staff/bookings', icon: ClipboardList, label: "Bookings" },
    ];

    const systemLinks = [
        { to: '/staff/notifications', icon: Bell, label: 'Notifications' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="h-screen w-screen bg-gray-50 flex overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 flex flex-col shadow-sm">
                {/* Logo Section */}
                <div className="p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                            <Droplets className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-gray-900 leading-none">AutoWash</h1>
                            <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-1">Staff Portal</p>
                        </div>
                    </div>
                </div>

                {/* Staff Shift Status */}
                <div className="px-4 mb-4">
                    <div className="bg-slate-900 rounded-2xl p-4 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-3">
                                <div className={`w-2 h-2 rounded-full animate-pulse ${isOnline ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-80">
                                    {isOnline ? 'Active on Shift' : 'On Break'}
                                </span>
                            </div>
                            <p className="text-sm font-bold truncate">Staff Member</p>
                            <p className="text-[10px] opacity-60 font-medium">Bay Operator #01</p>

                            <button
                                onClick={() => setIsOnline(!isOnline)}
                                className="mt-3 w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
                            >
                                {isOnline ? <Coffee className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                                {isOnline ? 'Go on Break' : 'Resume Work'}
                            </button>
                        </div>
                        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-500/20 rounded-full blur-xl group-hover:bg-blue-500/40 transition-all"></div>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-4 space-y-6 overflow-y-auto pt-2">
                    {/* Operations Group */}
                    <div>
                        <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Operations</p>
                        <div className="space-y-1">
                            {staffLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                                            isActive
                                                ? 'bg-blue-50 text-blue-600 shadow-sm'
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                        }`
                                    }
                                >
                                    <link.icon className="w-5 h-5" />
                                    {link.label}
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* System Group */}
                    <div>
                        <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">System</p>
                        <div className="space-y-1">
                            {systemLinks.map((link) => (
                                <NavLink
                                    key={link.to}
                                    to={link.to}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                                            isActive
                                                ? 'bg-blue-50 text-blue-600 shadow-sm'
                                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                        }`
                                    }
                                >
                                    <link.icon className="w-5 h-5" />
                                    {link.label}

                                    {link.label === 'Notifications' && unreadCount > 0 && (
                                        <span className="bg-red-500 text-white text-[10px] py-0.5 px-2 rounded-full font-black">
                                            {unreadCount > 99 ? '99+' : unreadCount}
                                        </span>
                                    )}
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </nav>

                {/* Logout Button */}
                <div className="p-4 mt-auto">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 px-4 py-3 text-gray-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all font-bold text-sm"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content View */}
            <main className="flex-1 ml-64 p-6 h-screen overflow-y-auto">
                <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};