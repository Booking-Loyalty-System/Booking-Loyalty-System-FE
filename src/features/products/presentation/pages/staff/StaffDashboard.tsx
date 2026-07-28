import React, { useEffect, useState } from "react";
import { useStaffDashboard } from "@/features/products/application/useStaffDashboard.ts";
import { useStaff } from "@/features/products/application/useStaff.ts";
import { useBooking } from "@/features/products/application/useBooking.ts";
import { usePayment } from "@/features/products/application/usePayment.ts";
import { toast } from "sonner";
import {
  Car,
  MapPin,
  User,
  X,
  Loader2,
  Camera,
  CheckCircle,
} from "lucide-react";
import {
  type DashboardBooking,
  DashboardStats,
} from "@/features/products/presentation/components/DashboardStats.tsx";
import { BookingTableFilters } from "@/features/products/presentation/components/customer/BookingTableFilters";
import { BookingTableRow } from "@/features/products/presentation/components/customer/BookingTableRow";
import { CheckoutSummaryModal } from "@/features/products/presentation/components/staff/CheckoutSummaryModal.tsx";
import type { BookingResponseData } from "@/features/products/domain/models/booking/booking.model.ts";
import { QrScannerModal } from "@/features/products/presentation/components/staff/QrScannerModal";
import { useQueryClient } from "@tanstack/react-query";
import { ActionImageModal } from "@/features/products/presentation/components/staff/ActionImageModal.tsx";
import { apiClient } from "@/core/api/apiClient";
import { ENDPOINTS } from "@/core/api/endpoints";

interface DashboardActions {
  confirm: (id: string) => Promise<unknown>;
  checkIn: (params: { id: string; staffId: string }) => Promise<unknown>;
  checkout: (id: string) => Promise<unknown>;
  staffCancel: (params: { id: string; cancel: string }) => Promise<unknown>;
  noShow: (id: string) => Promise<unknown>;
}

export const StaffDashboard: React.FC = () => {
  const queryClient = useQueryClient();

  const {
    bookings = [],
    isLoading: isBookingsLoading,
    selectedDate,
    setSelectedDate,
  } = useStaffDashboard() as unknown as {
    bookings: DashboardBooking[];
    isLoading: boolean;
    selectedDate: string;
    setSelectedDate: (date: string) => void;
    actions: DashboardActions;
  };

  const { staffProfile, isLoading: isStaffLoading } = useStaff();
  const [selectedBookingDetail, setSelectedBookingDetail] =
    useState<DashboardBooking | null>(null);

  const [selectedBookingForImages, setSelectedBookingForImages] =
    useState<DashboardBooking | null>(null);
  const [vehicleImages, setVehicleImages] = useState<{
    before: string[];
    after: string[];
  }>({ before: [], after: [] });
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [selectedBookingForCheckout, setSelectedBookingForCheckout] =
    useState<DashboardBooking | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    bookingId: string;
    type: "checkIn" | "finish";
  } | null>(null);

  const {
    confirmBooking,
    checkInBooking,
    checkoutBooking,
    staffCancelBooking,
    scanQr,
    noShowBooking,
  } = useBooking({ loadMyBookings: false });
  const { createPayOsUrl } = usePayment();

  const actions: DashboardActions = {
    confirm: confirmBooking,
    checkIn: checkInBooking,
    checkout: checkoutBooking,
    staffCancel: staffCancelBooking,
    noShow: noShowBooking,
  };

  const filteredBookings = bookings.filter((b) => {
    const bookingCode = b.bookingCode?.toLowerCase() || "";
    const vehicleName = b.vehicleName?.toLowerCase() || "";
    const licensePlate = b.licensePlate?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      bookingCode.includes(search) ||
      vehicleName.includes(search) ||
      licensePlate.includes(search);
    const matchesStatus = statusFilter === "All" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleQrScanSuccess = async (decodedText: string) => {
    setIsQrModalOpen(false);
    const loadToastId = toast.loading("Đang xác thực mã QR...");
    try {
      const bookingData = await scanQr(decodedText);
      if (bookingData && bookingData.bookingCode) {
        setSearchTerm(bookingData.bookingCode);
        setStatusFilter("All");
        toast.success(`Đã tìm thấy lịch đặt: ${bookingData.bookingCode}`, {
          id: loadToastId,
          icon: "✨",
        });
      } else {
        toast.error("Không thể trích xuất mã lịch đặt từ mã QR.", {
          id: loadToastId,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Mã QR không hợp lệ hoặc không có trong hệ thống!", {
        id: loadToastId,
      });
    }
  };

  useEffect(() => {
    if (!selectedBookingForImages) {
      setVehicleImages({ before: [], after: [] });
      return;
    }

    const fetchImages = async () => {
      setIsLoadingImages(true);
      try {
        const raw: any = await apiClient.get(
          ENDPOINTS.BOOKING.IMAGES(selectedBookingForImages.id),
        );

        const list: any[] = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.data)
            ? raw.data
            : Array.isArray(raw?.items)
              ? raw.items
              : [];

        const before = list
          .filter(
            (img: any) =>
              img.imageType === "BeforeWash" || img.type === "BeforeWash",
          )
          .map((img: any) => img.imageUrl || img.url || img.imagePath);

        const after = list
          .filter(
            (img: any) =>
              img.imageType === "AfterWash" || img.type === "AfterWash",
          )
          .map((img: any) => img.imageUrl || img.url || img.imagePath);

        setVehicleImages({ before, after });
      } catch (error) {
        console.error("Lỗi khi tải ảnh:", error);
        toast.error("Không thể tải hình ảnh của xe này.");
      } finally {
        setIsLoadingImages(false);
      }
    };

    fetchImages();
  }, [selectedBookingForImages]);

  // HÀM ĐƯỢC GỌI KHI BẤM NÚT "XONG" TRONG MODAL ẢNH
  const executePendingAction = async () => {
    if (!actionModal) return;

    if (actionModal.type === "checkIn") {
      try {
        if (!staffProfile?.id) return;

        // GỌI API CHUYỂN TRẠNG THÁI Ở ĐÂY SAU KHI ĐÃ UPLOAD ẢNH XONG
        await actions.checkIn({
          id: actionModal.bookingId,
          staffId: staffProfile.id,
        });
        queryClient.invalidateQueries({ queryKey: ["staff-bookings"] });
        toast.success("Đã xác nhận ảnh và Check-in thành công!");
      } catch (error) {
        console.error(error);
        toast.error("Cập nhật trạng thái Check-in thất bại.");
      }
    }

    // Đóng modal
    setActionModal(null);
  };

  const handleAction = async (
    id: string,
    action: "confirm" | "checkIn" | "checkout" | "staffCancel" | "noShow",
  ) => {
    try {
      switch (action) {
        case "confirm":
          await actions.confirm(id);
          toast.success(`Thao tác thành công!`);
          queryClient.invalidateQueries({ queryKey: ["staff-bookings"] });
          break;

        case "checkIn": {
          if (!staffProfile?.id) {
            toast.error(
              "Không tìm thấy thông tin nhân viên, vui lòng tải lại trang!",
            );
            return;
          }
          // CHỈ MỞ MODAL YÊU CẦU ẢNH TRƯỚC - KHÔNG GỌI API CHECK-IN Ở ĐÂY
          setActionModal({ isOpen: true, bookingId: id, type: "checkIn" });
          return;
        }

        case "checkout": {
          const booking = bookings.find((b) => b.id === id);
          if (booking) setSelectedBookingForCheckout(booking);
          return;
        }
        case "staffCancel": {
          const reason = window.prompt("Vui lòng nhập lý do hủy lịch:");
          if (!reason) return;
          await actions.staffCancel({ id, cancel: reason });
          toast.success(`Thao tác thành công!`);
          queryClient.invalidateQueries({ queryKey: ["staff-bookings"] });
          break;
        }
        case "noShow":
          if (
            window.confirm(
              "Bạn có chắc chắn muốn đánh dấu khách này là Không Đến (No-Show)?",
            )
          ) {
            await actions.noShow(id);
            toast.success(`Thao tác thành công!`);
            queryClient.invalidateQueries({ queryKey: ["staff-bookings"] });
          } else {
            return;
          }
          break;
      }
    } catch (error) {
      console.error(error);
      toast.error(`Thao tác thất bại`);
    }
  };

  const handleConfirmCash = async () => {
    if (!selectedBookingForCheckout) return;
    const bookingId = selectedBookingForCheckout.id;
    try {
      await actions.checkout(bookingId);
      toast.success(
        "Thanh toán tiền mặt thành công! Vui lòng tải ảnh bàn giao xe.",
      );
      setSelectedBookingForCheckout(null);
      queryClient.invalidateQueries({ queryKey: ["staff-bookings"] });
    } catch (error) {
      console.error(error);
      toast.error("Xử lý thu tiền mặt thất bại");
    }
  };

  const handleConfirmPayOS = async (): Promise<string> => {
    if (!selectedBookingForCheckout) return "";
    const toastId = toast.loading("Đang khởi tạo cổng thanh toán PayOS...");
    try {
      const response = await createPayOsUrl(selectedBookingForCheckout.id);
      toast.dismiss(toastId);
      if (!response) throw new Error("Không nhận được phản hồi từ máy chủ");
      if (typeof response === "object" && "checkoutUrl" in response)
        return (response as any).checkoutUrl;
      return response as unknown as string;
    } catch (error) {
      console.error(error);
      toast.error("Không thể kết nối đến cổng thanh toán PayOS", {
        id: toastId,
      });
      throw error;
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get("paymentStatus");

    if (paymentStatus) {
      queryClient.invalidateQueries({ queryKey: ["staff-bookings"] });
      const isSuccess = paymentStatus === "success";
      const audioFile = isSuccess ? "/sound/payment.mp3" : "/sound/payment.mp3";
      const message = isSuccess ? "Thanh toán thành công!" : "Hủy thanh toán!";
      const desc = isSuccess
        ? "Giao dịch đã được xác nhận."
        : "Giao dịch link thanh toán đã bị hủy bỏ hoặc hết hạn.";
      if (isSuccess)
        toast.success(message, { description: desc, duration: 5000 });
      else toast.error(message, { description: desc, duration: 10000 });

      setTimeout(() => {
        const audio = new Audio(audioFile);
        audio.play().catch(() => {
          const playOnFirstClick = () => {
            audio.play().catch((e) => console.error(e));
            window.removeEventListener("click", playOnFirstClick);
          };
          window.addEventListener("click", playOnFirstClick);
        });
      }, 500);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [queryClient]);

  if (isStaffLoading)
    return (
      <div className="space-y-10 w-full animate-pulse">
        <div className="h-12 w-64 bg-slate-200 dark:bg-white/5 rounded-2xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-40 bg-slate-200 dark:bg-white/5 rounded-[2rem]"
            ></div>
          ))}
        </div>
        <div className="h-[500px] bg-slate-200 dark:bg-white/5 rounded-[2.5rem]"></div>
      </div>
    );

  return (
    <div className="space-y-10 text-slate-800 dark:text-slate-100 animate-fade-in w-full">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:text-white tracking-tight">
            Staff Dashboard
          </h1>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Quản lý trạm rửa xe và theo dõi tiến độ công việc hôm nay.
          </p>
        </div>

        {staffProfile && (
          <div className="inline-flex items-center gap-4 bg-white/80 dark:bg-[#111]/80 backdrop-blur-xl px-5 py-3 rounded-2xl border border-slate-200/50 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl text-white shadow-md shadow-blue-500/20">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Xin chào,{" "}
                <span className="font-extrabold text-blue-950 dark:text-white">
                  {staffProfile.fullName}
                </span>
              </span>
            </div>
            <div className="w-px h-5 bg-slate-200 dark:bg-white/10"></div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300">
              <MapPin className="w-4 h-4 text-rose-500" />
              {staffProfile.branch?.branchName || "Chi nhánh"}
            </div>
          </div>
        )}
      </div>

      {/* STATS */}
      <DashboardStats
        bookings={bookings}
        localDate={selectedDate}
        setLocalDate={setSelectedDate}
      />

      {/* DANH SÁCH LỊCH ĐẶT */}
      <div className="bg-white/80 dark:bg-[#111]/80 backdrop-blur-2xl rounded-[2.5rem] border border-slate-200/60 dark:border-white/5 shadow-xl shadow-slate-200/20 dark:shadow-black/20 overflow-hidden flex flex-col transition-all duration-300">
        <div className="p-2 border-b border-slate-100 dark:border-white/5">
          <BookingTableFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            onOpenQr={() => setIsQrModalOpen(true)}
          />
        </div>

        {isBookingsLoading ? (
          <div className="p-32 flex flex-col items-center justify-center bg-transparent">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 animate-pulse">
              Đang đồng bộ dữ liệu...
            </p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="p-32 flex flex-col items-center justify-center text-slate-500 bg-transparent text-center space-y-3">
            <div className="w-20 h-20 bg-slate-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-2">
              <Car className="w-10 h-10 text-slate-300 dark:text-slate-600" />
            </div>
            <p className="text-xl font-extrabold text-slate-700 dark:text-slate-300">
              Không tìm thấy lịch đặt nào
            </p>
            <p className="text-sm font-medium dark:text-slate-500">
              Thử thay đổi bộ lọc hoặc chọn ngày khác xem sao nhé.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-white/5 border-b border-slate-200 dark:border-white/5">
                <tr>
                  <th className="py-5 px-6 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    Mã Code
                  </th>
                  <th className="py-5 px-6 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    Khách & Xe
                  </th>
                  <th className="py-5 px-6 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    Dịch vụ
                  </th>
                  <th className="py-5 px-6 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    Trạng thái
                  </th>
                  <th className="py-5 px-6 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 bg-transparent">
                {filteredBookings.map((b) => (
                  <BookingTableRow
                    key={b.id}
                    booking={b}
                    handleAction={handleAction}
                    onViewDetail={() => setSelectedBookingDetail(b)}
                    onViewImages={() => setSelectedBookingForImages(b)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODALS */}
      {selectedBookingForCheckout && (
        <CheckoutSummaryModal
          booking={selectedBookingForCheckout as BookingResponseData}
          onClose={() => setSelectedBookingForCheckout(null)}
          onConfirmCash={handleConfirmCash}
          onConfirmPayOS={handleConfirmPayOS}
        />
      )}

      {isQrModalOpen && (
        <QrScannerModal
          onClose={() => setIsQrModalOpen(false)}
          onScanSuccess={handleQrScanSuccess}
        />
      )}

      {actionModal && actionModal.isOpen && (
        <ActionImageModal
          bookingId={actionModal.bookingId}
          actionType={actionModal.type}
          onClose={() => setActionModal(null)}
          onConfirm={executePendingAction}
        />
      )}

      {/* Modal chi tiết lịch đặt */}
      {selectedBookingDetail && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#111] rounded-[2rem] shadow-2xl border border-slate-200 dark:border-white/10 w-full max-w-md overflow-hidden flex flex-col transform scale-100 animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-extrabold text-xl text-blue-950 dark:text-white tracking-tight">
                    Chi Tiết Lịch Đặt
                  </h2>
                  <p className="text-xs text-slate-500 font-bold mt-0.5">
                    Mã:{" "}
                    <span className="text-blue-600 dark:text-blue-400">
                      {selectedBookingDetail.bookingCode}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBookingDetail(null)}
                className="p-2.5 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-xl transition-all shadow-sm border border-slate-200/50 dark:border-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20">
                <div>
                  <p className="text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-1">
                    Biển số xe
                  </p>
                  <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:text-white">
                    {selectedBookingDetail.licensePlate}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest mb-1">
                    Dòng xe
                  </p>
                  <p className="text-lg font-bold text-slate-700 dark:text-slate-300">
                    {selectedBookingDetail.vehicleName}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: "Dịch vụ:",
                    value: selectedBookingDetail.serviceName,
                    primary: true,
                  },
                  {
                    label: "Khung giờ:",
                    value: `${selectedBookingDetail.startTime} - ${selectedBookingDetail.bookingDate}`,
                  },
                  {
                    label: "Trạng thái:",
                    value: selectedBookingDetail.status,
                    isStatus: true,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-white/5 border-dashed"
                  >
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                      {item.label}
                    </span>
                    {item.isStatus ? (
                      <span className="text-[10px] font-black px-3 py-1.5 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 rounded-lg uppercase tracking-widest shadow-sm">
                        {item.value}
                      </span>
                    ) : (
                      <span
                        className={`text-sm font-bold text-right max-w-[60%] ${item.primary ? "text-blue-950 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}
                      >
                        {item.value}
                      </span>
                    )}
                  </div>
                ))}

                {selectedBookingDetail.status === "Cancelled" &&
                  (selectedBookingDetail.cancelReason ||
                    selectedBookingDetail.cancellationReason) && (
                    <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-xl">
                      <div className="text-[10px] font-black text-rose-400 dark:text-rose-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <X size={12} className="text-rose-500" /> Lý do hủy
                      </div>
                      <div className="text-sm font-bold text-rose-700 dark:text-rose-400 italic leading-snug">
                        "
                        {selectedBookingDetail.cancelReason ||
                          selectedBookingDetail.cancellationReason}
                        "
                      </div>
                    </div>
                  )}
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex gap-3">
              <button
                onClick={() => setSelectedBookingDetail(null)}
                className="flex-1 py-3.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111] text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-white/5 transition-all shadow-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL MỚI: XEM ẢNH THEO XE KÈM GỌI API */}
      {selectedBookingForImages && (
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center z-[110] p-4 animate-in fade-in duration-300">
          <div className="bg-white dark:bg-[#111] rounded-[2rem] shadow-2xl border border-slate-200 dark:border-white/10 w-full max-w-lg overflow-hidden flex flex-col transform scale-100 animate-in zoom-in-95 duration-300">
            <div className="p-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-blue-950 dark:text-white tracking-tight">
                    Hình ảnh xe: {selectedBookingForImages.vehicleName}
                  </h3>
                  <p className="text-xs text-slate-500 font-bold">
                    Biển số:{" "}
                    <span className="text-blue-600 dark:text-blue-400">
                      {selectedBookingForImages.licensePlate}
                    </span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBookingForImages(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
              {isLoadingImages ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-3">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Đang tải hình ảnh từ máy chủ...
                  </p>
                </div>
              ) : (
                <>
                  {/* Ảnh Trước Khi Rửa (Check-in) */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 rounded-lg w-fit">
                      <Camera className="w-4 h-4" />
                      Ảnh Trước Khi Rửa (Check-in)
                    </div>

                    {vehicleImages.before.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {vehicleImages.before.map(
                          (url: string, index: number) => (
                            <div
                              key={`before-${index}`}
                              className="relative group overflow-hidden rounded-xl border border-slate-200 dark:border-white/5 aspect-square bg-slate-100 dark:bg-white/5"
                            >
                              <img
                                src={url}
                                alt="Trước khi rửa"
                                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                                onClick={() => setPreviewImage(url)}
                              />
                            </div>
                          ),
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium italic pl-1">
                        Chưa có ảnh check-in cho xe này.
                      </p>
                    )}
                  </div>

                  {/* Ảnh Sau Khi Rửa (Bàn giao) */}
                  <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-white/5">
                    <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg w-fit">
                      <CheckCircle className="w-4 h-4" />
                      Ảnh Sau Khi Rửa (Hoàn thành)
                    </div>

                    {vehicleImages.after.length > 0 ? (
                      <div className="grid grid-cols-3 gap-2">
                        {vehicleImages.after.map(
                          (url: string, index: number) => (
                            <div
                              key={`after-${index}`}
                              className="relative group overflow-hidden rounded-xl border border-slate-200 dark:border-white/5 aspect-square bg-slate-100 dark:bg-white/5"
                            >
                              <img
                                src={url}
                                alt="Sau khi rửa"
                                className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                                onClick={() => setPreviewImage(url)}
                              />
                            </div>
                          ),
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium italic pl-1">
                        Chưa có ảnh bàn giao cho xe này.
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="p-4 bg-slate-50/50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 flex justify-end">
              <button
                onClick={() => setSelectedBookingForImages(null)}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-sm transition-all"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL LIGHTBOX: PHÓNG TO ẢNH TRÀN MÀN HÌNH */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/90 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <button className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
            <X className="w-8 h-8" />
          </button>
          <img
            src={previewImage}
            alt="Preview Phóng to"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
