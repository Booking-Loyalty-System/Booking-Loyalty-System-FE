// src/features/products/presentation/pages/admin/AdminAnalytics.tsx
import { useQuery } from "@tanstack/react-query";
import { Layout } from "../../components/layout/Layout";
import { Users, TrendingUp, DollarSign } from "lucide-react";

import { AdminStatisticsRepository } from "../../../infrastructure/repositories/admin-statistics/admin-statistics.repository.implement";

const statsRepo = new AdminStatisticsRepository();

export function AdminAnalytics() {
  // Fetch dữ liệu từ API
  const { data: topCustomers } = useQuery({
    queryKey: ["top_customers"],
    queryFn: () => statsRepo.getTopCustomers(),
  });
  const { data: overview } = useQuery({
    queryKey: ["stats_overview"],
    queryFn: () => statsRepo.getOverview(),
  });

  return (
    <Layout title="Customer Analytics" userName="Admin" role="admin">
      <div className="space-y-8">
        {/* Header giữ nguyên như cũ */}

        {/* Metrics từ API */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Total Customers"
            value={overview?.totalCustomers || 0}
            icon={Users}
          />
          <MetricCard
            title="Completed Washes"
            value={overview?.completedBookings || 0}
            icon={TrendingUp}
          />
          <MetricCard
            title="Revenue"
            value={(overview?.totalRevenue || 0).toLocaleString() + "đ"}
            icon={DollarSign}
          />
        </div>

        {/* Top Customers Table sử dụng dữ liệu từ API */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-gray-200 font-bold">
            Top Performing Customers
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Tier
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Total Spent
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topCustomers?.map((c, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{c.fullName}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                      {c.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {c.totalSpent.toLocaleString()}đ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

// Component phụ để code gọn hơn
function MetricCard({ title, value, icon: Icon }: any) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <Icon className="w-5 h-5 text-blue-600 mb-2" />
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500">{title}</p>
    </div>
  );
}
