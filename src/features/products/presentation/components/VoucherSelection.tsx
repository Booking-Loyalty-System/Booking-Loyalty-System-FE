import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Ticket, Gift, Star, Check } from "lucide-react";
import type { Voucher } from "../../domain/models/voucher/voucher.model.ts";
import { useReward } from "../../application/useReward.ts";
import { toast } from "sonner";

interface VoucherSelectionProps {
  activeVouchers: Voucher[];
  selectedVoucherId: string;
  onSelectVoucher: (voucher: Voucher | null) => void;
  totalPoints: number;
}

export const VoucherSelection: React.FC<VoucherSelectionProps> = ({
  activeVouchers,
  selectedVoucherId,
  onSelectVoucher,
  totalPoints,
}) => {
  const { t } = useTranslation('customer');
  const {
    redeemReward: redeemVoucher,
    isRedeeming,
    availableRewards,
  } = useReward();
  const [showQuickRedeem, setShowQuickRedeem] = useState(false);

  // Danh sách phần thưởng quy đổi nhanh trong màn hình đặt lịch lấy từ API (giới hạn 4 món)
  const quickRedeemList = availableRewards.slice(0, 4);

  const handleQuickRedeem = async (
    rewardId: string,
    requiredPts: number,
    title: string,
  ) => {
    if (totalPoints < requiredPts) {
      toast.error(t("bookWash.voucher.toastNotEnoughPoints", { defaultValue: "You do not have enough points to redeem this voucher!" }));
      return;
    }

    try {
      const newVoucher = await redeemVoucher(rewardId);
      toast.success(t("bookWash.voucher.toastRedeemSuccess", { title, defaultValue: `Successfully redeemed: ${title}` }));
      if (newVoucher) {
        onSelectVoucher(newVoucher);
      }
    } catch (error) {
      toast.error(t("bookWash.voucher.toastRedeemFailed", { defaultValue: "Failed to redeem voucher. Please try again." }));
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
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm transition-all hover:shadow-md">
      {/* COMPONENT HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm tracking-tight">
              {t("bookWash.voucher.title", { defaultValue: "Your Rewards" })}
            </h3>
            <p className="text-[11px] font-medium text-slate-400">
              {t("bookWash.voucher.selectSubtitle", { defaultValue: "Select an available voucher for your booking" })}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowQuickRedeem(!showQuickRedeem)}
          className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
            showQuickRedeem
              ? "bg-amber-50 text-amber-600 border-amber-200 shadow-sm"
              : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
          }`}
        >
          <Gift className="w-3.5 h-3.5" />
          {showQuickRedeem ? t("bookWash.voucher.viewMyVouchers", { defaultValue: "View My Vouchers" }) : t("bookWash.voucher.redeemMore", { defaultValue: "Redeem More" })}
        </button>
      </div>

      {/* MAIN CONTAINER */}
      <div className="relative">
        {!showQuickRedeem ? (
          /* LIST OF CURRENT VOUCHERS */
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
            {usableVouchers.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <p className="text-xs font-semibold text-slate-400">
                  {t("bookWash.voucher.noVouchers", { defaultValue: "You don't have any usable vouchers." })}
                </p>
              </div>
            ) : (
              usableVouchers.map((voucher) => {
                const isSelected = selectedVoucherId === voucher.id;
                return (
                  <div
                    key={voucher.id}
                    onClick={() => onSelectVoucher(isSelected ? null : voucher)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-50/70 border-blue-500 shadow-sm"
                        : "bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl ${isSelected ? "bg-blue-500 text-white" : "bg-slate-50 text-slate-500"}`}
                      >
                        <Ticket className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-800">
                          {(voucher as any).name ||
                            (voucher as any).title ||
                            (voucher as any).description ||
                            t("bookWash.voucher.fallbackTitle", { defaultValue: "Reward Voucher" })}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                          {t("bookWash.voucher.codeLabel", { defaultValue: "Code:" })}{" "}
                          <span className="font-mono text-slate-600">
                            {voucher.code}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {voucher.discountValue && (
                        <span
                          className={`text-[11px] font-black px-2 py-0.5 rounded-md ${
                            isSelected
                              ? "bg-blue-100 text-blue-700"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          -{voucher.discountValue.toLocaleString()}₫
                        </span>
                      )}
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          isSelected
                            ? "bg-blue-500 border-blue-500 text-white"
                            : "border-slate-200 bg-white"
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
          /* QUICK REDEEM SHOP */
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-3 text-white mb-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-white text-amber-300 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-100">
                    {t("bookWash.voucher.pointsWallet", { defaultValue: "Your points wallet" })}
                  </span>
                </div>
                <span className="text-sm font-black tracking-tight bg-white/20 px-2 py-0.5 rounded-lg">
                  {totalPoints.toLocaleString()} pts
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
              {quickRedeemList.length === 0 ? (
                <div className="col-span-2 text-center py-6 text-xs font-bold text-slate-400">
                  {t("bookWash.voucher.noAvailableRewards", { defaultValue: "No reward vouchers currently available to redeem." })}
                </div>
              ) : (
                quickRedeemList.map((reward) => {
                  const canRedeem = totalPoints >= reward.pointsCost;
                  return (
                    <div
                      key={reward.id}
                      className="bg-slate-50/50 border border-slate-100 rounded-xl p-2.5 flex flex-col justify-between gap-2"
                    >
                      <div>
                        <h5 className="text-[11px] font-black text-slate-800 line-clamp-1">
                          {reward.name}
                        </h5>
                        <p className="text-[9px] font-medium text-slate-400 mt-0.5 line-clamp-1">
                          {reward.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                        <span className="text-xs font-black text-slate-700">
                          {reward.pointsCost} pts
                        </span>
                        <button
                          onClick={() =>
                            handleQuickRedeem(
                              reward.id,
                              reward.pointsCost,
                              reward.name,
                            )
                          }
                          disabled={isRedeeming || !canRedeem}
                          className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg shadow-sm ${
                            canRedeem
                              ? "bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all"
                              : "bg-slate-100 text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          {isRedeeming ? t("bookWash.voucher.redeeming", { defaultValue: "Redeeming..." }) : t("bookWash.voucher.redeemNow", { defaultValue: "Redeem Now" })}
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
    </div>
  );
};
