import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Droplets, Sparkles, Star, Crown, Gem, Award, 
  CheckCircle, ArrowRight, MapPin, Phone, Clock, Map,
  Sun, Moon
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/core/context/LanguageContext.tsx';
import { useTheme } from '@/core/context/ThemeContext.tsx';
import { LandingInteractiveMap } from '../components/LandingInteractiveMap';
import { useBranch } from "@/features/products/application/useBranch.ts";
import { useWashPackage } from "@/features/products/application/useWashPackage.ts";
import { MapModal } from "@/features/products/presentation/components/MapModal.tsx";

export const LandingPage: React.FC = () => {
  const { t } = useTranslation('customer');
  const { language, toggleLanguage } = useLanguage();
  const { isDark, toggleTheme } = useTheme();

  const { branches, isLoading: isLoadingBranches } = useBranch();
  const { washPackages, isLoading: isLoadingPackages } = useWashPackage();
  
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');

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
      bgColor: 'from-blue-500 to-blue-600',
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
      bgColor: 'from-gray-400 to-gray-500',
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
      bgColor: 'from-yellow-400 to-yellow-500',
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
      bgColor: 'from-purple-500 to-purple-600',
    },
  ];

  const handleOpenMap = (branchId?: string) => {
    setSelectedBranchId(branchId || '');
    setIsMapOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 selection:bg-blue-500 selection:text-white antialiased transition-colors duration-200">
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-6 lg:px-12 py-4 flex items-center justify-between transition-colors duration-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">AutoWash Pro</span>
            <span className="text-[10px] block font-semibold text-slate-400 dark:text-slate-500 -mt-1">{t('landing.subtitle')}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            id="theme-toggle-landing"
            onClick={toggleTheme}
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="flex items-center justify-center p-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-all duration-200 cursor-pointer"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-500" />
            ) : (
              <Moon className="w-4 h-4 text-blue-600" />
            )}
          </button>

          {/* Language Toggle Button */}
          <button
            id="language-toggle-landing"
            onClick={toggleLanguage}
            title={language === 'en' ? "Switch to Vietnamese" : "Switch to English"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border-2 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-all duration-200"
          >
            <span className="text-base leading-none">{language === 'en' ? '🇺🇸' : '🇻🇳'}</span>
            <span className="uppercase tracking-wide">{language === 'en' ? 'EN' : 'VI'}</span>
          </button>

          <Link
            to="/login"
            className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {t('landing.login')}
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/10 active:scale-95 transition-all"
          >
            {t('landing.register')}
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white py-24 px-6 lg:px-12">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-300 via-indigo-600 to-slate-950"></div>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 relative z-10">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-blue-200 text-xs font-semibold border border-white/10">
              <Sparkles className="w-3.5 h-3.5" />
              {t('landing.tagline')}
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight whitespace-pre-line">
              {t('landing.title')}
            </h1>
            
            <p className="text-lg lg:text-xl text-blue-100 font-medium max-w-2xl">
              {t('landing.description')}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-2xl shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                <span>{t('landing.getStarted')}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm text-white font-bold rounded-2xl transition-all flex items-center justify-center"
              >
                {t('landing.bookService')}
              </Link>
            </div>
          </div>
          
          <div className="flex-1 hidden lg:flex justify-center relative">
            <div className="w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl absolute -top-10 -left-10"></div>
            <div className="w-80 h-80 bg-indigo-500/20 rounded-full filter blur-3xl absolute -bottom-10 -right-10"></div>
            
            <div className="relative border border-white/10 bg-white/5 backdrop-blur-md rounded-3xl p-8 shadow-2xl max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <span className="font-extrabold text-lg text-blue-200">{t('landing.bookingTitle')}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full">{t('landing.save20')}</span>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 text-blue-200 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-300 font-bold uppercase tracking-wider">{t('landing.membershipBenefits')}</p>
                    <p className="font-bold text-sm">{t('landing.earnAndUpgrade')}</p>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500/20 text-indigo-200 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-300 font-bold uppercase tracking-wider">{t('landing.recommendedPkg')}</p>
                    <p className="font-bold text-sm">{t('landing.premiumWash')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white">{t('landing.ourPackages')}</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">{t('landing.ourPackagesDesc')}</p>
        </div>

        {isLoadingPackages ? (
          <div className="text-center text-slate-400 font-semibold py-12">{t('landing.loadingPackages')}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {washPackages.map((pkg, idx) => {
              const colors = ['blue', 'purple', 'orange'];
              const currentColor = colors[idx % colors.length];
              
              return (
                <div
                  key={pkg.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                      currentColor === 'blue' ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400' :
                      currentColor === 'purple' ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400' :
                      'bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400'
                    }`}>
                      {currentColor === 'blue' ? <Droplets className="w-7 h-7" /> :
                       currentColor === 'purple' ? <Star className="w-7 h-7" /> :
                       <Sparkles className="w-7 h-7" />}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{pkg.name}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 leading-relaxed">{pkg.description}</p>
                    
                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-3xl font-black text-slate-900 dark:text-white">{formatCurrency(pkg.price)}</span>
                      <span className="text-slate-400 dark:text-slate-500 text-xs font-semibold">• {pkg.durationMinutes} {t('bookWash.dateTime.mins', {defaultValue: 'mins'})}</span>
                    </div>

                    {pkg.features && (
                      <ul className="space-y-3 mb-8">
                        {pkg.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-300 font-medium">
                            <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <Link
                    to="/login"
                    className="block w-full py-3.5 text-center bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-blue-500/10 transition-colors"
                  >
                    {t('bookWash.dateTime.select', {defaultValue: 'Book Now'})}
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* LOYALTY TIERS SECTION */}
      <section className="bg-slate-100 dark:bg-slate-900/30 py-24 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white">{t('landing.membershipTiersTitle')}</h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">{t('landing.membershipTiersDesc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tItem) => {
              const Icon = tItem.icon;
              return (
                <div
                  key={tItem.tier}
                  className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xl transition-all duration-300"
                >
                  <div className={`bg-gradient-to-r ${tItem.bgColor} p-6 text-white`}>
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">{tItem.tier}</h3>
                    <p className="text-xs opacity-90 font-medium">{t('landing.tiers.pointsMultiplier', { mult: tItem.multiplier })}</p>
                  </div>
                  
                  <div className="p-6 space-y-5">
                    <div className="pb-4 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{t('landing.tiers.bookInAdvance')}</p>
                      <p className="font-extrabold text-slate-800 dark:text-white text-sm mt-0.5">
                        {t('landing.tiers.upToDays', { days: tItem.bookingWindow.split(' ')[0] })}
                      </p>
                    </div>
                    <ul className="space-y-3">
                      {tItem.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white rounded-2xl font-bold shadow-xl transition-all hover:-translate-y-0.5"
            >
              <span>{t('landing.registerToExchange')}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* LOCATIONS & MAP SECTION */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white">{t('landing.branchSystem')}</h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">{t('landing.branchSystemDesc')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Dynamic Branch List */}
          <div className="lg:col-span-1 space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {isLoadingBranches ? (
              <div className="text-center text-slate-400 font-semibold py-8">{t('landing.loadingBranches')}</div>
            ) : branches.length === 0 ? (
              <div className="text-center text-slate-400 font-semibold py-8">{t('landing.noBranches')}</div>
            ) : (
              branches.map((branch) => (
                <div
                  key={branch.id}
                  onClick={() => setSelectedBranchId(branch.id)}
                  className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border cursor-pointer transition-all duration-200 ${
                    selectedBranchId === branch.id
                      ? 'border-blue-600 bg-blue-50/5 dark:bg-blue-950/20 shadow-md shadow-blue-500/5'
                      : 'border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-lg'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-800 dark:text-white text-base">{branch.branchName}</h3>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 rounded-full">
                      {t('landing.open')}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
                      <span>{branch.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{branch.hotline}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
                      <span>{branch.operatingHours || '07:00 - 21:00'}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenMap(branch.id);
                    }}
                    className="mt-4 w-full py-2 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-white bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-600 rounded-xl transition-all text-center border border-blue-100 dark:border-blue-900/50"
                  >
                    {t('landing.viewOnMap')}
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Dynamic Mock Map */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{t('landing.mapTitle')}</h3>
                <button
                  onClick={() => handleOpenMap()}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md shadow-blue-500/10 active:scale-95 transition-all"
                >
                  <Map className="w-3.5 h-3.5" /> {t('landing.detailMapBtn')}
                </button>
              </div>

              <div className="relative w-full h-[400px] flex-1">
                <LandingInteractiveMap 
                  branches={branches} 
                  selectedBranchId={selectedBranchId} 
                  onSelectBranch={setSelectedBranchId} 
                />
              </div>
              
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-4 text-center font-medium italic">
                {t('landing.mapFooter')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <Droplets className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-white text-base tracking-tight">AutoWash Pro</span>
          </div>
          <p className="text-xs font-medium">{t('landing.allRightsReserved')}</p>
        </div>
      </footer>

      {/* MODAL BẢN ĐỒ CHI TIẾT SỐ */}
      <MapModal
        isOpen={isMapOpen}
        onClose={() => setIsMapOpen(false)}
        branches={branches}
        selectedBranchId={selectedBranchId}
      />
    </div>
  );
};
