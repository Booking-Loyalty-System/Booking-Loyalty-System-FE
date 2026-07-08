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

export function AdminDashboard() {
  const navigate = useNavigate();

  const [dateFilter, setDateFilter] = useState({
    fromDate: "2026-06-01",
    toDate: "2026-06-30",
    compareFromDate: "2026-05-01",
    compareToDate: "2026-05-31",
  });

  // 🌟 Lấy bộ lọc ngày và hàm cập nhật trực tiếp từ hook để quản lý đồng bộ
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
        return "bg-green-100 text-green-700";
      case "InProgress":
      case "CheckedIn":
        return "bg-orange-100 text-orange-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Confirmed":
        return "bg-blue-100 text-blue-700";
      case "NoShow":
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleExportRBL = async () => {
    await exportRbl();
  };

  const handleSaveTierConfig = async () => {
    await updateTierConfig(tierConfigState);
  };

  // Hàm cập nhật nhanh các trường ngày tháng trong state của hook
  const handleDateChange = (field: keyof typeof dateFilter, value: string) => {
    setDateFilter((prev) => ({ ...prev, [field]: value }));
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
      <div className="text-center py-12">
        <p className="text-red-500 font-semibold mb-4">Đã xảy ra lỗi khi tải dữ liệu dashboard.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const comparisonChartData = revenueComparison ? [
    {
      name: 'Đối soát Doanh thu',
      'Kỳ trước': revenueComparison.previousRevenue,
      'Kỳ này': revenueComparison.currentRevenue,
    }
  ] : [];

  return (
    <div className="animate-fade-in">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {(summary?.metrics?.totalRevenue || 0).toLocaleString("vi-VN")} đ
          </p>
          <p className="text-sm text-gray-600">Total Revenue</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {summary?.metrics?.totalBookings || 0}
          </p>
          <p className="text-sm text-gray-600">Total Bookings</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {summary?.metrics?.activeCustomers || 0}
          </p>
          <p className="text-sm text-gray-600">Active Customers</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">
            {Math.round(summary?.metrics?.averageOrderValue || 0).toLocaleString("vi-VN")} đ
          </p>
          <p className="text-sm text-gray-600">Average Order Value</p>
        </div>
      </div>

      {/* 🌟 REVENUE AUDITING & COMPARISON (CẬP NHẬT THEO ĐỐI SOÁT NGÀY) */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
        <div className="border-b border-gray-100 pb-5 mb-6">
          <h3 className="text-xl font-bold text-gray-900">Revenue Auditing & Comparison</h3>
          <p className="text-sm text-gray-500 mt-0.5">So sánh đối soát doanh thu dựa trên các khoảng thời gian tùy chọn</p>

          {/* Form chọn khoảng mốc ngày */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-4 bg-slate-50 rounded-xl border border-gray-100">
            {/* Cụm Kỳ Này */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Kỳ muốn coi (Kỳ này)</span>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={dateFilter.fromDate}
                  onChange={(e) => handleDateChange('fromDate', e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500 font-medium text-gray-700"
                />
                <span className="text-gray-400 text-sm font-medium">đến</span>
                <input
                  type="date"
                  value={dateFilter.toDate}
                  onChange={(e) => handleDateChange('toDate', e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500 font-medium text-gray-700"
                />
              </div>
            </div>

            {/* Cụm Kỳ Trước */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Kỳ đối chứng (Kỳ trước)</span>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={dateFilter.compareFromDate}
                  onChange={(e) => handleDateChange('compareFromDate', e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500 font-medium text-gray-700"
                />
                <span className="text-gray-400 text-sm font-medium">đến</span>
                <input
                  type="date"
                  value={dateFilter.compareToDate}
                  onChange={(e) => handleDateChange('compareToDate', e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500 font-medium text-gray-700"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Thống kê con số */}
          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Doanh thu kỳ này</span>
              <div className="text-3xl font-extrabold text-gray-900 mt-1">
                {(revenueComparison?.currentRevenue || 0).toLocaleString("vi-VN")} đ
              </div>
            </div>

            {/* Tỉ lệ tăng trưởng (%) */}
            <div>
              {(revenueComparison?.growthRate || 0) >= 0 ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+{revenueComparison?.growthRate}%</span>
                  <span className="text-emerald-500 font-normal ml-0.5">tăng trưởng</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                  <ArrowDownRight className="w-4 h-4" />
                  <span>{revenueComparison?.growthRate}%</span>
                  <span className="text-rose-500 font-normal ml-0.5">sụt giảm</span>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-gray-100">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Doanh thu kỳ trước</span>
              <span className="text-lg font-bold text-gray-600">
                {(revenueComparison?.previousRevenue || 0).toLocaleString("vi-VN")} đ
              </span>
            </div>
          </div>

          {/* Biểu đồ cột so sánh */}
          <div className="lg:col-span-2 h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonChartData} barGap={12}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 13 }} />
                <YAxis hide />
                <Tooltip
                  formatter={(value) => [`${Number(value).toLocaleString("vi-VN")} đ`]}
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} />
                <Bar dataKey="Kỳ trước" fill="#cbd5e1" radius={[6, 6, 0, 0]} maxBarSize={60} />
                <Bar dataKey="Kỳ này" fill="#1e6ffd" radius={[6, 6, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Revenue Overview
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportRBL}
                className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export RBL Dataset
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={summary?.revenueChart || []} id="revenue-bar-chart">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
                formatter={(value) => [`${Number(value).toLocaleString("vi-VN")} đ`, "Revenue"]}
              />
              <Bar dataKey="revenue" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tier Distribution */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Membership Tiers
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart id="tier-pie-chart">
              <Pie
                data={summary?.tierDistribution || []}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {(summary?.tierDistribution || []).map((entry: TierDistributionData, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color || "#3b82f6"} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} customers`, "Count"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {(summary?.tierDistribution || []).map((tier: TierDistributionData) => (
              <div
                key={tier.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: tier.color || "#3b82f6" }}
                  ></div>
                  <span className="text-sm text-gray-700">{tier.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  {tier.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">
              Recent Bookings
            </h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Booking ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(recentBookings || []).map((booking: RecentBooking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <code className="text-xs font-semibold text-blue-600" title={booking.id}>
                      {booking.id.substring(0, 8)}...
                    </code>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {booking.customer}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {booking.service}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {booking.amount.toLocaleString("vi-VN")} đ
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadgeClass(booking.status)}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tier Configuration Panel */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">
              Tier Rules & Configuration
            </h3>
          </div>
          <button
            onClick={handleSaveTierConfig}
            disabled={isUpdatingTierConfig}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isUpdatingTierConfig ? "Saving..." : "Save Changes"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Member Tier Config */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Member</h4>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">
                  Points Range
                </label>
                <input
                  type="text"
                  value="0 - 299"
                  disabled
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">
                  Points Multiplier
                </label>
                <input
                  type="number"
                  value={tierConfigState.memberMultiplier}
                  onChange={(e) =>
                    setTierConfigState({
                      ...tierConfigState,
                      memberMultiplier: parseFloat(e.target.value) || 0,
                    })
                  }
                  step="0.1"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">
                  Booking Window
                </label>
                <input
                  type="text"
                  value="7 days"
                  disabled
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          {/* Silver Tier Config */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-gray-600" />
              <h4 className="font-semibold text-gray-900">Silver</h4>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">
                  Points Range
                </label>
                <input
                  type="text"
                  value="300 - 599"
                  disabled
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">
                  Points Multiplier
                </label>
                <input
                  type="number"
                  value={tierConfigState.silverMultiplier}
                  onChange={(e) =>
                    setTierConfigState({
                      ...tierConfigState,
                      silverMultiplier: parseFloat(e.target.value) || 0,
                    })
                  }
                  step="0.1"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">
                  Booking Window
                </label>
                <input
                  type="text"
                  value="10 days"
                  disabled
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          {/* Gold Tier Config */}
          <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-300">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-yellow-600" />
              <h4 className="font-semibold text-gray-900">Gold</h4>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">
                  Points Range
                </label>
                <input
                  type="text"
                  value="600 - 999"
                  disabled
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">
                  Points Multiplier
                </label>
                <input
                  type="number"
                  value={tierConfigState.goldMultiplier}
                  onChange={(e) =>
                    setTierConfigState({
                      ...tierConfigState,
                      goldMultiplier: parseFloat(e.target.value) || 0,
                    })
                  }
                  step="0.1"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">
                  Booking Window
                </label>
                <input
                  type="text"
                  value="12 days"
                  disabled
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          {/* Platinum Tier Config */}
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-300">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-purple-600" />
              <h4 className="font-semibold text-gray-900">Platinum</h4>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">
                  Points Range
                </label>
                <input
                  type="text"
                  value="1000+"
                  disabled
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">
                  Points Multiplier
                </label>
                <input
                  type="number"
                  value={tierConfigState.platinumMultiplier}
                  onChange={(e) =>
                    setTierConfigState({
                      ...tierConfigState,
                      platinumMultiplier: parseFloat(e.target.value) || 0,
                    })
                  }
                  step="0.1"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-gray-600 mb-1 block">
                  Booking Window
                </label>
                <input
                  type="text"
                  value="14 days"
                  disabled
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Points Formula: Points = (Payment Amount /
            1000) × Tier Multiplier. Changes to multipliers will affect future
            point calculations.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            onClick={() => navigate("/admin/loyalty")}
            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all hover:border-blue-300 cursor-pointer group"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-600 transition-colors">
              <Award className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Loyalty Programs
            </h4>
            <p className="text-sm text-gray-600">Manage tiers and rewards</p>
          </div>

          <div
            onClick={() => navigate("/admin/promotions")}
            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all hover:border-blue-300 cursor-pointer group"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-600 transition-colors">
              <Megaphone className="w-6 h-6 text-orange-600 group-hover:text-white transition-colors" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Promotions</h4>
            <p className="text-sm text-gray-600">Create and manage campaigns</p>
          </div>

          <div
            onClick={() => navigate("/admin/analytics")}
            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all hover:border-blue-300 cursor-pointer group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 transition-colors">
              <TrendingUp className="w-4 h-4 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Customer Analytics
            </h4>
            <p className="text-sm text-gray-600">View detailed reports</p>
          </div>

          <div
            onClick={() => navigate("/admin/staff")}
            className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all hover:border-blue-300 cursor-pointer group"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-600 transition-colors">
              <Users className="w-6 h-6 text-green-600 group-hover:text-white transition-colors" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">
              Staff Management
            </h4>
            <p className="text-sm text-gray-600">Manage team and roles</p>
          </div>
        </div>
      </div>
    </div>
  );
}