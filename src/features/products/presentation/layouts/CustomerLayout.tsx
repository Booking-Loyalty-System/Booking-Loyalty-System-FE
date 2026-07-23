import React, { useEffect, useRef } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { toast } from "sonner";
import {
  LayoutDashboard,
  Car,
  Radio,
  Award,
  Gift,
  Megaphone,
  History,
  Bell,
  Search,
  Settings,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { SidebarItem } from "../components/SidebarItem";
import { ProfileDropdown } from "../components/ProfileDropdown";
import { TierUpgradeModal } from "../components/TierUpgradeModal";
import { useLanguage } from "@/core/context/LanguageContext.tsx";
import { useTheme } from "@/core/context/ThemeContext.tsx";
import { Chatbox } from "../components/Chatbox";

// Đưa các Hook chuẩn kiến trúc của bạn vào đây
import { useAuth } from "../../application/useAuth.ts";
import { useBooking } from "../../application/useBooking.ts";
import { useNotification } from "@/features/products/application/useNotification.ts";
import { useCustomerMe } from "@/features/products/application/useCustomer.ts";

interface MenuItem {
  path: string;
  label: string;
  icon: (isActive: boolean) => React.ReactNode;
}

export const CustomerLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useTranslation("common");
  const { language, toggleLanguage } = useLanguage();
  const { toggleTheme, isDark } = useTheme();

  // 🌟 Lấy dữ liệu từ các Application Hook chuẩn của hệ thống
  const { logout, userId } = useAuth();
  const { myBookings, isLoading } = useBooking();
  const { unreadCount } = useNotification();
  const { customerMe } = useCustomerMe();

  const myBookingsRef = useRef(myBookings);
  useEffect(() => {
    myBookingsRef.current = myBookings;
  }, [myBookings]);

  const customerMeRef = useRef(customerMe);
  useEffect(() => {
    customerMeRef.current = customerMe;
  }, [customerMe]);

  // 🌟 Kiểm tra thời gian thực: Có lịch đặt nào đang được rửa (InProgress) hay không?
  const hasInProgressBooking =
    !isLoading && myBookings.some((booking) => booking.status === "InProgress");

  // 🌟 THIẾT LẬP SIGNALR ĐỂ ĐỒNG BỘ DATA REALTIME
  useEffect(() => {
    if (!userId) return;

    const connection = new HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_SOCKET_URL}/booking`, {
        accessTokenFactory: () => localStorage.getItem("access_token") || "",
        headers: {
          "ngrok-skip-browser-warning": "true"
        }
      })
      .configureLogging(LogLevel.Warning)
      .withAutomaticReconnect()
      .build();

    const startSignalR = async () => {
      try {
        await connection.start();
        await connection.invoke("JoinCustomerGroup", userId);

        connection.on(
          "BookingStatusChanged",
          (data: { bookingId: string; status: string }) => {
            console.log(
              "🔔 [SignalR] Nhận được tín hiệu thay đổi trạng thái:",
              data,
            );
            const currentStatus = data?.status;

            if (currentStatus === "InProgress") {
              toast.success(
                "Your vehicle has entered the service bay! Opening Live Tracking...",
                { icon: "🚗" },
              );
              // Tự động chuyển hướng sang trang Live Tracking khi bắt đầu
              navigate("/live-tracking");
            } else if (currentStatus === "Completed") {
              const booking = myBookingsRef.current.find(b => b.id === data.bookingId);
              if (booking) {
                const tier = customerMeRef.current?.tier || "Member";
                const multiplier = tier === "Platinum" ? 3 : tier === "Gold" ? 2 : tier === "Silver" ? 1.5 : 1;
                const points = Math.floor((booking.totalPrice || 0) / 1000) * multiplier;

                toast.success(
                  `Thanh toán thành công! Bạn được cộng ${points.toLocaleString("vi-VN")} điểm thưởng.`,
                  { icon: "🎉" }
                );
                window.dispatchEvent(new Event("customer_points_changed"));
              } else {
                toast.success(
                  "Thanh toán thành công! Điểm thưởng đã được cộng vào tài khoản.",
                  { icon: "🎉" }
                );
              }
            } else {
              toast.info(`Current order status: ${currentStatus}`, {
                icon: "ℹ️",
              });
            }
            // Gọi lại tất cả các API liên quan để cập nhật giao diện mà không cần F5
            queryClient.invalidateQueries({ queryKey: ["my_bookings"] });
            queryClient.invalidateQueries({ queryKey: ["notifications"] });
            queryClient.invalidateQueries({ queryKey: ["unread_count"] });
            queryClient.invalidateQueries({ queryKey: ["loyalty_history"] });
            queryClient.invalidateQueries({ queryKey: ["customer_me"] });
          },
        );
      } catch (err) {
        if (err instanceof Error) {
          if (
            err.name === "AbortError" ||
            err.message.includes("stopped during negotiation")
          ) {
            console.log(
              "⏱️ [SignalR] Tiến trình bắt tay cũ bị hủy do React Remount (Strict Mode), đang kết nối lại...",
            );
          } else {
            console.error("❌ SignalR Connection Error thực sự: ", err);
          }
        } else {
          console.error("❌ SignalR gặp lỗi lạ: ", err);
        }
      }
    };

    startSignalR();

    return () => {
      connection.off("BookingStatusChanged");
      if (
        connection.state === "Connected" ||
        connection.state === "Connecting"
      ) {
        connection.stop().catch(() => { });
      }
    };
  }, [userId, queryClient]);

  // Mảng Menu gốc
  const rawMenuItems: MenuItem[] = [
    {
      path: "/dashboard",
      label: t("sidebar.dashboard", { defaultValue: "Dashboard" }),
      icon: (isActive) => (
        <div className={`p-2.5 rounded-xl transition-all duration-300 ${isActive ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-[0_4px_15px_rgba(59,130,246,0.4)]" : "bg-white/10 text-sky-100 group-hover:text-white group-hover:scale-110 group-hover:bg-white/15"}`}>
          <LayoutDashboard className="w-4 h-4" />
        </div>
      ),
    },
    {
      path: "/book-wash",
      label: t("sidebar.bookWash", { defaultValue: "Book Wash" }),
      icon: (isActive) => (
        <div className={`p-2.5 rounded-xl transition-all duration-300 ${isActive ? "bg-gradient-to-br from-emerald-400 to-teal-500 text-white shadow-[0_4px_15px_rgba(16,185,129,0.4)]" : "bg-white/10 text-sky-100 group-hover:text-white group-hover:scale-110 group-hover:bg-white/15"}`}>
          <Car className="w-4 h-4" />
        </div>
      ),
    },
    {
      path: "/live-tracking",
      label: t("sidebar.liveTracking", { defaultValue: "Live Tracking" }),
      icon: (isActive) => (
        <div className={`p-2.5 rounded-xl transition-all duration-300 ${isActive ? "bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-[0_4px_15px_rgba(239,68,68,0.4)]" : "bg-red-400/20 text-red-200 group-hover:bg-red-400/30"}`}>
          <Radio className="w-4 h-4 animate-pulse" />
        </div>
      ),
    },
    {
      path: "/loyalty-tier",
      label: t("sidebar.loyaltyTier", { defaultValue: "Loyalty & Tier" }),
      icon: (isActive) => (
        <div className={`p-2.5 rounded-xl transition-all duration-300 ${isActive ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-[0_4px_15px_rgba(245,158,11,0.4)]" : "bg-white/10 text-sky-100 group-hover:text-amber-200 group-hover:scale-110 group-hover:bg-white/15"}`}>
          <Award className="w-4 h-4" />
        </div>
      ),
    },
    {
      path: "/rewards",
      label: t("sidebar.rewards", { defaultValue: "Rewards" }),
      icon: (isActive) => (
        <div className={`p-2.5 rounded-xl transition-all duration-300 ${isActive ? "bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-[0_4px_15px_rgba(236,72,153,0.4)]" : "bg-white/10 text-sky-100 group-hover:text-pink-200 group-hover:animate-bounce group-hover:bg-white/15"}`}>
          <Gift className="w-4 h-4" />
        </div>
      ),
    },
    {
      path: "/promotions",
      label: t("sidebar.promotions", { defaultValue: "Promotions" }),
      icon: (isActive) => (
        <div className={`p-2.5 rounded-xl transition-all duration-300 ${isActive ? "bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white shadow-[0_4px_15px_rgba(168,85,247,0.4)]" : "bg-white/10 text-sky-100 group-hover:text-purple-200 group-hover:-rotate-12 group-hover:bg-white/15"}`}>
          <Megaphone className="w-4 h-4" />
        </div>
      ),
    },
    {
      path: "/booking-history",
      label: t("sidebar.bookingHistory", { defaultValue: "Booking History" }),
      icon: (isActive) => (
        <div className={`p-2.5 rounded-xl transition-all duration-300 ${isActive ? "bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-[0_4px_15px_rgba(6,182,212,0.4)]" : "bg-white/10 text-sky-100 group-hover:text-cyan-200 group-hover:scale-110 group-hover:bg-white/15"}`}>
          <History className="w-4 h-4" />
        </div>
      ),
    },
    {
      path: "/my-vehicles",
      label: t("sidebar.myVehicles", { defaultValue: "My Vehicles" }),
      icon: (isActive) => (
        <div className={`p-2.5 rounded-xl transition-all duration-300 ${isActive ? "bg-gradient-to-br from-teal-400 to-emerald-500 text-white shadow-[0_4px_15px_rgba(20,184,166,0.4)]" : "bg-white/10 text-sky-100 group-hover:text-teal-200 group-hover:translate-x-0.5 group-hover:bg-white/15"}`}>
          <Car className="w-4 h-4" />
        </div>
      ),
    },
    {
      path: "/notifications",
      label: t("sidebar.notifications", { defaultValue: "Notifications" }),
      icon: (isActive) => (
        <div className={`p-2.5 rounded-xl transition-all duration-300 ${isActive ? "bg-gradient-to-br from-slate-700 to-slate-900 text-white shadow-[0_4px_15px_rgba(51,65,85,0.4)]" : "bg-white/10 text-sky-100 group-hover:text-white group-hover:bg-white/15"}`}>
          <Bell className="w-4 h-4" />
        </div>
      ),
    },
    {
      path: "/settings",
      label: t("sidebar.settings", { defaultValue: "Settings" }),
      icon: (isActive) => (
        <div className={`p-2.5 rounded-xl transition-all duration-300 ${isActive ? "bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-[0_4px_15px_rgba(99,102,241,0.4)]" : "bg-white/10 text-sky-100 group-hover:text-indigo-200 group-hover:rotate-45 group-hover:bg-white/15"}`}>
          <Settings className="w-4 h-4" />
        </div>
      ),
    },
  ];

  const menuItems = rawMenuItems.filter(
    (item) => item.path !== "/live-tracking" || hasInProgressBooking,
  );

  const titleMap: Record<string, string> = {
    "/dashboard": t("header.dashboard", { defaultValue: "Dashboard" }),
    "/book-wash": t("header.bookAWash", { defaultValue: "Book a Wash" }),
    "/live-tracking": t("header.liveTracking", { defaultValue: "Live Tracking" }),
    "/loyalty-tier": t("header.loyaltyTier", { defaultValue: "Loyalty & Tier" }),
    "/rewards": t("header.rewards", { defaultValue: "Rewards" }),
    "/promotions": t("header.promotions", { defaultValue: "Promotions" }),
    "/booking-history": t("header.bookingHistory", { defaultValue: "Booking History" }),
    "/my-vehicles": t("header.myVehicles", { defaultValue: "My Vehicles" }),
    "/notifications": t("header.notificationCenter", { defaultValue: "Notification Center" }),
    "/settings": t("header.profileSettings", { defaultValue: "Profile Settings" }),
  };

  const currentTitle = titleMap[location.pathname] || "AutoWash Premium";

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen w-screen bg-[hsl(210,92%,91%)] dark:bg-[#0B0C10] overflow-hidden antialiased font-sans text-slate-800 dark:text-slate-200 relative">
      {/* 🌊 Aqua Premium background orbs — chỉ hiện ở light mode */}
      <div className="absolute inset-0 pointer-events-none z-0 dark:hidden">
        {/* Orb trái trên: xanh dương nhạt */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-gradient-radial from-sky-400/80 via-blue-200/40 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        {/* Orb phải dưới: cyan nhạt */}
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] rounded-full bg-gradient-radial from-cyan-400/70 via-sky-200/30 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '11s', animationDelay: '3s' }} />
        {/* Orb giữa: xanh nhẹ */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full bg-gradient-radial from-blue-300/60 to-transparent blur-[80px]" />
      </div>
      {/* SIDEBAR - Aqua Deep Blue Premium */}
      <aside className="w-72 bg-gradient-to-b from-[#1e5096] via-[#173f7a] to-[#0f2f5e] dark:bg-gradient-to-b dark:from-[#13151A] dark:to-[#0d0f14] backdrop-blur-2xl border-r border-white/10 dark:border-white/5 flex flex-col p-5 shrink-0 h-full relative z-20 shadow-[4px_0_32px_rgba(14,100,200,0.25)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center gap-4 px-3 py-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/40 ring-2 ring-white/20">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-white">
                {t("sidebar.appName", { defaultValue: "AutoWash" })}
              </h2>
              <p className="text-[10px] uppercase tracking-widest font-bold text-sky-300/80 -mt-1">
                {t("sidebar.tagline", { defaultValue: "Premium Care" })}
              </p>
            </div>
          </div>

          <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
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

        <div className="shrink-0 pt-4 border-t border-white/10 dark:border-white/5 space-y-3 mt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-300 dark:text-rose-400 hover:bg-rose-500/15 dark:hover:bg-rose-500/10 rounded-2xl transition-all duration-300 group"
          >
            <div className="p-2.5 rounded-xl bg-rose-500/20 text-rose-300 group-hover:scale-110 transition-transform">
              <LogOut className="w-4 h-4" />
            </div>
            <span>{t("sidebar.logout", { defaultValue: "Logout" })}</span>
          </button>
          <div className="text-center text-[10px] font-semibold text-sky-400/50 uppercase tracking-widest">
            {t("sidebar.copyright", { defaultValue: "© 2026 AutoWash Premium" })}
          </div>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Subtle background glow — đậm hơn cho light mode */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-sky-400/28 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-cyan-400/32 dark:bg-cyan-600/5 rounded-full blur-[100px] pointer-events-none mix-blend-multiply dark:mix-blend-lighten dark:hidden"></div>

        {/* HEADER - Glassmorphic */}
        <header className="h-20 bg-white/60 dark:bg-[#13151A]/60 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 flex items-center justify-between px-8 shrink-0 sticky top-0 z-10 transition-all duration-300">
          <div className="animate-fade-in flex items-center gap-4">
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:text-white">
              {currentTitle}
            </h1>
          </div>

          <div className="flex items-center gap-4 lg:gap-6">
            <div className="hidden md:block w-72 relative group">
              <input
                type="text"
                placeholder={t("header.searchPlaceholder", { defaultValue: "Search..." })}
                className="w-full bg-slate-100/80 dark:bg-white/5 dark:text-slate-200 dark:placeholder-slate-500 border border-transparent dark:border-white/5 rounded-2xl py-2.5 pl-5 pr-12 text-sm font-medium focus:outline-none focus:bg-white dark:focus:bg-[#1A1C23] focus:border-blue-500 dark:focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-sm group-hover:shadow-md"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-2 bg-slate-100/80 dark:bg-white/5 p-1 rounded-full border border-slate-200/50 dark:border-white/5">
              <button
                onClick={toggleTheme}
                title={isDark ? "Light Mode" : "Dark Mode"}
                className="p-2 rounded-full hover:bg-white dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all shadow-sm"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-white dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all text-xs font-bold shadow-sm"
              >
                <span className="text-sm leading-none">{language === "en" ? "🇺🇸" : "🇻🇳"}</span>
                <span className="uppercase">{language === "en" ? "EN" : "VI"}</span>
              </button>
            </div>

            <button
              onClick={() => navigate("/notifications")}
              className={`relative p-2.5 rounded-full transition-all duration-300 border ${location.pathname === "/notifications"
                ? "bg-gradient-to-r from-sky-500 to-blue-500 text-white border-transparent shadow-lg shadow-sky-500/30"
                : "bg-white/80 dark:bg-white/10 border-sky-200/60 dark:border-white/10 text-sky-600 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-white/20 hover:shadow-md"
                }`}
            >
              <Bell className="w-5 h-5 drop-shadow-sm" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white border-2 border-white dark:border-[#13151A] shadow-sm animate-bounce">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            <div className="pl-2 border-l border-slate-200 dark:border-white/10">
              <ProfileDropdown />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 lg:p-10 relative z-0 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <Chatbox />
      <TierUpgradeModal />
    </div>
  );
};
