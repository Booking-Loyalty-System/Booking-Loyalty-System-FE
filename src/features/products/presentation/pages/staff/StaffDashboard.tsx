import React, { useEffect, useState } from 'react';
import { useStaffDashboard } from "@/features/products/application/useStaffDashboard.ts";
import { useStaff } from "@/features/products/application/useStaff.ts";
import { useBooking } from "@/features/products/application/useBooking.ts";
import { usePayment } from "@/features/products/application/usePayment.ts";
import { toast } from "sonner";
import { Car, MapPin, User, X } from "lucide-react";
import { type DashboardBooking, DashboardStats } from "@/features/products/presentation/components/DashboardStats.tsx";
import { BookingTableFilters } from "@/features/products/presentation/components/BookingTableFilters.tsx";
import { BookingTableRow } from "@/features/products/presentation/components/BookingTableRow.tsx";
import { CheckoutSummaryModal } from "@/features/products/presentation/components/staff/CheckoutSummaryModal.tsx";
import type { BookingResponseData } from "@/features/products/domain/models/booking/booking.model.ts";
import { QrScannerModal } from "@/features/products/presentation/components/QrScannerModal.tsx";
import { useQueryClient } from '@tanstack/react-query';

interface DashboardActions {
    confirm: (id: string) => Promise<unknown>;
    checkIn: (params: { id: string; staffId: string }) => Promise<unknown>;
    checkout: (id: string) => Promise<unknown>;
    staffCancel: (params: { id: string; cancel: string }) => Promise<unknown>;
    noShow: (id: string) => Promise<unknown>;
}

export const StaffDashboard: React.FC = () => {
    // 🌟 2. Khởi tạo queryClient để điều khiển việc Refetch dữ liệu
    const queryClient = useQueryClient();

    const { bookings = [], isLoading: isBookingsLoading, selectedDate, setSelectedDate } = useStaffDashboard() as unknown as {
        bookings: DashboardBooking[];
        isLoading: boolean;
        selectedDate: string;
        setSelectedDate: (date: string) => void;
        actions: DashboardActions;
    };

    const { staffProfile, isLoading: isStaffLoading } = useStaff();
    const [selectedBookingDetail, setSelectedBookingDetail] = useState<DashboardBooking | null>(null);
    const [selectedBookingForCheckout, setSelectedBookingForCheckout] = useState<DashboardBooking | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);

    const {
        confirmBooking,
        checkInBooking,
        checkoutBooking,
        staffCancelBooking,
        scanQr,
        noShowBooking
    } = useBooking({ loadMyBookings: false });

    const { createPayOsUrl } = usePayment();

    const actions: DashboardActions = {
        confirm: confirmBooking,
        checkIn: checkInBooking,
        checkout: checkoutBooking,
        staffCancel: staffCancelBooking,
        noShow: noShowBooking,
    };

    const filteredBookings = bookings.filter(b => {
        const bookingCode = b.bookingCode?.toLowerCase() || '';
        const vehicleName = b.vehicleName?.toLowerCase() || '';
        const licensePlate = b.licensePlate?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();

        const matchesSearch =
            bookingCode.includes(search) ||
            vehicleName.includes(search) ||
            licensePlate.includes(search);

        const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleQrScanSuccess = async (decodedText: string) => {
        setIsQrModalOpen(false);

        const loadToastId = toast.loading('Đang xác thực mã QR...');

        try {
            const bookingData = await scanQr(decodedText);

            if (bookingData && bookingData.bookingCode) {
                setSearchTerm(bookingData.bookingCode);
                setStatusFilter('All');
                toast.success(`Đã tìm thấy lịch đặt: ${bookingData.bookingCode}`, { id: loadToastId, icon: '✨' });
            } else {
                toast.error('Không thể trích xuất mã lịch đặt từ mã QR.', { id: loadToastId });
            }
        } catch (error) {
            console.error(error);
            toast.error('Mã QR không hợp lệ hoặc không có trong hệ thống!', { id: loadToastId });
        }
    };

    const handleAction = async (id: string, action: 'confirm' | 'checkIn' | 'checkout' | 'staffCancel' | 'noShow') => {
        try {
            switch (action) {
                case 'confirm':
                    await actions.confirm(id);
                    break;
                case 'checkIn':
                    if (!staffProfile?.id) {
                        toast.error("Không tìm thấy thông tin nhân viên, vui lòng tải lại trang!");
                        return;
                    }
                    await actions.checkIn({ id, staffId: staffProfile.id });
                    break;
                case 'checkout': {
                    const booking = bookings.find(b => b.id === id);
                    if (booking) setSelectedBookingForCheckout(booking);
                    return;
                }
                case 'staffCancel': {
                    const reason = window.prompt("Vui lòng nhập lý do hủy lịch:");
                    if (!reason) return;
                    await actions.staffCancel({ id, cancel: reason });
                    break;
                }
                case 'noShow':
                    if (window.confirm("Bạn có chắc chắn muốn đánh dấu khách này là Không Đến (No-Show)?")) {
                        await actions.noShow(id);
                    } else {
                        return;
                    }
                    break;
            }

            // 🌟 3. THẦN CHÚ TỰ ĐỘNG CẬP NHẬT: Ép React Query gọi lại API lấy danh sách mới ngay lập tức
            toast.success(`Thao tác thành công!`);
            queryClient.invalidateQueries({ queryKey: ['staff-bookings'] });

        } catch (error) {
            console.error(error);
            toast.error(`Thao tác thất bại`);
        }
    };

    const handleConfirmCash = async () => {
        if (!selectedBookingForCheckout) return;
        try {
            await actions.checkout(selectedBookingForCheckout.id);
            toast.success('Thanh toán tiền mặt thành công!');
            setSelectedBookingForCheckout(null);
            queryClient.invalidateQueries({ queryKey: ['staff-bookings'] }); // Làm mới danh sách
        } catch (error) {
            console.error(error);
            toast.error('Xử lý thu tiền mặt thất bại');
        }
    };

    const handleConfirmPayOS = async (): Promise<string> => {
        if (!selectedBookingForCheckout) return '';
        const toastId = toast.loading('Đang khởi tạo cổng thanh toán PayOS...');
        try {
            const response = await createPayOsUrl(selectedBookingForCheckout.id);
            toast.dismiss(toastId); // Tắt hiệu ứng loading

            if (!response) {
                throw new Error("Không nhận được phản hồi từ máy chủ");
            }
            // 🛠️ FIX TẠI ĐÂY: Kiểm tra nếu phản hồi là Object thì bóc lấy thuộc tính checkoutUrl
            if (typeof response === 'object' && 'checkoutUrl' in response) {
                return (response as any).checkoutUrl;
            }

            // Trường hợp tầng Repository của bạn đã bóc sẵn ra chuỗi string trước đó rồi
            return response as unknown as string;
        } catch (error) {
            console.error(error);
            toast.error('Không thể kết nối đến cổng thanh toán PayOS', { id: toastId });
            throw error;
        }
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const paymentStatus = urlParams.get('paymentStatus');

        if (paymentStatus) {
            queryClient.invalidateQueries({ queryKey: ['staff-bookings'] });

            const isSuccess = paymentStatus === 'success';
            const audioFile = isSuccess ? '/sound/payment.mp3' : '/sound/payment.mp3';
            const message = isSuccess ? 'Thanh toán thành công!' : 'Hủy thanh toán!';
            const desc = isSuccess
                ? 'Giao dịch đã được xác nhận.'
                : 'Giao dịch link thanh toán đã bị hủy bỏ hoặc hết hạn.';
            if (isSuccess) {
                toast.success(message, { description: desc, duration: 5000 });
            } else {
                toast.error(message, { description: desc, duration: 10000 });
            }

            // 🎯 THỦ THUẬT: Đợi 500ms để trang ổn định, rồi mới phát âm thanh
            setTimeout(() => {
                const audio = new Audio(audioFile);
                audio.play().catch(() => {
                    const playOnFirstClick = () => {
                        audio.play().catch(e => console.error(e));
                        window.removeEventListener('click', playOnFirstClick);
                    };
                    window.addEventListener('click', playOnFirstClick);
                });
            }, 500);

            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [queryClient]);

    if (isStaffLoading) return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <div className="h-10 w-64 bg-slate-200 rounded-lg animate-pulse"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-36 bg-slate-100 rounded-2xl animate-pulse"></div>
                ))}
            </div>
            <div className="h-96 bg-slate-100 rounded-2xl animate-pulse"></div>
        </div>
    );

    return (
        <div className="space-y-8 font-sans antialiased text-slate-800 pb-12">
            {/* --- HEADER --- */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Staff Dashboard</h1>
                    {staffProfile && (
                        <div className="mt-4 inline-flex items-center gap-4 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                            <div className="flex items-center gap-2">
                                <div className="bg-blue-100 p-1.5 rounded-full text-blue-600">
                                    <User className="w-4 h-4" />
                                </div>
                                <span className="text-sm text-slate-600">Xin chào, <span className="font-bold text-slate-900">{staffProfile.fullName}</span></span>
                            </div>
                            <div className="w-px h-4 bg-slate-300"></div>
                            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                                <MapPin className="w-4 h-4 text-rose-500" />
                                {staffProfile.branch?.branchName || "Chi nhánh"}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* --- THỐNG KÊ (DASHBOARD STATS) --- */}
            <DashboardStats bookings={bookings} localDate={selectedDate} setLocalDate={setSelectedDate} />

            {/* --- DANH SÁCH LỊCH ĐẶT --- */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                <BookingTableFilters
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    onOpenQr={() => setIsQrModalOpen(true)}
                />

                {isBookingsLoading ? (
                    <div className="p-20 flex flex-col items-center justify-center bg-white">
                        <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-sm font-semibold text-slate-500 animate-pulse">Đang đồng bộ dữ liệu lịch đặt...</p>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="p-16 flex flex-col items-center justify-center text-slate-500 bg-white">
                        <p className="text-lg font-semibold text-slate-700">Không có lịch đặt nào</p>
                        <p className="text-sm mt-1">Thử thay đổi bộ lọc hoặc ngày xem sao nhé.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-white border-b border-slate-200">
                                <tr>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Mã Code</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Khách & Xe</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Dịch vụ</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Trạng thái</th>
                                    <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {filteredBookings.map(b => (
                                    <BookingTableRow key={b.id} booking={b} handleAction={handleAction} onViewDetail={() => setSelectedBookingDetail(b)} />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Các Modal chức năng liên quan */}
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

            {/* Modal chi tiết lịch đặt */}
            {selectedBookingDetail && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden flex flex-col">
                        <div className="p-5 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                                    <Car className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="font-extrabold text-lg text-slate-900">Chi Tiết Lịch Đặt</h2>
                                    <p className="text-xs text-slate-500 font-medium">
                                        Mã: <span className="font-bold text-blue-600">{selectedBookingDetail.bookingCode}</span>
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedBookingDetail(null)} className="p-2 hover:bg-slate-200/70 text-slate-400 hover:text-slate-700 rounded-xl transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <div className="flex items-center justify-between p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
                                <div>
                                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Biển số xe</p>
                                    <p className="text-2xl font-black text-slate-900">{selectedBookingDetail.licensePlate}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Dòng xe</p>
                                    <p className="text-lg font-bold text-slate-700">{selectedBookingDetail.vehicleName}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-slate-100 border-dashed">
                                    <span className="text-sm font-medium text-slate-500">Dịch vụ:</span>
                                    <span className="text-sm font-bold text-slate-900 text-right max-w-[60%]">{selectedBookingDetail.serviceName}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-100 border-dashed">
                                    <span className="text-sm font-medium text-slate-500">Khung giờ:</span>
                                    <span className="text-sm font-bold text-slate-900">{selectedBookingDetail.startTime} - {selectedBookingDetail.bookingDate}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-100 border-dashed">
                                    <span className="text-sm font-medium text-slate-500">Trạng thái:</span>
                                    <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded uppercase tracking-wider">{selectedBookingDetail.status}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-3">
                            <button onClick={() => setSelectedBookingDetail(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-100 transition-colors">
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};