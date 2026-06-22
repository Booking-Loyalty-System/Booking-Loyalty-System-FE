import React, { useState } from 'react';
import { Gift, Ticket, Star, Sparkles, CheckCircle, Info, History } from 'lucide-react';
import { useVoucher } from '@/features/products/application/useVoucher.ts';
import { useCustomerMe } from '@/features/products/application/useCustomer.ts';
import { toast } from 'sonner';

// --- Interface phụ cho danh sách phần thưởng UI ---
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
}

export const RewardsSection: React.FC = () => {
    // 🌟 Dùng useCustomerMe để lấy số điểm thật của khách hàng đang đăng nhập
    const { customerMe } = useCustomerMe();
    // 🌟 Dùng useVoucher để lấy danh sách voucher thật và hàm đổi voucher
    const { vouchers, redeemVoucher, isRedeeming } = useVoucher();

    const availablePoints = customerMe?.totalPoints ?? 0;
    const [redeemingId, setRedeemingId] = useState<string | null>(null);

    // --- Cấu hình danh sách phần thưởng dựa theo ảnh UI ---
    const rewards: RewardItem[] = [
        {
            id: 'rw_1',
            title: 'Free Basic Wash',
            description: 'Redeem for one complimentary basic car wash service',
            validDays: 30,
            requiredPts: 200,
            icon: <Gift className="w-6 h-6" />,
            iconBg: 'bg-blue-50',
            iconColor: 'text-blue-600',
        },
        {
            id: 'rw_2',
            title: '100.000đ Discount Voucher',
            description: 'Get 100.000đ off on any service package',
            validDays: 60,
            requiredPts: 150,
            icon: <Ticket className="w-6 h-6" />,
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
        },
        {
            id: 'rw_3',
            title: 'VIP Booking Slot',
            description: 'Priority booking access for premium time slots',
            validDays: 90,
            requiredPts: 300,
            icon: <Star className="w-6 h-6" />,
            iconBg: 'bg-purple-50',
            iconColor: 'text-purple-600',
        },
        {
            id: 'rw_4',
            title: 'Free Premium Wash',
            description: 'Redeem for one complimentary premium car wash service',
            validDays: 30,
            requiredPts: 400,
            icon: <Sparkles className="w-6 h-6" />,
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-500',
        },
        {
            id: 'rw_5',
            title: '250.000đ Discount Voucher',
            description: 'Get 250.000đ off on any service package',
            validDays: 60,
            requiredPts: 350,
            icon: <Ticket className="w-6 h-6" />,
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
        },
        {
            id: 'rw_6',
            title: 'Free Ceramic Coating',
            description: 'Redeem for complimentary ceramic coating service',
            validDays: 30,
            requiredPts: 800,
            icon: <Sparkles className="w-6 h-6" />,
            iconBg: 'bg-amber-50',
            iconColor: 'text-amber-500',
            comingSoon: true,
        },
    ];

    const handleRedeemClick = async (rewardId: string, cost: number, title: string) => {
        if (availablePoints < cost) {
            toast.error('You do not have enough points to redeem this reward!');
            return;
        }
        setRedeemingId(rewardId);
        try {
            await redeemVoucher(rewardId);
            toast.success(`Successfully redeemed: ${title}! Voucher has been added to your account.`);
        } catch (err) {
            console.error(err);
            toast.error('Redemption failed, please try again.');
        } finally {
            setRedeemingId(null);
        }
    };

    return (
        <div className="w-full space-y-8 text-slate-800">

            {/* 1. Thanh thông báo tự động áp dụng khi checkout */}
            <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-5 flex items-start gap-4">
                <div className="p-2 bg-white rounded-full text-emerald-600 shadow-sm shrink-0">
                    <Info className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                    <h4 className="font-bold text-emerald-900 text-base">Auto-Applied at Checkout</h4>
                    <p className="text-sm text-emerald-800 leading-relaxed">
                        All redeemed vouchers, free washes, and tier perks are <strong className="text-emerald-900 font-extrabold">automatically applied at checkout</strong>. No need to enter codes manually - just redeem and book!
                    </p>
                </div>
            </div>

            {/* 2. Danh sách phần thưởng */}
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                    <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Available Rewards</h2>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500">
                        <CheckCircle className="w-4 h-4 text-slate-400" />
                        <span>You can redeem {rewards.filter(r => !r.comingSoon && availablePoints >= r.requiredPts).length} rewards</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rewards.map((item) => {
                        const canAfford = availablePoints >= item.requiredPts;

                        return (
                            <div
                                key={item.id}
                                className={`bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative ${
                                    item.comingSoon ? 'opacity-75' : ''
                                }`}
                            >
                                {item.comingSoon && (
                                    <span className="absolute top-4 right-4 bg-slate-100 text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full">
                    Coming Soon
                  </span>
                                )}

                                <div>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.iconBg} ${item.iconColor}`}>
                                        {item.icon}
                                    </div>

                                    <h3 className="text-lg font-bold text-slate-800 tracking-tight">{item.title}</h3>
                                    <p className="text-sm text-slate-500 mt-2 leading-relaxed font-medium">{item.description}</p>

                                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mt-4">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                        <span>Valid for {item.validDays} days</span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Required</p>
                                        <p className="text-xl font-black text-slate-800 mt-0.5">{item.requiredPts} <span className="text-sm font-bold text-slate-500">pts</span></p>
                                    </div>

                                    <button
                                        onClick={() => handleRedeemClick(item.id, item.requiredPts, item.title)}
                                        disabled={item.comingSoon || !canAfford || isRedeeming || redeemingId === item.id}
                                        className={`font-bold text-sm px-6 py-2.5 rounded-xl shadow-sm transition-all ${
                                            !item.comingSoon && canAfford
                                                ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95'
                                                : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                                        }`}
                                    >
                                        {redeemingId === item.id ? 'Redeeming...' : 'Redeem Now'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 3. Phần lịch sử đổi thưởng gần đây */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-2.5">
                    <History className="w-5 h-5 text-slate-400" />
                    <h3 className="text-lg font-bold text-slate-800 tracking-tight">Recently Redeemed</h3>
                </div>

                <div className="divide-y divide-slate-100">
                    {vouchers.length === 0 ? (
                        <p className="text-sm text-slate-400 font-medium text-center py-8">No redemption history yet.</p>
                    ) : vouchers.map((v) => (
                        <div
                            key={v.id}
                            className="p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                                    v.isFreeWash ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                                }`}>
                                    {v.isFreeWash ? <Gift className="w-6 h-6" /> : <Ticket className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-base tracking-tight">{v.title}</h4>
                                    <p className="text-sm text-slate-400 font-medium mt-1">Expires: {v.expiryDate} · Code: <span className="font-mono">{v.code}</span></p>
                                </div>
                            </div>

                            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                                <p className="text-lg font-black text-slate-800 tracking-tight">
                                    -{v.requiredPoints} <span className="text-xs font-bold text-slate-500">pts</span>
                                </p>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                    v.status === 'Active'
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : v.status === 'Used'
                                            ? 'bg-slate-100 text-slate-600'
                                            : 'bg-rose-50 text-rose-600'
                                }`}>
                                    {v.status === 'Active' ? 'Active' : v.status === 'Used' ? 'Used' : 'Expired'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};