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
import type { LoyaltyTransaction } from "@/features/products/domain/models/loyalty/loyalty.dto.ts";

interface MembershipTier {
  name: string;
  pointsRangeKey: string;
  pointsRangeDefault: string;
  discount: string;
  multiplier: string;
  advanceBooking: number;
  benefits: string[];
  isCurrent: boolean;
  colorClass: string;
  bgClass: string;
  icon: React.ReactNode;
}

export const LoyaltyTier: React.FC = () => {
  const { t } = useTranslation("customer");
  const { customerMe } = useCustomerMe();
  const { data: historyData, isLoading: isLoadingHistory } =
    useLoyaltyHistory();

  // Tách biệt hai loại điểm theo cấu trúc mới của API
  const availablePoints = customerMe?.availablePoint || 0; // Dùng để hiển thị số dư tiêu dùng
  const totalPoints = customerMe?.totalPoint || 0; // Dùng để xét hạng
  const currentTierName = customerMe?.tier || "Bronze";

  // Tính toán target dựa trên mức TỔNG ĐIỂM (totalPoints)
  let targetPoints = 300;
  let nextTierName = "Silver";
  if (totalPoints >= 300 && totalPoints < 600) {
    targetPoints = 600;
    nextTierName = "Gold";
  } else if (totalPoints >= 600 && totalPoints < 1000) {
    targetPoints = 1000;
    nextTierName = "Platinum";
  } else if (totalPoints >= 1000) {
    targetPoints = totalPoints;
    nextTierName = "Max Tier";
  }

  const pointsToGo = Math.max(0, targetPoints - totalPoints);
  const progressPercentage =
    totalPoints >= 1000 ? 100 : (totalPoints / targetPoints) * 100;

  const baseTiers: MembershipTier[] = [
    {
      name: "Bronze",
      pointsRangeKey: "loyaltyTier.tierBronzeRange",
      pointsRangeDefault: "0 - 299 points",
      discount: "5%",
      multiplier: "1x",
      advanceBooking: 7,
      benefits: ["benefitBirthdayBonus"],
      isCurrent: false,
      colorClass: "border-slate-200 text-blue-600",
      bgClass: "bg-blue-50",
      icon: <Award className="w-6 h-6 text-blue-600" />,
    },
    {
      name: "Silver",
      pointsRangeKey: "loyaltyTier.tierSilverRange",
      pointsRangeDefault: "300 - 599 points",
      discount: "10%",
      multiplier: "1.5x",
      advanceBooking: 10,
      benefits: ["benefitPrioritySupport", "benefitExclusiveOffers"],
      isCurrent: false,
      colorClass: "border-slate-200 text-slate-400",
      bgClass: "bg-slate-50",
      icon: <Award className="w-6 h-6 text-slate-400" />,
    },
    {
      name: "Gold",
      pointsRangeKey: "loyaltyTier.tierGoldRange",
      pointsRangeDefault: "600 - 999 points",
      discount: "15%",
      multiplier: "2x",
      advanceBooking: 12,
      benefits: ["benefitPriorityBooking", "benefitFreeWashBirthday"],
      isCurrent: false,
      colorClass: "border-amber-200 text-amber-500",
      bgClass: "bg-amber-50",
      icon: <Crown className="w-6 h-6 text-amber-500" />,
    },
    {
      name: "Platinum",
      pointsRangeKey: "loyaltyTier.tierPlatinumRange",
      pointsRangeDefault: "1000+ points",
      discount: "20%",
      multiplier: "3x",
      advanceBooking: 14,
      benefits: ["benefitVipAccess", "benefitDedicatedManager"],
      isCurrent: false,
      colorClass: "border-purple-200 text-purple-600",
      bgClass: "bg-purple-50",
      icon: <Gem className="w-6 h-6 text-purple-600" />,
    },
  ];

  const tiers = baseTiers.map((tItem) => ({
    ...tItem,
    isCurrent:
      tItem.name.toLowerCase() === currentTierName.toLowerCase() ||
      (tItem.name === "Bronze" &&
        (!currentTierName || currentTierName.toLowerCase() === "member")),
  }));

  const currentTierInfo = tiers.find((tItem) => tItem.isCurrent) || tiers[0];

  const transactions: LoyaltyTransaction[] = historyData?.transactions || [];

  // Sử dụng totalPoints cho tổng điểm đã tích luỹ (Points Earned)
  const totalEarned = totalPoints || historyData?.totalEarnedThisMonth || 0;
  const totalRedeemed = historyData?.totalRedeemedThisMonth || 0;
  const totalBookings =
    customerMe?.totalWashes || historyData?.totalBookingsThisMonth || 0;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans antialiased text-slate-800">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl p-6 md:p-8 shadow-lg">
          <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-start gap-6">
            <div>
              <p className="text-sm font-medium text-blue-100 uppercase tracking-wider">
                {t("loyaltyTier.currentTier")}
              </p>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-1 flex flex-wrap items-center gap-2 capitalize">
                {t(`loyaltyTier.tiers.${currentTierName.toLowerCase()}`, { defaultValue: `${currentTierName} Member` })}
                {currentTierInfo.icon && (
                  <span className="[&>svg]:text-amber-300 [&>svg]:fill-amber-300 [&>svg]:w-8 [&>svg]:h-8 inline-block shrink-0">
                    {currentTierInfo.icon}
                  </span>
                )}
              </h1>
              {/* Hiển thị số dư khả dụng ở Banner */}
              <p className="text-xl font-semibold text-blue-50 mt-2">
                {totalPoints} <span className="text-sm font-medium opacity-80">{t("loyaltyTier.pointsEarned", { defaultValue: "Points Earned" })}</span>
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl flex items-center gap-3 border border-white/10 shrink-0">
              <div className="p-3 bg-white/20 rounded-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* Thanh Tiến trình (Progress Bar) - Tính dựa trên totalPoints */}
          <div className="mt-8 relative z-10">
            <div className="flex flex-col sm:flex-row justify-between text-sm font-medium text-blue-100 mb-2 gap-1.5 flex-wrap">
              <span>{t("loyaltyTier.progressToLabel", { nextTier: t(`loyaltyTier.tiers.${nextTierName.toLowerCase()}`, { defaultValue: nextTierName }) })}</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-lg text-xs font-bold">
                {totalPoints >= 1000
                  ? t("loyaltyTier.maxTierReached", { defaultValue: "Max Tier Reached" })
                  : t("loyaltyTier.pointsToGoSuffix", { n: pointsToGo, defaultValue: `${pointsToGo} points to go` })}
              </span>
            </div>
            <div className="w-full bg-blue-700/50 h-3 rounded-full overflow-hidden p-[2px]">
              <div
                className="bg-white h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-blue-200 mt-2 italic">
              {t("loyaltyTier.tiersAutoReviewed", {
                defaultValue: `Tiers are auto-reviewed & upgraded/downgraded monthly based on your past 3 months' data. Progression is based on Total Points (${totalPoints}).`
              })}
            </p>
          </div>

          {/* Chỉ số Tóm tắt nhanh */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10 relative z-10">
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl text-center border border-white/5">
              <TrendingUp className="w-5 h-5 mx-auto mb-1 text-blue-200" />
              <p className="text-2xl font-bold">{availablePoints}</p>
              <p className="text-xs text-blue-200">{t("loyaltyTier.availablePoints", { defaultValue: "Available Points" })}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl text-center border border-white/5">
              <Gift className="w-5 h-5 mx-auto mb-1 text-blue-200" />
              <p className="text-2xl font-bold">{currentTierInfo.discount}</p>
              <p className="text-xs text-blue-200">{t("loyaltyTier.discountRateCard")}</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl text-center border border-white/5">
              <Award className="w-5 h-5 mx-auto mb-1 text-blue-200" />
              <p className="text-2xl font-bold">{currentTierInfo.multiplier}</p>
              <p className="text-xs text-blue-200">{t("loyaltyTier.pointsMultiplierCard")}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              {t("loyaltyTier.howYouEarnPoints")}
            </h2>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 mb-6">
            <p className="text-lg font-bold text-emerald-900 text-center sm:text-left">
              {t("loyaltyTier.pointsFormula")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tiers.map((tItem) => (
              <div
                key={tItem.name}
                className={`p-4 rounded-xl text-center border ${tItem.isCurrent ? "bg-blue-50 border-blue-200 ring-2 ring-blue-500" : "bg-slate-50/50 border-slate-100"}`}
              >
                <p className="text-sm font-medium text-slate-500">{t(`loyaltyTier.tiers.${tItem.name.toLowerCase()}`, { defaultValue: tItem.name })}</p>
                <p
                  className={`text-2xl font-black mt-1 ${tItem.isCurrent ? "text-blue-700" : "text-blue-600"}`}
                >
                  {tItem.multiplier}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-4 italic">
            {t("loyaltyTier.formulaExample")}
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-8">
            {t("loyaltyTier.membershipTiers", { defaultValue: "Membership Tiers" })}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative bg-white rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between ${tier.colorClass} ${
                  tier.isCurrent
                    ? "ring-2 ring-blue-500 shadow-md scale-[1.02] border-blue-500"
                    : "shadow-sm hover:shadow-md border-slate-100"
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

                  <h3 className="text-2xl font-bold text-slate-800">
                    {t(`loyaltyTier.tiers.${tier.name.toLowerCase()}`, { defaultValue: tier.name })}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 font-medium">
                    {t(tier.pointsRangeKey, { defaultValue: tier.pointsRangeDefault })}
                  </p>

                  <div className="mt-6 space-y-3 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>
                        {t("loyaltyTier.benefitDiscount", { n: tier.discount })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>
                        {t("loyaltyTier.benefitMultiplier", { multiplier: tier.multiplier })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>
                        {t("loyaltyTier.benefitAdvanceBooking", { n: tier.advanceBooking })}
                      </span>
                    </div>
                    {tier.benefits.map((benefit, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm text-slate-700"
                      >
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span>{t(`loyaltyTier.benefit${benefit.replace("benefit", "")}`, { defaultValue: benefit })}</span>
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
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {/* Sử dụng hook useTranslation và hàm t() để lấy nội dung dịch thuật đa ngôn ngữ từ locale files */}
                  {t("loyaltyTier.stats.pointsEarned", { defaultValue: "Total Points Earned" })}
                </p>
                {/* Sử dụng Total Earned dựa trên Total Points trọn đời để thể hiện tổng điểm tích lũy */}
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {totalEarned}
                </p>
                <p className="text-xs text-slate-400 mt-1">{t("loyaltyTier.stats.allTime", { defaultValue: "All Time" })}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {/* Sử dụng t() từ react-i18next hiển thị thống kê điểm thưởng đã đổi */}
                  {t("loyaltyTier.stats.pointsRedeemed", { defaultValue: "Points Redeemed" })}
                </p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {totalRedeemed}
                </p>
                <p className="text-xs text-slate-400 mt-1">{t("loyaltyTier.stats.allTime", { defaultValue: "All Time" })}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                <Gift className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {/* Sử dụng t() từ react-i18next hiển thị thống kê tổng số lượt đặt lịch của thành viên */}
                  {t("loyaltyTier.stats.totalBookings", { defaultValue: "Total Bookings" })}
                </p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {totalBookings}
                </p>
                <p className="text-xs text-slate-400 mt-1">{t("loyaltyTier.stats.allTime", { defaultValue: "All Time" })}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <Calendar className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Bảng Lịch sử Giao dịch */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <History className="w-5 h-5 text-slate-400" />
              <h3 className="text-lg font-bold text-slate-800">
                {t("loyaltyTier.transactionHistory")}
              </h3>
            </div>

            <div className="overflow-x-auto">
              {isLoadingHistory ? (
                <div className="p-8 text-center text-slate-500">
                  {t("loyaltyTier.loadingTransactions")}
                </div>
              ) : transactions.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  {t("loyaltyTier.noTransactions")}
                </div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                      <th className="py-4 px-6">{t("loyaltyTier.table.date")}</th>
                      <th className="py-4 px-6">{t("loyaltyTier.table.description")}</th>
                      <th className="py-4 px-6">{t("loyaltyTier.table.type")}</th>
                      <th className="py-4 px-6 text-right">{t("loyaltyTier.table.points")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {transactions.map((tx, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-4 px-6 font-medium text-slate-400">
                          {tx.date}
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-800">
                          {tx.description}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                              tx.type === "Earned"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-rose-50 text-rose-700"
                            }`}
                          >
                            {t(`loyaltyTier.txType${tx.type}`, { defaultValue: tx.type })}
                          </span>
                        </td>
                        <td
                          className={`py-4 px-6 text-right font-bold text-base ${
                            tx.points > 0 ? "text-emerald-600" : "text-rose-600"
                          }`}
                        >
                          {tx.points > 0 ? `+${tx.points}` : tx.points}
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
