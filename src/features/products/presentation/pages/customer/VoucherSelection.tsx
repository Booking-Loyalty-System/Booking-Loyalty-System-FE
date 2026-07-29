import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Ticket, Gift, Star, Check } from "lucide-react";
import type { Voucher } from "../../../domain/models/voucher/voucher.model.ts";
import { useReward } from "../../../application/useReward.ts";
import { toast } from "sonner";

interface VoucherSelectionProps {
  activeVouchers: Voucher[];
  selectedVoucherId: string;
  onSelectVoucher: (voucher: Voucher | null) => void;
  totalPoints: number;
  availableFreeWashes: number;
}

export const VoucherSelection: React.FC<VoucherSelectionProps> = ({
  activeVouchers,
  selectedVoucherId,
  onSelectVoucher,
  totalPoints,
  availableFreeWashes,
}) => {
  const { t } = useTranslation("customer");
  const {
    redeemReward: redeemVoucher,
    isRedeeming,
    availableRewards,
  } = useReward();
  const [showQuickRedeem, setShowQuickRedeem] = useState(false);
  const [confirmReward, setConfirmReward] = useState<{
    id: string;
    title: string;
    cost: number;
    isFreeWash: boolean;
  } | null>(null);
  const quickRedeemList = availableRewards.slice(0, 4);

  const handleQuickRedeem = (
    rewardId: string,
    requiredPts: number,
    title: string,
    isFreeWash: boolean,
  ) => {
    // Kiểm tra điều kiện riêng cho phần thưởng Rửa Xe Miễn Phí
    if (isFreeWash && availableFreeWashes < 1) {
      toast.error(
        t("bookWash.voucher.toastNotEnoughWashes", {
          defaultValue: "Bạn chưa có lượt rửa xe miễn phí nào để đổi!",
        }),
      );
      return;
    }

    // Kiểm tra điều kiện cho các voucher đổi bằng điểm
    if (!isFreeWash && totalPoints < requiredPts) {
      toast.error(
        t("bookWash.voucher.toastNotEnoughPoints", {
          defaultValue: "You do not have enough points to redeem this voucher!",
        }),
      );
      return;
    }

    setConfirmReward({ id: rewardId, title, cost: requiredPts, isFreeWash });
  };

  const executeRedeem = async () => {
    if (!confirmReward) return;
    const { id, title } = confirmReward;
    setConfirmReward(null);

    try {
      const newVoucher = await redeemVoucher(id);
      toast.success(
        t("bookWash.voucher.toastRedeemSuccess", {
          title,
          defaultValue: `Successfully redeemed: ${title}`,
        }),
      );
      if (newVoucher) {
        onSelectVoucher(newVoucher);
      }
    } catch (error) {
      toast.error(
        t("bookWash.voucher.toastRedeemFailed", {
          defaultValue: "Failed to redeem voucher. Please try again.",
        }),
      );
    }
  };

  const usableVouchers = activeVouchers.filter((v) => {
    const statusStr = String(v.status).toLowerCase();
    return (
      statusStr !== "used" &&
      statusStr !== "fulfilled" &&
      statusStr !== "expired"
    );
  });

  return (
    <div className="bg-white dark:bg-[#13151A] rounded-2xl border border-slate-100 dark:border-white/5 p-5 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 dark:text-white text-sm tracking-tight">
              {t("bookWash.voucher.title", { defaultValue: "Your Rewards" })}
            </h3>
            <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
              {t("bookWash.voucher.selectSubtitle", {
                defaultValue: "Select an available voucher for your booking",
              })}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowQuickRedeem(!showQuickRedeem)}
          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
            showQuickRedeem
              ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20 shadow-sm"
              : "bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10"
          }`}
        >
          <Gift className="w-3.5 h-3.5" />
          {showQuickRedeem
            ? t("bookWash.voucher.viewMyVouchers", {
                defaultValue: "View My Vouchers",
              })
            : t("bookWash.voucher.redeemMore", { defaultValue: "Redeem More" })}
        </button>
      </div>

      <div className="relative">
        {!showQuickRedeem ? (
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
            {usableVouchers.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-200 dark:border-white/10 rounded-xl bg-slate-50/50 dark:bg-white/5">
                <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                  {t("bookWash.voucher.noVouchers", {
                    defaultValue: "You don't have any usable vouchers.",
                  })}
                </p>
              </div>
            ) : (
              usableVouchers.map((voucher) => {
                const isSelected = selectedVoucherId === voucher.id;

                // Nhận diện voucher Free Wash để hiển thị nhãn FREE thay vì số tiền
                const vName =
                  (voucher as any).name || (voucher as any).title || "";
                const isFreeWash =
                  voucher.isFreeWash || vName === "Phần thưởng Rửa Xe Miễn Phí";

                return (
                  <div
                    key={voucher.id}
                    onClick={() => onSelectVoucher(isSelected ? null : voucher)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-50/70 dark:bg-blue-900/30 border-blue-500 dark:border-blue-400 shadow-sm"
                        : "bg-white dark:bg-white/5 border-slate-100 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50/30 dark:hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl ${isSelected ? "bg-blue-500 text-white" : "bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400"}`}
                      >
                        <Ticket className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-800 dark:text-white">
                          {vName ||
                            (voucher as any).description ||
                            t("bookWash.voucher.fallbackTitle", {
                              defaultValue: "Reward Voucher",
                            })}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-0.5">
                          {t("bookWash.voucher.codeLabel", {
                            defaultValue: "Code:",
                          })}{" "}
                          <span className="font-mono text-slate-600 dark:text-slate-300">
                            {voucher.code}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {isFreeWash ? (
                        <span
                          className={`text-[11px] font-black px-2 py-0.5 rounded-md ${
                            isSelected
                              ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                              : "bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                          }`}
                        >
                          MIỄN PHÍ
                        </span>
                      ) : (
                        voucher.discountValue && (
                          <span
                            className={`text-[11px] font-black px-2 py-0.5 rounded-md ${
                              isSelected
                                ? "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                                : "bg-emerald-50 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
                            }`}
                          >
                            -{voucher.discountValue.toLocaleString()}₫
                          </span>
                        )
                      )}

                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-blue-500 border-blue-500 text-white"
                            : "border-slate-200 dark:border-white/10 bg-white dark:bg-white/5"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-3 text-white mb-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-white text-amber-300 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-100">
                    {t("bookWash.voucher.pointsWallet", {
                      defaultValue: "Your points wallet",
                    })}
                  </span>
                </div>
                <span className="text-sm font-black tracking-tight bg-white/20 px-2 py-0.5 rounded-lg">
                  {totalPoints.toLocaleString()} pts
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
              {quickRedeemList.length === 0 ? (
                <div className="col-span-2 text-center py-6 text-xs font-bold text-slate-400 dark:text-slate-500">
                  {t("bookWash.voucher.noAvailableRewards", {
                    defaultValue:
                      "No reward vouchers currently available to redeem.",
                  })}
                </div>
              ) : (
                quickRedeemList.map((reward) => {
                  // Phân biệt Free Wash và Quà thường
                  const isFreeWashReward =
                    reward.name === "Phần thưởng Rửa Xe Miễn Phí";
                  const canRedeem = isFreeWashReward
                    ? availableFreeWashes >= 1
                    : totalPoints >= reward.pointsCost;

                  return (
                    <div
                      key={reward.id}
                      className="bg-slate-50/50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-xl p-2.5 flex flex-col justify-between gap-2"
                    >
                      <div>
                        <h5 className="text-[11px] font-black text-slate-800 dark:text-white line-clamp-1">
                          {reward.name}
                        </h5>
                        <p className="text-[9px] font-medium text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                          {reward.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-50 dark:border-white/5 pt-2">
                        <span className="text-xs font-black text-slate-700 dark:text-slate-300">
                          {isFreeWashReward
                            ? "7 lượt"
                            : `${reward.pointsCost} pts`}
                        </span>
                        <button
                          onClick={() =>
                            handleQuickRedeem(
                              reward.id,
                              reward.pointsCost,
                              reward.name,
                              isFreeWashReward,
                            )
                          }
                          disabled={isRedeeming || !canRedeem}
                          className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg shadow-sm ${
                            canRedeem
                              ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all"
                              : "bg-slate-100 dark:bg-white/5 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                          }`}
                        >
                          {isRedeeming
                            ? t("bookWash.voucher.redeeming", {
                                defaultValue: "Redeeming...",
                              })
                            : t("bookWash.voucher.redeemNow", {
                                defaultValue: "Redeem Now",
                              })}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
      {confirmReward && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#13151A] dark:border dark:border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
              {t("rewards.confirmModal.title", {
                defaultValue: "Xác nhận đổi thưởng",
              })}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm mb-6 leading-relaxed">
              {t("rewards.confirmModal.descPre", {
                defaultValue: "Bạn có chắc chắn muốn dùng ",
              })}
              {confirmReward.isFreeWash ? (
                <span className="font-bold text-slate-800 dark:text-white">
                  {t("rewards.confirmModal.freeWashText", {
                    defaultValue: "1 lượt rửa xe miễn phí",
                  })}
                </span>
              ) : (
                <span className="font-bold text-slate-800 dark:text-white">
                  {t("rewards.confirmModal.pointsText", {
                    cost: confirmReward.cost,
                    defaultValue: `${confirmReward.cost} điểm`,
                  })}
                </span>
              )}{" "}
              {t("rewards.confirmModal.descPost", {
                defaultValue: " để đổi lấy ",
              })}
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {confirmReward.title}
              </span>
              {t("rewards.confirmModal.descWarning", {
                defaultValue: " không? Hành động này không thể hoàn tác.",
              })}
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
                {t("rewards.confirmModal.confirm", {
                  defaultValue: "Xác nhận đổi",
                })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
