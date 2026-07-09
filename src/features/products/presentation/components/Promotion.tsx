import React, { useState } from 'react';
import { Tag, Sparkles, Calendar, Copy, Check } from 'lucide-react';
import { usePromotion } from '@/features/products/application/usePromotion.ts';
import { useTranslation } from 'react-i18next';
import { translateDynamic } from '@/shared/utils/translateDynamic.ts';

export const Promotions: React.FC = () => {
    const { t, i18n } = useTranslation('customer');
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const { promotions, isLoading } = usePromotion();

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    if (isLoading) {
        return <div className="p-10 text-center font-medium text-slate-500">{t('promotions.loadingText')}</div>;
    }

    // Đảm bảo promotions là một mảng để tránh lỗi .filter is not a function nếu api trả về undefined lúc đầu
    const safePromotions = Array.isArray(promotions) ? promotions : [];

    // Lọc data an toàn với Optional Chaining (?.) cho targetTiers vì API không có trường này
    const featuredPromos = safePromotions.filter(
        (p) => p.discountValue >= 30 || p.targetTiers?.includes("Gold")
    );
    const activePromos = safePromotions.filter(
        (p) => !featuredPromos.find((f) => f.id === p.id)
    );

    return (
        <div className="w-full space-y-10 font-sans antialiased text-slate-800 dark:text-slate-100 pb-12 animate-fade-in">
            {/* Banner Khuyến Mãi */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-[#111] dark:from-[#050505] dark:to-[#111] border border-slate-800/50 dark:border-white/10 text-white rounded-[2.5rem] p-8 lg:p-10 shadow-2xl group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>
                <div className="absolute -right-20 -top-20 w-80 h-80 bg-orange-500/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-orange-500/30 transition-colors duration-700"></div>
                <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-pink-500/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-pink-500/30 transition-colors duration-700"></div>
                
                <div className="relative z-10 space-y-6 max-w-2xl">
                    <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold text-orange-400">
                        <Sparkles className="w-4 h-4" />
                        <span className="tracking-wide uppercase">{t('promotions.banner.badgeLimitedTime')}</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                        {t('promotions.banner.heading')}
                    </h1>
                    <p className="text-base md:text-lg text-slate-400 font-medium leading-relaxed">
                        {t('promotions.banner.description')}
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                        <div className="bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/10">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('promotions.banner.labelYourTier')}</p>
                            <p className="text-xl font-black text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)] mt-1">Gold Member</p>
                        </div>
                        <div className="bg-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/10">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t('promotions.banner.labelActivePromotions')}</p>
                            <p className="text-xl font-black text-white mt-1">
                                {activePromos.length + featuredPromos.length} {t('promotions.banner.labelAvailable', { defaultValue: 'Available' })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Promotions Section */}
            <div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">{t('promotions.featured.sectionTitle')}</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {featuredPromos.map((promo, idx) => (
                        <div key={idx} className="bg-white dark:bg-[#111] rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all duration-300 p-8 relative flex flex-col justify-between group overflow-hidden">
                            <div className="absolute top-0 right-8 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-2xl shadow-[0_10px_20px_rgba(37,99,235,0.3)] group-hover:-translate-y-2 transition-transform">
                                <Sparkles className="w-5 h-5 animate-pulse" />
                            </div>
                            <div>
                                <div className="flex items-start gap-5">
                                    <div className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center shrink-0 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-inner">
                                        <Tag className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-2 pt-1">
                                        {/* Fallback sang .title nếu mock data dùng title, còn api thật dùng name */}
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                                            {translateDynamic(promo.name || promo.title, i18n.language)}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{translateDynamic(promo.description, i18n.language)}</p>
                                        <div className="flex flex-wrap items-center gap-3 pt-2">
                                            {promo.targetTiers && promo.targetTiers.length > 0 && (
                                                <span className="text-xs font-black tracking-wider uppercase px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400">
                                                    {promo.targetTiers.join(', ')}
                                                </span>
                                            )}
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-bold bg-slate-50 dark:bg-white/5 px-3 py-1.5 rounded-xl">
                                                <Calendar className="w-4 h-4 text-slate-400" />
                                                <span>{t('promotions.featured.labelUntil')} {new Date(promo.endDate).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Promo Code Box */}
                                <div className="mt-8 bg-slate-50/80 dark:bg-black/20 rounded-2xl p-5 flex items-center justify-between gap-4 border border-slate-100 dark:border-white/5 group-hover:border-blue-500/30 transition-colors">
                                    <div className="space-y-1">
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">{t('promotions.featured.labelPromoCode')}</p>
                                        <p className="text-lg font-mono font-black text-blue-600 dark:text-blue-400 tracking-wider">{promo.code}</p>
                                    </div>
                                    <button
                                        onClick={() => handleCopyCode(promo.code)}
                                        className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-bold px-5 py-3 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-200 active:scale-95 transition-all shadow-md"
                                    >
                                        {copiedCode === promo.code ? (
                                            <>
                                                <Check className="w-4 h-4 text-emerald-500" />
                                                <span>{t('promotions.featured.btnCopied')}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4" />
                                                <span>{t('promotions.featured.btnCopyCode')}</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Điều khoản sử dụng */}
                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/5">
                                <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">{t('promotions.featured.termsAndConditions')}</h4>
                                <ul className="text-xs text-slate-500 dark:text-slate-400 font-medium space-y-2 list-none p-0 leading-relaxed">
                                    {promo.conditions?.map((c, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                            <span className="text-blue-500 mt-0.5">•</span>
                                            {translateDynamic(c, i18n.language)}
                                        </li>
                                    ))}
                                    {(!promo.conditions || promo.conditions.length === 0) && (
                                        <li className="flex items-start gap-2">
                                            <span className="text-blue-500 mt-0.5">•</span>
                                            {t('promotions.featured.defaultCondition', { defaultValue: 'Áp dụng cho các hóa đơn thỏa mãn điều kiện tối thiểu.' })}
                                        </li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* All Active Promotions Grid */}
            <div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-6 tracking-tight">{t('promotions.allActive.sectionTitle')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activePromos.map((item, idx) => (
                        <div key={idx} className="bg-white dark:bg-[#111] border border-slate-200 dark:border-white/5 rounded-[2rem] p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group">
                            <div className="space-y-5">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                                        {translateDynamic(item.name || item.title, i18n.language)}
                                    </h3>
                                    {item.targetTiers && item.targetTiers.length > 0 && (
                                        <span className="inline-block bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-lg">
                                            {item.targetTiers.join(', ')}
                                        </span>
                                    )}
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{translateDynamic(item.description, i18n.language)}</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-black/20 rounded-xl p-4 border border-slate-100 dark:border-white/5">
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest">{t('promotions.allActive.labelCode')}</p>
                                    <p className="text-base font-mono font-black text-blue-600 dark:text-blue-400 mt-1">{item.code}</p>
                                </div>
                            </div>
                            <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-semibold">
                                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                                    <Calendar className="w-4 h-4" />
                                    <span>{t('promotions.allActive.labelUntil')} {new Date(item.endDate).toLocaleDateString('vi-VN')}</span>
                                </div>
                                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1 font-bold group-hover:translate-x-1 transition-transform">
                                    <span>{t('promotions.allActive.btnViewDetails')}</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
