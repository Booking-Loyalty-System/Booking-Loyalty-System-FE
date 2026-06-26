import React, { useEffect, useState } from "react";
import {
  Calendar,
  Search,
  Filter,
  ClipboardList,
  Car,
  Check,
  X,
  ArrowRight,
  DollarSign,
  CreditCard,
  Coins,
} from "lucide-react";
import { useStaffDashboard } from "../../../application/useStaffDashboard";
import { toast } from "sonner";
import { useAuth } from "@/features/products/application/useAuth.ts";
import * as signalR from "@microsoft/signalr";
import { useQueryClient } from "@tanstack/react-query";
import { BookingDetailModal } from "@/features/products/presentation/components/BookingDetailModal.tsx";
import { useBooking } from "@/features/products/application/useBooking.ts";

interface DashboardBooking {
  id: string;
  bookingCode: string;
  vehicleId: string;
  vehicleName: string;
  licensePlate: string;
  washPackageId: string;
  serviceName: string;
  branchId: string;
  bookingDate: string;
  startTime: string;
  status:
    | "Pending"
    | "Confirmed"
    | "CheckedIn"
    | "Queued"
    | "InProgress"
    | "Completed"
    | "CheckedOut"
    | "Cancelled"
    | "NoShow"
    | "Rejected"
    | string;
  totalAmount: number;
  pointsEarned: number | null;
  createdAt: string;
}

interface DashboardActions {
  updateStatus: (params: {
    id: string;
    payload: { targetStatus: number; reason?: string; staffId?: string };
  }) => Promise<unknown>;
}

export const TotalBookings: React.FC = () => {
  const { userId } = useAuth();
  const queryClient = useQueryClient();
  const { checkoutBooking } = useBooking({ loadMyBookings: false });

  const {
    bookings = [],
    isLoading,
    selectedDate,
    setSelectedDate,
    actions,
  } = useStaffDashboard() as unknown as {
    bookings: DashboardBooking[];
    isLoading: boolean;
    selectedDate: string;
    setSelectedDate: (date: string) => void;
    actions: DashboardActions;
  };

  const [detailModalBooking, setDetailModalBooking] =
    useState<DashboardBooking | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // STATE CHO QUẢN LÝ THANH TOÁN
  const [paymentModalBooking, setPaymentModalBooking] =
    useState<DashboardBooking | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<"Cash" | "Transfer">(
    "Cash",
  );

  const staffBranchId = bookings[0]?.branchId || "";

  useEffect(() => {
    if (!staffBranchId) return; // Nếu chưa có BranchId thì chưa kết nối để tránh lỗi

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7001/hubs/booking", {
        accessTokenFactory: () => localStorage.getItem("access_token") || "",
      })
      .withAutomaticReconnect()
      .build();

    // Khởi chạy kết nối
    connection
      .start()
      .then(async () => {
        console.log("⚡ Connected to BookingHub!");

        await connection.invoke("joinBranchGroup", staffBranchId);
        console.log(`Joined branch group: ${staffBranchId}`);
      })
      .catch((err) => console.error("SignalR Connection Error: ", err));

    connection.on("ReceiveBookingCreated", (newBooking: DashboardBooking) => {
      console.log("🔥 Dữ liệu SignalR nhận được:", newBooking);
      console.log("🔥 selectedDate hiện tại:", selectedDate);
      if (newBooking.bookingDate === selectedDate) {
        queryClient.invalidateQueries({ queryKey: ["staff-bookings"] });

        toast.success(`🎉 Có lịch đặt mới! Mã: ${newBooking.bookingCode}`, {
          description: `Xe: ${newBooking.licensePlate} - Khung giờ: ${newBooking.startTime}`,
        });
      }
      toast.success(`🎉 Có lịch đặt mới! Mã: ${newBooking.bookingCode}`);
    });

    // 🧼 CLEANUP LIFECYCLE: Khi Staff đổi chi nhánh hoặc rời trang
    return () => {
      if (connection.state === signalR.HubConnectionState.Connected) {
        // Gọi hàm Leave để giải phóng kết nối khỏi Group ở Backend trước khi ngắt hẳn
        connection
          .invoke("leaveBranchGroup", staffBranchId)
          .then(() => connection.stop())
          .catch((err) => console.error("Error during Hub cleanup:", err));
      } else {
        connection.stop();
      }
    };
  }, [selectedDate, staffBranchId, queryClient]);

  // Xử lý logic gọi chung hàm updateStatus với payload tương ứng
  const handleStatusUpdate = async (
    bookingId: string,
    type: "confirm" | "cancel" | "checkin" | "checkout" | "start",
    method?: "Cash" | "Transfer",
  ) => {
    setActionLoadingId(bookingId);
    try {
      if (type === "start") {
        await actions.updateStatus({
          id: bookingId,
          payload: { targetStatus: 2, staffId: userId! },
        });
        toast.success(
          "Đã đưa xe vào khoang rửa! Trạng thái đang là In Progress.",
        );
      } else if (type === "checkin") {
        await actions.updateStatus({
          id: bookingId,
          payload: { targetStatus: 5, staffId: userId || undefined },
        });
        toast.success("Đã check-in xe vào tiệm thành công!");
      } else if (type === "confirm") {
        await actions.updateStatus({
          id: bookingId,
          payload: { targetStatus: 1 },
        });
        toast.success("Đã xác nhận lịch đặt thành công!");
      } else if (type === "cancel") {
        await actions.updateStatus({
          id: bookingId,
          payload: {
            targetStatus: 8,
            reason: "Staff cancelled from dashboard",
          },
        });
        toast.success("Đã hủy lịch đặt thành công.");
      } else if (type === "checkout") {
        await checkoutBooking(bookingId);
        toast.success(
          `Đã thanh toán bằng ${method === "Cash" ? "Tiền mặt" : "Chuyển khoản"} & Xuất xưởng thành công! 🎉`,
        );
        setPaymentModalBooking(null);
      }
    } catch (error) {
      console.error("Update status failed:", error);
      toast.error(
        "Cập nhật trạng thái thất bại. Có thể dữ liệu đã cũ, đang tải lại...",
      );

      // Đóng modal luôn nếu API báo lỗi (tránh user bấm liên tục)
      if (type === "checkout") setPaymentModalBooking(null);
    } finally {
      setActionLoadingId(null);

      // 👉 VŨ KHÍ TỐI THƯỢNG NẰM Ở ĐÂY
      // Đặt queryKey cụ thể là "staff-bookings" và dùng await để đảm bảo UI update ngay
      await queryClient.invalidateQueries({ queryKey: ["staff-bookings"] });
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const search = searchTerm.toLowerCase();
    return (
      (b.bookingCode?.toLowerCase().includes(search) ||
        b.licensePlate?.toLowerCase().includes(search) ||
        b.vehicleName?.toLowerCase().includes(search) ||
        b.serviceName?.toLowerCase().includes(search)) &&
      (statusFilter === "All" || b.status === statusFilter)
    );
  });

  return (
    <div className="space-y-6 font-sans antialiased">
      {/* Header và Bộ chọn ngày */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Total Bookings</h1>
          <p className="text-gray-500 text-sm">
            Overview of all bookings scheduled for the selected date.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-lg text-blue-700 font-semibold text-sm">
          <Calendar className="w-4 h-4" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* Thanh công cụ: Tìm kiếm và Bộ lọc */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Code, Plate, Vehicle or Service..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="CheckedIn">Checked In</option>
            <option value="Queued">Queued</option>
            <option value="InProgress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="CheckedOut">Checked Out</option>
            <option value="Cancelled">Cancelled</option>
            <option value="NoShow">No Show</option>
          </select>
        </div>
      </div>

      {/* Bảng hiển thị danh sách */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-100 rounded-lg"></div>
            <div className="h-12 bg-gray-100 rounded-lg"></div>
            <div className="h-12 bg-gray-100 rounded-lg"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ClipboardList className="w-8 h-8 text-gray-400" />
            </div>
            <p className="font-semibold">No bookings found</p>
            <p className="text-sm">
              Try adjusting your filters or search term.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left table-auto">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Booking Code</th>
                  <th className="py-4 px-6">Vehicle Info</th>
                  <th className="py-4 px-6">Service Pack</th>
                  <th className="py-4 px-6">Time</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Amount</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBookings.map((b) => (
                  <tr
                    key={b.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setDetailModalBooking(b)}
                  >
                    <td className="py-4 px-6 font-mono font-black text-blue-600 text-base tracking-wide">
                      {b.bookingCode}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-slate-100 rounded-md text-slate-600">
                          <Car className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 font-mono text-sm uppercase tracking-tight">
                            {b.licensePlate || "N/A"}
                          </p>
                          <p className="text-xs text-gray-400 font-medium">
                            {b.vehicleName || "Unknown Car"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-sm font-semibold text-gray-700">
                      {b.serviceName || "Standard Wash"}
                    </td>

                    <td className="py-4 px-6 text-sm text-gray-700 font-medium">
                      {b.startTime || "--:--"}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          b.status === "Confirmed"
                            ? "bg-blue-100 text-blue-700"
                            : b.status === "CheckedIn"
                              ? "bg-purple-100 text-purple-700"
                              : b.status === "Queued"
                                ? "bg-indigo-100 text-indigo-700"
                                : b.status === "InProgress"
                                  ? "bg-amber-100 text-amber-700"
                                  : b.status === "Completed"
                                    ? "bg-emerald-100 text-emerald-700"
                                    : b.status === "CheckedOut"
                                      ? "bg-green-100 text-green-700"
                                      : b.status === "Cancelled"
                                        ? "bg-rose-100 text-rose-700"
                                        : b.status === "NoShow"
                                          ? "bg-orange-100 text-orange-700"
                                          : b.status === "Pending"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right font-black text-gray-900 text-sm">
                      {(b.totalAmount || 0).toLocaleString("vi-VN")}đ
                    </td>

                    <td
                      className="py-4 px-6 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {b.status === "CheckedIn" && (
                          <button
                            onClick={() => handleStatusUpdate(b.id, "start")}
                            disabled={actionLoadingId === b.id}
                            className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm transition-all disabled:opacity-50"
                          >
                            <Car className="w-3.5 h-3.5" />
                            Bắt đầu rửa
                          </button>
                        )}
                        {b.status === "Pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleStatusUpdate(b.id, "confirm")
                              }
                              disabled={actionLoadingId === b.id}
                              className="inline-flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-2.5 py-1.5 rounded-lg shadow-sm transition-all disabled:opacity-50"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Confirm
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(b.id, "cancel")}
                              disabled={actionLoadingId === b.id}
                              className="inline-flex items-center gap-1 bg-rose-50 text-rose-600 hover:bg-rose-100 font-bold text-xs px-2.5 py-1.5 rounded-lg transition-all disabled:opacity-50"
                            >
                              <X className="w-3.5 h-3.5" />
                              Cancel
                            </button>
                          </>
                        )}

                        {b.status === "Confirmed" && (
                          <button
                            onClick={() => handleStatusUpdate(b.id, "checkin")}
                            disabled={actionLoadingId === b.id}
                            className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm transition-all disabled:opacity-50"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                            Check In
                          </button>
                        )}

                        {/* HÀNH ĐỘNG KHI XE ĐÃ RỬA XONG (Completed) */}
                        {b.status === "Completed" && (
                          <button
                            onClick={() => setPaymentModalBooking(b)}
                            disabled={actionLoadingId === b.id}
                            className="inline-flex items-center gap-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg shadow-sm transition-all shadow-emerald-100"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                            Thanh Toán
                          </button>
                        )}

                        {b.status !== "Pending" &&
                          b.status !== "Confirmed" &&
                          b.status !== "Completed" && (
                            <span className="text-xs text-gray-400 italic font-medium">
                              No actions
                            </span>
                          )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {detailModalBooking && (
          <BookingDetailModal
            booking={
              {
                ...detailModalBooking,
                vehiclePlate: detailModalBooking.licensePlate,
                washPackageName: detailModalBooking.serviceName,
                endTime: "",
              } as any
            }
            onClose={() => setDetailModalBooking(null)}
          />
        )}
      </div>

      {/* MODAL CHỌN PHƯƠNG THỨC THANH TOÁN (POPUP) */}
      {paymentModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-gray-100">
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Xử Lý Thanh Toán
              </h3>
              <button
                onClick={() => setPaymentModalBooking(null)}
                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Thông tin đơn hàng tóm tắt */}
            <div className="bg-slate-50 p-4 rounded-xl space-y-2 mb-5 border border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Mã lịch đặt:</span>
                <span className="font-mono font-bold text-blue-600">
                  {paymentModalBooking.bookingCode}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Biển số xe:</span>
                <span className="font-semibold text-gray-800 uppercase font-mono">
                  {paymentModalBooking.licensePlate}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Gói dịch vụ:</span>
                <span className="font-semibold text-gray-800">
                  {paymentModalBooking.serviceName}
                </span>
              </div>
              <div className="border-t border-gray-200/60 pt-2 flex justify-between items-center mt-1">
                <span className="text-gray-900 font-bold">
                  Tổng thanh toán:
                </span>
                <span className="text-lg font-black text-rose-600">
                  {(paymentModalBooking.totalAmount || 0).toLocaleString(
                    "vi-VN",
                  )}
                  đ
                </span>
              </div>
            </div>

            {/* Chọn Phương Thức */}
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Chọn phương thức thanh toán
            </label>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* Option Tiền Mặt */}
              <button
                type="button"
                onClick={() => setSelectedMethod("Cash")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2 ${
                  selectedMethod === "Cash"
                    ? "border-blue-600 bg-blue-50/60 text-blue-700 shadow-sm"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Coins
                  className={`w-6 h-6 ${selectedMethod === "Cash" ? "text-blue-600" : "text-gray-400"}`}
                />
                <span className="text-sm font-bold">Tiền mặt</span>
              </button>

              {/* Option Chuyển Khoản */}
              <button
                type="button"
                onClick={() => setSelectedMethod("Transfer")}
                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all gap-2 ${
                  selectedMethod === "Transfer"
                    ? "border-blue-600 bg-blue-50/60 text-blue-700 shadow-sm"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <CreditCard
                  className={`w-6 h-6 ${selectedMethod === "Transfer" ? "text-blue-600" : "text-gray-400"}`}
                />
                <span className="text-sm font-bold">Chuyển khoản</span>
              </button>
            </div>

            {/* Nhóm Nút Xử Lý */}
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setPaymentModalBooking(null)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() =>
                  handleStatusUpdate(
                    paymentModalBooking.id,
                    "checkout",
                    selectedMethod,
                  )
                }
                disabled={actionLoadingId === paymentModalBooking.id}
                className="px-5 py-2 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100 transition-colors flex items-center gap-1 disabled:opacity-50"
              >
                {actionLoadingId === paymentModalBooking.id
                  ? "Đang xử lý..."
                  : "Xác Nhận & Xuất Xưởng"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
