import React, { useState } from 'react';
import { Tag, Crown, Sparkles, Calendar, Copy, Check } from 'lucide-react';

interface PromoCardProps {
    title: string;
    description: string;
    badgeText: string;
    badgeBg: string;
    badgeColor: string;
    dateText: string;
    code: string;
    conditions: string[];
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
    isFeatured?: boolean;
}

export const Promotions: React.FC = () => {
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const featuredPromos: PromoCardProps[] = [
        {
            title: 'Weekend Special - 30% Off',
            description: 'Get 30% off on all premium wash services every weekend',
            badgeText: 'All Members',
            badgeBg: 'bg-blue-50',
            badgeColor: 'text-blue-600',
            dateText: 'Until May 31, 2026',
            code: 'WEEKEND30',
            conditions: ['Valid on Saturdays and Sundays', 'Cannot be combined with other offers', 'Booking required in advance'],
            icon: <Tag className="w-6 h-6" />,
            iconBg: 'bg-emerald-50',
            iconColor: 'text-emerald-600',
            isFeatured: true
        },
        {
            title: 'Exclusive for Gold: Free Vacuuming',
            description: 'Free ceramic coating upgrade with any premium wash',
            badgeText: 'Gold Members Only',
            badgeBg: 'bg-pink-600',
            badgeColor: 'text-white',
            dateText: 'Until June 15, 2026',
            code: 'GOLDVIP',
            conditions: ['Valid for Gold members only', 'Limited to one use per month', 'Upgrade worth 400.000đ'],
            icon: <Crown className="w-6 h-6" />,
            iconBg: 'bg-purple-50',
            iconColor: 'text-purple-600',
            isFeatured: false
        }
    ];

    const activePromos = [
        { title: 'Refer a Friend', desc: 'Refer a friend and both get 500 bonus points', code: 'REFER500', date: 'Ongoing', icon: <Sparkles className="text-blue-600" />, bg: 'bg-blue-50' },
        { title: 'Early Bird Special', desc: '20% off on bookings before 9 AM', code: 'EARLY20', date: 'May 25, 2026', icon: <Tag className="text-emerald-600" />, bg: 'bg-emerald-50' },
        { title: 'Birthday Month Bonus', desc: 'Double points on all services during your birthday month', code: 'BDAY2X', date: 'Ongoing', icon: <Sparkles className="text-blue-600" />, bg: 'bg-blue-50' }
    ];

    return (
        <div className="w-full space-y-8 font-sans antialiased text-slate-800">
            {/* Banner Khuyến Mãi */}
            <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white rounded-2xl p-6 md:p-8 shadow-md">
                <div className="relative z-10 space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Limited Time</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Special Promotions Just for You!</h1>
                    <p className="text-sm md:text-base text-orange-50 opacity-90 leading-relaxed">
                        Save big with our exclusive member promotions and tier-based rewards. Check back regularly for new offers!
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                        <div className="bg-white/15 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                            <p className="text-xs text-orange-100 font-medium">Your Tier</p>
                            <p className="text-sm font-bold mt-0.5">Gold Member</p>
                        </div>
                        <div className="bg-white/15 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
                            <p className="text-xs text-orange-100 font-medium">Active Promotions</p>
                            <p className="text-sm font-bold mt-0.5">6 Available</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Promotions Section */}
            <div>
                <h2 className="text-2xl font-extrabold text-slate-800 mb-6 tracking-tight">Featured Promotions</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {featuredPromos.map((promo, idx) => (
                        <div key={idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 relative flex flex-col justify-between group">
                            <div className="absolute top-0 right-6 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full shadow-md">
                                <Sparkles className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${promo.iconBg} ${promo.iconColor}`}>
                                        {promo.icon}
                                    </div>
                                    <div className="space-y-1.5">
                                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">{promo.title}</h3>
                                        <p className="text-sm text-slate-500 font-medium leading-relaxed">{promo.description}</p>
                                        <div className="flex flex-wrap items-center gap-3 pt-1">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${promo.badgeBg} ${promo.badgeColor}`}>
                        {promo.badgeText}
                      </span>
                                            <div className="flex items-center gap-1 text-xs text-slate-400 font-semibold">
                                                <Calendar className="w-3.5 h-3.5" />
                                                <span>{promo.dateText}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Promo Code Box */}
                                <div className="mt-5 bg-slate-50/80 rounded-xl p-4 flex items-center justify-between gap-4 border border-slate-100">
                                    <div className="space-y-0.5">
                                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Promo Code</p>
                                        <p className="text-base font-mono font-bold text-blue-600 tracking-wide">{promo.code}</p>
                                    </div>
                                    <button
                                        onClick={() => handleCopyCode(promo.code)}
                                        className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-blue-700 active:scale-95 transition"
                                    >
                                        {copiedCode === promo.code ? (
                                            <>
                                                <Check className="w-3.5 h-3.5" />
                                                <span>Copied</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-3.5 h-3.5" />
                                                <span>Copy Code</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Điều khoản sử dụng */}
                            <div className="mt-5 pt-4 border-t border-slate-100">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Terms & Conditions:</h4>
                                <ul className="text-xs text-slate-500 font-medium space-y-1 list-disc pl-4 leading-relaxed">
                                    {promo.conditions.map((c, i) => <li key={i}>{c}</li>)}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* All Active Promotions Grid */}
            <div>
                <h2 className="text-2xl font-extrabold text-slate-800 mb-6 tracking-tight">All Active Promotions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activePromos.map((item, idx) => (
                        <div key={idx} className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                            <div className="space-y-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.bg}`}>
                                    {item.icon}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-base font-bold text-slate-900 tracking-tight">{item.title}</h3>
                                    <span className="inline-block bg-blue-50 text-blue-600 text-xs font-bold px-2 py-0.5 rounded-md mt-1">
                    All Members
                  </span>
                                    <p className="text-sm text-slate-500 font-medium pt-2 leading-relaxed">{item.desc}</p>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-3">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Code</p>
                                    <p className="text-sm font-mono font-bold text-blue-600 mt-0.5">{item.code}</p>
                                </div>
                            </div>
                            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{item.date}</span>
                                </div>
                                <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-bold">
                                    <span>View Details</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};