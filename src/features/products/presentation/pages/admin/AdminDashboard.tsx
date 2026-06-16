import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../../components/layout/Layout";
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
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 4500 },
  { month: "Feb", revenue: 5200 },
  { month: "Mar", revenue: 4800 },
  { month: "Apr", revenue: 6100 },
  { month: "May", revenue: 7300 },
];

const tierDistribution = [
  { name: "Member", value: 145, color: "#3b82f6" },
  { name: "Silver", value: 89, color: "#9ca3af" },
  { name: "Gold", value: 56, color: "#eab308" },
  { name: "Platinum", value: 23, color: "#a855f7" },
];

const recentBookings = [
  {
    id: "BK12355",
    customer: "John Doe",
    service: "Premium Wash",
    amount: 38.25,
    status: "Completed",
  },
  {
    id: "BK12354",
    customer: "Jane Smith",
    service: "Basic Wash",
    amount: 21.25,
    status: "In Progress",
  },
  {
    id: "BK12353",
    customer: "Mike Johnson",
    service: "Ceramic Wash",
    amount: 72.25,
    status: "Scheduled",
  },
  {
    id: "BK12352",
    customer: "Sarah Williams",
    service: "Premium Wash",
    amount: 38.25,
    status: "Completed",
  },
  {
    id: "BK12351",
    customer: "Tom Brown",
    service: "Basic Wash",
    amount: 21.25,
    status: "Completed",
  },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const [tierConfig, setTierConfig] = useState({
    memberMultiplier: 1,
    silverMultiplier: 1.5,
    goldMultiplier: 2,
    platinumMultiplier: 3,
  });

  const handleExportRBL = () => {
    const csvData = `Timestamp,CustomerID,Tier,BookingID,ServiceType,Amount,PointsEarned,LoyaltyEvent
2026-05-17 10:00:00,C001,Gold,BK12350,Premium Wash,45.00,0.09,Booking Created
2026-05-17 10:30:00,C001,Gold,BK12350,Premium Wash,45.00,0.09,Wash Completed
2026-05-17 11:00:00,C002,Platinum,BK12351,Basic Wash,25.00,0.075,Booking Created
2026-05-17 12:00:00,C003,Silver,BK12352,Ceramic Wash,85.00,0.1275,Booking Created`;

    const blob = new Blob([csvData], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `RBL_Dataset_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    alert("RBL Dataset exported successfully for research purposes!");
  };

  const handleSaveTierConfig = () => {
    alert("Tier configuration saved successfully!");
  };

  return (
    <Layout title="Admin Dashboard" userName="Admin" role="admin">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-green-600 font-semibold">+12.5%</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">$28,450</p>
          <p className="text-sm text-gray-600">Total Revenue (May)</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-blue-600 font-semibold">+8.3%</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">387</p>
          <p className="text-sm text-gray-600">Total Bookings (May)</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-purple-600 font-semibold">
              +15.2%
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">313</p>
          <p className="text-sm text-gray-600">Active Customers</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-sm text-orange-600 font-semibold">+5.7%</span>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-1">$73.50</p>
          <p className="text-sm text-gray-600">Average Order Value</p>
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
              <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Last 6 Months</option>
                <option>Last 12 Months</option>
                <option>This Year</option>
              </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData} id="revenue-bar-chart">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
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
                data={tierDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {tierDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {tierDistribution.map((tier) => (
              <div
                key={tier.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: tier.color }}
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
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
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
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <code className="text-sm font-semibold text-blue-600">
                      {booking.id}
                    </code>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {booking.customer}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {booking.service}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    ${booking.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        booking.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "In Progress"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
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
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Changes
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
                  value={tierConfig.memberMultiplier}
                  onChange={(e) =>
                    setTierConfig({
                      ...tierConfig,
                      memberMultiplier: parseFloat(e.target.value),
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
                  value={tierConfig.silverMultiplier}
                  onChange={(e) =>
                    setTierConfig({
                      ...tierConfig,
                      silverMultiplier: parseFloat(e.target.value),
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
                  value={tierConfig.goldMultiplier}
                  onChange={(e) =>
                    setTierConfig({
                      ...tierConfig,
                      goldMultiplier: parseFloat(e.target.value),
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
                  value={tierConfig.platinumMultiplier}
                  onChange={(e) =>
                    setTierConfig({
                      ...tierConfig,
                      platinumMultiplier: parseFloat(e.target.value),
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
              <Users className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
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
    </Layout>
  );
}
