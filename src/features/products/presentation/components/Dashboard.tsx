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
  Droplets,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useCustomerMe } from "@/features/products/application/useCustomer.ts";
import { useAuth } from "@/features/products/application/useAuth.ts";
import { useBooking } from "@/features/products/application/useBooking.ts";
import { useReward } from "@/features/products/application/useReward.ts";

export const Dashboard: React.FC = () => {
  const { customerMe, isLoading: isCustomerLoading } = useCustomerMe();
  const { user } = useAuth();
  const {
    myBookings,
    isLoading: isBookingLoading,
    cancelBooking,
  } = useBooking();
  const { redemptions } = useReward();
  const navigate = useNavigate();
  const { t } = useTranslation("customer");

  const displayName = customerMe?.fullName || user?.fullName || "Khách hàng";
  const totalPoints = customerMe?.totalPoints ?? 0;
  const tier = customerMe?.tier ?? "Member";
  const washesCount = customerMe?.totalWashes ?? 0;
  const totalSpent = customerMe?.totalSpent ?? 0;

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

  const stats = [
    {
      id: 1,
      label: t("dashboard.stats.allTime", "All time"),
      value: isCustomerLoading ? "..." : washesCount.toString(),
      sub: t("dashboard.stats.totalBookings", "Total Bookings"),
      icon: <Droplets className="w-6 h-6 text-blue-500 dark:text-blue-400" />,
      bg: "bg-gradient-to-br from-blue-500/10 to-blue-500/5",
      border: "border-blue-500/20",
    },
    {
      id: 2,
      label: t("dashboard.stats.loyalty", "Loyalty"),
      value: isCustomerLoading ? "..." : totalPoints.toString(),
      sub: t("dashboard.stats.totalPoints", "Total Points"),
      icon: <Star className="w-6 h-6 text-amber-500 dark:text-amber-400" />,
      bg: "bg-gradient-to-br from-amber-500/10 to-amber-500/5",
      border: "border-amber-500/20",
    },
    {
      id: 3,
      label: t("dashboard.stats.status", "Status"),
      value: isCustomerLoading ? "..." : tier,
      sub: t("dashboard.stats.membershipTier", "Membership Tier"),
      icon: <Award className="w-6 h-6 text-purple-500 dark:text-purple-400" />,
      bg: "bg-gradient-to-br from-purple-500/10 to-purple-500/5",
      border: "border-purple-500/20",
    },
    {
      id: 4,
      label: t("dashboard.stats.savings", "Đã Chi"),
      value: isCustomerLoading
        ? "..."
        : `${(totalSpent / 1000).toLocaleString("vi-VN")}k`,
      sub: t("dashboard.stats.totalSaved", "Tổng tiền đã sử dụng"),
      icon: (
        <TrendingUp className="w-6 h-6 text-emerald-500 dark:text-emerald-400" />
      ),
      bg: "bg-gradient-to-br from-emerald-500/10 to-emerald-500/5",
      border: "border-emerald-500/20",
    },
  ];

  const quickActions = [
    {
      name: t("dashboard.quickActions.bookWash", "Book Wash"),
      desc: t("dashboard.quickActions.bookWashDesc", "Schedule a new wash"),
      icon: <Calendar className="w-6 h-6 text-white" />,
      gradient: "from-blue-500 to-indigo-600",
      path: "/book-wash",
    },
    {
      name: t("dashboard.quickActions.rewards", "Rewards"),
      desc: t("dashboard.quickActions.rewardsDesc", "Redeem your points"),
      icon: <Gift className="w-6 h-6 text-white" />,
      gradient: "from-emerald-400 to-teal-500",
      path: "/rewards",
    },
    {
      name: t("dashboard.quickActions.promotions", "Promotions"),
      desc: t("dashboard.quickActions.promotionsDesc", "View active deals"),
      icon: <Megaphone className="w-6 h-6 text-white" />,
      gradient: "from-purple-500 to-fuchsia-600",
      path: "/promotions",
    },
    {
      name: t("dashboard.quickActions.history", "History"),
      desc: t("dashboard.quickActions.historyDesc", "View past bookings"),
      icon: <History className="w-6 h-6 text-white" />,
      gradient: "from-amber-400 to-orange-500",
      path: "/booking-history",
    },
  ];

  let currentCycleWashes = washesCount % 7;
  if (currentCycleWashes === 0 && washesCount > 0) {
    currentCycleWashes = 7;
  }
  const remainingWashes = 7 - currentCycleWashes;
  const washProgressPercentage = Math.round((currentCycleWashes / 7) * 100);

  const earnedFreeWashes = Math.floor(washesCount / 7);
  const redeemedFreeWashes = Array.isArray(redemptions) ? redemptions.filter(r => r && (r.rewardName === "Phần thưởng Rửa Xe Miễn Phí" || r.rewardName === "Free Car Wash Reward" || r.rewardName.includes("Miễn Phí") || r.rewardName.includes("Free Wash"))).length : 0;
  const availableFreeWashes = Math.max(0, earnedFreeWashes - redeemedFreeWashes);

  React.useEffect(() => {
    if (availableFreeWashes > 0 && !sessionStorage.getItem("notifiedFreeWash")) {
      toast.success(t("dashboard.freeWashToast", "Chúc mừng! Bạn đã đủ lượt để nhận 1 lần rửa xe miễn phí. Voucher khả dụng đã sẵn sàng trong mục Phần Thưởng!"));
      sessionStorage.setItem("notifiedFreeWash", "true");
    }
  }, [availableFreeWashes, t]);

  const handleCancel = async (id: string) => {
    if (
      window.confirm(
        t("dashboard.cancelConfirm", "Bạn có chắc chắn muốn hủy lịch hẹn này?"),
      )
    ) {
      try {
        await cancelBooking({ id, reason: "Khách hàng hủy từ Dashboard" });
        toast.success(
          t("dashboard.cancelSuccess", "Đã hủy lịch hẹn thành công"),
        );
      } catch {
        toast.error(t("dashboard.cancelError", "Không thể hủy lịch hẹn"));
      }
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12 animate-fade-in text-slate-800 dark:text-slate-100">
      {/* WELCOME HEADER */}
      <div className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          {t("dashboard.welcomeBack", "Welcome back,")} {displayName}!
          <span className="animate-bounce inline-block origin-bottom-right">
            👋
          </span>
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 font-medium">
          {t(
            "dashboard.accountToday",
            "Here's what's happening with your account today.",
          )}
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className={`bg-white dark:bg-[#13151A] border ${stat.border} dark:border-white/5 rounded-[2rem] p-6 flex flex-col justify-between min-h-[160px] relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
          >
            {/* Subtle background glow on hover */}
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${stat.bg}`}
            ></div>

            <div className="relative z-10 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase">
                {stat.label}
              </span>
              <div
                className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center border border-white/50 dark:border-white/5 shadow-sm group-hover:scale-110 transition-transform duration-300`}
              >
                {stat.icon}
              </div>
            </div>
            <div className="relative z-10 mt-6">
              <span className="block text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
                {stat.value}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1 block">
                {stat.sub}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* FREE WASH REWARD PROGRESS (Premium Redesign) */}
      <div className="relative bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-[#0D1615] dark:to-[#13151A] border border-emerald-200/50 dark:border-emerald-900/30 rounded-[2.5rem] p-8 lg:p-10 overflow-hidden group">
        <div className="absolute right-0 top-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-[80px] group-hover:bg-emerald-400/20 transition-all duration-500 pointer-events-none"></div>

        <div className="relative z-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex gap-5 items-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-[0_8px_20px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-transform">
                <Gift className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-100 tracking-tight">
                  {t("dashboard.freeWashRewardProgress", "Free Wash Reward")}
                </h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
                  {t(
                    "dashboard.completeWashesToEarn",
                    "Complete 7 washes to earn a FREE wash!",
                  )}
                </p>
              </div>
            </div>
            <div className="text-left md:text-right">
              <span className="block text-4xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">
                {currentCycleWashes}
                <span className="text-2xl text-emerald-400 dark:text-emerald-700">
                  /7
                </span>
              </span>
              <span className="text-xs text-emerald-700 dark:text-emerald-500 font-bold uppercase tracking-widest">
                {t("dashboard.washesDone", "Washes Done")}
              </span>
            </div>
          </div>

          <div className="w-full bg-emerald-200/50 dark:bg-slate-800/80 h-8 rounded-full overflow-hidden relative flex items-center p-1 border border-emerald-100 dark:border-white/5 shadow-inner">
            <div
              className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full flex items-center justify-end pr-4 transition-all duration-1000 ease-out shadow-sm"
              style={{ width: `${washProgressPercentage}%`, minWidth: washProgressPercentage > 0 ? '2.5rem' : '0' }}
            >
              {washProgressPercentage > 0 && (
                <span className="text-xs font-black text-white drop-shadow-md">
                  {washProgressPercentage}%
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <p className="text-base font-medium text-emerald-800 dark:text-emerald-300">
              {remainingWashes > 0 ? (
                <>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-lg">
                    {remainingWashes} {t("dashboard.moreWashes", "more")}
                  </span>{" "}
                  {t(
                    "dashboard.unlockReward",
                    "to unlock your FREE wash reward!",
                  )}
                </>
              ) : (
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-lg flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  {t(
                    "dashboard.unlockedReward",
                    "You unlocked a FREE wash reward! 🎉",
                  )}
                </span>
              )}
            </p>

            <div className="flex items-center gap-2 bg-white/50 dark:bg-black/20 p-2 rounded-2xl backdrop-blur-sm border border-emerald-100/50 dark:border-white/5">
              {Array.from({ length: 7 }).map((_, idx) => {
                const step = idx + 1;
                if (step <= currentCycleWashes) {
                  return (
                    <div key={step} className="relative">
                      <div className="absolute inset-0 bg-emerald-400 blur-sm opacity-50 rounded-full animate-pulse"></div>
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 fill-white dark:fill-slate-900 relative z-10" />
                    </div>
                  );
                }
                return (
                  <div
                    key={step}
                    className="w-8 h-8 rounded-full bg-emerald-100/50 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-emerald-300 dark:text-slate-600 border border-emerald-200/50 dark:border-white/5"
                  >
                    {step}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* TWO COLUMNS LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* CURRENT TIER CARD - Premium */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-[#0B0C10] dark:to-[#13151A] border border-blue-500/50 dark:border-white/10 rounded-[2.5rem] p-8 lg:p-10 text-white relative overflow-hidden shadow-2xl min-h-[380px] flex flex-col justify-between group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>

          <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-400/20 dark:bg-blue-500/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-blue-400/30 dark:group-hover:bg-blue-500/30 transition-colors duration-700"></div>
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-500/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-purple-500/30 transition-colors duration-700"></div>

          <div className="space-y-8 relative z-10">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-[1.25rem] flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.3)] border border-white/20">
                  <Award className="w-8 h-8 text-white drop-shadow-md" />
                </div>
                <div>
                  <span className="block text-xs font-black text-slate-400 tracking-widest uppercase mb-1">
                    {t("dashboard.currentTier", "Current Tier")}
                  </span>
                  <h2 className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                    {isCustomerLoading
                      ? t("dashboard.loading", "Loading...")
                      : `${tier} ${t("dashboard.member", "Member")}`}
                  </h2>
                </div>
              </div>
              <Sparkles className="w-8 h-8 text-amber-400 animate-pulse" />
            </div>

            <div className="space-y-3 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl">
              <div className="flex justify-between text-sm font-bold text-slate-300">
                <span>
                  {t("dashboard.progressToNextTier", "Progress to Next Tier")}
                </span>
                <span className="text-white">{totalPoints} / 1000 pts</span>
              </div>
              <div className="w-full bg-black/50 h-3 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] relative"
                  style={{
                    width: `${Math.min(100, (totalPoints / 1000) * 100)}%`,
                  }}
                >
                  <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
              <p className="text-sm font-medium text-slate-400 pt-1">
                <span className="text-white font-bold">
                  {Math.max(0, 1000 - totalPoints)}
                </span>{" "}
                {t("dashboard.pointsToNextTier", "points to next tier")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 mt-6 relative z-10">
            <div className="bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm border border-white/10 rounded-2xl p-4 lg:p-5">
              <span className="block text-2xl lg:text-3xl font-black text-white">
                {totalPoints}
              </span>
              <span className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 block">
                {t("dashboard.totalPoints", "Total Points")}
              </span>
            </div>
            <div className="bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm border border-white/10 rounded-2xl p-4 lg:p-5">
              <span className="block text-2xl lg:text-3xl font-black text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">
                {tier === "Gold"
                  ? "2x"
                  : tier === "Platinum"
                    ? "3x"
                    : tier === "Silver"
                      ? "1.5x"
                      : "1x"}
              </span>
              <span className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 block">
                {t("dashboard.multiplier", "Points Multiplier")}
              </span>
            </div>
            <div className="bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm border border-white/10 rounded-2xl p-4 lg:p-5">
              <span className="block text-2xl lg:text-3xl font-black text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.3)]">
                {tier === "Platinum"
                  ? 14
                  : tier === "Gold"
                    ? 12
                    : tier === "Silver"
                      ? 10
                      : 7}
              </span>
              <span className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 block">
                {t("dashboard.bookingDays", "Booking Days")}
              </span>
            </div>
          </div>
        </div>

        {/* UPCOMING BOOKING - Premium */}
        <div className="bg-white dark:bg-[#13151A] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col min-h-[380px] group">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-4 mb-6">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3">
              {t("dashboard.upcomingBooking.title", "Upcoming Booking")}
            </h3>
            <div className="p-2 bg-slate-50 dark:bg-white/5 rounded-full">
              <Clock className="w-5 h-5 text-slate-400" />
            </div>
          </div>

          {isBookingLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
            </div>
          ) : nextBooking ? (
            <div className="flex flex-col h-full justify-between">
              <div className="bg-gradient-to-br from-slate-50 to-white dark:from-white/5 dark:to-transparent border border-slate-200/50 dark:border-white/10 rounded-3xl p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-base lg:text-lg line-clamp-1">
                      {nextBooking.washPackageName || "Dịch vụ rửa xe"}
                    </h4>
                    <p className="text-sm text-slate-500 font-bold mt-0.5">
                      {new Date(nextBooking.bookingDate).toLocaleDateString(
                        "vi-VN",
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-sm font-semibold pt-2">
                  <div className="flex justify-between items-center bg-white dark:bg-white/5 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                    <span className="text-slate-500">
                      {t("dashboard.bookingTime", "Time")}
                    </span>
                    <span className="text-slate-900 dark:text-white text-lg font-black">
                      {nextBooking.startTime}
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <span className="text-slate-500">
                      {t("dashboard.bookingVehicle", "Vehicle")}
                    </span>
                    <span className="text-slate-900 dark:text-white uppercase font-bold tracking-wider bg-slate-100 dark:bg-white/10 px-3 py-1 rounded-lg">
                      {(nextBooking as any).licensePlate ||
                        (nextBooking as any).vehiclePlate ||
                        "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-2">
                    <span className="text-slate-500">
                      {t("dashboard.bookingStatus", "Status")}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black tracking-widest uppercase ${
                        nextBooking.status === "Confirmed"
                          ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                          : nextBooking.status === "Pending"
                            ? "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400"
                            : "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400"
                      }`}
                    >
                      {nextBooking.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-6 mt-auto">
                <button
                  onClick={() => handleCancel(nextBooking.id)}
                  className="flex items-center gap-2 text-rose-500 hover:text-rose-600 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
                >
                  <XCircle className="w-4 h-4" />
                  {t("dashboard.cancel", "Cancel")}
                </button>
                <button
                  onClick={() => navigate("/booking-history")}
                  className="flex items-center gap-2 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:border dark:border-white/20 px-5 py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  {t("dashboard.viewAll", "View All")}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-2 border border-slate-100 dark:border-white/5">
                <Calendar className="w-10 h-10 text-slate-300 dark:text-slate-600" />
              </div>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 max-w-[200px]">
                {t(
                  "dashboard.upcomingBooking.noBooking",
                  "Bạn chưa có lịch hẹn nào sắp tới.",
                )}
              </p>
              <button
                onClick={() => navigate("/book-wash")}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-6 py-3 rounded-xl shadow-lg shadow-blue-500/30 hover:-translate-y-1 transition-all"
              >
                {t("dashboard.upcomingBooking.bookNow", "Đặt lịch ngay")}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="space-y-6 pt-4">
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {t("dashboard.quickActionsTitle", "Quick Actions")}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, i) => (
            <div
              key={i}
              onClick={() => navigate(action.path)}
              className="bg-white dark:bg-[#13151A] border border-slate-200 dark:border-white/5 rounded-3xl p-6 flex items-center gap-5 cursor-pointer hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group"
            >
              <div
                className={`w-14 h-14 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                {action.icon}
              </div>
              <div>
                <h4 className="font-extrabold text-slate-900 dark:text-white text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {action.name}
                </h4>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
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
