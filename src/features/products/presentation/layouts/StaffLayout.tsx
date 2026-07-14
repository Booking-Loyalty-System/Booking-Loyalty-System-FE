import React, { useState } from "react";
import { StaffChatPanel } from "../components/staff/StaffChatPanel";
import { NavLink, useNavigate, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Car,
  Droplets,
  LogOut,
  Bell,
  CheckCircle2,
  Coffee,
  ClipboardList,
  LayoutGrid,
} from "lucide-react";
import { useAuth } from "../../application/useAuth";
import { useNotification } from "@/features/products/application/useNotification.ts";

export const StaffLayout: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isOnline, setIsOnline] = useState(true);
  const { unreadCount } = useNotification();

  const staffLinks = [
    { to: "/staff/dashboard", icon: LayoutDashboard, label: "Overview" },
    { to: "/staff/monitor", icon: LayoutGrid, label: "Queue Monitor" },
    { to: "/staff/queue", icon: Car, label: "Live Queue" },
    { to: "/staff/bookings", icon: ClipboardList, label: "Bookings" },
  ];

  const systemLinks = [
    { to: "/staff/notifications", icon: Bell, label: "Notifications" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="h-screen w-screen bg-[#fafafa] dark:bg-[#050505] flex overflow-hidden antialiased font-sans">

      {/* Background Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten z-0"></div>

      {/* Sidebar - Premium Glassmorphic */}
      <aside className="w-72 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-2xl border-r border-slate-200/60 dark:border-white/5 flex flex-col justify-between shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)] h-full relative z-20 transition-all duration-300">

        {/* Logo Section */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Droplets className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 tracking-tight leading-none">
                AutoWash
              </h1>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest mt-1">
                Staff Portal
              </p>
            </div>
          </div>
        </div>

        {/* Staff Shift Status */}
        {/* <div className="px-6 mb-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-950 rounded-3xl p-5 text-white relative overflow-hidden shadow-lg shadow-blue-600/20 border border-blue-500/30 group">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:bg-white/30 transition-all duration-700 pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOnline ? "bg-emerald-400" : "bg-amber-400"}`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${isOnline ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">
                  {isOnline ? "Active on Shift" : "On Break"}
                </span>
              </div>
              <p className="text-base font-extrabold truncate">Staff Member</p>
              <p className="text-[11px] text-blue-200 font-bold uppercase tracking-wider mt-0.5">
                Bay Operator #01
              </p>

              <button
                onClick={() => setIsOnline(!isOnline)}
                className="mt-5 w-full py-2.5 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 shadow-sm"
              >
                {isOnline ? (
                  <Coffee className="w-4 h-4 text-amber-400" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
                {isOnline ? "Go on Break" : "Resume Work"}
              </button>
            </div>
          </div>
        </div> */}

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-6 overflow-y-auto custom-scrollbar">
          {/* Operations Group */}
          <div>
            <p className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
              Operations
            </p>
            <div className="space-y-1.5">
              {staffLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all font-bold text-sm group ${isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-white/20" : "bg-slate-100 dark:bg-white/5 group-hover:bg-white dark:group-hover:bg-white/10"}`}>
                        <link.icon className="w-4 h-4" />
                      </div>
                      {link.label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          {/* System Group */}
          <div>
            <p className="px-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
              System
            </p>
            <div className="space-y-1.5">
              {systemLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all font-bold text-sm group ${isActive
                      ? "bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-600 dark:to-slate-800 text-white shadow-lg shadow-slate-900/20"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`p-2 rounded-xl transition-colors ${isActive ? "bg-white/20" : "bg-slate-100 dark:bg-white/5 group-hover:bg-white dark:group-hover:bg-white/10"}`}>
                        <link.icon className="w-4 h-4" />
                      </div>
                      <span className="flex-1">{link.label}</span>

                      {link.label === "Notifications" && unreadCount > 0 && (
                        <span className="bg-rose-500 text-white text-[10px] py-1 px-2.5 rounded-full font-black shadow-sm animate-pulse">
                          {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>

        {/* Logout Button */}
        <div className="pt-4 mt-auto border-t border-slate-100 dark:border-white/5 shrink-0">
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
      <main className="flex-1 p-6 md:p-8 lg:p-10 h-screen overflow-y-auto relative z-10 custom-scrollbar">
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
          <Outlet />
        </div>
      </main>

      <StaffChatPanel />
    </div>
  );
};
