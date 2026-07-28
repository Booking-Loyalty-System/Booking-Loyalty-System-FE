import React, { useState, useMemo } from "react";
import {
  Gift,
  Ticket,
  Star,
  Sparkles,
  CheckCircle,
  Info,
  History,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useReward } from "@/features/products/application/useReward.ts";
import { useCustomerMe } from "@/features/products/application/useCustomer.ts";
import { toast } from "sonner";
import { translateDynamic } from "@/shared/utils/translateDynamic.ts";

interface RewardItem {
  id: string;
  title: string;
  description: string;
  validDays: number;
  requiredPts: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  comingSoon?: boolean;
  isFreeWashReward?: boolean; // Cờ nhận diện quà rửa xe
}

export const RewardsSection: React.FC = () => {
  const { t, i18n } = useTranslation("customer");
  const { customerMe } = useCustomerMe();
  const {
    redemptions,
    redeemReward,
    isRedeeming,
    availableRewards,
    isLoadingRewards,
  } = useReward();

  const availablePoints = customerMe?.availablePoint ?? 0;
  const totalWashes = customerMe?.totalWashes ?? 0;
  const earnedFreeWashes = Math.floor(totalWashes / 7);
  const redeemedFreeWashes = Array.isArray(redemptions) ? redemptions.filter(r => r && (r.rewardName === "Phần thưởng Rửa Xe Miễn Phí" || r.rewardName === "Free Car Wash Reward" || r.rewardName.includes("Miễn Phí") || r.rewardName.includes("Free Wash"))).length : 0;
  const availableFreeWashes = Math.max(0, earnedFreeWashes - redeemedFreeWashes);
  const [redeemingId, setRedeemingId] = useState<string | null>(null);
  const [confirmReward, setConfirmReward] = useState<{ id: string, title: string, cost: number, isFreeWash: boolean } | null>(null);
  // Bảng cấu hình icon mẫu
  const iconMap = {
    GIFT: {
      icon: <Gift className="w-6 h-6" />,
      iconBg: "bg-blue-50 dark:bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    TICKET: {
      icon: <Ticket className="w-6 h-6" />,
      iconBg: "bg-emerald-50 dark:bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    STAR: {
      icon: <Star className="w-6 h-6" />,
      iconBg: "bg-purple-50 dark:bg-purple-500/10",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    SPARKLES: {
      icon: <Sparkles className="w-6 h-6" />,
      iconBg: "bg-amber-50 dark:bg-amber-500/10",
      iconColor: "text-amber-500 dark:text-amber-400",
    },
  };

  const rewards: RewardItem[] = useMemo(() => {
    if (!Array.isArray(availableRewards)) return [];

    return availableRewards
      .map((reward) => {
        if (!reward) return null;

        // Nhận diện voucher Rửa Xe Miễn Phí
        const isFreeWashReward = reward.name === "Phần thưởng Rửa Xe Miễn Phí";

        let iconConfig = iconMap.GIFT;
        if (reward.discountAmount >= 200) {
          iconConfig = iconMap.SPARKLES;
        } else if (reward.discountAmount >= 100) {
          iconConfig = iconMap.STAR;
        } else if (reward.discountAmount >= 20) {
          iconConfig = iconMap.TICKET;
        }

        return {
          id: reward.id,
          title: translateDynamic(reward.name ?? "Voucher đặc biệt", i18n.language),
          description:
            translateDynamic(reward.description ?? "Đổi điểm để nhận ưu đãi giảm giá.", i18n.language),
          validDays: reward.validDays ?? 30,
          requiredPts: reward.pointsCost ?? 0,
          comingSoon: !reward.isActive,
          isFreeWashReward,
          ...iconConfig,
        };
      })
      .filter((item) => item !== null) as RewardItem[];
  }, [availableRewards, i18n.language]);

  const redeemableCount = useMemo(() => {
    return rewards.filter((r) => {
      if (r.comingSoon) return false;
      if (r.isFreeWashReward) return availableFreeWashes >= 1;
      return availablePoints >= r.requiredPts;
    }).length;
  }, [rewards, availablePoints, availableFreeWashes]);

  const handleRedeemClick = (
    rewardId: string,
    cost: number,
    title: string,
    isFreeWash: boolean = false,
  ) => {
    if (isFreeWash && availableFreeWashes < 1) {
      toast.error(
        t("rewards.toastNotEnoughWashes", {
          defaultValue: "Bạn chưa có lượt rửa xe miễn phí nào để đổi!",
        }),
      );
      return;
    }

    if (!isFreeWash && availablePoints < cost) {
      toast.error(
        t("rewards.toastNotEnoughPoints", {
          defaultValue: "Bạn không đủ điểm tích lũy để đổi phần thưởng này!",
        }),
      );
      return;
    }

    setConfirmReward({ id: rewardId, title, cost, isFreeWash });
  };

  const executeRedeem = async () => {
    if (!confirmReward) return;
    
    setRedeemingId(confirmReward.id);
    const { id, title } = confirmReward;
    setConfirmReward(null);

    try {
      await redeemReward(id);
      toast.success(
        t("rewards.redeemSuccess", {
          title,
          defaultValue: `Đổi thành công: ${title}! Voucher đã được thêm vào tài khoản của bạn.`,
        }),
      );
    } catch (err) {
      console.error("Lỗi đổi thưởng:", err);
      toast.error(
        t("rewards.toastRedeemFailed", {
          defaultValue: "Đổi quà thất bại, vui lòng thử lại sau.",
        }),
      );
    } finally {
      setRedeemingId(null);
    }
  };

  return (
    <div className="w-full space-y-8 text-slate-800 dark:text-white">
      {/* 1. Thanh thông báo tự động áp dụng */}
      <div className="bg-emerald-50/60 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl p-5 flex items-start gap-4">
        <div className="p-2 bg-white dark:bg-emerald-900/30 rounded-full text-emerald-600 dark:text-emerald-400 shadow-sm shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-emerald-900 dark:text-emerald-400 text-base">
            {t("rewards.infoTitle", {
              defaultValue: "Tự động áp dụng khi đặt lịch",
            })}
          </h4>
          <p className="text-sm text-emerald-800 dark:text-emerald-300 leading-relaxed">
            {t("rewards.infoDesc", {
              defaultValue:
                "Tất cả voucher sau khi đổi sẽ được tự động tối ưu tại trang thanh toán. Bạn không cần phải nhập mã thủ công!",
            })}
          </p>
        </div>
      </div>

      {/* 2. Danh sách phần thưởng */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            {t("rewards.availableRewardsTitle", {
              defaultValue: "Phần thưởng khả dụng",
            })}
          </h2>
          <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
            <CheckCircle className="w-4 h-4 text-slate-400 dark:text-slate-500" />
            <span>
              {t("rewards.redeemableCountMsg", {
                n: redeemableCount,
                defaultValue: `Bạn có thể đổi được ${redeemableCount} phần thưởng`,
              })}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingRewards ? (
            <div className="col-span-full py-12 flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
            </div>
          ) : rewards.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 font-medium">
              {t("rewards.noRewardsAvailable", {
                defaultValue: "Hiện tại không có phần thưởng nào khả dụng.",
              })}
            </div>
          ) : (
            rewards.map((item) => {
              const isEligibleForFreeWash = availableFreeWashes >= 1;
              const canAfford = item.isFreeWashReward
                ? isEligibleForFreeWash
                : availablePoints >= item.requiredPts;

              return (
                <div
                  key={item.id}
                  className={`bg-white dark:bg-[#13151A] rounded-2xl p-6 border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative ${
                    item.comingSoon ? "opacity-75" : ""
                  }`}
                >
                  {item.comingSoon && (
                    <span className="absolute top-4 right-4 bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300 text-xs font-bold px-2.5 py-1 rounded-full">
                      {t("rewards.comingSoonBadge", {
                        defaultValue: "Sắp ra mắt",
                      })}
                    </span>
                  )}

                  <div>
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.iconBg} ${item.iconColor}`}
                    >
                      {item.icon}
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed font-medium">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 font-semibold mt-4">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                      <span>
                        {t("rewards.validDaysLabel", {
                          n: item.validDays,
                          defaultValue: `Hạn dùng ${item.validDays} ngày sau khi đổi`,
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        {t("rewards.requirementLabel", {
                          defaultValue: "Yêu cầu",
                        })}
                      </p>

                      {item.isFreeWashReward ? (
                        <div className="flex flex-col">
                          <p className="text-xl font-black text-slate-800 dark:text-white mt-0.5">
                            7{" "}
                            <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                              {t("rewards.washesUnit", {
                                defaultValue: "lượt",
                              })}
                            </span>
                          </p>
                        </div>
                      ) : (
                        <p className="text-xl font-black text-slate-800 dark:text-white mt-0.5">
                          {item.requiredPts}{" "}
                          <span className="text-sm font-bold text-slate-500 dark:text-slate-400">
                            {t("rewards.pointsUnit", { defaultValue: "điểm" })}
                          </span>
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() =>
                        handleRedeemClick(
                          item.id,
                          item.requiredPts,
                          item.title,
                          item.isFreeWashReward,
                        )
                      }
                      disabled={
                        item.comingSoon ||
                        !canAfford ||
                        isRedeeming ||
                        redeemingId === item.id
                      }
                      className={`font-bold text-sm px-6 py-2.5 rounded-xl shadow-sm transition-all ${
                        !item.comingSoon && canAfford
                          ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
                          : "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none"
                      }`}
                    >
                      {redeemingId === item.id
                        ? t("rewards.processingBtn", {
                            defaultValue: "Đang xử lý...",
                          })
                        : t("rewards.redeemNowBtn", {
                            defaultValue: "Đổi Ngay",
                          })}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 3. Phần lịch sử đổi thưởng gần đây */}
      <div className="bg-white dark:bg-[#13151A] rounded-2xl shadow-sm border border-slate-100 dark:border-white/5 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-white/10 flex items-center gap-2.5">
          <History className="w-5 h-5 text-slate-400 dark:text-slate-500" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">
            {t("rewards.redemptionHistoryTitle", {
              defaultValue: "Lịch sử đổi thưởng",
            })}
          </h3>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-white/10">
          {!Array.isArray(redemptions) || redemptions.length === 0 ? (
            <p className="text-sm text-slate-400 dark:text-slate-500 font-medium text-center py-8">
              {t("rewards.noRedemptionHistory", {
                defaultValue: "Bạn chưa đổi phần thưởng nào.",
              })}
            </p>
          ) : (
            redemptions.map((v) => {
              if (!v) return null;

              const isHistoryFreeWash =
                v.rewardName === "Phần thưởng Rửa Xe Miễn Phí";

              return (
                <div
                  key={v.id}
                  className="p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Ticket className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white text-base tracking-tight">
                        {translateDynamic(v.rewardName ?? "Voucher giảm giá", i18n.language)}
                      </h4>
                      {(() => {
                        const statusLower = String(v.status).toLowerCase();
                        const isAvailable =
                          statusLower === "active" || statusLower === "pending";
                        const isUsed =
                          statusLower === "used" || statusLower === "fulfilled";

                        return (
                          <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-1">
                            {t("rewards.statusLabel", {
                              defaultValue: "Trạng thái: ",
                            })}{" "}
                            <span
                              className={
                                isAvailable
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-slate-500 dark:text-slate-400"
                              }
                            >
                              {isAvailable
                                ? t("rewards.statusAvailable", {
                                    defaultValue: "Khả dụng",
                                  })
                                : isUsed
                                  ? t("rewards.statusUsed", {
                                      defaultValue: "Đã dùng",
                                    })
                                  : t("rewards.statusExpired", {
                                      defaultValue: "Hết hạn",
                                    })}
                            </span>{" "}
                            {t("rewards.codeLabel", { defaultValue: "· Mã:" })}{" "}
                            <span className="font-mono">
                              {isHistoryFreeWash
                                ? `REDEEM-1WASH`
                                : `REDEEM-${v.pointsSpent}PTS`}
                            </span>
                          </p>
                        );
                      })()}
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-white/10">
                    {isHistoryFreeWash ? (
                      <p className="text-lg font-black text-slate-800 dark:text-white tracking-tight">
                        -1{" "}
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          {t("rewards.washesUnit", { defaultValue: "lượt" })}
                        </span>
                      </p>
                    ) : (
                      <p className="text-lg font-black text-slate-800 dark:text-white tracking-tight">
                        -{v.pointsSpent ?? 0}{" "}
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                          {t("rewards.pointsUnit", { defaultValue: "điểm" })}
                        </span>
                      </p>
                    )}
                    <p className="text-[12px] font-bold text-slate-400 dark:text-slate-500">
                      {t("rewards.remainingBalance", { defaultValue: "Balance after:" })} {v.balanceAfter ?? 0} {t("rewards.pointsUnit", { defaultValue: "pts" })}
                    </p>
                    {(() => {
                      const statusLower = String(v.status).toLowerCase();
                      const isAvailable =
                        statusLower === "active" || statusLower === "pending";
                      const isUsed =
                        statusLower === "used" || statusLower === "fulfilled";

                      return (
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                            isAvailable
                              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                              : isUsed
                                ? "bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300"
                                : "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {isAvailable
                            ? t("rewards.statusAvailable", {
                                defaultValue: "Khả dụng",
                              })
                            : isUsed
                              ? t("rewards.statusUsed", {
                                  defaultValue: "Đã dùng",
                                })
                              : t("rewards.statusExpired", {
                                  defaultValue: "Hết hạn",
                                })}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
      {confirmReward && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#13151A] dark:border dark:border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
              {t("rewards.confirmModal.title", { defaultValue: "Xác nhận đổi thưởng" })}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 leading-relaxed">
              {t("rewards.confirmModal.descPre", { defaultValue: "Bạn có chắc chắn muốn dùng " })}
              {confirmReward.isFreeWash ? (
                <span className="font-bold text-slate-800 dark:text-white">
                  {t("rewards.confirmModal.freeWashText", { defaultValue: "1 lượt rửa xe miễn phí" })}
                </span>
              ) : (
                <span className="font-bold text-slate-800 dark:text-white">
                  {t("rewards.confirmModal.pointsText", { cost: confirmReward.cost, defaultValue: `${confirmReward.cost} điểm` })}
                </span>
              )}{" "}
              {t("rewards.confirmModal.descPost", { defaultValue: " để đổi lấy " })}
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{confirmReward.title}</span>
              {t("rewards.confirmModal.descWarning", { defaultValue: " không? Hành động này không thể hoàn tác." })}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmReward(null)}
                className="px-5 py-2.5 font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-xl transition-all"
              >
                {t("rewards.confirmModal.cancel", { defaultValue: "Hủy" })}
              </button>
              <button
                onClick={executeRedeem}
                className="px-5 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm active:scale-95"
              >
                {t("rewards.confirmModal.confirm", { defaultValue: "Xác nhận đổi" })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
