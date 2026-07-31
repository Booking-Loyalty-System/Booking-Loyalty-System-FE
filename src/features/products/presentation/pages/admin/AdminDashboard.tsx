import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  Users,
  Calendar,
  TrendingUp,
  Award,
  Megaphone,
  Download,
  Settings,
  Save,
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useAdminDashboard } from "@/features/products/application/useAdminDashboard";
import type { TierDistributionData, RecentBooking } from "@/features/products/domain/models/admin-dashboard/admin-dashboard.model";
import { useTranslation } from "react-i18next";
import { translateDynamic } from "@/shared/utils/dynamicTranslator";

export function AdminDashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation('customer');

  const [dateFilter, setDateFilter] = useState({
    fromDate: "2026-06-01",
    toDate: "2026-06-30",
    compareFromDate: "2026-05-01",
    compareToDate: "2026-05-31",
  });

  const [tempDateFilter, setTempDateFilter] = useState({ ...dateFilter });
  const [dateError, setDateError] = useState<string | null>(null);

  const {
    summary,
    recentBookings,
    tierConfig: serverTierConfig,
    revenueComparison,
    isLoading,
    isError,
    updateTierConfig,
    isUpdatingTierConfig,
    exportRbl
  } = useAdminDashboard(dateFilter);

  const [tierConfigState, setTierConfigState] = useState({
    memberMultiplier: 1,
    silverMultiplier: 1.5,
    goldMultiplier: 2,
    platinumMultiplier: 3,
  });

  useEffect(() => {
    if (serverTierConfig) {
      setTierConfigState({
        memberMultiplier: serverTierConfig.memberMultiplier,
        silverMultiplier: serverTierConfig.silverMultiplier,
        goldMultiplier: serverTierConfig.goldMultiplier,
        platinumMultiplier: serverTierConfig.platinumMultiplier,
      });
    }
  }, [serverTierConfig]);

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30";
      case "InProgress":
      case "CheckedIn":
        return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30";
      case "Pending":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/30";
      case "Confirmed":
        return "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-400 dark:border-indigo-500/30";
      case "NoShow":
      case "Cancelled":
        return "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-500/20 dark:text-rose-400 dark:border-rose-500/30";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-white/10 dark:text-slate-300 dark:border-white/20";
    }
  };

  const handleExportRBL = async () => {
    await exportRbl();
  };

  const handleSaveTierConfig = async () => {
    await updateTierConfig(tierConfigState);
  };

  const handleDateChange = (field: keyof typeof dateFilter, value: string) => {
    setTempDateFilter((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilter = () => {
    const from = new Date(tempDateFilter.fromDate);
    const to = new Date(tempDateFilter.toDate);
    const compareFrom = new Date(tempDateFilter.compareFromDate);
    const compareTo = new Date(tempDateFilter.compareToDate);

    if (isNaN(from.getTime()) || isNaN(to.getTime()) || isNaN(compareFrom.getTime()) || isNaN(compareTo.getTime())) {
      setDateError(t('adminDashboard.revenueComparison.invalidDateError', { defaultValue: 'Vui lòng nhập đầy đủ ngày hợp lệ.' }));
      return;
    }

    if (from > to || compareFrom > compareTo) {
      setDateError(t('adminDashboard.revenueComparison.dateOrderError', { defaultValue: 'Bạn đã nhập sai thứ tự, hãy nhập đúng thứ tự!' }));
      return;
    }

    setDateError(null);
    setDateFilter(tempDateFilter);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 bg-white dark:bg-[#111] rounded-[2.5rem] border border-rose-200 dark:border-rose-900/50 shadow-xl">
        <p className="text-rose-500 font-bold mb-4">Đã xảy ra lỗi khi tải dữ liệu dashboard.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const comparisonChartData = revenueComparison ? [
    {
      name: t('adminDashboard.revenueComparison.revenueAudit', { defaultValue: 'Đối soát Doanh thu' }),
      [t('adminDashboard.revenueComparison.previousTerm', { defaultValue: 'Kỳ trước' })]: revenueComparison.previousRevenue,
      [t('adminDashboard.revenueComparison.currentTerm', { defaultValue: 'Kỳ này' })]: revenueComparison.currentRevenue,
    }
  ] : [];

  return (
    <div className="animate-fade-in space-y-8 text-blue-950 dark:text-slate-100 pb-12">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">{t('adminDashboard.title', { defaultValue: 'Admin Overview' })}</h1>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mt-1">
            {t('adminDashboard.subtitle', { defaultValue: 'Theo dõi tổng quan doanh thu và hiệu suất kinh doanh.' })}
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: t('adminDashboard.metrics.totalRevenue', { defaultValue: 'Total Revenue' }), value: `${(summary?.metrics?.totalRevenue || 0).toLocaleString("vi-VN")} đ`, icon: DollarSign, color: 'emerald' },
          { label: t('adminDashboard.metrics.totalBookings', { defaultValue: 'Total Bookings' }), value: summary?.metrics?.totalBookings || 0, icon: Calendar, color: 'blue' },
          { label: t('adminDashboard.metrics.activeCustomers', { defaultValue: 'Active Customers' }), value: summary?.metrics?.activeCustomers || 0, icon: Users, color: 'purple' },
          { label: t('adminDashboard.metrics.averageOrderValue', { defaultValue: 'Average Order Value' }), value: `${Math.round(summary?.metrics?.averageOrderValue || 0).toLocaleString("vi-VN")} đ`, icon: TrendingUp, color: 'amber' }
        ].map((metric, idx) => (
          <div key={idx} className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-2xl rounded-[2rem] p-6 border border-slate-200/60 dark:border-white/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 bg-${metric.color}-100 dark:bg-${metric.color}-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <metric.icon className={`w-7 h-7 text-${metric.color}-600 dark:text-${metric.color}-400`} />
              </div>
            </div>
            <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:text-white mb-1 tracking-tight">
              {metric.value}
            </p>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              {metric.label}
            </p>
          </div>
        ))}
      </div>

      {/* REVENUE AUDITING & COMPARISON */}
      <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-slate-200/60 dark:border-white/5 shadow-lg">
        <div className="border-b border-slate-100 dark:border-white/5 pb-6 mb-8">
          <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:text-white">{t('adminDashboard.revenueComparison.title', { defaultValue: 'Revenue Auditing & Comparison' })}</h3>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{t('adminDashboard.revenueComparison.subtitle', { defaultValue: 'So sánh đối soát doanh thu dựa trên các khoảng thời gian tùy chọn' })}</p>

          {/* Form chọn khoảng mốc ngày */}
          <div className="flex flex-col gap-4 mt-6 p-6 bg-slate-50/50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Cụm Kỳ Này */}
              <div className="space-y-3">
                <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest block">{t('adminDashboard.revenueComparison.currentPeriod', { defaultValue: 'Kỳ muốn coi (Kỳ này)' })}</span>
                <div className="flex items-center gap-3">
                  <input
                    type="date"
                    value={tempDateFilter.fromDate}
                    onChange={(e) => handleDateChange('fromDate', e.target.value)}
                    className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-700 dark:text-slate-200 transition-all shadow-sm"
                  />
                  <span className="text-slate-400 text-xs font-black uppercase">{t('adminDashboard.revenueComparison.to', { defaultValue: 'đến' })}</span>
                  <input
                    type="date"
                    value={tempDateFilter.toDate}
                    onChange={(e) => handleDateChange('toDate', e.target.value)}
                    className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-700 dark:text-slate-200 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Cụm Kỳ Trước */}
              <div className="space-y-3">
                <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest block">{t('adminDashboard.revenueComparison.previousPeriod', { defaultValue: 'Kỳ đối chứng (Kỳ trước)' })}</span>
                <div className="flex items-center gap-3">
                  <input
                    type="date"
                    value={tempDateFilter.compareFromDate}
                    onChange={(e) => handleDateChange('compareFromDate', e.target.value)}
                    className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-500/10 font-bold text-slate-700 dark:text-slate-200 transition-all shadow-sm"
                  />
                  <span className="text-slate-400 text-xs font-black uppercase">{t('adminDashboard.revenueComparison.to', { defaultValue: 'đến' })}</span>
                  <input
                    type="date"
                    value={tempDateFilter.compareToDate}
                    onChange={(e) => handleDateChange('compareToDate', e.target.value)}
                    className="w-full bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-500/10 font-bold text-slate-700 dark:text-slate-200 transition-all shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Thông báo lỗi & nút Áp dụng */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-100 dark:border-white/5">
              <div className="flex-1">
                {dateError && (
                  <p className="text-sm font-bold text-rose-500 dark:text-rose-400 animate-pulse">
                    {dateError}
                  </p>
                )}
              </div>
              <button
                onClick={handleApplyFilter}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 self-end sm:self-auto"
              >
                {t('adminDashboard.revenueComparison.applyBtn', { defaultValue: 'Áp dụng đối soát' })}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
          {/* Thống kê con số */}
          <div className="space-y-6">
            <div>
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-2">Doanh thu kỳ này</span>
              <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:text-white tracking-tight">
                {(revenueComparison?.currentRevenue || 0).toLocaleString("vi-VN")} đ
              </div>
            </div>

            {/* Tỉ lệ tăng trưởng (%) */}
            <div>
              {(revenueComparison?.growthRate || 0) >= 0 ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20 shadow-sm">
                  <ArrowUpRight className="w-5 h-5" />
                  <span>+{revenueComparison?.growthRate}%</span>
                  <span className="text-emerald-500 dark:text-emerald-500/70 ml-1">{t('adminDashboard.revenueComparison.growth', { defaultValue: 'tăng trưởng' })}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 shadow-sm">
                  <ArrowDownRight className="w-5 h-5" />
                  <span>{revenueComparison?.growthRate}%</span>
                  <span className="text-rose-500 dark:text-rose-500/70 ml-1">{t('adminDashboard.revenueComparison.decline', { defaultValue: 'sụt giảm' })}</span>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-white/5">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Doanh thu kỳ trước</span>
              <span className="text-xl font-bold text-slate-600 dark:text-slate-400">
                {(revenueComparison?.previousRevenue || 0).toLocaleString("vi-VN")} đ
              </span>
            </div>
          </div>

          {/* Biểu đồ cột so sánh */}
          <div className="lg:col-span-2 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonChartData} barGap={16}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#64748b', fontSize: 13, fontWeight: 'bold' }} />
                <YAxis hide />
                <Tooltip
                  formatter={(value) => [`${Number(value).toLocaleString("vi-VN")} đ`]}
                  contentStyle={{ borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                />
                <Legend verticalAlign="top" height={40} iconType="circle" iconSize={10} wrapperStyle={{ fontWeight: 'bold' }} />
                <Bar dataKey={t('adminDashboard.revenueComparison.previousTerm', { defaultValue: 'Kỳ trước' })} fill="#94a3b8" radius={[8, 8, 0, 0]} maxBarSize={70} />
                <Bar dataKey={t('adminDashboard.revenueComparison.currentTerm', { defaultValue: 'Kỳ này' })} fill="#3b82f6" radius={[8, 8, 0, 0]} maxBarSize={70} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white/80 dark:bg-[#111]/80 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-slate-200/60 dark:border-white/5 shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:text-white">{t('adminDashboard.revenueComparison.revenueOverview', { defaultValue: 'Revenue Overview' })}</h3>
            <button
              onClick={handleExportRBL}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-sm rounded-xl hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 transition-all"
            >
              <Download className="w-4 h-4" />
              {t('adminDashboard.revenueComparison.exportDataset', { defaultValue: 'Export Dataset' })}
            </button>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={summary?.revenueChart || []} id="revenue-bar-chart">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontWeight: 'bold' }} axisLine={false} tickLine={false} />
              <YAxis stroke="#64748b" tick={{ fontWeight: 'bold' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "none",
                  borderRadius: "16px",
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                  fontWeight: 'bold',
                }}
                formatter={(value) => [`${Number(value).toLocaleString("vi-VN")} đ`, "Revenue"]}
                cursor={{ fill: 'rgba(59,130,246,0.05)' }}
              />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} maxBarSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tier Distribution */}
        <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-2xl rounded-[2.5rem] p-8 border border-slate-200/60 dark:border-white/5 shadow-lg flex flex-col">
          <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:text-white mb-6">{t('adminDashboard.membershipTiers.title', { defaultValue: 'Membership Tiers' })}</h3>
          <div className="flex-1 flex flex-col justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart id="tier-pie-chart">
                <Pie
                  data={summary?.tierDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {(summary?.tierDistribution || []).map((entry: TierDistributionData, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color || "#3b82f6"} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} customers`, "Count"]}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-8 space-y-3">
              {(summary?.tierDistribution || []).map((tier: TierDistributionData) => (
                <div
                  key={tier.name}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3.5 h-3.5 rounded-full shadow-sm"
                      style={{ backgroundColor: tier.color || "#3b82f6" }}
                    ></div>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{translateDynamic(tier.name, 'tier', t)}</span>
                  </div>
                  <span className="text-sm font-black text-blue-950 dark:text-white">
                    {tier.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings - hidden */}
      {/* <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-2xl rounded-[2.5rem] border border-slate-200/60 dark:border-white/5 shadow-lg overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
          <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:text-white">{t('adminDashboard.recentBookings.title', { defaultValue: 'Recent Bookings' })}</h3>
        </div>
        <div className="overflow-x-auto custom-scrollbar p-2">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 dark:border-white/5">
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">{t('adminDashboard.recentBookings.bookingId', { defaultValue: 'Booking ID' })}</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">{t('adminDashboard.recentBookings.customer', { defaultValue: 'Customer' })}</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">{t('adminDashboard.recentBookings.service', { defaultValue: 'Service' })}</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">{t('adminDashboard.recentBookings.amount', { defaultValue: 'Amount' })}</th>
                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">{t('adminDashboard.recentBookings.status', { defaultValue: 'Status' })}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              {(recentBookings || []).map((booking: RecentBooking) => (
                <tr key={booking.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-5">
                    <code className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-md" title={booking.id}>
                      {booking.id.substring(0, 8)}...
                    </code>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-blue-950 dark:text-white">
                    {booking.customer.replace('Customer ', t('adminDashboard.recentBookings.customerWord', { defaultValue: 'Customer' }) + ' ').replace(' Tier', '').replace('Bronze', translateDynamic('Bronze', 'tier', t)).replace('Silver', translateDynamic('Silver', 'tier', t)).replace('Gold', translateDynamic('Gold', 'tier', t)).replace('Platinum', translateDynamic('Platinum', 'tier', t))}
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-600 dark:text-slate-300">
                    {translateDynamic(booking.service, 'package', t)}
                  </td>
                  <td className="px-6 py-5 text-sm font-black text-blue-950 dark:text-white">
                    {booking.amount.toLocaleString("vi-VN")} đ
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg border ${getStatusBadgeClass(booking.status)}`}
                    >
                      {translateDynamic(booking.status, 'status', t)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}

      {/* Tier Configuration Panel */}
      <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-2xl rounded-[2.5rem] border border-slate-200/60 dark:border-white/5 shadow-lg p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Settings className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:text-white">{t('adminDashboard.tierConfig.title', { defaultValue: 'Tier Rules & Configuration' })}</h3>
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-1">{t('adminDashboard.tierConfig.subtitle', { defaultValue: 'Quản lý hệ số nhân điểm cho các hạng thành viên' })}</p>
            </div>
          </div>
          <button
            onClick={handleSaveTierConfig}
            disabled={isUpdatingTierConfig}
            className="flex items-center gap-2 px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-blue-950 font-bold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            {isUpdatingTierConfig ? t('adminDashboard.tierConfig.saving', { defaultValue: 'Saving...' }) : t('adminDashboard.tierConfig.saveChanges', { defaultValue: 'Save Changes' })}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Member Tier Config */}
          <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-6 border border-slate-100 dark:border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-slate-200/50 dark:bg-slate-700/20 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex items-center gap-3 mb-5 relative z-10">
              <Award className="w-6 h-6 text-slate-500" />
              <h4 className="font-extrabold text-lg text-blue-950 dark:text-white">{translateDynamic('Member', 'tier', t)}</h4>
            </div>
            <div className="space-y-4 relative z-10">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">{t('adminDashboard.tierConfig.pointsRange', { defaultValue: 'Points Range' })}</label>
                <input type="text" value="0 - 299" disabled className="w-full px-4 py-2.5 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-500 opacity-70" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block">{t('adminDashboard.tierConfig.pointsMultiplier', { defaultValue: 'Points Multiplier' })}</label>
                <input
                  type="number"
                  value={tierConfigState.memberMultiplier}
                  onChange={(e) => setTierConfigState({ ...tierConfigState, memberMultiplier: parseFloat(e.target.value) || 0 })}
                  step="0.1"
                  className="w-full px-4 py-2.5 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-blue-950 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Silver Tier Config */}
          <div className="bg-slate-100/80 dark:bg-slate-800/40 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-slate-300/50 dark:bg-slate-600/30 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex items-center gap-3 mb-5 relative z-10">
              <Award className="w-6 h-6 text-slate-600 dark:text-slate-300" />
              <h4 className="font-extrabold text-lg text-blue-950 dark:text-white">{translateDynamic('Silver', 'tier', t)}</h4>
            </div>
            <div className="space-y-4 relative z-10">
              <div>
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">{t('adminDashboard.tierConfig.pointsRange', { defaultValue: 'Points Range' })}</label>
                <input type="text" value="300 - 599" disabled className="w-full px-4 py-2.5 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-500 opacity-70" />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">{t('adminDashboard.tierConfig.pointsMultiplier', { defaultValue: 'Points Multiplier' })}</label>
                <input
                  type="number"
                  value={tierConfigState.silverMultiplier}
                  onChange={(e) => setTierConfigState({ ...tierConfigState, silverMultiplier: parseFloat(e.target.value) || 0 })}
                  step="0.1"
                  className="w-full px-4 py-2.5 bg-white dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-blue-950 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Gold Tier Config */}
          <div className="bg-amber-50 dark:bg-amber-500/10 rounded-2xl p-6 border border-amber-200 dark:border-amber-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-amber-200/50 dark:bg-amber-500/20 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex items-center gap-3 mb-5 relative z-10">
              <Award className="w-6 h-6 text-amber-500" />
              <h4 className="font-extrabold text-lg text-amber-700 dark:text-amber-400">{translateDynamic('Gold', 'tier', t)}</h4>
            </div>
            <div className="space-y-4 relative z-10">
              <div>
                <label className="text-[10px] font-black text-amber-600/70 dark:text-amber-400/70 uppercase tracking-widest mb-1.5 block">{t('adminDashboard.tierConfig.pointsRange', { defaultValue: 'Points Range' })}</label>
                <input type="text" value="600 - 999" disabled className="w-full px-4 py-2.5 bg-white dark:bg-black/20 border border-amber-200 dark:border-amber-500/20 rounded-xl text-sm font-bold text-amber-600/70 dark:text-amber-400/70 opacity-70" />
              </div>
              <div>
                <label className="text-[10px] font-black text-amber-600/70 dark:text-amber-400/70 uppercase tracking-widest mb-1.5 block">{t('adminDashboard.tierConfig.pointsMultiplier', { defaultValue: 'Points Multiplier' })}</label>
                <input
                  type="number"
                  value={tierConfigState.goldMultiplier}
                  onChange={(e) => setTierConfigState({ ...tierConfigState, goldMultiplier: parseFloat(e.target.value) || 0 })}
                  step="0.1"
                  className="w-full px-4 py-2.5 bg-white dark:bg-black/20 border border-amber-200 dark:border-amber-500/20 rounded-xl text-sm font-bold text-amber-700 dark:text-amber-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Platinum Tier Config */}
          <div className="bg-fuchsia-50 dark:bg-fuchsia-500/10 rounded-2xl p-6 border border-fuchsia-200 dark:border-fuchsia-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-fuchsia-200/50 dark:bg-fuchsia-500/20 rounded-bl-full -mr-4 -mt-4"></div>
            <div className="flex items-center gap-3 mb-5 relative z-10">
              <Award className="w-6 h-6 text-fuchsia-500" />
              <h4 className="font-extrabold text-lg text-fuchsia-700 dark:text-fuchsia-400">{translateDynamic('Platinum', 'tier', t)}</h4>
            </div>
            <div className="space-y-4 relative z-10">
              <div>
                <label className="text-[10px] font-black text-fuchsia-600/70 dark:text-fuchsia-400/70 uppercase tracking-widest mb-1.5 block">{t('adminDashboard.tierConfig.pointsRange', { defaultValue: 'Points Range' })}</label>
                <input type="text" value="1000+" disabled className="w-full px-4 py-2.5 bg-white dark:bg-black/20 border border-fuchsia-200 dark:border-fuchsia-500/20 rounded-xl text-sm font-bold text-fuchsia-600/70 dark:text-fuchsia-400/70 opacity-70" />
              </div>
              <div>
                <label className="text-[10px] font-black text-fuchsia-600/70 dark:text-fuchsia-400/70 uppercase tracking-widest mb-1.5 block">{t('adminDashboard.tierConfig.pointsMultiplier', { defaultValue: 'Points Multiplier' })}</label>
                <input
                  type="number"
                  value={tierConfigState.platinumMultiplier}
                  onChange={(e) => setTierConfigState({ ...tierConfigState, platinumMultiplier: parseFloat(e.target.value) || 0 })}
                  step="0.1"
                  className="w-full px-4 py-2.5 bg-white dark:bg-black/20 border border-fuchsia-200 dark:border-fuchsia-500/20 rounded-xl text-sm font-bold text-fuchsia-700 dark:text-fuchsia-400 focus:outline-none focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/20 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-5 bg-blue-50/50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl flex items-start gap-3">
          <div className="bg-blue-100 dark:bg-blue-500/30 p-1.5 rounded-lg shrink-0 mt-0.5">
            <Settings className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
            <span className="font-extrabold uppercase tracking-widest text-[10px]">{t('adminDashboard.tierConfig.formulaTitle', { defaultValue: 'Công thức:' })}</span><br/>
            {t('adminDashboard.tierConfig.formulaDesc', { defaultValue: 'Điểm nhận được = (Tổng tiền thanh toán / 1000) × Hệ số hạng (Tier Multiplier). Việc thay đổi hệ số chỉ áp dụng cho các giao dịch trong tương lai.' })}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:text-white mb-6">{t('adminDashboard.quickManagement.title', { defaultValue: 'Quick Management' })}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: t('adminDashboard.quickManagement.loyaltyPrograms', { defaultValue: 'Loyalty Programs' }), desc: t('adminDashboard.quickManagement.loyaltyProgramsDesc', { defaultValue: 'Manage tiers and rewards' }), icon: Award, color: 'purple', path: '/admin/loyalty' },
            { title: t('adminDashboard.quickManagement.promotions', { defaultValue: 'Promotions' }), desc: t('adminDashboard.quickManagement.promotionsDesc', { defaultValue: 'Create and manage campaigns' }), icon: Megaphone, color: 'orange', path: '/admin/promotions' },
            { title: t('adminDashboard.quickManagement.customerAnalytics', { defaultValue: 'Customer Analytics' }), desc: t('adminDashboard.quickManagement.customerAnalyticsDesc', { defaultValue: 'View detailed reports' }), icon: TrendingUp, color: 'blue', path: '/admin/analytics' },
            { title: t('adminDashboard.quickManagement.staffManagement', { defaultValue: 'Staff Management' }), desc: t('adminDashboard.quickManagement.staffManagementDesc', { defaultValue: 'Manage team and roles' }), icon: Users, color: 'emerald', path: '/admin/staff' }
          ].map((action, idx) => (
            <div
              key={idx}
              onClick={() => navigate(action.path)}
              className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-2xl rounded-[2rem] p-6 border border-slate-200/60 dark:border-white/5 hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 dark:hover:border-blue-500/50 transition-all duration-300 cursor-pointer group"
            >
              <div className={`w-14 h-14 bg-${action.color}-100 dark:bg-${action.color}-500/20 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-${action.color}-500 transition-colors duration-300`}>
                <action.icon className={`w-7 h-7 text-${action.color}-600 dark:text-${action.color}-400 group-hover:text-white transition-colors`} />
              </div>
              <h4 className="text-lg font-extrabold text-blue-950 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {action.title}
              </h4>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{action.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}