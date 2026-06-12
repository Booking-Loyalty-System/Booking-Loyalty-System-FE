import React, { useState } from "react";
import {
  Calendar,
  Star,
  Clock,
  DollarSign,
  Search,
  Filter,
  Download,
  ArrowRight,
  ArrowLeft,
  XCircle,
  QrCode,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { useBooking } from "@/features/products/application/useBooking";
import { useLoyalty } from "@/features/products/application/useLoyalty";
import { format } from "date-fns";
import { toast } from "sonner";

export const BookingHistory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { useGetMyBookings, useCancelBooking } = useBooking();
  const { useGetLoyaltyInfo } = useLoyalty();

  const { data: bookings = [], isLoading, isError } = useGetMyBookings();
  const { data: loyaltyInfo } = useGetLoyaltyInfo();
  const cancelMutation = useCancelBooking();

  // Tính toán thống kê từ dữ liệu thật
  const stats = [
    {
      title: "Total Bookings",
      value: bookings.length.toString(),
      icon: <Calendar className="w-6 h-6 text-blue-600" />,
      bg: "bg-blue-50/50",
    },
    {
      title: "Available Points",
      value: loyaltyInfo?.totalPoints.toString() || "0",
      icon: <Star className="w-6 h-6 text-emerald-600" />,
      bg: "bg-emerald-50/50",
    },
    {
      title: "Current Tier",
      value: loyaltyInfo?.currentTier || "Member",
      icon: <Clock className="w-6 h-6 text-purple-600" />,
      bg: "bg-purple-50/50",
    },
    {
      title: "Total Spent",
      value: `$${bookings.reduce((sum, b) => sum + b.totalAmount, 0).toFixed(2)}`,
      icon: <DollarSign className="w-6 h-6 text-orange-600" />,
      bg: "bg-orange-50/50",
    },
  ];

  const handleCancel = async (id: string) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await cancelMutation.mutateAsync(id);
        toast.success("Booking cancelled successfully");
      } catch {
        toast.error("Failed to cancel booking");
      }
    }
  };

  const filteredBookings = bookings.filter(
    (b) =>
      b.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.status.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-500 font-medium">
          Loading your booking history...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
        <h3 className="text-lg font-bold text-red-900">
          Oops! Something went wrong
        </h3>
        <p className="text-red-600">
          We couldn't load your booking history. Please try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 font-sans antialiased text-slate-800">
      {/* Thẻ Thống Kê */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className={`p-3.5 rounded-xl ${stat.bg} shrink-0`}>
              {stat.icon}
            </div>
            <div className="space-y-0.5">
              <p className="text-2xl font-black text-slate-900 tracking-tight">
                {stat.value}
              </p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {stat.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bộ Lọc & Tìm Kiếm */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by booking code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 border border-slate-200 text-slate-600 bg-white text-sm font-bold px-4 py-2.5 rounded-xl hover:bg-slate-50 transition">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Bảng Dữ Liệu */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="py-20 text-center">
            <Calendar className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">
              No bookings found
            </h3>
            <p className="text-slate-500 text-sm">
              You haven't made any bookings that match your criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  <th className="py-5 px-6">Code</th>
                  <th className="py-5 px-6">Date & Time</th>
                  <th className="py-5 px-6">Status</th>
                  <th className="py-5 px-6">Total</th>
                  <th className="py-5 px-6">Points</th>
                  <th className="py-5 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-600">
                {filteredBookings.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="py-5 px-6">
                      <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                        {item.bookingCode}
                      </span>
                    </td>
                    <td className="py-5 px-6">
                      <div className="font-bold text-slate-900">
                        {format(new Date(item.bookingDate), "MMM dd, yyyy")}
                      </div>
                      <div className="text-xs text-slate-400 font-semibold mt-0.5">
                        {item.startTime}
                      </div>
                    </td>
                    <td className="py-5 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          item.status === "Completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : item.status === "Cancelled"
                              ? "bg-rose-100 text-rose-700"
                              : item.status === "Confirmed"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-5 px-6 font-black text-slate-900">
                      ${item.totalAmount.toFixed(2)}
                    </td>
                    <td className="py-5 px-6">
                      {item.pointsEarned ? (
                        <span className="text-emerald-600 font-bold">
                          +{item.pointsEarned}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="py-5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          title="View QR Code"
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <QrCode className="w-5 h-5" />
                        </button>
                        {item.status === "Confirmed" ||
                        item.status === "Pending" ? (
                          <button
                            onClick={() => handleCancel(item.id)}
                            title="Cancel Booking"
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        ) : null}
                        <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Phân Trang (Placeholder) */}
        <div className="p-5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
          <span>Page 1 of 1</span>
          <div className="flex gap-2">
            <button
              disabled
              className="p-2 border border-slate-100 rounded-lg opacity-50 cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              disabled
              className="p-2 border border-slate-100 rounded-lg opacity-50 cursor-not-allowed"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
