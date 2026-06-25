import React, { useState } from 'react';
import { Ticket, Gift, Star, Plus, Check } from 'lucide-react';
import type { Voucher } from '../../domain/models/voucher/voucher.model.ts';
import { useVoucher } from '../../application/useVoucher.ts';
import { toast } from 'sonner';

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
    totalPoints
}) => {
    const { redeemVoucher, isRedeeming } = useVoucher();
    const [showQuickRedeem, setShowQuickRedeem] = useState(false);

    // Danh sách phần thưởng quy đổi nhanh trong màn hình đặt lịch
    const quickRedeemList = [
        {
            id: 'rw_2',
            title: '100.000đ Discount Voucher',
            requiredPts: 150,
            discount: 100000,
            desc: 'Get 100.000đ off on any service'
        },
        {
            id: 'rw_5',
            title: '250.000đ Discount Voucher',
            requiredPts: 350,
            discount: 250000,
            desc: 'Get 250.000đ off on any service'
        }
    ];

    const handleQuickRedeem = async (rewardId: string, requiredPts: number, title: string) => {
        if (totalPoints < requiredPts) {
            toast.error("You do not have enough points to redeem this voucher!");
            return;
        }

        try {
            const newVoucher = await redeemVoucher(rewardId);
            toast.success(`Successfully redeemed: ${title}!`);
            // Tự động chọn voucher vừa đổi
            onSelectVoucher(newVoucher);
            setShowQuickRedeem(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to redeem voucher, please try again.");
        }
    };

    return (
        <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-sm space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                        <Ticket className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-base font-extrabold text-[#0f172a]">Promotions & Vouchers</h3>
                        <p className="text-xs text-[#64748b] font-medium">Apply a discount voucher to your booking</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-xs text-slate-400 font-bold uppercase block">Current Points</span>
                    <span className="text-sm font-black text-emerald-600 flex items-center gap-1">
                        <Star className="w-4 h-4 fill-emerald-500 text-emerald-500" />
                        {totalPoints} pts
                    </span>
                </div>
            </div>

            {/* List of active vouchers */}
            <div className="space-y-3">
                {activeVouchers.length === 0 ? (
                    <div className="text-center py-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-100 p-4">
                        <p className="text-sm text-slate-400 font-medium">You don't have any available discount vouchers.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activeVouchers.map((voucher) => {
                            const isSelected = voucher.id === selectedVoucherId;
                            return (
                                <div
                                    key={voucher.id}
                                    onClick={() => onSelectVoucher(isSelected ? null : voucher)}
                                    className={`relative border rounded-2xl p-4 cursor-pointer transition-all flex items-start gap-3 select-none ${
                                        isSelected
                                            ? 'border-emerald-500 bg-emerald-50/30 shadow-sm'
                                            : 'border-[#e2e8f0] hover:border-slate-300 hover:bg-slate-50/30'
                                    }`}
                                >
                                    <div className={`p-2.5 rounded-xl shrink-0 ${
                                        isSelected ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-500'
                                    }`}>
                                        {voucher.isFreeWash ? <Gift className="w-5 h-5" /> : <Ticket className="w-5 h-5" />}
                                    </div>
                                    <div className="space-y-1 pr-6">
                                        <h4 className="font-bold text-slate-800 text-sm tracking-tight">{voucher.title}</h4>
                                        <p className="text-xs text-slate-400 font-semibold">Code: {voucher.code}</p>
                                        <p className="text-[10px] text-slate-400 font-medium">Expires: {voucher.expiryDate}</p>
                                    </div>
                                    {isSelected && (
                                        <div className="absolute top-4 right-4 bg-emerald-500 text-white rounded-full p-0.5">
                                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Quick Redeem toggle */}
            <div className="border-t border-[#f1f5f9] pt-4">
                {!showQuickRedeem ? (
                    <button
                        onClick={() => setShowQuickRedeem(true)}
                        className="flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        Redeem points for a new voucher
                    </button>
                ) : (
                    <div className="bg-slate-50 rounded-2xl p-4 space-y-4 animate-fade-in">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-500">Quick Redeem Vouchers</span>
                            <button
                                onClick={() => setShowQuickRedeem(false)}
                                className="text-xs font-bold text-slate-400 hover:text-slate-600"
                            >
                                Cancel
                            </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {quickRedeemList.map((reward) => {
                                const canRedeem = totalPoints >= reward.requiredPts;
                                return (
                                    <div
                                        key={reward.id}
                                        className="bg-white border border-[#e2e8f0] rounded-xl p-3.5 flex flex-col justify-between gap-3 shadow-xs"
                                    >
                                        <div>
                                            <h5 className="font-bold text-slate-800 text-xs">{reward.title}</h5>
                                            <p className="text-[10px] text-slate-400 mt-0.5">{reward.desc}</p>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                                            <span className="text-xs font-black text-slate-700">{reward.requiredPts} pts</span>
                                            <button
                                                onClick={() => handleQuickRedeem(reward.id, reward.requiredPts, reward.title)}
                                                disabled={isRedeeming || !canRedeem}
                                                className={`text-[10px] font-extrabold px-3 py-1.5 rounded-lg shadow-sm ${
                                                    canRedeem 
                                                        ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all'
                                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                                }`}
                                            >
                                                {isRedeeming ? 'Redeeming...' : 'Redeem Now'}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
