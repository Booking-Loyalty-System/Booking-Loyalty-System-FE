import React, { useState } from "react";
import type { BookingSummaryProps } from "@/features/products/domain/models/booking/booking.model.ts";
import { Tag, X, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { translateDynamic } from "@/shared/utils/translateDynamic.ts";
import { translatePromotion } from "@/shared/utils/dynamicTranslator.ts";

export const BookingSummary: React.FC<BookingSummaryProps> = ({
  selectedPackageId,
  selectedTime,
  currentVehicle,
  currentPackage,
  selectedDateSlot,
  isBooking,
  onConfirmBooking,
  selectedVoucher,
  appliedPromotion,
  onApplyPromotion,
  onRemovePromotion,
}) => {
  const { t, i18n } = useTranslation("customer");
  const originalPrice = currentPackage?.price || 0;

  // 1. Tính Promotion trên GIÁ GỐC trước
  let promoDiscount = 0;
  if (appliedPromotion) {
    if (typeof (appliedPromotion as any).discountAmount !== "undefined") {
      promoDiscount = Math.min(
        originalPrice,
        Math.max(0, Number((appliedPromotion as any).discountAmount) || 0),
      );
    } else if (appliedPromotion.discountType === "FixedAmount") {
      promoDiscount = Math.min(
        originalPrice,
        Math.max(0, appliedPromotion.discountValue || 0),
      );
    } else if (appliedPromotion.discountType === "Percentage") {
      promoDiscount = Math.min(
        originalPrice,
        Math.floor(
          originalPrice *
            (Math.max(0, appliedPromotion.discountValue || 0) / 100),
        ),
      );
    }
  }

  const priceAfterPromotion = Math.max(0, originalPrice - promoDiscount);

  // 2. Reward/Voucher được trừ SAU Promotion
  let voucherDiscount = 0;
  if (selectedVoucher) {
    const vName =
      (selectedVoucher as any).name || (selectedVoucher as any).title || "";

    const isFreeWash =
      (selectedVoucher as any).isFreeWash === true ||
      vName === "Phần thưởng Rửa Xe Miễn Phí";

    if (isFreeWash) {
      // Free Wash miễn toàn bộ phần tiền còn lại sau Promotion.
      voucherDiscount = priceAfterPromotion;
    } else {
      voucherDiscount = Math.min(
        priceAfterPromotion,
        Math.max(0, Number((selectedVoucher as any).discountValue) || 0),
      );
    }
  }

  // 3. Tổng cuối cùng: Giá gốc → Promotion → Reward/Voucher
  let totalPrice = Math.max(0, priceAfterPromotion - voucherDiscount);

  // Khi không dùng Reward/Voucher, có thể dùng finalAmount do API Promotion trả về.
  if (
    appliedPromotion &&
    typeof (appliedPromotion as any).finalAmount !== "undefined" &&
    !selectedVoucher
  ) {
    totalPrice = Math.max(
      0,
      Number((appliedPromotion as any).finalAmount) || 0,
    );
  }

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setIsApplyingPromo(true);
    setPromoError("");
    if (onApplyPromotion) {
      const result = await onApplyPromotion(promoInput.trim());
      if (result !== true) {
        setPromoError(result as string);
      } else {
        setPromoInput("");
      }
    }
    setIsApplyingPromo(false);
  };

  return (
    <div className="w-full lg:w-80 shrink-0 sticky top-6">
      <div className="bg-white dark:bg-[#13151A] border border-[#e2e8f0] dark:border-white/5 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[350px]">
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-[#0f172a] dark:text-white border-b border-[#f1f5f9] dark:border-white/5 pb-3">
            {t("bookingSummary.title", { defaultValue: "Booking Summary" })}
          </h3>

          {!selectedPackageId ? (
            <div className="text-center py-12 text-[#94a3b8] dark:text-slate-500 font-medium text-sm px-4">
              {t("bookingSummary.promptSelect", {
                defaultValue: "Select a vehicle and wash package to continue",
              })}
            </div>
          ) : (
            <div className="space-y-4 text-sm">
              {currentVehicle && (
                <div className="flex justify-between items-start">
                  <div>
                    <span className="block text-xs text-[#94a3b8] dark:text-slate-500 font-medium">
                      {t("bookingSummary.vehicle", { defaultValue: "Vehicle" })}
                    </span>
                    <span className="font-bold text-[#334155] dark:text-slate-300">
                      {currentVehicle.vehicleName}
                    </span>
                  </div>
                  <span className="text-xs font-bold bg-blue-50 dark:bg-blue-900/30 text-[#1e6ffd] dark:text-blue-400 px-2 py-1 rounded-md">
                    {currentVehicle.licensePlate}
                  </span>
                </div>
              )}
              {currentPackage && (
                <div className="flex justify-between items-center border-t border-[#f1f5f9] dark:border-white/5 pt-3">
                  <div>
                    <span className="block text-xs text-[#94a3b8] dark:text-slate-500 font-medium">
                      {t("bookingSummary.package", {
                        defaultValue: "Wash Package",
                      })}
                    </span>
                    <span className="font-bold text-[#334155] dark:text-slate-300">
                      {currentPackage.name}
                    </span>
                  </div>
                  <span className="font-extrabold text-[#0f172a] dark:text-white text-lg">
                    {originalPrice.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              )}
              <div className="flex flex-col gap-1 border-t border-[#f1f5f9] dark:border-white/5 pt-3">
                <span className="block text-xs text-[#94a3b8] dark:text-slate-500 font-medium">
                  {t("bookingSummary.scheduleTime", {
                    defaultValue: "Schedule Time",
                  })}
                </span>
                <span className="font-bold text-[#334155] dark:text-slate-300">
                  {selectedDateSlot?.fullDate}{" "}
                  {selectedTime
                    ? `- ${selectedTime}`
                    : t("bookingSummary.chooseTime", {
                        defaultValue: "(Please choose time)",
                      })}
                </span>
              </div>

              {/* Promotion Section */}
              <div className="border-t border-[#f1f5f9] dark:border-white/5 pt-3">
                {!appliedPromotion ? (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5" />{" "}
                      {t("bookingSummary.promoCode", {
                        defaultValue: "Promo Code",
                      })}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={t("bookingSummary.enterCode", {
                          defaultValue: "Enter code",
                        })}
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 dark:text-white rounded-xl px-3 py-2 text-sm uppercase font-mono placeholder:normal-case placeholder:font-sans focus:outline-blue-500"
                      />
                      <button
                        onClick={handleApplyPromo}
                        disabled={isApplyingPromo || !promoInput.trim()}
                        className="bg-slate-900 dark:bg-blue-600 dark:border dark:border-white/20 text-white font-bold text-xs px-3 py-2 rounded-xl disabled:opacity-50"
                      >
                        {t("bookingSummary.apply", { defaultValue: "Apply" })}
                      </button>
                    </div>
                    {promoError && (
                      <p className="text-xs text-rose-500 font-medium">
                        {promoError}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl p-3 flex justify-between items-start gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>
                          {t("bookingSummary.promoApplied", {
                            defaultValue: "Promo Applied",
                          })}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        {appliedPromotion.code}
                      </p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">
                        {translatePromotion(
                          (appliedPromotion as any).title ||
                            "Khuyến mãi đã áp dụng",
                          i18n,
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <button
                        onClick={onRemovePromotion}
                        className="text-slate-400 hover:text-rose-500 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                        -{promoDiscount.toLocaleString("vi-VN")}đ
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Reward/Voucher hiển thị sau Promotion đúng theo thứ tự tính tiền */}
              {selectedVoucher && (
                <div className="flex justify-between items-center border-t border-[#f1f5f9] dark:border-white/5 pt-3 text-emerald-600 dark:text-emerald-400 font-medium">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400">
                      {t("bookingSummary.appliedVoucher", {
                        defaultValue: "Applied Voucher",
                      })}
                    </span>
                    <span className="text-xs font-bold truncate max-w-[150px]">
                      {translateDynamic(
                        (selectedVoucher as any).title ||
                          (selectedVoucher as any).name ||
                          "Voucher",
                        i18n.language,
                      )}
                    </span>
                  </div>
                  <span className="font-bold">
                    -{voucherDiscount.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              )}

              <div className="border-t border-[#f1f5f9] dark:border-white/5 pt-4 mt-2 flex justify-between items-baseline">
                <span className="font-bold text-[#0f172a] dark:text-white text-base">
                  {t("bookingSummary.totalEstimated", {
                    defaultValue: "Total Estimated:",
                  })}
                </span>
                <span className="font-black text-[#1e6ffd] dark:text-blue-400 text-2xl">
                  {totalPrice.toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onConfirmBooking}
          disabled={!selectedPackageId || !selectedTime || isBooking}
          className="w-full mt-6 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-[0_8px_30px_rgb(37,99,235,0.3)] hover:-translate-y-0.5 active:translate-y-0 border border-transparent dark:border-white/10 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isBooking
            ? t("bookingSummary.processing", { defaultValue: "Processing..." })
            : t("bookingSummary.confirmBooking", {
                defaultValue: "Confirm Booking",
              })}
        </button>
      </div>
    </div>
  );
};
