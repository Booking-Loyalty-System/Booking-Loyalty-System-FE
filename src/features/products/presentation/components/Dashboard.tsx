import React from 'react';
import {
    Calendar, Star, Award, TrendingUp, Gift, CheckCircle2,
    Sparkles, Clock, XCircle, ArrowRight, Megaphone, History
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCustomerMe } from '@/features/products/application/useCustomer.ts';
import { useAuth } from '@/features/products/application/useAuth.ts';

export const Dashboard: React.FC = () => {
    // 🌟 Lấy thông tin khách hàng đang đăng nhập từ Application Layer
    const { customerMe } = useCustomerMe();
    const { user } = useAuth();
    const navigate = useNavigate();

    const displayName = customerMe?.fullName || user?.fullName || 'Khách hàng';
    const totalPoints = customerMe?.totalPoints ?? 850;
    const tier = customerMe?.tier ?? 'Gold';
    const washesCount = customerMe?.totalWashes ?? 5;

    // Giả lập dữ liệu và điều chỉnh đơn vị tiền tệ sang VND
    const stats = [
        { id: 1, label: 'This Month', value: '8', sub: 'Total Bookings', icon: <Calendar className="w-5 h-5 text-blue-500" />, bg: 'bg-blue-50' },
        { id: 2, label: 'Loyalty', value: totalPoints.toString(), sub: 'Total Points', icon: <Star className="w-5 h-5 text-emerald-500" />, bg: 'bg-emerald-50' },
        { id: 3, label: 'Status', value: tier, sub: 'Membership Tier', icon: <Award className="w-5 h-5 text-purple-500" />, bg: 'bg-purple-50' },
        { id: 4, label: 'Savings', value: '1.270.000đ', sub: 'Total Saved', icon: <TrendingUp className="w-5 h-5 text-orange-500" />, bg: 'bg-orange-50' },
    ];

    const quickActions = [
        { name: 'Book Wash', desc: 'Schedule a new wash', icon: <Calendar className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50', path: '/book-wash' },
        { name: 'Rewards', desc: 'Redeem your points', icon: <Gift className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50', path: '/rewards' },
        { name: 'Promotions', desc: 'View active deals', icon: <Megaphone className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50', path: '/promotions' },
        { name: 'History', desc: 'View past bookings', icon: <History className="w-5 h-5 text-orange-600" />, bg: 'bg-orange-50', path: '/booking-history' },
    ];

    // Logic tính tiến trình rửa xe (cứ mỗi 7 lần thì đầy thanh)
    let currentCycleWashes = washesCount % 7;
    // Nếu chia hết cho 7 và lớn hơn 0 (ví dụ 7, 14, 21) thì hiển thị đầy thanh (7/7) thay vì (0/7)
    if (currentCycleWashes === 0 && washesCount > 0) {
        currentCycleWashes = 7;
    }

    const remainingWashes = 7 - currentCycleWashes;
    const washProgressPercentage = Math.round((currentCycleWashes / 7) * 100);

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-fade-in">

            {/* WELCOME HEADER (image_6ebedd.png) */}
            <div className="space-y-1">
                <h1 className="text-3xl font-extrabold text-[#0f172a] flex items-center gap-2">
                    Welcome back, {displayName}! <span className="animate-bounce">👋</span>
                </h1>
                <p className="text-sm text-[#64748b] font-medium">Here's what's happening with your account today.</p>
            </div>

            {/* 4 THẺ THỐNG KÊ (STATS CARDS) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.id} className="bg-white border border-[#e2e8f0] rounded-2xl p-6 flex flex-col justify-between min-h-[140px] relative group hover:shadow-sm transition-all">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-[#94a3b8] font-bold tracking-wide uppercase">{stat.label}</span>
                            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                                {stat.icon}
                            </div>
                        </div>
                        <div className="mt-4">
                            <span className="block text-3xl font-black text-[#0f172a]">{stat.value}</span>
                            <span className="text-xs text-[#64748b] font-semibold">{stat.sub}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* FREE WASH REWARD PROGRESS (Thanh tiến trình màu xanh lá) */}
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-start">
                    <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-[#16a34a] rounded-xl flex items-center justify-center text-white shadow-sm">
                            <Gift className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#14532d]">Free Wash Reward Progress</h3>
                            <p className="text-xs text-[#166534] font-medium">Complete 7 washes to earn a FREE wash!</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="block text-3xl font-black text-[#16a34a]">{currentCycleWashes}/7</span>
                        <span className="text-[10px] text-[#166534] font-bold uppercase tracking-wider">Washes Done</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#dcfce7] h-6 rounded-full overflow-hidden relative flex items-center">
                    <div
                        className="bg-[#16a34a] h-full rounded-full flex items-center justify-end pr-3 transition-all duration-500"
                        style={{ width: `${washProgressPercentage}%` }}
                    >
                        <span className="text-[10px] font-bold text-white">{washProgressPercentage}%</span>
                    </div>
                </div>

                {/* Chấm điểm mốc tròn (1-7) và text thông báo */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-1">
                    <p className="text-sm font-semibold text-[#166534]">
                        {remainingWashes > 0 ? (
                            <>
                                <span className="text-[#16a34a] font-bold">{remainingWashes} more washes</span> to unlock your FREE wash reward!
                            </>
                        ) : (
                            <span className="text-[#16a34a] font-bold">You unlocked a FREE wash reward! 🎉</span>
                        )}
                    </p>

                    {/* Badge đếm số từ 1 đến 7 */}
                    <div className="flex items-center gap-1.5">
                        {Array.from({ length: 7 }).map((_, idx) => {
                            const step = idx + 1;
                            if (step <= currentCycleWashes) {
                                return <CheckCircle2 key={step} className="w-6 h-6 text-[#16a34a] fill-white" />;
                            }
                            return (
                                <div key={step} className="w-6 h-6 rounded-full bg-[#e2e8f0] flex items-center justify-center text-xs font-bold text-[#94a3b8]">
                                    {step}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* PHẦN LAYOUT HAI CỘT CHÍNH (image_6ebedc.png) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* CỘT TRÁI: CURRENT TIER CARD (Bản rộng 2 phần) */}
                <div className="lg:col-span-2 bg-gradient-to-br from-[#1e6ffd] via-[#2563eb] to-[#1d4ed8] rounded-3xl p-8 text-white relative overflow-hidden shadow-lg min-h-[340px] flex flex-col justify-between">
                    {/* Decor vòng tròn mờ phía sau */}
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

                    <div className="space-y-6 relative z-10">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                                    <Award className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <span className="block text-xs text-blue-100 font-semibold tracking-wider uppercase">Current Tier</span>
                                    <h2 className="text-3xl font-black tracking-tight">{tier} Member</h2>
                                </div>
                            </div>
                            <Sparkles className="w-8 h-8 text-blue-200 animate-pulse" />
                        </div>

                        {/* Thanh Tiến Trình Lên Platinum */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-blue-100">
                                <span>Progress to Next Tier</span>
                                <span>{totalPoints}/1000 points</span>
                            </div>
                            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                                <div className="bg-white h-full rounded-full" style={{ width: `${Math.min(100, (totalPoints / 1000) * 100)}%` }}></div>
                            </div>
                            <p className="text-xs text-blue-100 font-medium pt-1">
                                {Math.max(0, 1000 - totalPoints)} points to next tier <br />
                                <span className="opacity-75 text-[11px]">Tiers are auto-reviewed monthly based on your past 3 months' data</span>
                            </p>
                        </div>
                    </div>

                    {/* Hàng 3 khối thông số phụ nằm đáy card */}
                    <div className="grid grid-cols-3 gap-4 pt-6 mt-4 border-t border-white/10 relative z-10">
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                            <span className="block text-xl font-black">{totalPoints}</span>
                            <span className="text-[10px] text-blue-100 font-semibold uppercase">Total Points</span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                            <span className="block text-xl font-black">{tier === 'Gold' ? '2x' : tier === 'Platinum' ? '3x' : '1.5x'}</span>
                            <span className="text-[10px] text-blue-100 font-semibold uppercase">Points Multiplier</span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                            <span className="block text-xl font-black">12</span>
                            <span className="text-[10px] text-blue-100 font-semibold uppercase">Booking Days</span>
                        </div>
                    </div>
                </div>

                {/* CỘT PHẢI: UPCOMING BOOKING (Bản hẹp 1 phần) */}
                <div className="bg-white border border-[#e2e8f0] rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[340px]">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
                            <h3 className="text-base font-bold text-[#0f172a] flex items-center gap-2">
                                Upcoming Booking
                            </h3>
                            <Clock className="w-4 h-4 text-[#94a3b8]" />
                        </div>

                        {/* Thẻ chi tiết lịch hẹn */}
                        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#0f172a] text-sm">Premium Wash</h4>
                                    <p className="text-xs text-[#64748b] font-semibold">May 18, 2026</p>
                                </div>
                            </div>

                            <div className="space-y-2 text-xs font-semibold pt-1">
                                <div className="flex justify-between">
                                    <span className="text-[#94a3b8]">Time</span>
                                    <span className="text-[#0f172a]">10:00 AM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#94a3b8]">Vehicle</span>
                                    <span className="text-[#0f172a]">ABC-1234</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[#94a3b8]">Status</span>
                                    <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md text-[10px] font-bold">Confirmed</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Khu vực nút hành động ở đáy */}
                    <div className="flex items-center justify-between pt-4 border-t border-[#f1f5f9] mt-4">
                        <button className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-xl text-xs font-bold transition-colors">
                            <XCircle className="w-4 h-4" />
                            Cancel Booking
                        </button>
                        <button className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors">
                            View All
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            </div>

            {/* SECTION: QUICK ACTIONS */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#0f172a]">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {quickActions.map((action, i) => (
                        <div
                            key={i}
                            onClick={() => navigate(action.path)}
                            className="bg-white border border-[#e2e8f0] hover:border-blue-200 rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
                        >
                            <div className={`w-12 h-12 ${action.bg} rounded-xl flex items-center justify-center shrink-0`}>
                                {action.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-[#0f172a] text-sm group-hover:text-blue-600 transition-colors">{action.name}</h4>
                                <p className="text-xs text-[#94a3b8] font-medium mt-0.5">{action.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
};