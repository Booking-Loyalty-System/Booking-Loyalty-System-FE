import React, { useMemo } from "react";
import {
  Calendar,
  Star,
  Award,
  TrendingUp,
  Gift,
  CheckCircle2,
  Sparkles,
  Clock,
  XCircle,
  ArrowRight,
  Megaphone,
  History,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useCustomerMe } from "@/features/products/application/useCustomer.ts";
import { useAuth } from "@/features/products/application/useAuth.ts";
import { useBooking } from "@/features/products/application/useBooking.ts";

export const Dashboard: React.FC = () => {
  // 🌟 Lấy thông tin từ các Hook chuẩn của hệ thống
  const { customerMe, isLoading: isCustomerLoading } = useCustomerMe();
  const { user } = useAuth();
  const {
    myBookings,
    isLoading: isBookingLoading,
    cancelBooking,
  } = useBooking();
  const navigate = useNavigate();
  const { t } = useTranslation('customer');

  // Map dữ liệu
  const displayName = customerMe?.fullName || user?.fullName || "Khách hàng";
  const totalPoints = customerMe?.totalPoints ?? 0;
  const tier = customerMe?.tier ?? "Member";
  const washesCount = customerMe?.totalWashes ?? 0;
  const totalSpent = customerMe?.totalSpent ?? 0;

  // 🌟 Tìm Booking sắp tới gần nhất (Lọc các trạng thái chưa hoàn thành)
  const nextBooking = useMemo(() => {
    if (!myBookings || myBookings.length === 0) return null;
    return myBookings
      .filter((b) =>
        ["Pending", "Confirmed", "Queued", "InProgress"].includes(b.status),
      )
      .sort(
        (a, b) =>
          new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime(),
      )[0];
  }, [myBookings]);

  // Thống kê nhanh
  const stats = [
    {
      id: 1,
      label: t('dashboard.stats.allTime', 'All time'),
      value: isCustomerLoading ? "..." : washesCount.toString(),
      sub: t('dashboard.stats.totalBookings', 'Total Bookings'),
      icon: <Calendar className="w-5 h-5 text-blue-500" />,
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      id: 2,
      label: t('dashboard.stats.loyalty', 'Loyalty'),
      value: isCustomerLoading ? "..." : totalPoints.toString(),
      sub: t('dashboard.stats.totalPoints', 'Total Points'),
      icon: <Star className="w-5 h-5 text-emerald-500" />,
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      id: 3,
      label: t('dashboard.stats.status', 'Status'),
      value: isCustomerLoading ? "..." : tier,
      sub: t('dashboard.stats.membershipTier', 'Membership Tier'),
      icon: <Award className="w-5 h-5 text-purple-500" />,
      bg: "bg-purple-50 dark:bg-purple-950/30",
    },
    {
      id: 4,
      label: t('dashboard.stats.savings', 'Đã Chi'),
      value: isCustomerLoading
        ? "..."
        : `${totalSpent.toLocaleString("vi-VN")}đ`,
      sub: t('dashboard.stats.totalSaved', 'Tổng tiền đã sử dụng dịch vụ'),
      icon: <TrendingUp className="w-5 h-5 text-orange-500" />,
      bg: "bg-orange-50 dark:bg-orange-950/30",
    },
  ];

  const quickActions = [
    {
      name: t('dashboard.quickActions.bookWash', 'Book Wash'),
      desc: t('dashboard.quickActions.bookWashDesc', 'Schedule a new wash'),
      icon: <Calendar className="w-5 h-5 text-blue-600" />,
      bg: "bg-blue-50 dark:bg-blue-950/30",
      path: "/book-wash",
    },
    {
      name: t('dashboard.quickActions.rewards', 'Rewards'),
      desc: t('dashboard.quickActions.rewardsDesc', 'Redeem your points'),
      icon: <Gift className="w-5 h-5 text-emerald-600" />,
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
      path: "/rewards",
    },
    {
      name: t('dashboard.quickActions.promotions', 'Promotions'),
      desc: t('dashboard.quickActions.promotionsDesc', 'View active deals'),
      icon: <Megaphone className="w-5 h-5 text-purple-600" />,
      bg: "bg-purple-50 dark:bg-purple-950/30",
      path: "/promotions",
    },
    {
      name: t('dashboard.quickActions.history', 'History'),
      desc: t('dashboard.quickActions.historyDesc', 'View past bookings'),
      icon: <History className="w-5 h-5 text-orange-600" />,
      bg: "bg-orange-50 dark:bg-orange-950/30",
      path: "/booking-history",
    },
  ];

  // Logic tính tiến trình rửa xe miễn phí (Mỗi 7 lần)
  let currentCycleWashes = washesCount % 7;
  if (currentCycleWashes === 0 && washesCount > 0) {
    currentCycleWashes = 7;
  }
  const remainingWashes = 7 - currentCycleWashes;
  const washProgressPercentage = Math.round((currentCycleWashes / 7) * 100);

  // Hủy lịch từ Dashboard
  const handleCancel = async (id: string) => {
    if (window.confirm(t('dashboard.cancelConfirm', 'Bạn có chắc chắn muốn hủy lịch hẹn này?'))) {
      try {
        await cancelBooking({ id, reason: "Khách hàng hủy từ Dashboard" });
        toast.success(t('dashboard.cancelSuccess', 'Đã hủy lịch hẹn thành công'));
      } catch {
        toast.error(t('dashboard.cancelError', 'Không thể hủy lịch hẹn'));
      }
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* WELCOME HEADER */}
      <div className="space-y-1">
        <h1 className="text-3xl font-extrabold text-[#0f172a] dark:text-white flex items-center gap-2">
          {t('dashboard.welcomeBack', 'Welcome back,')} {displayName}!{" "}
          <span className="animate-bounce">👋</span>
        </h1>
        <p className="text-sm text-[#64748b] dark:text-slate-400 font-medium">
          {t('dashboard.accountToday', "Here's what's happening with your account today.")}
        </p>
      </div>

      {/* 4 THỂ THỐNG KÊ (STATS CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between min-h-[140px] relative group hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#94a3b8] dark:text-slate-500 font-bold tracking-wide uppercase">
                {stat.label}
              </span>
              <div
                className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}
              >
                {stat.icon}
              </div>
            </div>
            <div className="mt-4">
              <span className="block text-3xl font-black text-[#0f172a] dark:text-white">
                {stat.value}
              </span>
              <span className="text-xs text-[#64748b] dark:text-slate-400 font-semibold">
                {stat.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* FREE WASH REWARD PROGRESS (Thanh tiến trình màu xanh lá) */}
      <div className="bg-[#f0fdf4] dark:bg-emerald-950/10 border border-[#bbf7d0] dark:border-emerald-900/30 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 bg-[#16a34a] rounded-xl flex items-center justify-center text-white shadow-sm">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#14532d] dark:text-emerald-400">
                {t('dashboard.freeWashRewardProgress', 'Free Wash Reward Progress')}
              </h3>
              <p className="text-xs text-[#166534] dark:text-emerald-500 font-medium">
                {t('dashboard.completeWashesToEarn', 'Complete 7 washes to earn a FREE wash!')}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="block text-3xl font-black text-[#16a34a]">
              {currentCycleWashes}/7
            </span>
            <span className="text-[10px] text-[#166534] dark:text-emerald-500 font-bold uppercase tracking-wider">
              {t('dashboard.washesDone', 'Washes Done')}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#dcfce7] dark:bg-slate-800 h-6 rounded-full overflow-hidden relative flex items-center">
          <div
            className="bg-[#16a34a] h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500"
            style={{ width: `${washProgressPercentage}%` }}
          >
            <span className="text-[10px] font-bold text-white">
              {washProgressPercentage}%
            </span>
          </div>
        </div>

        {/* Chấm điểm mốc tròn (1-7) và text thông báo */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-1">
          <p className="text-sm font-semibold text-[#166534] dark:text-emerald-400/90">
            {remainingWashes > 0 ? (
              <>
                <span className="text-[#16a34a] font-bold">
                  {remainingWashes} {t('dashboard.moreWashes', 'more washes')}
                </span>{" "}
                {t('dashboard.unlockReward', 'to unlock your FREE wash reward!')}
              </>
            ) : (
              <span className="text-[#16a34a] font-bold">
                {t('dashboard.unlockedReward', 'You unlocked a FREE wash reward! 🎉')}
              </span>
            )}
          </p>

          {/* Badge đếm số từ 1 đến 7 */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: 7 }).map((_, idx) => {
              const step = idx + 1;
              if (step <= currentCycleWashes) {
                return (
                  <CheckCircle2
                    key={step}
                    className="w-6 h-6 text-[#16a34a] fill-white dark:fill-slate-900"
                  />
                );
              }
              return (
                <div
                  key={step}
                  className="w-6 h-6 rounded-full bg-[#e2e8f0] dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-[#94a3b8] dark:text-slate-500"
                >
                  {step}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PHẦN LAYOUT HAI CỘT CHÍNH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* CURRENT TIER CARD */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#1e6ffd] via-[#2563eb] to-[#1d4ed8] rounded-3xl p-8 text-white relative overflow-hidden shadow-lg min-h-[340px] flex flex-col justify-between">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="space-y-6 relative z-10">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <span className="block text-xs text-blue-100 font-semibold tracking-wider uppercase">
                    {t('dashboard.currentTier', 'Current Tier')}
                  </span>
                  <h2 className="text-3xl font-black tracking-tight">
                    {isCustomerLoading ? t('dashboard.loading', 'Loading...') : `${tier} ${t('dashboard.member', 'Member')}`}
                  </h2>
                </div>
              </div>
              <Sparkles className="w-8 h-8 text-blue-200 animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-blue-100">
                <span>{t('dashboard.progressToNextTier', 'Progress to Next Tier')}</span>
                <span>{totalPoints}/1000 points</span>
              </div>
              <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-white h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (totalPoints / 1000) * 100)}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-blue-100 font-medium pt-1">
                {Math.max(0, 1000 - totalPoints)} {t('dashboard.pointsToNextTier', 'points to next tier')} <br />
                <span className="opacity-75 text-[11px]">
                  {t('dashboard.tiersAutoReviewed', "Tiers are auto-reviewed monthly based on your past 3 months' data")}
                </span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 mt-4 border-t border-white/10 relative z-10">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <span className="block text-xl font-black">{totalPoints}</span>
              <span className="text-[10px] text-blue-100 font-semibold uppercase">
                {t('dashboard.totalPoints', 'Total Points')}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <span className="block text-xl font-black">
                {tier === "Gold"
                  ? "2x"
                  : tier === "Platinum"
                    ? "3x"
                    : tier === "Silver"
                      ? "1.5x"
                      : "1x"}
              </span>
              <span className="text-[10px] text-blue-100 font-semibold uppercase">
                {t('dashboard.multiplier', 'Points Multiplier')}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
              <span className="block text-xl font-black">
                {tier === "Platinum"
                  ? 14
                  : tier === "Gold"
                    ? 12
                    : tier === "Silver"
                      ? 10
                      : 7}
              </span>
              <span className="text-[10px] text-blue-100 font-semibold uppercase">
                {t('dashboard.bookingDays', 'Booking Days')}
              </span>
            </div>
          </div>
        </div>

        {/* UPCOMING BOOKING */}
        <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col min-h-[340px]">
          <div className="flex items-center justify-between border-b border-[#f1f5f9] dark:border-slate-800 pb-3 mb-4">
            <h3 className="text-base font-bold text-[#0f172a] dark:text-white flex items-center gap-2">
              {t('dashboard.upcomingBooking.title', 'Upcoming Booking')}
            </h3>
            <Clock className="w-4 h-4 text-[#94a3b8] dark:text-slate-500" />
          </div>

          {isBookingLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : nextBooking ? (
            <div className="flex flex-col h-full justify-between">
              <div className="bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#0f172a] dark:text-white text-sm line-clamp-1">
                      {nextBooking.washPackageName || "Dịch vụ rửa xe"}
                    </h4>
                    <p className="text-xs text-[#64748b] dark:text-slate-400 font-semibold">
                      {new Date(nextBooking.bookingDate).toLocaleDateString(
                        "vi-VN",
                      )}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-xs font-semibold pt-1">
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8] dark:text-slate-500">{t('dashboard.bookingTime', 'Time')}</span>
                    <span className="text-[#0f172a] dark:text-slate-300">
                      {nextBooking.startTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#94a3b8] dark:text-slate-500">{t('dashboard.bookingVehicle', 'Vehicle')}</span>
                    <span className="text-[#0f172a] dark:text-slate-300 uppercase">
                      {(nextBooking as any).licensePlate ||
                        (nextBooking as any).vehiclePlate ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#94a3b8] dark:text-slate-500">{t('dashboard.bookingStatus', 'Status')}</span>
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        nextBooking.status === "Confirmed"
                          ? "bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400"
                          : nextBooking.status === "Pending"
                            ? "bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-455"
                            : "bg-blue-100 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400"
                      }`}
                    >
                      {nextBooking.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-[#f1f5f9] dark:border-slate-800 mt-auto">
                <button
                  onClick={() => handleCancel(nextBooking.id)}
                  className="flex items-center gap-1.5 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 px-3 py-2 rounded-xl text-xs font-bold transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  {t('dashboard.cancel', 'Cancel')}
                </button>
                <button
                  onClick={() => navigate("/booking-history")}
                  className="flex items-center gap-1 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                >
                  {t('dashboard.viewAll', 'View All')}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-2">
                <Calendar className="w-8 h-8 text-slate-300 dark:text-slate-650" />
              </div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {t('dashboard.upcomingBooking.noBooking', 'Bạn chưa có lịch hẹn nào sắp tới.')}
              </p>
              <button
                onClick={() => navigate("/book-wash")}
                className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-blue-700 transition"
              >
                {t('dashboard.upcomingBooking.bookNow', 'Đặt lịch ngay')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-[#0f172a] dark:text-white">{t('dashboard.quickActionsTitle', 'Quick Actions')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, i) => (
            <div
              key={i}
              onClick={() => navigate(action.path)}
              className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-800 rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div
                className={`w-12 h-12 ${action.bg} rounded-xl flex items-center justify-center shrink-0`}
              >
                {action.icon}
              </div>
              <div>
                <h4 className="font-bold text-[#0f172a] dark:text-slate-200 text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {action.name}
                </h4>
                <p className="text-xs text-[#94a3b8] dark:text-slate-500 font-medium mt-0.5">
                  {action.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
