import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Droplets, Sparkles, Star, Crown, Gem, Award,
  CheckCircle, ArrowRight, MapPin, Phone, Clock, Map,
  Sun, Moon, MessageSquare, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/core/context/LanguageContext.tsx';
import { useTheme } from '@/core/context/ThemeContext.tsx';
import { LandingInteractiveMap } from '../components/LandingInteractiveMap';
import { useBranch } from "@/features/products/application/useBranch.ts";
import { useWashPackage } from "@/features/products/application/useWashPackage.ts";
import { MapModal } from "@/features/products/presentation/components/MapModal.tsx";
import { usePublicFeedbacks } from "@/features/products/application/useFeedback.ts";

export const LandingPage: React.FC = () => {
  const { t } = useTranslation('customer');
  const { language, toggleLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  const { branches, isLoading: isLoadingBranches } = useBranch();
  const { washPackages, isLoading: isLoadingPackages } = useWashPackage();

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');

  const [feedbackPageIndex, setFeedbackPageIndex] = useState(1);
  const feedbackPageSize = 6;

  const { data: feedbackData, isLoading: isLoadingFeedback } = usePublicFeedbacks(
    selectedBranchId || undefined,
    feedbackPageIndex,
    feedbackPageSize
  );

  useEffect(() => {
    setFeedbackPageIndex(1);
  }, [selectedBranchId]);

  const totalPages = Math.ceil((feedbackData?.totalFeedbacks || 0) / feedbackPageSize) || 1;

  const tiers = [
    {
      tier: t('landing.tiers.member'),
      icon: Award,
      color: 'blue',
      multiplier: '1x',
      bookingWindow: `7 ${t('landing.tiers.upToDays').replace('Tối đa ', '').replace('Up to ', '')}`,
      benefits: [
        t('landing.tiers.benefit_member_1'),
        t('landing.tiers.benefit_member_2'),
        t('landing.tiers.benefit_member_3'),
        t('landing.tiers.benefit_member_4')
      ],
      bgColor: 'from-blue-500 to-cyan-500',
    },
    {
      tier: t('landing.tiers.silver'),
      icon: Star,
      color: 'gray',
      multiplier: '1.5x',
      bookingWindow: `10 ${t('landing.tiers.upToDays').replace('Tối đa ', '').replace('Up to ', '')}`,
      benefits: [
        t('landing.tiers.benefit_silver_1'),
        t('landing.tiers.benefit_silver_2'),
        t('landing.tiers.benefit_silver_3'),
        t('landing.tiers.benefit_silver_4')
      ],
      bgColor: 'from-slate-400 to-slate-600',
    },
    {
      tier: t('landing.tiers.gold'),
      icon: Crown,
      color: 'yellow',
      multiplier: '2x',
      bookingWindow: `12 ${t('landing.tiers.upToDays').replace('Tối đa ', '').replace('Up to ', '')}`,
      benefits: [
        t('landing.tiers.benefit_gold_1'),
        t('landing.tiers.benefit_gold_2'),
        t('landing.tiers.benefit_gold_3'),
        t('landing.tiers.benefit_gold_4')
      ],
      bgColor: 'from-amber-400 to-orange-500',
    },
    {
      tier: t('landing.tiers.platinum'),
      icon: Gem,
      color: 'purple',
      multiplier: '3x',
      bookingWindow: `14 ${t('landing.tiers.upToDays').replace('Tối đa ', '').replace('Up to ', '')}`,
      benefits: [
        t('landing.tiers.benefit_platinum_1'),
        t('landing.tiers.benefit_platinum_2'),
        t('landing.tiers.benefit_platinum_3'),
        t('landing.tiers.benefit_platinum_4')
      ],
      bgColor: 'from-purple-500 to-pink-500',
    },
  ];

  const handleOpenMap = (branchId?: string) => {
    setSelectedBranchId(branchId || '');
    setIsMapOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const renderStars = (rating: number, isLarge: boolean = false) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <Star
            key={i}
            className={`${isLarge ? 'w-6 h-6' : 'w-4 h-4'} fill-amber-400 text-amber-400 shrink-0`}
          />
        );
      } else if (i === fullStars + 1 && hasHalf) {
        stars.push(
          <div key={i} className="relative shrink-0 select-none">
            <Star className={`${isLarge ? 'w-6 h-6' : 'w-4 h-4'} text-slate-300 dark:text-slate-700`} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={`${isLarge ? 'w-6 h-6' : 'w-4 h-4'} fill-amber-400 text-amber-400`} />
            </div>
          </div>
        );
      } else {
        stars.push(
          <Star
            key={i}
            className={`${isLarge ? 'w-6 h-6' : 'w-4 h-4'} text-slate-300 dark:text-slate-600 shrink-0`}
          />
        );
      }
    }
    return <div className="flex gap-0.5">{stars}</div>;
  };

  return (
    <div className="w-full min-h-screen bg-[hsl(210,92%,91%)] dark:bg-[#0B0C10] font-sans text-slate-800 dark:text-slate-200 selection:bg-sky-400 selection:text-white antialiased transition-colors duration-300 overflow-x-hidden relative">

      {/* 🌊 Aqua Premium background — chỉ hiện ở light mode */}
      <div className="fixed inset-0 pointer-events-none z-0 dark:hidden">
        {/* Orb góc trên trái */}
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-sky-400/85 via-blue-200/40 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '9s' }} />
        {/* Orb góc dưới phải */}
        <div className="absolute -bottom-40 -right-20 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-cyan-400/75 via-sky-200/35 to-transparent blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
        {/* Orb giữa-trái */}
        <div className="absolute top-1/3 -left-20 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-blue-300/65 to-transparent blur-2xl animate-pulse" style={{ animationDuration: '15s', animationDelay: '2s' }} />
        {/* Lưới gợn nước đậm hơn */}
        <div className="absolute inset-0 opacity-60" style={{
          backgroundImage: 'radial-gradient(circle, rgba(14,165,233,0.12) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 85% 85% at 50% 50%, black 30%, transparent 100%)'
        }} />
      </div>

      {/* HEADER NAVBAR - Ultra Glassmorphism */}
      <header className="fixed top-0 inset-x-0 z-50 bg-white/65 dark:bg-[#0a0a0a]/70 backdrop-blur-2xl border-b border-sky-200/50 dark:border-white/10 px-6 lg:px-12 py-4 flex items-center justify-between transition-all duration-300 shadow-[0_1px_24px_rgba(14,165,233,0.07)] dark:shadow-none">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-105">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">AutoWash Premium</span>
            <span className="text-[10px] block font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest -mt-1">{t('landing.subtitle')}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 lg:gap-6">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all duration-300"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 transition-all duration-300 text-xs font-bold"
            >
              <span className="text-sm leading-none">{language === 'en' ? '🇺🇸' : '🇻🇳'}</span>
              <span className="uppercase">{language === 'en' ? 'EN' : 'VI'}</span>
            </button>
          </div>

          <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-white/10"></div>

          <Link
            to="/login"
            className="hidden sm:block text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {t('landing.login')}
          </Link>
          <Link
            to="/register"
            className="relative px-6 py-2.5 bg-slate-900 dark:bg-white/10 dark:border dark:border-white/20 dark:backdrop-blur-md text-white dark:text-white rounded-full font-bold text-sm transition-all duration-300 hover:scale-105 hover:bg-slate-800 dark:hover:bg-white/20 dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center gap-2 group"
          >
            <span>{t('landing.register')}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </header>

      {/* HERO SECTION - Premium Modern Look */}
      <section className="relative min-h-[100vh] flex items-center pt-24 pb-12 px-6 lg:px-12 overflow-hidden">
        {/* Abstract Glowing Orbs — Aqua Premium palette */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-sky-300/25 dark:bg-blue-600/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-lighten animate-pulse"></div>
          <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-cyan-300/20 dark:bg-purple-600/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-lighten animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
          {/* Hero Content */}
          <div className="flex-1 space-y-8 text-center lg:text-left pt-12 lg:pt-0">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-full text-blue-600 dark:text-blue-300 text-xs font-bold border border-slate-200/50 dark:border-white/10 shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span className="uppercase tracking-wider">{t('landing.tagline')}</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter leading-[1.1]">
              <span className="block text-blue-950 dark:text-white drop-shadow-sm">
                {t('landing.title').split('\n')[0] || t('landing.title')}
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 dark:from-blue-400 dark:to-indigo-400 mt-2 pb-2">
                Premium Car Care
              </span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {t('landing.description')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full font-bold shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 border border-white/10"
              >
                <span>{t('landing.getStarted')}</span>
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 border border-slate-200/50 dark:border-white/10 backdrop-blur-xl text-blue-950 dark:text-white rounded-full font-bold transition-all hover:-translate-y-1 flex items-center justify-center shadow-sm"
              >
                {t('landing.bookService')}
              </Link>
            </div>
          </div>

          {/* Hero Image/Mockup Right side */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative perspective-1000">
            <div className="relative transform-gpu lg:rotate-y-[-12deg] lg:rotate-x-[8deg] transition-transform duration-700 hover:rotate-0 hover:scale-[1.02]">
              {/* Glow behind card */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/30 to-purple-500/30 blur-3xl rounded-[3rem] -z-10"></div>

              <div className="relative bg-white/80 dark:bg-[#111111]/80 backdrop-blur-2xl border border-white/50 dark:border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                      <Crown className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-blue-950 dark:text-white uppercase tracking-wider">{t('landing.membershipBenefits')}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('landing.earnAndUpgrade')}</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 rounded-full text-xs font-black tracking-widest">
                    VIP
                  </div>
                </div>

                {/* Visual Fake Data Blocks */}
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center gap-4 border border-slate-100 dark:border-white/5">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-blue-950 dark:text-white">Premium Wash</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">45 mins • Interior & Exterior</div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center gap-4 border border-slate-100 dark:border-white/5">
                    <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center">
                      <Star className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-blue-950 dark:text-white">Earn 2x Points</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Applied to your next booking</div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-white/10 flex justify-between items-center">
                  <div className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">{t('landing.save20')}</div>
                  <button className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-blue-950 rounded-xl text-sm font-bold shadow-md hover:scale-105 transition-transform">
                    {t('bookWash.dateTime.select', { defaultValue: 'Book Now' })}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="relative py-32 px-6 lg:px-12 bg-white dark:bg-[#0B0C10] z-10 rounded-t-[3rem] -mt-10 shadow-[0_-20px_50px_rgba(0,0,0,0.02)] dark:shadow-[0_-20px_50px_rgba(0,0,0,0.3)] border-t border-transparent dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:text-white">{t('landing.ourPackages')}</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">{t('landing.ourPackagesDesc')}</p>
          </div>

          {isLoadingPackages ? (
            <div className="flex justify-center"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {washPackages.map((pkg, idx) => {
                const isPremium = idx === 1; // Highlight the middle card
                return (
                  <div
                    key={pkg.id}
                    className={`group relative bg-slate-50 dark:bg-[#13151A] rounded-[2.5rem] p-8 lg:p-10 transition-all duration-500 flex flex-col justify-between ${isPremium
                      ? 'border border-amber-500/50 shadow-2xl shadow-amber-500/10 lg:-mt-8 lg:mb-8 overflow-hidden'
                      : 'border border-slate-200 dark:border-white/5 hover:border-blue-300 dark:hover:border-white/20 hover:-translate-y-2 hover:shadow-xl'
                      }`}
                  >
                    {isPremium && (
                      <>
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-amber-500/20 rounded-full blur-[50px] opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        <div className="absolute -top-4 inset-x-0 flex justify-center z-10">
                          <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-black tracking-widest px-6 py-2 rounded-full shadow-lg border border-white/20">
                            MOST POPULAR
                          </span>
                        </div>
                      </>
                    )}
                    <div>
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-sm border group-hover:scale-110 transition-transform duration-300 ${isPremium ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/5'
                        }`}>
                        {idx === 0 ? <Droplets className={`w-8 h-8 ${!isPremium && 'text-blue-500'}`} /> :
                          idx === 1 ? <Star className={`w-8 h-8 ${!isPremium && 'text-indigo-500'}`} /> :
                            <Sparkles className={`w-8 h-8 ${!isPremium && 'text-purple-500'}`} />}
                      </div>

                      <h3 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:text-white mb-3">{pkg.name}</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed line-clamp-2">{pkg.description}</p>

                      <div className="flex items-end gap-2 mb-10">
                        <span className="text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:text-white">{formatCurrency(pkg.price)}</span>
                        <span className="text-slate-400 dark:text-slate-500 font-bold text-sm mb-1">/{pkg.durationMinutes}m</span>
                      </div>

                      {pkg.features && (
                        <ul className="space-y-4 mb-10">
                          {pkg.features.map((feature, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-300 font-medium">
                              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                              <span className="leading-tight">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <Link
                      to="/login"
                      className={`block w-full py-4 text-center rounded-2xl font-bold transition-all duration-300 relative z-10 ${isPremium
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-[0_8px_20px_rgba(245,158,11,0.3)] hover:-translate-y-1 border border-white/20'
                        : 'bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 border border-transparent dark:border-white/5 text-blue-950 dark:text-white'
                        }`}
                    >
                      {t('bookWash.dateTime.select', { defaultValue: 'Select Plan' })}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* LOYALTY TIERS SECTION */}
      <section className="relative py-32 px-6 lg:px-12 bg-slate-50 dark:bg-[#08090C] overflow-hidden border-t border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:text-white">{t('landing.membershipTiersTitle')}</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">{t('landing.membershipTiersDesc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tItem) => {
              const Icon = tItem.icon;
              return (
                <div
                  key={tItem.tier}
                  className="group relative bg-white dark:bg-[#13151A] rounded-[2rem] overflow-hidden border border-slate-200 dark:border-white/5 hover:border-white/10 dark:hover:border-white/10 transition-all duration-300 hover:-translate-y-2 shadow-sm hover:shadow-2xl"
                >
                  {/* Glowing border effect on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${tItem.bgColor} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <div className={`absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r ${tItem.bgColor}`}></div>

                  <div className="p-8 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${tItem.bgColor} text-white shadow-lg`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-extrabold mb-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:text-white">{tItem.tier}</h3>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-8">
                      {t('landing.tiers.pointsMultiplier', { mult: tItem.multiplier })}
                    </p>

                    <div className="pb-6 mb-6 border-b border-slate-100 dark:border-white/5">
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mb-1.5">{t('landing.tiers.bookInAdvance')}</p>
                      <p className="font-black text-blue-950 dark:text-white text-xl">
                        {t('landing.tiers.upToDays', { days: tItem.bookingWindow.split(' ')[0] })}
                      </p>
                    </div>
                    <ul className="space-y-4">
                      {tItem.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                          <CheckCircle className={`w-5 h-5 shrink-0 ${idx < 2 ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-700'}`} />
                          <span className="leading-tight">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CUSTOMER FEEDBACK SECTION */}
      <section className="relative py-32 px-6 lg:px-12 bg-slate-50 dark:bg-[#08090C] overflow-hidden border-t border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="space-y-4 max-w-2xl">
              <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:text-white">
                {t('landing.feedback.title')}
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
                {t('landing.feedback.subtitle')}
              </p>
            </div>

            {/* Branch Filter dropdown */}
            <div className="flex flex-col gap-2 shrink-0">
              <label htmlFor="feedback-branch-select" className="text-xs font-bold text-slate-400 dark:text-slate-550 uppercase tracking-wider">
                {t('landing.feedback.selectBranch')}
              </label>
              <select
                id="feedback-branch-select"
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="w-full md:w-64 px-4 py-3 bg-white dark:bg-[#111111] border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 dark:text-white transition-all shadow-sm"
              >
                <option value="">{t('landing.feedback.allBranches')}</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.branchName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Stats Overview Panel */}
            <div className="bg-white dark:bg-[#13151A] rounded-[2rem] p-8 border border-slate-200 dark:border-white/5 shadow-sm space-y-6">
              <div className="text-center py-6 space-y-3">
                <span className="text-slate-400 dark:text-slate-550 text-sm font-bold uppercase tracking-wider block">
                  {t('landing.feedback.averageRating')}
                </span>
                <span className="text-6xl font-black text-blue-950 dark:text-white block">
                  {feedbackData?.averageRating ? feedbackData.averageRating.toFixed(1) : '0.0'}
                </span>
                <div className="flex justify-center mt-2">
                  {renderStars(feedbackData?.averageRating || 0, true)}
                </div>
                <span className="text-sm font-bold text-slate-500 dark:text-slate-400 block mt-2">
                  {t('landing.feedback.totalFeedbacks', { count: feedbackData?.totalFeedbacks || 0 })}
                </span>
              </div>

              {/* Progress bars (Service, Staff, Price) */}
              <div className="pt-6 border-t border-slate-100 dark:border-white/5 space-y-4">
                {(() => {
                  const fbs = feedbackData?.feedbacks || [];
                  const count = fbs.length;
                  const avgStaff = count > 0 ? fbs.reduce((acc, f) => acc + f.staffRating, 0) / count : 0;
                  const avgService = count > 0 ? fbs.reduce((acc, f) => acc + f.serviceRating, 0) / count : 0;
                  const avgPrice = count > 0 ? fbs.reduce((acc, f) => acc + f.priceRating, 0) / count : 0;

                  return (
                    <>
                      {/* Staff Rating Bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-slate-650 dark:text-slate-400">
                          <span>{t('landing.feedback.staff')}</span>
                          <span>{avgStaff > 0 ? avgStaff.toFixed(1) : '5.0'}/5.0</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-1000"
                            style={{ width: `${(avgStaff || 5.0) * 20}%` }}
                          />
                        </div>
                      </div>

                      {/* Service Rating Bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-slate-650 dark:text-slate-400">
                          <span>{t('landing.feedback.service')}</span>
                          <span>{avgService > 0 ? avgService.toFixed(1) : '5.0'}/5.0</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all duration-1000"
                            style={{ width: `${(avgService || 5.0) * 20}%` }}
                          />
                        </div>
                      </div>

                      {/* Price Rating Bar */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-slate-650 dark:text-slate-400">
                          <span>{t('landing.feedback.price')}</span>
                          <span>{avgPrice > 0 ? avgPrice.toFixed(1) : '5.0'}/5.0</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-1000"
                            style={{ width: `${(avgPrice || 5.0) * 20}%` }}
                          />
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Feedbacks Grid List */}
            <div className="lg:col-span-2 space-y-6">
              {isLoadingFeedback ? (
                // Loading Skeleton state
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white dark:bg-[#13151A] rounded-[2rem] p-6 border border-slate-200 dark:border-white/5 animate-pulse space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-200 dark:bg-white/5 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-slate-200 dark:bg-white/5 rounded w-3/4" />
                          <div className="h-3 bg-slate-200 dark:bg-white/5 rounded w-1/2" />
                        </div>
                      </div>
                      <div className="h-4 bg-slate-200 dark:bg-white/5 rounded w-full" />
                      <div className="h-4 bg-slate-200 dark:bg-white/5 rounded w-5/6" />
                    </div>
                  ))}
                </div>
              ) : !feedbackData?.feedbacks || feedbackData.feedbacks.length === 0 ? (
                // Empty state
                <div className="bg-white dark:bg-[#13151A] rounded-[2rem] p-12 text-center border border-slate-200 dark:border-white/5 shadow-sm space-y-4">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-400 dark:text-slate-500">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <p className="text-slate-550 dark:text-slate-400 font-bold">
                    {t('landing.feedback.noFeedbacks')}
                  </p>
                </div>
              ) : (
                <>
                  {/* Reviews Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {feedbackData.feedbacks.map((fb, idx) => {
                      // Generate initials for avatar
                      const initials = fb.customerName
                        ? fb.customerName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
                        : 'U';

                      // Nice avatar color based on index
                      const colors = [
                        'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
                        'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
                        'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
                        'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
                      ];
                      const colorClass = colors[idx % colors.length];

                      return (
                        <div
                          key={idx}
                          className="group relative bg-white dark:bg-[#13151A] rounded-[2rem] p-6 border border-slate-200 dark:border-white/5 hover:border-blue-300 dark:hover:border-white/20 transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-md"
                        >
                          <div className="space-y-4">
                            {/* Header info */}
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${colorClass} shrink-0`}>
                                  {initials}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-bold text-blue-950 dark:text-white truncate text-sm">
                                    {fb.customerName || 'Anonymous'}
                                  </h4>
                                  <span className="text-[10px] text-slate-400 dark:text-slate-550 block">
                                    {new Date(fb.createdAt).toLocaleDateString(
                                      language === 'vi' ? 'vi-VN' : 'en-US',
                                      { year: 'numeric', month: 'short', day: 'numeric' }
                                    )}
                                  </span>
                                </div>
                              </div>
                              <div className="shrink-0">
                                {renderStars(fb.overallRating)}
                              </div>
                            </div>

                            {/* Comment */}
                            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed line-clamp-3">
                              "{fb.comment || 'Không có bình luận.'}"
                            </p>
                          </div>

                          {/* Aspect breakdown */}
                          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center gap-4 text-[10px] font-bold text-slate-450 dark:text-slate-500">
                            <div>
                              {t('landing.feedback.staff')}: <span className="text-amber-500">{fb.staffRating}★</span>
                            </div>
                            <div>
                              {t('landing.feedback.service')}: <span className="text-blue-500">{fb.serviceRating}★</span>
                            </div>
                            <div>
                              {t('landing.feedback.price')}: <span className="text-emerald-500">{fb.priceRating}★</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pagination Controls */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between pt-4">
                      <button
                        onClick={() => setFeedbackPageIndex(p => Math.max(p - 1, 1))}
                        disabled={feedbackPageIndex === 1}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#13151A] hover:bg-slate-50 dark:hover:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-350 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:dark:hover:bg-[#13151A] rounded-xl text-xs font-bold transition-all"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>{t('landing.feedback.previous')}</span>
                      </button>

                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                        {t('landing.feedback.page', { current: feedbackPageIndex, total: totalPages })}
                      </span>

                      <button
                        onClick={() => setFeedbackPageIndex(p => Math.min(p + 1, totalPages))}
                        disabled={feedbackPageIndex === totalPages}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#13151A] hover:bg-slate-50 dark:hover:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-350 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:dark:hover:bg-[#13151A] rounded-xl text-xs font-bold transition-all"
                      >
                        <span>{t('landing.feedback.next')}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* LOCATIONS & MAP SECTION */}
      <section className="relative py-32 px-6 lg:px-12 bg-white dark:bg-[#0B0C10] z-10 border-t border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:text-white">{t('landing.branchSystem')}</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">{t('landing.branchSystemDesc')}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {isLoadingBranches ? (
                <div className="flex justify-center py-12"><div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
              ) : branches.length === 0 ? (
                <div className="text-center text-slate-400 font-bold py-12">{t('landing.noBranches')}</div>
              ) : (
                branches.map((branch) => (
                  <div
                    key={branch.id}
                    onClick={() => setSelectedBranchId(branch.id)}
                    className={`group rounded-[1.5rem] p-6 cursor-pointer transition-all duration-300 border ${selectedBranchId === branch.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-800 shadow-md'
                      : 'bg-slate-50 dark:bg-[#111111] border-slate-200 dark:border-white/5 hover:border-blue-200 dark:hover:border-white/20'
                      }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-extrabold text-blue-950 dark:text-white text-lg">{branch.branchName}</h3>
                      <span className="text-[10px] font-black tracking-widest px-2.5 py-1 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-full">
                        {t('landing.open')}
                      </span>
                    </div>

                    <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
                        <span>{branch.address}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 shrink-0 text-slate-400" />
                        <span>{branch.hotline}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 shrink-0 text-slate-400" />
                        <span>{branch.operatingHours || '07:00 - 21:00'}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenMap(branch.id);
                      }}
                      className="mt-6 w-full py-3 text-sm font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-blue-50 dark:hover:bg-white/10 rounded-xl transition-all"
                    >
                      {t('landing.viewOnMap')}
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="lg:col-span-2">
              <div className="bg-slate-50 dark:bg-[#111111] rounded-[2rem] p-4 border border-slate-200 dark:border-white/5 h-full min-h-[500px] flex flex-col relative overflow-hidden">
                <div className="absolute top-6 right-6 z-10">
                  <button
                    onClick={() => handleOpenMap()}
                    className="flex items-center gap-2 bg-white dark:bg-[#1a1a1a] hover:bg-slate-50 dark:hover:bg-[#222] text-blue-950 dark:text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg border border-slate-200 dark:border-white/10 transition-all"
                  >
                    <Map className="w-4 h-4" /> {t('landing.detailMapBtn')}
                  </button>
                </div>
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-inner bg-slate-200 dark:bg-slate-800">
                  <LandingInteractiveMap
                    branches={branches}
                    selectedBranchId={selectedBranchId}
                    onSelectBranch={setSelectedBranchId}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-50 dark:bg-[#08090C] py-12 px-6 border-t border-slate-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md">
              <Droplets className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-blue-950 dark:text-white text-xl tracking-tight">AutoWash Premium</span>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('landing.allRightsReserved')}</p>
        </div>
      </footer>

      {/* MAP MODAL */}
      <MapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        branches={branches}
        selectedBranchId={selectedBranchId}
      />
    </div>
  );
};