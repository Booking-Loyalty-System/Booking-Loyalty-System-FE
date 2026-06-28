import { Layout } from "../../components/layout/Layout";
import { DollarSign, Users, Calendar, TrendingUp } from "lucide-react";
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
import { useQuery } from "@tanstack/react-query";
import { AdminStatisticsRepository } from "../../../infrastructure/repositories/admin-statistics/admin-statistics.repository.implement";

const statsRepo = new AdminStatisticsRepository();

export function AdminDashboard() {
  // --- Fetch API ---
  const { data: overview } = useQuery({
    queryKey: ["stats_overview"],
    queryFn: () => statsRepo.getOverview(),
  });
  const { data: revenueData } = useQuery({
    queryKey: ["stats_revenue"],
    queryFn: () => statsRepo.getRevenue("day"),
  });
  const { data: tiers } = useQuery({
    queryKey: ["stats_tiers"],
    queryFn: () => statsRepo.getTierDistribution(),
  });

  // --- Logic hiển thị ---
  const TIER_COLORS = ["#3b82f6", "#9ca3af", "#eab308", "#a855f7"];
  const formattedTiers =
    tiers?.map((t, index) => ({
      name: t.tierName,
      value: t.customerCount,
      color: TIER_COLORS[index % TIER_COLORS.length],
    })) || [];

  return (
    <Layout title="Admin Dashboard" userName="Admin" role="admin">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: "Total Revenue",
            val: overview?.totalRevenue.toLocaleString() + "đ",
            icon: DollarSign,
            color: "green",
          },
          {
            label: "Total Bookings",
            val: overview?.totalBookings,
            icon: Calendar,
            color: "blue",
          },
          {
            label: "Active Customers",
            val: overview?.totalCustomers,
            icon: Users,
            color: "purple",
          },
          {
            label: "Avg Revenue/Booking",
            val: overview?.avgRevenuePerBooking.toFixed(0) + "đ",
            icon: TrendingUp,
            color: "orange",
          },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 border border-gray-200"
          >
            <div
              className={`w-12 h-12 mb-4 rounded-lg flex items-center justify-center bg-${item.color}-100`}
            >
              <item.icon className={`w-6 h-6 text-${item.color}-600`} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{item.val}</p>
            <p className="text-sm text-gray-600">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl font-semibold mb-6">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#2563eb" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="text-xl font-semibold mb-6">Membership Tiers</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={formattedTiers}
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
              >
                {formattedTiers.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {formattedTiers.map((t, i) => (
              <div
                key={i}
                className="flex items-center justify-between text-sm"
              >
                <span className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: t.color }}
                  />{" "}
                  {t.name}
                </span>
                <span className="font-semibold">{t.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
