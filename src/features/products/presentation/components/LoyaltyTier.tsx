import React from 'react';
import { Crown, TrendingUp, Gift, Award, Calendar, History } from 'lucide-react';

interface MembershipTier {
    name: string;
    pointsRange: string;
    discount: string;
    multiplier: string;
    advanceBooking: number;
    benefits: string[];
    isCurrent: boolean;
    colorClass: string;
    bgClass: string;
    icon: React.ReactNode;
}

interface Transaction {
    date: string;
    description: string;
    type: 'Earned' | 'Redeemed';
    points: number;
}

export const LoyaltyTier: React.FC = () => {

    // --- Giả lập dữ liệu từ UI mẫu ---
    const currentPoints = 850;
    const targetPoints = 1000;
    const pointsToGo = targetPoints - currentPoints;
    const progressPercentage = (currentPoints / targetPoints) * 100;

    const tiers: MembershipTier[] = [
        {
            name: 'Member',
            pointsRange: '0 - 299 points',
            discount: '5%',
            multiplier: '1x',
            advanceBooking: 7,
            benefits: ['Birthday bonus'],
            isCurrent: false,
            colorClass: 'border-slate-200 text-blue-600',
            bgClass: 'bg-blue-50',
            icon: <Award className="w-6 h-6 text-blue-600" />
        },
        {
            name: 'Silver',
            pointsRange: '300 - 599 points',
            discount: '10%',
            multiplier: '1.5x',
            advanceBooking: 10,
            benefits: ['Priority support', 'Exclusive offers'],
            isCurrent: false,
            colorClass: 'border-slate-200 text-slate-400',
            bgClass: 'bg-slate-50',
            icon: <Award className="w-6 h-6 text-slate-400" />
        },
        {
            name: 'Gold',
            pointsRange: '600 - 999 points',
            discount: '15%',
            multiplier: '2x',
            advanceBooking: 12,
            benefits: ['Priority booking', 'Free wash on birthday'],
            isCurrent: true,
            colorClass: 'border-amber-400 ring-2 ring-amber-400 text-amber-500',
            bgClass: 'bg-amber-50',
            icon: <Crown className="w-6 h-6 text-amber-500" />
        },
        {
            name: 'Platinum',
            pointsRange: '1000+ points',
            discount: '20%',
            multiplier: '3x',
            advanceBooking: 14,
            benefits: ['VIP priority access', 'Dedicated account manager'],
            isCurrent: false,
            colorClass: 'border-purple-200 text-purple-600',
            bgClass: 'bg-purple-50',
            icon: <Gift className="w-6 h-6 text-purple-600" />
        }
    ];

    const transactions: Transaction[] = [
        { date: 'May 15, 2026', description: 'Premium Wash Booking', type: 'Earned', points: 45 },
        { date: 'May 12, 2026', description: 'Basic Wash Booking', type: 'Earned', points: 25 },
        { date: 'May 10, 2026', description: 'Redeemed: Free Wash Voucher', type: 'Redeemed', points: -200 },
        { date: 'May 08, 2026', description: 'Ceramic Wash Booking', type: 'Earned', points: 85 },
        { date: 'May 05, 2026', description: 'Premium Wash Booking', type: 'Earned', points: 45 },
    ];

    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans antialiased text-slate-800">
            <div className="max-w-6xl mx-auto space-y-8">

                {/* =========================================================================
            HEADER BANNER (Thông tin hạng hiện tại & Tiến trình)
           ========================================================================= */}
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-2xl p-6 md:p-8 shadow-lg">
                    <div className="relative z-10 flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                        <div>
                            <p className="text-sm font-medium text-blue-100 uppercase tracking-wider">Your Current Tier</p>
                            <h1 className="text-3xl md:text-4xl font-bold mt-1 flex items-center gap-2">
                                Gold Member <Crown className="w-8 h-8 text-amber-300 fill-amber-300" />
                            </h1>
                            <p className="text-xl font-semibold text-blue-50 mt-2">{currentPoints} Total Points</p>
                        </div>

                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl flex items-center gap-3 border border-white/10">
                            <div className="p-3 bg-white/20 rounded-lg">
                                <Crown className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    {/* Thanh Tiến trình (Progress Bar) */}
                    <div className="mt-8 relative z-10">
                        <div className="flex justify-between text-sm font-medium text-blue-100 mb-2">
                            <span>Progress to Platinum</span>
                            <span>{pointsToGo} points to go</span>
                        </div>
                        <div className="w-full bg-blue-700/50 h-3 rounded-full overflow-hidden p-[2px]">
                            <div
                                className="bg-white h-full rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                        <p className="text-xs text-blue-200 mt-2 italic">
                            Tiers are auto-reviewed & upgraded/downgraded monthly based on your past 3 months' data
                        </p>
                    </div>

                    {/* Chỉ số Tóm tắt nhanh */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10 relative z-10">
                        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl text-center border border-white/5">
                            <TrendingUp className="w-5 h-5 mx-auto mb-1 text-blue-200" />
                            <p className="text-2xl font-bold">{currentPoints}</p>
                            <p className="text-xs text-blue-200">Total Points</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl text-center border border-white/5">
                            <Gift className="w-5 h-5 mx-auto mb-1 text-blue-200" />
                            <p className="text-2xl font-bold">15%</p>
                            <p className="text-xs text-blue-200">Discount Rate</p>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm p-4 rounded-xl text-center border border-white/5">
                            <Award className="w-5 h-5 mx-auto mb-1 text-blue-200" />
                            <p className="text-2xl font-bold">2x</p>
                            <p className="text-xs text-blue-200">Points Multiplier</p>
                        </div>
                    </div>
                </div>

                {/* =========================================================================
            HOW YOU EARN POINTS (Quy tắc tính điểm)
           ========================================================================= */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">How You Earn Points</h2>
                    </div>

                    <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 mb-6">
                        <p className="text-lg font-bold text-emerald-900 text-center sm:text-left">
                            Points = (Payment Amount / 1000) × Tier Multiplier
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {tiers.map((t) => (
                            <div key={t.name} className={`p-4 rounded-xl text-center border ${t.isCurrent ? 'bg-amber-50/30 border-amber-200' : 'bg-slate-50/50 border-slate-100'}`}>
                                <p className="text-sm font-medium text-slate-500">{t.name}</p>
                                <p className={`text-2xl font-black mt-1 ${t.isCurrent ? 'text-amber-600' : 'text-blue-600'}`}>{t.multiplier}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-slate-400 mt-4 italic">
                        Example: A $45 wash for Gold members = (45/1000) × 2 = 0.09 × 2 = 0.18 points
                    </p>
                </div>

                {/* =========================================================================
            MEMBERSHIP TIERS (Chi tiết quyền lợi từng hạng)
           ========================================================================= */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">Membership Tiers</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {tiers.map((tier) => (
                            <div
                                key={tier.name}
                                className={`relative bg-white rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between ${tier.colorClass} shadow-sm hover:shadow-md`}
                            >
                                {tier.isCurrent && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow">
                    Current Tier
                  </span>
                                )}

                                <div>
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${tier.bgClass}`}>
                                        {tier.icon}
                                    </div>

                                    <h3 className="text-2xl font-bold text-slate-800">{tier.name}</h3>
                                    <p className="text-sm text-slate-500 mt-1 font-medium">{tier.pointsRange}</p>

                                    <div className="mt-6 space-y-3 pt-6 border-t border-slate-100">
                                        <div className="flex items-center gap-2 text-sm text-slate-700">
                                            <span className="text-emerald-500 font-bold">✓</span>
                                            <span><strong>{tier.discount}</strong> discount</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-700">
                                            <span className="text-emerald-500 font-bold">✓</span>
                                            <span>Points × <strong>{tier.multiplier}</strong></span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-slate-700">
                                            <span className="text-emerald-500 font-bold">✓</span>
                                            <span>Book <strong>{tier.advanceBooking} days</strong> in advance</span>
                                        </div>
                                        {tier.benefits.map((benefit, idx) => (
                                            <div key={idx} className="flex items-center gap-2 text-sm text-slate-700">
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

                {/* =========================================================================
            STATS & TRANSACTION HISTORY (Thống kê & Lịch sử)
           ========================================================================= */}
                <div className="space-y-6">
                    {/* Hộp chỉ số Thống kê tháng */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Points Earned</p>
                                <p className="text-3xl font-bold text-slate-800 mt-1">285</p>
                                <p className="text-xs text-slate-400 mt-1">This month</p>
                            </div>
                            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Points Redeemed</p>
                                <p className="text-3xl font-bold text-slate-800 mt-1">200</p>
                                <p className="text-xs text-slate-400 mt-1">This month</p>
                            </div>
                            <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                                <Gift className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Total Bookings</p>
                                <p className="text-3xl font-bold text-slate-800 mt-1">8</p>
                                <p className="text-xs text-slate-400 mt-1">This month</p>
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
                            <h3 className="text-lg font-bold text-slate-800">Transaction History</h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                                    <th className="py-4 px-6">Date</th>
                                    <th className="py-4 px-6">Description</th>
                                    <th className="py-4 px-6">Type</th>
                                    <th className="py-4 px-6 text-right">Points</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                                {transactions.map((tx, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="py-4 px-6 font-medium text-slate-400">{tx.date}</td>
                                        <td className="py-4 px-6 font-semibold text-slate-800">{tx.description}</td>
                                        <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                            tx.type === 'Earned'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                        }`}>
                          {tx.type}
                        </span>
                                        </td>
                                        <td className={`py-4 px-6 text-right font-bold text-base ${
                                            tx.points > 0 ? 'text-emerald-600' : 'text-rose-600'
                                        }`}>
                                            {tx.points > 0 ? `+${tx.points}` : tx.points}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default LoyaltyTier;