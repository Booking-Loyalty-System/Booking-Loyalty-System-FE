import { Layout } from "../../../../../shared/components/layout/Layout";
import {
  Users,
  TrendingUp,
  DollarSign,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Download,
} from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const growthData = [
  { name: "Jan", newCustomers: 45, revenue: 4200 },
  { name: "Feb", newCustomers: 52, revenue: 4800 },
  { name: "Mar", newCustomers: 48, revenue: 4500 },
  { name: "Apr", newCustomers: 61, revenue: 5900 },
  { name: "May", newCustomers: 73, revenue: 7300 },
];

const customerSegmentData = [
  { name: "New", count: 120 },
  { name: "Returning", count: 450 },
  { name: "Loyal", count: 180 },
  { name: "Churned", count: 45 },
];

export function AdminAnalytics() {
  return (
    <Layout title="Customer Analytics" userName="Admin" role="admin">
      <div className="space-y-8">
        {/* Analytics Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              Performance Insights
            </h3>
            <p className="text-gray-500">
              Track business growth and customer behavior
            </p>
          </div>
          <div className="flex gap-3">
            <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Last 30 Days</option>
              <option>Last Quarter</option>
              <option>Year to Date</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="flex items-center text-xs font-bold text-green-600">
                <ArrowUpRight className="w-3 h-3" />
                12%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">1,245</p>
            <p className="text-sm text-gray-500">Total Customers</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="flex items-center text-xs font-bold text-green-600">
                <ArrowUpRight className="w-3 h-3" />
                8%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">84%</p>
            <p className="text-sm text-gray-500">Retention Rate</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="flex items-center text-xs font-bold text-red-600">
                <ArrowDownRight className="w-3 h-3" />
                3%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">$82.40</p>
            <p className="text-sm text-gray-500">Avg. Lifetime Value</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-5 h-5 text-orange-600" />
              <span className="flex items-center text-xs font-bold text-green-600">
                <ArrowUpRight className="w-3 h-3" />
                15%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">4.2</p>
            <p className="text-sm text-gray-500">Washes per Year</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue vs Growth */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h4 className="text-lg font-bold text-gray-900 mb-6">
              Revenue Growth Trend
            </h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData} id="analytics-area-chart">
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9ca3af", fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Customer Segments */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h4 className="text-lg font-bold text-gray-900 mb-6">
              Customer Segmentation
            </h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={customerSegmentData}
                  layout="vertical"
                  id="analytics-bar-chart"
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="#f3f4f6"
                  />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#4b5563", fontWeight: 500 }}
                  />
                  <Tooltip cursor={{ fill: "#f9fafb" }} />
                  <Bar
                    dataKey="count"
                    fill="#8b5cf6"
                    radius={[0, 8, 8, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Customers Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <h4 className="font-bold text-gray-900">
              Top Performing Customers
            </h4>
            <button className="text-blue-600 text-sm font-semibold hover:underline">
              View All Customers
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                    Tier
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                    Total Spent
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                    Last Visit
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  {
                    name: "Sarah Wilson",
                    tier: "Platinum",
                    spent: "$1,240",
                    last: "2 days ago",
                    points: 1450,
                  },
                  {
                    name: "Michael Chen",
                    tier: "Gold",
                    spent: "$980",
                    last: "5 days ago",
                    points: 890,
                  },
                  {
                    name: "David Miller",
                    tier: "Gold",
                    spent: "$850",
                    last: "1 week ago",
                    points: 760,
                  },
                  {
                    name: "Emma Thompson",
                    tier: "Silver",
                    spent: "$420",
                    last: "2 weeks ago",
                    points: 380,
                  },
                ].map((customer, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {customer.name}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-bold ${
                          customer.tier === "Platinum"
                            ? "bg-purple-100 text-purple-700"
                            : customer.tier === "Gold"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {customer.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {customer.spent}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {customer.last}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-blue-600">
                      {customer.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
