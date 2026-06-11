import React from 'react';
import {
    Calendar, Star, Award, TrendingUp, Gift, CheckCircle2,
    Sparkles, ArrowRight, Megaphone, History,
    Activity, Droplets, Wind, Zap, Bell, X
} from 'lucide-react';
import { useAuth } from '../../application/useAuth';
import { useLoyalty } from '../../application/useLoyalty';
import { useBooking } from '../../application/useBooking';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const { useGetLoyaltyInfo } = useLoyalty();
    const { useGetMyBookings } = useBooking();
    const navigate = useNavigate();

    const { data: loyaltyInfo } = useGetLoyaltyInfo();
    const { data: bookings = [] } = useGetMyBookings();

    // Logic tìm đơn hàng đang thực hiện (Live Wash)
    // Giả lập một đơn hàng đang in progress nếu có bất kỳ đơn nào status là 'Confirmed' (để demo UI)
    // Trong thực tế sẽ dựa vào status từ Backend
    const activeBooking = bookings.find(b => ['InProgress', 'Washing', 'Drying'].includes(b.status)) || 
                         (bookings.length > 0 ? bookings[0] : null); // Demo purposes

    const upcomingBooking = bookings
        .filter(b => ['Pending', 'Confirmed'].includes(b.status))
        .sort((a, b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime())[0];

    const stats = [
        { id: 1, label: 'This Month', value: bookings.filter(b => new Date(b.bookingDate).getMonth() === new Date().getMonth()).length.toString(), sub: 'Total Bookings', icon: <Calendar className="w-5 h-5 text-blue-500" />, bg: 'bg-blue-50' },
        { id: 2, label: 'Loyalty', value: loyaltyInfo?.totalPoints.toString() || '850', sub: 'Total Points', icon: <Star className="w-5 h-5 text-emerald-500" />, bg: 'bg-emerald-50' },
        { id: 3, label: 'Status', value: loyaltyInfo?.currentTier || 'Gold', sub: 'Membership Tier', icon: <Award className="w-5 h-5 text-purple-500" />, bg: 'bg-purple-50' },
        { id: 4, label: 'Savings', value: `$${(bookings.length * 5 + 127).toFixed(0)}`, sub: 'Total Saved', icon: <TrendingUp className="w-5 h-5 text-orange-500" />, bg: 'bg-orange-50' },
    ];

    const quickActions = [
        { name: 'Book Wash', path: '/book-wash', desc: 'Schedule a new wash', icon: <Calendar className="w-5 h-5 text-blue-600" />, bg: 'bg-blue-50' },
        { name: 'Rewards', path: '/rewards', desc: 'Redeem your points', icon: <Gift className="w-5 h-5 text-emerald-600" />, bg: 'bg-emerald-50' },
        { name: 'Promotions', path: '/promotions', desc: 'View active deals', icon: <Megaphone className="w-5 h-5 text-purple-600" />, bg: 'bg-purple-50' },
        { name: 'History', path: '/booking-history', desc: 'View past bookings', icon: <History className="w-5 h-5 text-orange-600" />, bg: 'bg-orange-50' },
    ];

    return (
        <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-in fade-in duration-700">
            {/* Notification Bar */}
            <div className="bg-blue-600 text-white px-6 py-4 rounded-[24px] flex items-center justify-between shadow-xl shadow-blue-500/20 animate-in slide-in-from-top duration-500">
                <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md">
                        <Zap className="w-5 h-5 fill-white" />
                    </div>
                    <div>
                        <p className="text-sm font-black tracking-tight">Weekend Flash Sale! ⚡</p>
                        <p className="text-xs text-blue-100 font-medium">Get 20% off for all Premium packages this Saturday & Sunday. Use code: WEEKEND20</p>
                    </div>
                </div>
                <button className="hover:bg-white/10 p-2 rounded-xl transition-colors shrink-0">
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* WELCOME HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black text-[#0f172a] tracking-tight flex items-center gap-3">
                        Welcome, {user?.fullName.split(' ')[0] || 'Member'}! <span className="animate-bounce">👋</span>
                    </h1>
                    <p className="text-sm text-[#64748b] font-bold">Your car wash command center is ready.</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-full border border-slate-100 shadow-sm">
                    <div className="flex -space-x-3">
                        {[1,2,3].map(i => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                                <img src={`https://i.pravatar.cc/150?u=${i + 20}`} alt="avatar" />
                            </div>
                        ))}
                    </div>
                    <div className="h-4 w-px bg-slate-200"></div>
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">12 Friends Active</p>
                </div>
            </div>

            {/* LIVE WASH STATUS (New & Dynamic) */}
            {activeBooking && (
                <div className="bg-white border-2 border-blue-50 rounded-[40px] p-10 shadow-2xl shadow-blue-500/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full -mr-48 -mt-48 blur-[80px] opacity-60 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-10">
                        <div className="shrink-0 flex flex-col items-center">
                            <div className="w-28 h-28 bg-blue-600 rounded-[36px] flex items-center justify-center shadow-2xl shadow-blue-300 relative">
                                <Activity className="w-12 h-12 text-white animate-pulse" />
                                <div className="absolute inset-0 bg-white/20 rounded-[36px] animate-ping opacity-20"></div>
                            </div>
                            <span className="mt-6 px-4 py-1.5 bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border border-blue-100">Live Operation</span>
                        </div>

                        <div className="flex-1 space-y-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded uppercase">In Progress</span>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order #BW-{activeBooking.bookingCode}</span>
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Wash in Progress</h3>
                                    <p className="text-slate-500 font-bold mt-1 text-lg">Your <span className="text-blue-600">{activeBooking.vehicleName || 'Vehicle'}</span> is currently at the Drying station.</p>
                                </div>
                                <div className="bg-slate-50 px-6 py-4 rounded-3xl border border-slate-100 text-center min-w-[140px]">
                                    <p className="text-3xl font-black text-blue-600 tracking-tighter">08<span className="text-sm text-slate-400 font-bold ml-1">m</span></p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Remaining</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-4 relative pt-2">
                                {/* Track Line */}
                                <div className="absolute top-7 left-0 w-full h-1.5 bg-slate-100 -z-10 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-600 w-3/4 transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                                </div>
                                
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100 transition-transform hover:scale-110"><CheckCircle2 className="w-6 h-6" /></div>
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Checking</span>
                                </div>
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-100 transition-transform hover:scale-110"><Droplets className="w-6 h-6" /></div>
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Washing</span>
                                </div>
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200 animate-bounce"><Wind className="w-6 h-6" /></div>
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Drying</span>
                                </div>
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-300 transition-transform hover:scale-110"><Sparkles className="w-6 h-6" /></div>
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Finish</span>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => navigate(`/live-tracking/${activeBooking.id}`)}
                            className="shrink-0 bg-slate-900 hover:bg-black text-white px-10 py-5 rounded-[24px] font-black text-sm transition-all flex items-center gap-3 shadow-2xl hover:-translate-y-2 active:scale-95 group"
                        >
                            View Live Stream
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            )}

            {/* 4 THẺ THỐNG KÊ (STATS CARDS) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.id} className="bg-white border border-slate-100 rounded-[28px] p-7 flex flex-col justify-between min-h-[160px] relative group hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-20 h-20 bg-slate-50 rounded-full group-hover:bg-blue-50 transition-colors duration-500"></div>
                        
                        <div className="flex items-center justify-between relative z-10">
                            <span className="text-[10px] text-[#94a3b8] font-black tracking-[0.15em] uppercase">{stat.label}</span>
                            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm`}>
                                {stat.icon}
                            </div>
                        </div>
                        <div className="mt-6 relative z-10">
                            <span className="block text-4xl font-black text-[#0f172a] tracking-tight">{stat.value}</span>
                            <span className="text-[11px] text-[#64748b] font-bold uppercase tracking-widest mt-1 opacity-70">{stat.sub}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* FREE WASH REWARD PROGRESS */}
            <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-[36px] p-8 space-y-6 shadow-xl shadow-emerald-500/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                    <div className="flex gap-6 items-center">
                        <div className="w-16 h-16 bg-[#16a34a] rounded-[24px] flex items-center justify-center text-white shadow-xl shadow-emerald-200 group-hover:rotate-12 transition-transform">
                            <Gift className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-[#14532d] tracking-tight">Free Wash Progress</h3>
                            <p className="text-sm text-[#166534] font-bold opacity-80 mt-1">Complete 7 washes to earn a FREE session!</p>
                        </div>
                    </div>
                    <div className="text-right bg-white/50 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white">
                        <span className="block text-3xl font-black text-[#16a34a] leading-none">5/7</span>
                        <span className="text-[10px] text-[#166534] font-black uppercase tracking-widest mt-1 block">Completed</span>
                    </div>
                </div>

                <div className="space-y-4 relative z-10">
                    <div className="w-full bg-white/60 h-8 rounded-2xl overflow-hidden relative flex items-center p-1.5 border border-emerald-100">
                        <div
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-xl flex items-center justify-end pr-4 transition-all duration-1000 shadow-lg shadow-emerald-200"
                            style={{ width: '71%' }}
                        >
                            <span className="text-[11px] font-black text-white tracking-widest">71%</span>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pt-2">
                        <p className="text-base font-bold text-[#166534]">
                            Just <span className="text-[#16a34a] font-black px-2 py-1 bg-white rounded-lg mx-1 shadow-sm">2 more</span> washes to unlock your reward!
                        </p>

                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((idx) => (
                                <div key={idx} className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-emerald-100 text-emerald-600">
                                    <CheckCircle2 className="w-5 h-5 fill-emerald-500 text-white" />
                                </div>
                            ))}
                            {[6, 7].map((idx) => (
                                <div key={idx} className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-black text-slate-400">
                                    {idx}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* PHẦN LAYOUT HAI CỘT CHÍNH */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* CỘT TRÁI: CURRENT TIER CARD */}
                <div className="lg:col-span-2 bg-gradient-to-br from-[#1e6ffd] via-[#2563eb] to-[#1d4ed8] rounded-[48px] p-12 text-white relative overflow-hidden shadow-2xl shadow-blue-500/20 min-h-[420px] flex flex-col justify-between group">
                    <div className="absolute -right-32 -top-32 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-white/20 transition-all duration-1000"></div>
                    
                    <div className="space-y-10 relative z-10">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-8">
                                <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[36px] flex items-center justify-center border border-white/20 shadow-2xl group-hover:-rotate-12 transition-transform duration-500">
                                    <Award className="w-12 h-12 text-white" />
                                </div>
                                <div>
                                    <span className="block text-xs text-blue-100 font-black tracking-[0.3em] uppercase mb-2 opacity-80">Membership Tier</span>
                                    <h2 className="text-5xl font-black tracking-tight">{loyaltyInfo?.currentTier || 'Gold'} Member</h2>
                                </div>
                            </div>
                            <div className="bg-white/10 p-4 rounded-3xl backdrop-blur-md border border-white/10">
                                <Sparkles className="w-8 h-8 text-blue-200 animate-pulse" />
                            </div>
                        </div>

                        <div className="space-y-6 max-w-lg">
                            <div className="flex justify-between text-sm font-black text-blue-50 uppercase tracking-widest px-1">
                                <span>Progress to Platinum</span>
                                <span>{loyaltyInfo?.totalPoints || 850}/2000 pts</span>
                            </div>
                            <div className="w-full bg-white/10 h-5 rounded-3xl overflow-hidden backdrop-blur-md p-1.5 border border-white/5">
                                <div className="bg-gradient-to-r from-white via-white to-blue-200 h-full rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.6)] transition-all duration-1000" style={{ width: '45%' }}></div>
                            </div>
                            <p className="text-base text-blue-50 font-bold leading-relaxed opacity-90">
                                You're earning points <span className="text-white font-black underline underline-offset-8 decoration-blue-300">2x faster</span> than regular members. Keep it up!
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6 pt-10 mt-6 border-t border-white/10 relative z-10">
                        {[
                            { label: 'Total Points', val: loyaltyInfo?.totalPoints || 850, icon: <Star className="w-4 h-4" /> },
                            { label: 'Tier Multiplier', val: 'x2.0', icon: <Zap className="w-4 h-4" /> },
                            { label: 'Loyalty Year', val: '2026', icon: <Calendar className="w-4 h-4" /> }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white/10 backdrop-blur-md rounded-3xl p-5 border border-white/5 hover:bg-white/20 transition-all duration-300">
                                <span className="flex items-center gap-2 text-[10px] text-blue-100 font-black uppercase tracking-[0.2em] mb-2 opacity-70">
                                    {item.icon} {item.label}
                                </span>
                                <span className="block text-3xl font-black tracking-tight">{item.val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CỘT PHẢI: UPCOMING BOOKING */}
                <div className="bg-white border border-slate-100 rounded-[48px] p-10 shadow-2xl shadow-slate-200/50 flex flex-col justify-between min-h-[420px] relative overflow-hidden">
                    <div className="space-y-8 relative z-10">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black text-[#0f172a] tracking-tight">Next Appointment</h3>
                            <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors">
                                <Bell className="w-5 h-5 text-slate-400" />
                            </button>
                        </div>

                        {upcomingBooking ? (
                            <div className="bg-slate-50 rounded-[36px] p-8 space-y-8 border border-slate-100 shadow-inner">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-blue-600 rounded-[24px] flex items-center justify-center text-white shadow-xl shadow-blue-100">
                                        <Calendar className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-[#0f172a] text-xl tracking-tight">{upcomingBooking.serviceName}</h4>
                                        <p className="text-xs text-blue-600 font-black uppercase tracking-widest mt-1">{format(new Date(upcomingBooking.bookingDate), 'MMMM dd, yyyy')}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-2">
                                    <div className="flex justify-between items-center text-sm font-bold">
                                        <span className="text-[#94a3b8] uppercase tracking-widest text-[10px] font-black">Time Slot</span>
                                        <span className="text-[#0f172a] bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-100">{upcomingBooking.startTime}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-bold">
                                        <span className="text-[#94a3b8] uppercase tracking-widest text-[10px] font-black">Vehicle Info</span>
                                        <span className="text-[#0f172a] font-black">{upcomingBooking.licensePlate}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm font-bold">
                                        <span className="text-[#94a3b8] uppercase tracking-widest text-[10px] font-black">Status</span>
                                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-lg uppercase">Confirmed</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="py-16 text-center space-y-6">
                                <div className="w-20 h-20 bg-slate-50 rounded-[30px] flex items-center justify-center mx-auto shadow-inner">
                                    <Calendar className="w-10 h-10 text-slate-200" />
                                </div>
                                <div>
                                    <p className="text-lg font-black text-slate-900">No upcoming washes</p>
                                    <p className="text-sm text-slate-400 font-bold mt-1">Ready for a fresh look?</p>
                                </div>
                                <button 
                                    onClick={() => navigate('/book-wash')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-black text-sm transition-all shadow-xl shadow-blue-100 active:scale-95"
                                >
                                    Book Now
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4 pt-8 relative z-10">
                        {upcomingBooking && (
                            <button className="flex-1 py-5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-[24px] text-xs font-black transition-all uppercase tracking-[0.15em]">
                                Reschedule
                            </button>
                        )}
                        <button 
                            onClick={() => navigate('/booking-history')}
                            className="flex-[2] py-5 bg-slate-900 hover:bg-black text-white rounded-[24px] text-xs font-black transition-all uppercase tracking-[0.15em] flex items-center justify-center gap-3 group"
                        >
                            History
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* SECTION: QUICK ACTIONS */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-black text-[#0f172a] tracking-tight">Quick Shortcuts</h3>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Always Available</span>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {quickActions.map((action, i) => (
                        <div
                            key={i}
                            onClick={() => navigate(action.path)}
                            className="bg-white border border-slate-100 hover:border-blue-500 rounded-[40px] p-8 flex flex-col items-center text-center gap-6 cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-3 transition-all duration-500 group relative overflow-hidden"
                        >
                            <div className="absolute -right-8 -top-8 w-28 h-28 bg-slate-50 rounded-full group-hover:bg-blue-50 transition-colors duration-500"></div>
                            
                            <div className={`w-20 h-20 ${action.bg} rounded-[28px] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm relative z-10 group-hover:rotate-6`}>
                                {React.cloneElement(action.icon as React.ReactElement, { className: "w-8 h-8" })}
                            </div>
                            <div className="relative z-10">
                                <h4 className="font-black text-[#0f172a] text-lg group-hover:text-blue-600 transition-colors tracking-tight">{action.name}</h4>
                                <p className="text-xs text-[#94a3b8] font-bold uppercase tracking-widest mt-1.5 opacity-80">{action.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
