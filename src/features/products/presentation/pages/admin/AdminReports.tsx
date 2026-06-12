import { useState } from "react";
import { Layout } from "../../components/layout/Layout";
import {
  TrendingUp,
  Clock,
  Download,
  FileText,
  FileSpreadsheet,
  MapPin,
  Users,
  Star,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from "recharts";

const BRANCHES = [
  { id: "all", name: "All Branches", color: "#3b82f6" },
  { id: "D1", name: "District 1", color: "#6366f1" },
  { id: "D7", name: "District 7", color: "#f59e0b" },
  { id: "TD", name: "Thu Duc", color: "#10b981" },
  { id: "TB", name: "Tan Binh", color: "#ef4444" },
];

const revenueByMonth = [
  { month: "Jan", D1: 4500, D7: 3200, TD: 2800, TB: 3100 },
  { month: "Feb", D1: 5200, D7: 3800, TD: 3100, TB: 3500 },
  { month: "Mar", D1: 4800, D7: 3500, TD: 2900, TB: 3300 },
  { month: "Apr", D1: 6100, D7: 4200, TD: 3600, TB: 4000 },
  { month: "May", D1: 7300, D7: 5100, TD: 4400, TB: 4800 },
  { month: "Jun", D1: 6800, D7: 4700, TD: 4000, TB: 4500 },
];

const bookingsByMonth = [
  { month: "Jan", D1: 189, D7: 134, TD: 112, TB: 128 },
  { month: "Feb", D1: 215, D7: 158, TD: 131, TB: 145 },
  { month: "Mar", D1: 198, D7: 143, TD: 119, TB: 136 },
  { month: "Apr", D1: 247, D7: 172, TD: 148, TB: 163 },
  { month: "May", D1: 298, D7: 208, TD: 181, TB: 195 },
  { month: "Jun", D1: 276, D7: 192, TD: 164, TB: 183 },
];

const peakHourData = [
  { hour: "8 AM", D1: 12, D7: 9, TD: 8, TB: 10 },
  { hour: "9 AM", D1: 28, D7: 20, TD: 17, TB: 22 },
  { hour: "10 AM", D1: 45, D7: 32, TD: 28, TB: 33 },
  { hour: "11 AM", D1: 52, D7: 38, TD: 34, TB: 39 },
  { hour: "12 PM", D1: 38, D7: 28, TD: 24, TB: 29 },
  { hour: "1 PM", D1: 31, D7: 22, TD: 19, TB: 24 },
  { hour: "2 PM", D1: 42, D7: 31, TD: 27, TB: 32 },
  { hour: "3 PM", D1: 56, D7: 40, TD: 36, TB: 42 },
  { hour: "4 PM", D1: 61, D7: 44, TD: 39, TB: 46 },
  { hour: "5 PM", D1: 48, D7: 35, TD: 30, TB: 37 },
  { hour: "6 PM", D1: 35, D7: 25, TD: 22, TB: 27 },
];

const branchPerformance = [
  { metric: "Revenue", D1: 90, D7: 65, TD: 56, TB: 62 },
  { metric: "Bookings", D1: 85, D7: 60, TD: 52, TB: 58 },
  { metric: "Satisfaction", D1: 88, D7: 82, TD: 79, TB: 84 },
  { metric: "Efficiency", D1: 80, D7: 75, TD: 70, TB: 73 },
  { metric: "Retention", D1: 78, D7: 70, TD: 66, TB: 69 },
];

const branchSummary = [
  {
    id: "D1",
    name: "District 1",
    revenue: 34700,
    bookings: 1423,
    rating: 4.8,
    growth: "+18%",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    id: "D7",
    name: "District 7",
    revenue: 24500,
    bookings: 1007,
    rating: 4.6,
    growth: "+14%",
    color: "from-amber-500 to-amber-600",
  },
  {
    id: "TD",
    name: "Thu Duc",
    revenue: 20800,
    bookings: 855,
    rating: 4.4,
    growth: "+11%",
    color: "from-emerald-500 to-emerald-600",
  },
  {
    id: "TB",
    name: "Tan Binh",
    revenue: 23200,
    bookings: 949,
    rating: 4.7,
    growth: "+15%",
    color: "from-rose-500 to-rose-600",
  },
];

type BranchId = "all" | "D1" | "D7" | "TD" | "TB";

export function AdminReports() {
  const [selectedBranch, setSelectedBranch] = useState<BranchId>("all");
  const [chartType, setChartType] = useState<"revenue" | "bookings">("revenue");

  const handleExportPDF = () => alert("Exporting report as PDF...");

  const handleExportExcel = () => {
    const rows = revenueByMonth.map(
      (r) => `${r.month},${r.D1},${r.D7},${r.TD},${r.TB}`,
    );
    const csv = `Month,District 1,District 7,Thu Duc,Tan Binh\n${rows.join("\n")}`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Revenue_Report_All_Branches_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const data = chartType === "revenue" ? revenueByMonth : bookingsByMonth;
  const yLabel = chartType === "revenue" ? "Revenue ($)" : "Bookings";

  const filteredBranches =
    selectedBranch === "all"
      ? BRANCHES.filter((b) => b.id !== "all")
      : BRANCHES.filter((b) => b.id === selectedBranch);

  const totals = branchSummary.reduce(
    (acc, b) => ({
      revenue: acc.revenue + b.revenue,
      bookings: acc.bookings + b.bookings,
    }),
    { revenue: 0, bookings: 0 },
  );

  return (
    <Layout title="Reports & Analytics" userName="Admin" role="admin">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-gray-500">
            Comprehensive business insights across all branches
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FileText className="w-4 h-4" /> Export PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" /> Export Excel
            </button>
          </div>
        </div>

        {/* Branch Selector Tabs */}
        <div className="bg-white rounded-xl p-2 border border-gray-200 shadow-sm flex gap-1 flex-wrap">
          {BRANCHES.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedBranch(b.id as BranchId)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                selectedBranch === b.id
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {b.id !== "all" && <MapPin className="w-3.5 h-3.5" />}
              {b.name}
            </button>
          ))}
        </div>

        {/* Key Metrics */}
        {selectedBranch === "all" ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 opacity-80" />
                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded">
                  All Branches
                </span>
              </div>
              <p className="text-3xl font-bold mb-1">
                ${(totals.revenue / 1000).toFixed(0)}K
              </p>
              <p className="text-sm opacity-90">Total Revenue (6 months)</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Download className="w-8 h-8 opacity-80" />
                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded">
                  +15%
                </span>
              </div>
              <p className="text-3xl font-bold mb-1">
                {totals.bookings.toLocaleString()}
              </p>
              <p className="text-sm opacity-90">Total Bookings</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 opacity-80" />
                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded">
                  Peak
                </span>
              </div>
              <p className="text-3xl font-bold mb-1">4 PM</p>
              <p className="text-sm opacity-90">Busiest Hour (All)</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <Star className="w-8 h-8 opacity-80" />
                <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded">
                  Avg
                </span>
              </div>
              <p className="text-3xl font-bold mb-1">4.6</p>
              <p className="text-sm opacity-90">Avg Customer Rating</p>
            </div>
          </div>
        ) : (
          (() => {
            const b = branchSummary.find((b) => b.id === selectedBranch)!;
            return (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div
                  className={`bg-gradient-to-br ${b.color} rounded-xl p-6 text-white shadow-lg`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <TrendingUp className="w-8 h-8 opacity-80" />
                    <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded">
                      {b.growth}
                    </span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    ${(b.revenue / 1000).toFixed(0)}K
                  </p>
                  <p className="text-sm opacity-90">Revenue (6 months)</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="w-8 h-8 opacity-80" />
                    <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded">
                      6 mo.
                    </span>
                  </div>
                  <p className="text-3xl font-bold mb-1">
                    {b.bookings.toLocaleString()}
                  </p>
                  <p className="text-sm opacity-90">Total Bookings</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="w-8 h-8 opacity-80" />
                    <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded">
                      Peak
                    </span>
                  </div>
                  <p className="text-3xl font-bold mb-1">4 PM</p>
                  <p className="text-sm opacity-90">Busiest Hour</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Star className="w-8 h-8 opacity-80" />
                    <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded">
                      Rating
                    </span>
                  </div>
                  <p className="text-3xl font-bold mb-1">{b.rating}</p>
                  <p className="text-sm opacity-90">Customer Rating</p>
                </div>
              </div>
            );
          })()
        )}

        {/* Branch Performance Cards (only in All view) */}
        {selectedBranch === "all" && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Branch Performance Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {branchSummary.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setSelectedBranch(b.id as BranchId)}
                  className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm text-left hover:border-blue-400 hover:shadow-md transition-all"
                >
                  <div
                    className={`inline-flex items-center gap-1.5 bg-gradient-to-r ${b.color} text-white text-xs font-bold px-3 py-1 rounded-full mb-3`}
                  >
                    <MapPin className="w-3 h-3" /> {b.name}
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mb-0.5">
                    ${(b.revenue / 1000).toFixed(0)}K
                  </p>
                  <p className="text-sm text-gray-500 mb-3">
                    Revenue · {b.bookings} bookings
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-yellow-600 font-semibold">
                      <Star className="w-3.5 h-3.5" fill="currentColor" />{" "}
                      {b.rating}
                    </span>
                    <span className="text-green-600 font-semibold">
                      {b.growth}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Revenue / Bookings Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {chartType === "revenue" ? "Revenue" : "Bookings"} by Month
                {selectedBranch !== "all" &&
                  ` — ${BRANCHES.find((b) => b.id === selectedBranch)?.name}`}
              </h3>
              <p className="text-sm text-gray-500">
                6-month trend
                {selectedBranch === "all" ? " across all branches" : ""}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setChartType("revenue")}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${chartType === "revenue" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  Revenue
                </button>
                <button
                  onClick={() => setChartType("bookings")}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${chartType === "bookings" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  Bookings
                </button>
              </div>
            </div>
          </div>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} id="reports-bar-chart">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="month"
                  stroke="#6b7280"
                  style={{ fontSize: "13px" }}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: "13px" }}
                  label={{
                    value: yLabel,
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: "12px" },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend />
                {filteredBranches.map((b) => (
                  <Bar
                    key={b.id}
                    dataKey={b.id}
                    name={b.name}
                    fill={b.color}
                    radius={[6, 6, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Hour Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Peak Hour Analysis
              </h3>
              <p className="text-sm text-gray-500">
                Hourly booking distribution to optimize staffing
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 border border-orange-200 rounded-lg">
              <Clock className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-semibold text-orange-600">
                Peak: 4 PM
              </span>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={peakHourData} id="reports-line-chart">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="hour"
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="#6b7280"
                  style={{ fontSize: "12px" }}
                  label={{
                    value: "Bookings",
                    angle: -90,
                    position: "insideLeft",
                    style: { fontSize: "12px" },
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Legend />
                {filteredBranches.map((b) => (
                  <Line
                    key={b.id}
                    type="monotone"
                    dataKey={b.id}
                    name={b.name}
                    stroke={b.color}
                    strokeWidth={2.5}
                    dot={{ fill: b.color, r: 4 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar / Branch Comparison (only All view) */}
        {selectedBranch === "all" && (
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                Branch Performance Radar
              </h3>
              <p className="text-sm text-gray-500">
                Multi-dimensional comparison across all branches
              </p>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={branchPerformance}>
                  <PolarGrid />
                  <PolarAngleAxis
                    dataKey="metric"
                    style={{ fontSize: "13px" }}
                  />
                  {BRANCHES.filter((b) => b.id !== "all").map((b) => (
                    <Radar
                      key={b.id}
                      name={b.name}
                      dataKey={b.id}
                      stroke={b.color}
                      fill={b.color}
                      fillOpacity={0.12}
                      strokeWidth={2}
                    />
                  ))}
                  <Legend />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Key Insights</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                <span>
                  District 1 leads in revenue, generating 34% of total across
                  all branches
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                <span>
                  All branches share peak demand at 4 PM — coordinated staffing
                  is critical
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                <span>
                  Thu Duc shows the fastest growth potential with +11% bookings
                  YTD
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></span>
                <span>
                  May was the strongest month across all 4 branches
                  simultaneously
                </span>
              </li>
            </ul>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-6">
            <h4 className="font-bold text-gray-900 mb-3">Recommendations</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></span>
                <span>
                  Redistribute staff from D1 to Thu Duc during 3–5 PM on
                  weekdays
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></span>
                <span>
                  Launch morning promotions across all branches to balance
                  hourly demand
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></span>
                <span>
                  Invest in capacity expansion at Tan Binh — highest
                  satisfaction score (4.7)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0"></span>
                <span>
                  Run cross-branch loyalty campaigns to drive customers to less
                  busy locations
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
