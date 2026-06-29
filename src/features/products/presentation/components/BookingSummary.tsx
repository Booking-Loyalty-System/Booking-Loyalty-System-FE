import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { BookingSummaryProps } from "@/features/products/domain/models/booking/booking.model.ts";
import { Tag, X, CheckCircle2 } from 'lucide-react';

export const BookingSummary: React.FC<BookingSummaryProps> = ({
    selectedPackageId, selectedTime, currentVehicle, currentPackage, selectedDateSlot, isBooking, onConfirmBooking, selectedVoucher, appliedPromotion, onApplyPromotion, onRemovePromotion
}) => {
    const { t } = useTranslation('customer');
    const originalPrice = currentPackage?.price || 0;
    let voucherDiscount = 0;
    let promoDiscount = 0;

    if (selectedVoucher) {
        if (selectedVoucher.isFreeWash) {
            voucherDiscount = originalPrice;
        } else {
            voucherDiscount = Math.min(originalPrice, selectedVoucher.discountValue);
        }
    }

    const priceAfterVoucher = Math.max(0, originalPrice - voucherDiscount);

    if (appliedPromotion) {
        if (appliedPromotion.discountType === 'FixedAmount') {
            promoDiscount = Math.min(priceAfterVoucher, appliedPromotion.discountValue);
        } else if (appliedPromotion.discountType === 'Percentage') {
            promoDiscount = Math.floor(priceAfterVoucher * (appliedPromotion.discountValue / 100));
        }
    }

    const totalPrice = Math.max(0, priceAfterVoucher - promoDiscount);

    const [promoInput, setPromoInput] = useState('');
    const [promoError, setPromoError] = useState('');
    const [isApplyingPromo, setIsApplyingPromo] = useState(false);

    const handleApplyPromo = async () => {
        if (!promoInput.trim()) return;
        setIsApplyingPromo(true);
        setPromoError('');
        if (onApplyPromotion) {
            const result = await onApplyPromotion(promoInput.trim());
            if (result !== true) {
                setPromoError(result as string);
            } else {
                setPromoInput(''); // Clear on success
            }
        }
        setIsApplyingPromo(false);
    };

    return (
        <div className="w-full lg:w-80 shrink-0 sticky top-6">
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[350px]">
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-[#0f172a] border-b border-[#f1f5f9] pb-3">{t('bookWash.summary.title', { defaultValue: "Booking Summary" })}</h3>

                    {!selectedPackageId ? (
                        <div className="text-center py-12 text-[#94a3b8] font-medium text-sm px-4">
                            {t('bookWash.summary.selectToContinue', { defaultValue: "Select a vehicle and wash package to continue" })}
                        </div>
                    ) : (
                        <div className="space-y-4 text-sm">
                            {currentVehicle && (
                                <div className="flex justify-between items-start">
                                    <div>
                                        <span className="block text-xs text-[#94a3b8] font-medium">{t('bookWash.summary.vehicle', { defaultValue: "Vehicle" })}</span>
                                        <span className="font-bold text-[#334155]">{currentVehicle.vehicleName}</span>
                                    </div>
                                    <span className="text-xs font-bold bg-blue-50 text-[#1e6ffd] px-2 py-1 rounded-md">{currentVehicle.licensePlate}</span>
                                </div>
                            )}
                            {currentPackage && (
                                <div className="flex justify-between items-center border-t border-[#f1f5f9] pt-3">
                                    <div>
                                        <span className="block text-xs text-[#94a3b8] font-medium">{t('bookWash.summary.package', { defaultValue: "Wash Package" })}</span>
                                        <span className="font-bold text-[#334155]">{currentPackage.name}</span>
                                    </div>
                                    <span className="font-extrabold text-[#0f172a] text-lg">{originalPrice.toLocaleString('vi-VN')}đ</span>
                                </div>
                            )}
                            <div className="flex flex-col gap-1 border-t border-[#f1f5f9] pt-3">
                                <span className="block text-xs text-[#94a3b8] font-medium">{t('bookWash.summary.dateTime', { defaultValue: "Schedule Time" })}</span>
                                <span className="font-bold text-[#334155]">
                                    {selectedDateSlot?.fullDate} {selectedTime ? `- ${selectedTime}` : t('bookWash.summary.pleaseChooseTime', { defaultValue: '(Please choose time)' })}
                                </span>
                            </div>

                            {/* Voucher Discount Display */}
                            {selectedVoucher && (
                                <div className="flex justify-between items-center border-t border-[#f1f5f9] pt-3 text-emerald-600 font-medium">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-slate-400">{t('bookWash.summary.appliedVoucher', { defaultValue: "Applied Voucher" })}</span>
                                        <span className="text-xs font-bold truncate max-w-[150px]">{selectedVoucher.title}</span>
                                    </div>
                                    <span className="font-bold">-{voucherDiscount.toLocaleString('vi-VN')}đ</span>
                                </div>
                            )}

                            {/* Promotion Section */}
                            <div className="border-t border-[#f1f5f9] pt-3">
                                {!appliedPromotion ? (
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> {t('bookWash.summary.promoCode', { defaultValue: "Promo Code" })}</label>
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                placeholder={t('bookWash.summary.enterCode', { defaultValue: "Enter code" })} 
                                                value={promoInput}
                                                onChange={(e) => setPromoInput(e.target.value)}
                                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm uppercase font-mono placeholder:normal-case placeholder:font-sans focus:outline-blue-500"
                                            />
                                            <button 
                                                onClick={handleApplyPromo}
                                                disabled={isApplyingPromo || !promoInput.trim()}
                                                className="bg-slate-900 text-white font-bold text-xs px-3 py-2 rounded-xl disabled:opacity-50"
                                            >
                                                {t('bookWash.summary.apply', { defaultValue: "Apply" })}
                                            </button>
                                        </div>
                                        {promoError && <p className="text-xs text-rose-500 font-medium">{promoError}</p>}
                                    </div>
                                ) : (
                                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex justify-between items-start gap-2">
                                        <div className="space-y-0.5">
                                            <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span>{t('bookWash.summary.promoApplied', { defaultValue: "Promo Applied" })}</span>
                                            </div>
                                            <p className="text-xs font-bold text-slate-700">{appliedPromotion.code}</p>
                                            <p className="text-[10px] text-slate-500">{appliedPromotion.title}</p>
                                        </div>
                                        <div className="text-right">
                                            <button onClick={onRemovePromotion} className="text-slate-400 hover:text-rose-500 p-1">
                                                <X className="w-4 h-4" />
                                            </button>
                                            <p className="text-sm font-bold text-emerald-600 mt-1">-{promoDiscount.toLocaleString('vi-VN')}đ</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-[#f1f5f9] pt-4 mt-2 flex justify-between items-baseline">
                                <span className="font-bold text-[#0f172a] text-base">{t('bookWash.summary.totalEstimated', { defaultValue: "Total Estimated:" })}</span>
                                <span className="font-black text-[#1e6ffd] text-2xl">{totalPrice.toLocaleString('vi-VN')}đ</span>
                            </div>
                        </div>
                    )}
                </div>

                <button
                    onClick={onConfirmBooking}
                    disabled={!selectedPackageId || !selectedTime || isBooking}
                    className="w-full mt-6 py-3 px-4 rounded-xl bg-[#1e6ffd] hover:bg-blue-700 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isBooking ? t('bookWash.summary.processing', { defaultValue: "Processing..." }) : t('bookWash.summary.confirmBooking', { defaultValue: "Confirm Booking" })}
                </button>
            </div>
        </div>
    );
};