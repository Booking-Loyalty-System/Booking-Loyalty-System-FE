import React from "react";
import {
  Crown,
  TrendingUp,
  Gift,
  Award,
  Calendar,
  History,
  Gem,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCustomerMe } from "@/features/products/application/useCustomer.ts";
import { useLoyaltyHistory } from "@/features/products/application/useLoyalty.ts";
import { useTier } from "@/features/products/application/useTier";
import type { LoyaltyTransaction } from "@/features/products/domain/models/loyalty/loyalty.dto.ts";

interface MembershipTier {
  id: string;
  name: string;
  minPointsRequired: number;
  maintenancePoints: number;
  pointRate: number;
  multiplier: string;
  advanceBooking: number;
  benefits: string[];
  isCurrent: boolean;
  colorClass: string;
  bgClass: string;
  icon: React.ReactNode;
}

const normalizeTierName = (value?: string | null) =>
  (value ?? "")
    .replace(/\s+(tier|member)$/i, "")
    .trim()
    .toLowerCase();

const formatMultiplier = (pointRate: number) =>
  `${Number(pointRate.toFixed(2))}x`;

const getTierAppearance = (tierName: string) => {
  switch (normalizeTierName(tierName)) {
    case "silver":
      return {
        colorClass:
          "border-slate-200 dark:border-white/10 text-slate-400 dark:text-slate-300",
        bgClass: "bg-slate-50 dark:bg-slate-800",
        icon: <Award className="w-6 h-6 text-slate-400 dark:text-slate-300" />,
      };
    case "gold":
      return {
        colorClass:
          "border-amber-200 dark:border-amber-500/30 text-amber-500 dark:text-amber-400",
        bgClass: "bg-amber-50 dark:bg-amber-500/10",
        icon: <Crown className="w-6 h-6 text-amber-500 dark:text-amber-400" />,
      };
    case "diamond":
      return {
        colorClass:
          "border-purple-200 dark:border-purple-500/30 text-purple-600 dark:text-purple-400",
        bgClass: "bg-purple-50 dark:bg-purple-500/10",
        icon: <Gem className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      };
    default:
      return {
        colorClass:
          "border-slate-200 dark:border-white/10 text-blue-600 dark:text-blue-400",
        bgClass: "bg-blue-50 dark:bg-blue-900/30",
        icon: <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      };
  }
};

export const LoyaltyTier: React.FC = () => {
  const { t } = useTranslation("customer");
  const { customerMe } = useCustomerMe();
  const { tiers: tierData = [] } = useTier();
  const { data: historyData, isLoading: isLoadingHistory } =
    useLoyaltyHistory();

  // Tách biệt hai loại điểm theo cấu trúc mới của API
  const availablePoints = customerMe?.availablePoint || 0; // Dùng để hiển thị số dư tiêu dùng
  const totalPoints = customerMe?.totalPoint || 0; // Dùng để xét hạng
  const currentTierName = customerMe?.tier || "Bronze";

  // Tier API là nguồn dữ liệu duy nhất cho các thông số hiển thị.
  const tiers: MembershipTier[] = React.useMemo(
    () =>
      [...tierData]
        .sort((a, b) => a.minPointsRequired - b.minPointsRequired)
        .map((tier) => ({
          id: tier.id,
          name: tier.tierName,
          minPointsRequired: tier.minPointsRequired,
          maintenancePoints: tier.maintenancePoints,
          pointRate: tier.pointRate,
          multiplier: formatMultiplier(tier.pointRate),
          advanceBooking: tier.bookingWindow,
          benefits: tier.benefits ?? [],
          isCurrent:
            normalizeTierName(tier.tierName) ===
            normalizeTierName(currentTierName),
          ...getTierAppearance(tier.tierName),
        })),
    [tierData, currentTierName],
  );

  const currentTierInfo = tiers.find((tItem) => tItem.isCurrent) || tiers[0];
  const currentTierIndex = Math.max(
    0,
    tiers.findIndex((tier) => tier.isCurrent),
  );
  const nextTier = tiers[currentTierIndex + 1];
  const nextTierName = nextTier?.name ?? "Max Tier";
  const pointsToGo = nextTier
    ? Math.max(0, nextTier.minPointsRequired - totalPoints)
    : 0;
  const currentTierMinimum = currentTierInfo?.minPointsRequired ?? 0;
  const progressPercentage = nextTier
    ? Math.min(
        100,
        Math.max(
          0,
          ((totalPoints - currentTierMinimum) /
            (nextTier.minPointsRequired - currentTierMinimum)) *
            100,
        ),
      )
    : 100;

  const transactions: LoyaltyTransaction[] = historyData?.transactions || [];

  // Sử dụng totalPoints cho tổng điểm đã tích luỹ (Points Earned)
  const totalEarned = totalPoints || historyData?.totalEarnedThisMonth || 0;
  const totalRedeemed = historyData?.totalRedeemedThisMonth || 0;
  const totalBookings =
    customerMe?.totalWashes || historyData?.totalBookingsThisMonth || 0;

  // Tính toán số dư sau mỗi giao dịch
  const transactionsWithBalance = React.useMemo(() => {
    if (!transactions.length) return [];

    // Sắp xếp giảm dần theo ngày (mới nhất lên đầu)
    const sortedTx = [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );

    let currentBalance = availablePoints;

    return sortedTx.map((tx) => {
      const balanceAfter = currentBalance;
      // Nếu backend trả tx.points âm cho Redeem thì dùng luôn, nếu trả dương thì ép âm
      const pointDiff =
        tx.type === "Redeemed" && tx.points > 0 ? -tx.points : tx.points;

      // Lùi về số dư của thời điểm trước khi có giao dịch này
      currentBalance = currentBalance - pointDiff;
      // Số dư trước khi thực hiện giao dịch này
      const balanceBefore = currentBalance;

      return {
        ...tx,
        balanceAfter,
        balanceBefore,
      };
    });
  }, [transactions, availablePoints]);

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 font-sans antialiased text-slate-800 dark:text-white">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-sky-100 via-blue-100 to-indigo-100 dark:from-[#0B0C10] dark:to-[#13151A] border border-sky-300/90 dark:border-white/10 rounded-[2.5rem] p-6 md:p-10 shadow-[0_8px_40px_rgba(14,165,233,0.22)] dark:shadow-2xl group">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-sky-400/35 dark:bg-blue-500/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-sky-400/46 dark:group-hover:bg-blue-500/30 transition-colors duration-700"></div>
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-cyan-400/29 dark:bg-purple-500/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-cyan-400/40 dark:group-hover:bg-purple-500/30 transition-colors duration-700"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-start gap-6">
            <div>
              <p className="text-sm font-medium text-sky-600 dark:text-slate-400 uppercase tracking-wider">
                {t("loyaltyTier.currentTier")}
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-1 flex flex-wrap items-center gap-2 capitalize text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-sky-500 dark:from-white dark:to-slate-400">
                {t(`loyaltyTier.tiers.${currentTierName.toLowerCase()}`, {
                  defaultValue: `${currentTierName} Member`,
                })}
                {currentTierInfo?.icon && (
                  <span className="[&>svg]:text-amber-300 [&>svg]:fill-amber-300 [&>svg]:w-8 [&>svg]:h-8 inline-block shrink-0">
                    {currentTierInfo.icon}
                  </span>
                )}
              </h1>
              {/* Hiển thị số dư khả dụng ở Banner */}
              <p className="text-xl font-semibold text-slate-700 dark:text-slate-300 mt-2">
                {totalPoints}{" "}
                <span className="text-sm font-medium opacity-80 text-slate-500 dark:text-slate-400">
                  {t("loyaltyTier.pointsEarned", {
                    defaultValue: "Points Earned",
                  })}
                </span>
              </p>
            </div>

            <div className="bg-sky-50/90 dark:bg-white/10 backdrop-blur-md p-4 rounded-xl flex items-center gap-3 border border-sky-300/70 dark:border-white/10 shrink-0 shadow-sm">
              <div className="p-3 bg-sky-100 dark:bg-white/20 rounded-lg">
                <Crown className="w-6 h-6 text-sky-600 dark:text-white" />
              </div>
            </div>
          </div>

          {/* Thanh Tiến trình (Progress Bar) - Tính dựa trên totalPoints */}
          <div className="mt-8 relative z-10 bg-sky-50/80 dark:bg-white/5 backdrop-blur-md border border-sky-300/90 dark:border-white/10 p-6 rounded-3xl shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between text-sm font-medium text-slate-600 dark:text-slate-300 mb-2 gap-1.5 flex-wrap">
              <span>
                {t("loyaltyTier.progressToLabel", {
                  nextTier: t(
                    `loyaltyTier.tiers.${nextTierName.toLowerCase()}`,
                    { defaultValue: nextTierName },
                  ),
                })}
              </span>
              <span className="text-blue-950 dark:text-white font-bold">
                {!nextTier
                  ? t("loyaltyTier.maxTierReached", {
                      defaultValue: "Max Tier Reached",
                    })
                  : t("loyaltyTier.pointsToGoSuffix", {
                      n: pointsToGo,
                      defaultValue: `${pointsToGo} points to go`,
                    })}
              </span>
            </div>
            <div className="w-full bg-sky-200 dark:bg-black/50 h-3 rounded-full overflow-hidden p-0.5 border border-sky-300/60 dark:border-white/5">
              <div
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)] relative"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 italic">
              {t("loyaltyTier.tiersAutoReviewed", {
                defaultValue: `Tiers are auto-reviewed & upgraded/downgraded monthly based on your past 3 months' data. Progression is based on Total Points (${totalPoints}).`,
              })}
            </p>
          </div>

          {/* Chỉ số Tóm tắt nhanh */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-sky-300/60 dark:border-white/10 relative z-10">
            <div className="bg-white/70 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 transition-colors backdrop-blur-sm p-4 rounded-xl text-center border border-sky-300/70 dark:border-white/10 shadow-sm">
              <TrendingUp className="w-5 h-5 mx-auto mb-1 text-sky-500 dark:text-slate-400" />
              <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:text-white">
                {availablePoints}
              </p>
              <p className="text-xs text-sky-600 dark:text-slate-400">
                {t("loyaltyTier.availablePoints", {
                  defaultValue: "Available Points",
                })}
              </p>
            </div>
            <div className="bg-white/70 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 transition-colors backdrop-blur-sm p-4 rounded-xl text-center border border-sky-300/70 dark:border-white/10 shadow-sm">
              <Gift className="w-5 h-5 mx-auto mb-1 text-sky-500 dark:text-slate-400" />
              <p className="text-2xl font-bold text-amber-500 dark:text-amber-400">
                {currentTierInfo?.multiplier ?? "—"}
              </p>
              <p className="text-xs text-sky-600 dark:text-slate-400">
                {t("loyaltyTier.pointsMultiplierCard", {
                  defaultValue: "Points Multiplier",
                })}
              </p>
            </div>
            <div className="bg-white/70 dark:bg-white/5 hover:bg-white/90 dark:hover:bg-white/10 transition-colors backdrop-blur-sm p-4 rounded-xl text-center border border-sky-300/70 dark:border-white/10 shadow-sm">
              <Award className="w-5 h-5 mx-auto mb-1 text-sky-500 dark:text-slate-400" />
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {currentTierInfo
                  ? `${currentTierInfo.advanceBooking} ${t("bookWash.priority.days", { defaultValue: "days" })}`
                  : "—"}
              </p>
              <p className="text-xs text-slate-400">
                {t("loyaltyTier.advanceBooking", {
                  defaultValue: "Advance Booking",
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#13151A] rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-500/10 rounded-lg text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              {t("loyaltyTier.howYouEarnPoints")}
            </h2>
          </div>

          <div className="bg-emerald-50/50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl p-4 mb-6">
            <p className="text-lg font-bold text-emerald-900 dark:text-emerald-400 text-center sm:text-left">
              {t("loyaltyTier.pointsFormula")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tiers.map((tItem) => (
              <div
                key={tItem.name}
                className={`p-4 rounded-xl text-center border ${tItem.isCurrent ? "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-500/50 ring-2 ring-blue-500" : "bg-slate-50/50 dark:bg-white/5 border-slate-100 dark:border-white/10"}`}
              >
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {t(`loyaltyTier.tiers.${tItem.name.toLowerCase()}`, {
                    defaultValue: tItem.name,
                  })}
                </p>
                <p
                  className={`text-2xl font-black mt-1 ${tItem.isCurrent ? "text-blue-700 dark:text-blue-300" : "text-blue-600 dark:text-blue-400"}`}
                >
                  {tItem.multiplier}
                </p>
              </div>
            ))}
          </div>
          {currentTierInfo && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 italic">
              {t("loyaltyTier.formulaExampleDynamic", {
                amount: (450000).toLocaleString("vi-VN"),
                tier: currentTierInfo.name,
                multiplier: currentTierInfo.multiplier,
                points: Math.floor((450000 / 1000) * currentTierInfo.pointRate),
                defaultValue: `Example: A 450,000đ wash for ${currentTierInfo.name} members = (450,000 / 1,000) × ${currentTierInfo.multiplier} = ${Math.floor((450000 / 1000) * currentTierInfo.pointRate)} points`,
              })}
            </p>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-8">
            {t("loyaltyTier.membershipTiers", {
              defaultValue: "Membership Tiers",
            })}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {tiers.map((tier, tierIndex) => (
              <div
                key={tier.name}
                className={`relative bg-white dark:bg-[#13151A] rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between ${tier.colorClass} ${
                  tier.isCurrent
                    ? "ring-2 ring-blue-500 shadow-md scale-[1.02] border-blue-500 dark:border-blue-500"
                    : "shadow-sm hover:shadow-md border-slate-100 dark:border-white/10"
                }`}
              >
                {tier.isCurrent && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    {t("loyaltyTier.currentTier")}
                  </span>
                )}

                <div>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${tier.bgClass}`}
                  >
                    {tier.icon}
                  </div>

                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
                    {t(`loyaltyTier.tiers.${tier.name.toLowerCase()}`, {
                      defaultValue: tier.name,
                    })}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                    {tiers[tierIndex + 1]
                      ? `${tier.minPointsRequired} - ${tiers[tierIndex + 1].minPointsRequired - 1} ${t("loyaltyTier.points", { defaultValue: "points" })}`
                      : `${tier.minPointsRequired}+ ${t("loyaltyTier.points", { defaultValue: "points" })}`}
                  </p>

                  <div className="mt-6 space-y-3 pt-6 border-t border-slate-100 dark:border-white/10">
                    <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>
                        {t("loyaltyTier.benefitMultiplier", {
                          multiplier: tier.multiplier,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>
                        {t("loyaltyTier.benefitAdvanceBooking", {
                          n: tier.advanceBooking,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>
                        {tier.maintenancePoints > 0
                          ? `${tier.maintenancePoints} ${t("loyaltyTier.maintenancePointsEvery90Days", { defaultValue: "maintenance points / 90 days" })}`
                          : t("loyaltyTier.noMaintenanceRequired", {
                              defaultValue: "No maintenance points required",
                            })}
                      </span>
                    </div>
                    {tier.benefits.map((benefit, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300"
                      >
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Hộp chỉ số Thống kê tháng */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-[#13151A] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {/* Sử dụng hook useTranslation và hàm t() để lấy nội dung dịch thuật đa ngôn ngữ từ locale files */}
                  {t("loyaltyTier.stats.pointsEarned", {
                    defaultValue: "Total Points Earned",
                  })}
                </p>
                {/* Sử dụng Total Earned dựa trên Total Points trọn đời để thể hiện tổng điểm tích lũy */}
                <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">
                  {totalEarned}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {t("loyaltyTier.stats.allTime", { defaultValue: "All Time" })}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-[#13151A] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {/* Sử dụng t() từ react-i18next hiển thị thống kê điểm thưởng đã đổi */}
                  {t("loyaltyTier.stats.pointsRedeemed", {
                    defaultValue: "Points Redeemed",
                  })}
                </p>
                <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">
                  {totalRedeemed}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {t("loyaltyTier.stats.allTime", { defaultValue: "All Time" })}
                </p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400">
                <Gift className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white dark:bg-[#13151A] p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {/* Sử dụng t() từ react-i18next hiển thị thống kê tổng số lượt đặt lịch của thành viên */}
                  {t("dashboard.stats.totalWash", {
                    defaultValue: "Total CheckedOut Wash",
                  })}
                </p>
                <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">
                  {totalBookings}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {t("loyaltyTier.stats.allTime", { defaultValue: "All Time" })}
                </p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Bảng Lịch sử Giao dịch */}
          <div className="bg-white dark:bg-[#13151A] rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-white/10 flex items-center gap-3">
              <History className="w-5 h-5 text-slate-400 dark:text-slate-500" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                {t("loyaltyTier.transactionHistory")}
              </h3>
            </div>

            <div className="overflow-x-auto">
              {isLoadingHistory ? (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                  {t("loyaltyTier.loadingTransactions")}
                </div>
              ) : transactions.length === 0 ? (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                  {t("loyaltyTier.noTransactions")}
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-white/10">
                      <th className="py-4 px-6">
                        {t("loyaltyTier.table.date")}
                      </th>
                      <th className="py-4 px-6">
                        {t("loyaltyTier.table.description")}
                      </th>
                      <th className="py-4 px-6">
                        {t("loyaltyTier.table.type")}
                      </th>

                      <th className="py-4 px-6 text-right">
                        {t("loyaltyTier.table.points")}
                      </th>
                      <th className="py-4 px-6 text-right">
                        {t("loyaltyTier.table.balance", {
                          defaultValue: "Balance",
                        })}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/10 text-sm text-slate-700 dark:text-slate-300">
                    {transactionsWithBalance.map((tx, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 px-6 font-medium text-slate-400 dark:text-slate-500">
                          {new Date(tx.date).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-800 dark:text-white">
                          {(() => {
                            const desc = tx.description;
                            // Match EN pattern: "Earned from booking {code}"
                            // Match VI pattern: "Cộng điểm từ đơn hàng {code}"
                            if (
                              desc.includes("Earned from booking") ||
                              desc.includes("Cộng điểm từ đơn hàng")
                            ) {
                              const code = desc.includes("Earned from booking")
                                ? desc.split("Earned from booking ")[1]
                                : desc.split("Cộng điểm từ đơn hàng ")[1];
                              return `${t("loyaltyTier.earnedFromBooking", { defaultValue: "Earned from booking" })} ${code ?? ""}`;
                            }
                            // Match EN pattern: "Redeemed Voucher {name}"
                            // Match VI pattern: "Đổi điểm lấy Voucher {name}"
                            if (
                              desc.includes("Redeemed Voucher") ||
                              desc.includes("Đổi điểm lấy Voucher")
                            ) {
                              const name = desc.includes("Redeemed Voucher")
                                ? desc.split("Redeemed Voucher ")[1]
                                : desc.split("Đổi điểm lấy Voucher ")[1];
                              return `${t("loyaltyTier.redeemedVoucher", { defaultValue: "Redeemed Voucher" })} ${name ?? ""}`;
                            }
                            // Match EN pattern: "No-show penalty..."
                            // Match VI pattern: "Phạt vắng mặt..."
                            if (
                              desc.includes("No-show penalty") ||
                              desc.includes("Phạt vắng mặt")
                            ) {
                              return t("loyaltyTier.noShowPenalty", {
                                defaultValue: "No-show penalty",
                              });
                            }
                            // Fallback: hiển thị nguyên chuỗi
                            return desc;
                          })()}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                              tx.type === "Earned"
                                ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                                : "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400"
                            }`}
                          >
                            {t(`loyaltyTier.txType${tx.type}`, {
                              defaultValue: tx.type,
                            })}
                          </span>
                        </td>

                        <td
                          className={`py-4 px-6 text-right font-bold text-base ${
                            tx.points > 0 && tx.type === "Earned"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {tx.points > 0 && tx.type === "Earned"
                            ? `+${tx.points}`
                            : tx.points > 0
                              ? `-${tx.points}`
                              : tx.points}
                        </td>
                        <td className="py-4 px-6 text-right font-bold text-slate-800 dark:text-white text-base">
                          {tx.balanceAfter}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoyaltyTier;
