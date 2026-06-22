import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Droplets, Sparkles, Star, Crown, Gem, Award, 
  CheckCircle, ArrowRight, MapPin, Phone, Clock, Map 
} from 'lucide-react';
import { useBranch } from "@/features/products/application/useBranch.ts";
import { useWashPackage } from "@/features/products/application/useWashPackage.ts";
import { MapModal } from "@/features/products/presentation/components/MapModal.tsx";

// Static tier info for introduction
const tiers = [
  {
    tier: 'Member',
    icon: Award,
    color: 'blue',
    multiplier: '1x',
    bookingWindow: '7 days',
    benefits: ['5% off invoice', 'Points multiplier: 1x', 'Book up to 7 days in advance', 'Birthday gift'],
    bgColor: 'from-blue-500 to-blue-600',
  },
  {
    tier: 'Silver Tier',
    icon: Star,
    color: 'gray',
    multiplier: '1.5x',
    bookingWindow: '10 days',
    benefits: ['10% off invoice', 'Points multiplier: 1.5x', 'Book up to 10 days in advance', 'Priority support'],
    bgColor: 'from-gray-400 to-gray-500',
  },
  {
    tier: 'Gold Tier',
    icon: Crown,
    color: 'yellow',
    multiplier: '2x',
    bookingWindow: '12 days',
    benefits: ['15% off invoice', 'Points multiplier: 2x', 'Book up to 12 days in advance', 'Free wash on birthday'],
    bgColor: 'from-yellow-400 to-yellow-500',
  },
  {
    tier: 'Platinum Tier',
    icon: Gem,
    color: 'purple',
    multiplier: '3x',
    bookingWindow: '14 days',
    benefits: ['20% off invoice', 'Points multiplier: 3x', 'Book up to 14 days in advance', 'VIP lane at store'],
    bgColor: 'from-purple-500 to-purple-600',
  },
];

// Hàm phụ để tính toán vị trí tương đối trên bản đồ giả lập của HCMC dựa theo tọa độ thật
const getRelativePosition = (lat: number, lon: number) => {
  // Khoảng tọa độ bao quanh TP.HCM
  const minLat = 10.70;
  const maxLat = 10.85;
  const minLon = 106.60;
  const maxLon = 106.75;
  
  const x = ((lon - minLon) / (maxLon - minLon)) * 100;
  const y = (1 - (lat - minLat) / (maxLat - minLat)) * 100;
  
  return {
    left: `${Math.min(90, Math.max(10, x))}%`,
    top: `${Math.min(90, Math.max(10, y))}%`
  };
};

export const LandingPage: React.FC = () => {
  const { branches, isLoading: isLoadingBranches } = useBranch();
  const { washPackages, isLoading: isLoadingPackages } = useWashPackage();
  
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');

  const handleOpenMap = (branchId?: string) => {
    setSelectedBranchId(branchId || '');
    setIsMapOpen(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-slate-50 font-sans text-slate-800 selection:bg-blue-500 selection:text-white antialiased">
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Droplets className="w-6 h-6" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">AutoWash Pro</span>
            <span className="text-[10px] block font-semibold text-slate-400 -mt-1">Smart Car Care</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/10 active:scale-95 transition-all"
          >
            Register now
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
              Next Generation Automated Car Wash Technology
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight">
              Smart Car Wash <br/>
              <span className="bg-gradient-to-r from-blue-200 to-teal-100 bg-clip-text text-transparent">Accumulate Huge Offers</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-blue-100 font-medium max-w-2xl">
              Experience the state-of-the-art automated booking system. Fast wash, easy payment, upgrade your membership to get free vouchers daily.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-2xl shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                <span>Get started now</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm text-white font-bold rounded-2xl transition-all flex items-center justify-center"
              >
                Book a service
              </Link>
            </div>
          </div>
          
          <div className="flex-1 hidden lg:flex justify-center relative">
            <div className="w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl absolute -top-10 -left-10"></div>
            <div className="w-80 h-80 bg-indigo-500/20 rounded-full filter blur-3xl absolute -bottom-10 -right-10"></div>
            
            <div className="relative border border-white/10 bg-white/5 backdrop-blur-md rounded-3xl p-8 shadow-2xl max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <span className="font-extrabold text-lg text-blue-200">AutoWash Booking</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full">Save 20%</span>
              </div>
              <div className="space-y-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 text-blue-200 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-300 font-bold uppercase tracking-wider">Membership Benefits</p>
                    <p className="font-bold text-sm">Earn Points & Upgrade</p>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-500/20 text-indigo-200 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-300 font-bold uppercase tracking-wider">Recommended Package</p>
                    <p className="font-bold text-sm">Premium Wash</p>
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
          <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-slate-900">Our Service Packages</h2>
          <p className="text-lg text-slate-500 font-medium">Choose the best care package that suits your vehicle</p>
        </div>

        {isLoadingPackages ? (
          <div className="text-center text-slate-400 font-semibold py-12">Loading service packages...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {washPackages.map((pkg, idx) => {
              const colors = ['blue', 'purple', 'orange'];
              const currentColor = colors[idx % colors.length];
              
              return (
                <div
                  key={pkg.id}
                  className="bg-white rounded-3xl p-8 border border-slate-200 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${
                      currentColor === 'blue' ? 'bg-blue-50 text-blue-600' :
                      currentColor === 'purple' ? 'bg-purple-50 text-purple-600' :
                      'bg-orange-50 text-orange-600'
                    }`}>
                      {currentColor === 'blue' ? <Droplets className="w-7 h-7" /> :
                       currentColor === 'purple' ? <Star className="w-7 h-7" /> :
                       <Sparkles className="w-7 h-7" />}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{pkg.name}</h3>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">{pkg.description}</p>
                    
                    <div className="flex items-baseline gap-2 mb-6">
                      <span className="text-3xl font-black text-slate-900">{formatCurrency(pkg.price)}</span>
                      <span className="text-slate-400 text-xs font-semibold">• {pkg.durationMinutes} mins</span>
                    </div>

                    {pkg.features && (
                      <ul className="space-y-3 mb-8">
                        {pkg.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2.5 text-sm text-slate-600 font-medium">
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
                    Book Now
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* LOYALTY TIERS SECTION */}
      <section className="bg-slate-100 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-slate-900">Membership Tiers & Benefits</h2>
            <p className="text-lg text-slate-500 font-medium">Accumulate reward points after every wash to upgrade your tier and enjoy deep automatic discounts</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.tier}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300"
                >
                  <div className={`bg-gradient-to-r ${t.bgColor} p-6 text-white`}>
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-1">{t.tier}</h3>
                    <p className="text-xs opacity-90 font-medium">Points multiplier: {t.multiplier}</p>
                  </div>
                  
                  <div className="p-6 space-y-5">
                    <div className="pb-4 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Book in advance</p>
                      <p className="font-extrabold text-slate-800 text-sm mt-0.5">Up to {t.bookingWindow}</p>
                    </div>
                    <ul className="space-y-3">
                      {t.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
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
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold shadow-xl transition-all hover:-translate-y-0.5"
            >
              <span>Register to Exchange Reward Points Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* LOCATIONS & MAP SECTION */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl lg:text-5xl font-black tracking-tight text-slate-900">Branch System</h2>
          <p className="text-lg text-slate-500 font-medium">Find and select the nearest AutoWash Pro branch in HCMC</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Dynamic Branch List */}
          <div className="lg:col-span-1 space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {isLoadingBranches ? (
              <div className="text-center text-slate-400 font-semibold py-8">Loading branches...</div>
            ) : branches.length === 0 ? (
              <div className="text-center text-slate-400 font-semibold py-8">No branches found.</div>
            ) : (
              branches.map((branch) => (
                <div
                  key={branch.id}
                  onClick={() => setSelectedBranchId(branch.id)}
                  className={`bg-white rounded-2xl p-5 border cursor-pointer transition-all duration-200 ${
                    selectedBranchId === branch.id
                      ? 'border-blue-600 bg-blue-50/5 shadow-md shadow-blue-500/5'
                      : 'border-slate-200 hover:border-blue-300 hover:shadow-lg'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-slate-800 text-base">{branch.branchName}</h3>
                    </div>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full">
                      Open
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-xs text-slate-500">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{branch.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-700">{branch.hotline}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{branch.operatingHours || '07:00 - 21:00'}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenMap(branch.id);
                    }}
                    className="mt-4 w-full py-2 text-xs font-bold text-blue-600 hover:text-white bg-blue-50 hover:bg-blue-600 rounded-xl transition-all text-center border border-blue-100"
                  >
                    View on Digital Map
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Dynamic Mock Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900">Branch System Map</h3>
                <button
                  onClick={() => handleOpenMap()}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md shadow-blue-500/10 active:scale-95 transition-all"
                >
                  <Map className="w-3.5 h-3.5" /> Detailed Digital Map
                </button>
              </div>

              <div className="relative w-full h-[400px] bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 rounded-2xl overflow-hidden border border-slate-200 flex-1">
                {/* Background Grid SVG */}
                <div className="absolute inset-0 opacity-10">
                  <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#2563eb" strokeWidth="1"/>
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                {/* Stylized Saigon River */}
                <div className="absolute bottom-0 left-0 w-full h-1/3 bg-blue-200 opacity-25 rounded-t-[100px]"></div>

                {/* Dynamic branch positioning based on real coordinates */}
                {!isLoadingBranches && branches.map((branch) => {
                  const pos = getRelativePosition(branch.latitude, branch.longitude);
                  const isSelected = selectedBranchId === branch.id;
                  
                  return (
                    <div 
                      key={branch.id} 
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 z-10"
                      style={{ left: pos.left, top: pos.top }}
                      onClick={() => setSelectedBranchId(branch.id)}
                    >
                      <div className="relative group flex flex-col items-center">
                        <MapPin className={`w-10 h-10 filter drop-shadow-md transition-transform hover:scale-110 ${
                          isSelected ? 'text-blue-600 scale-110' : 'text-slate-500'
                        }`} fill={isSelected ? '#2563eb' : '#94a3b8'} />
                        <div className="absolute -bottom-8 whitespace-nowrap bg-slate-900/90 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-lg opacity-90">
                          {branch.branchName.replace("AutoWash ", "")}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* City Label */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3.5 py-2 rounded-xl shadow-md border border-slate-100">
                  <p className="text-xs font-black text-slate-800">Ho Chi Minh City</p>
                  <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{branches.length} Active Branches</p>
                </div>
              </div>
              
              <p className="text-xs text-slate-400 mt-4 text-center font-medium italic">
                Click on "Detailed Digital Map" to open the full interactive GPS tracking system
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
          <p className="text-xs font-medium">© 2026 AutoWash Pro. All rights reserved.</p>
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
