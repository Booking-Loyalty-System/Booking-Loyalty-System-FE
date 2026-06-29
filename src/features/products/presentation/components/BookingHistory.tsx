import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {XCircle, Calendar, Star, Clock, DollarSign, AlertTriangle} from 'lucide-react';
import { useBooking } from "@/features/products/application/useBooking.ts";
import type { MyBookingRecord } from "@/features/products/domain/models/booking/booking.model.ts";
import { useCustomerMe } from '@/features/products/application/useCustomer.ts';
import { BookingDetailModal } from '@/features/products/presentation/components/BookingDetailModal';
import {BookingSuccessCard} from "@/features/products/presentation/components/BookingSuccessCard.tsx";
import {useLocation} from "react-router-dom";
import {toast} from "sonner";
import {ReschedulePicker} from "@/features/products/presentation/components/ReschedulePicker.tsx";

export const BookingHistory: React.FC = () => {
    const { t } = useTranslation('customer');
    const location = useLocation();
    const [selectedBooking, setSelectedBooking] = useState<MyBookingRecord | null>(null);

    const [bookingToCancel, setBookingToCancel] = useState<MyBookingRecord | null>(null);
    const [cancelReason, setCancelReason] = useState<string>('Change of personal plans');
    const [customReason, setCustomReason] = useState<string>('');

    const [rescheduleData, setRescheduleData] = useState<{ date: string; slotId: string; timeLabel: string } | null>(null);

    const { myBookings, isFetchingBookings, error, cancelBooking, isCanceling } = useBooking();
    const { customerMe } = useCustomerMe();

    // Ép kiểu an toàn từ dữ liệu navigate gửi qua (nếu có)
    const newBooking = location.state?.newBooking as MyBookingRecord | undefined;

    const closeCancelModal = () => {
        setBookingToCancel(null);
        setCustomReason('');
        setRescheduleData(null);
        setCancelReason('Change of personal plans');
    };

    const sortedBookings = [...myBookings].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Pending':
                return 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50';
            case 'Confirmed':
                return 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50';
            case 'CheckedIn':
                return 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/50';
            case 'Queued':
                return 'bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-950/30 dark:text-cyan-400 dark:border-cyan-900/50';
            case 'InProgress':
                return 'bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/50';
            case 'Completed':
                return 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50';
            case 'CheckedOut':
                return 'bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-950/30 dark:text-teal-400 dark:border-teal-900/50';
            case 'Cancelled':
            case 'Rejected':
                return 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50';
            case 'NoShow':
                return 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700';
            default:
                return 'bg-slate-50 text-slate-600 border border-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-800';
        }
    };

    const handleConfirmCancel = async () => {
        if (!bookingToCancel) return;

        // 1. Validation cho option Đổi Ngày Giờ
        if (cancelReason === 'Want to change to another time slot or date') {
            if (!rescheduleData) {
                return toast.error("Please select the date and time you want to change to!");
            }
        }

        // 2. Validation cho option Lý do khác
        if (cancelReason === 'Other reason' && !customReason.trim()) {
            return toast.error("Please specify the reason in the text box!");
        }

        // 3. Chuẩn hóa Lý do cuối cùng để gửi lên API
        let finalReason = cancelReason;
        if (cancelReason === 'Other reason') {
            finalReason = customReason;
        } else if (cancelReason === 'Want to change to another time slot or date' && rescheduleData) {
            finalReason = `Requested to reschedule to ${rescheduleData.date} (Slot: ${rescheduleData.timeLabel})`;
        }

        try {
            // Thực thi gửi payload lên application layer
            await cancelBooking({
                id: bookingToCancel.id,
                reason: finalReason
            });

            toast.success(`Successfully processed booking code ${bookingToCancel.bookingCode}`);
            closeCancelModal();
        } catch (err) {
            console.error("Xử lý đơn thất bại:", err);
            toast.error("Could not complete the operation, please try again later.");
        }
    };

    if (isFetchingBookings) return <div className="p-10 text-center font-medium text-slate-500">Loading history...</div>;
    if (error) return <div className="p-10 text-center font-medium text-red-500">An error occurred!</div>;

    const completedBookings = sortedBookings.filter(b => b.status === 'Completed');
    const stats = [
        { title: 'Total Bookings', value: sortedBookings.length.toString(), icon: <Calendar className="w-6 h-6 text-blue-600" />, bg: 'bg-blue-50/50' },
        { title: 'Points Earned', value: (customerMe?.totalPoints || 0).toLocaleString('en-US'), icon: <Star className="w-6 h-6 text-emerald-600" />, bg: 'bg-emerald-50/50' },
        { title: 'Minutes Saved', value: completedBookings.reduce((sum, b) => sum + (b.durationMinutes || 0), 0).toLocaleString('en-US'), icon: <Clock className="w-6 h-6 text-purple-600" />, bg: 'bg-purple-50/50' },
        { title: 'Total Spent', value: formatCurrency(completedBookings.reduce((sum, b) => sum + b.totalPrice, 0)), icon: <DollarSign className="w-6 h-6 text-orange-600" />, bg: 'bg-orange-50/50' },
    ];

    const predefinedReasons = [
        "Change of personal plans",
        "Want to change to another time slot or date",
        "Selected wrong branch / service package",
        "Other reason"
    ];

    return (
        <div className="w-full space-y-6 font-sans antialiased text-slate-800">
            {/* Modal Chi Tiết - Chỉ hiển thị khi người dùng nhấn View Details */}
            <BookingDetailModal
                booking={selectedBooking}
                onClose={() => setSelectedBooking(null)}
            />

            {/* Khối Banner Thông Báo Thành Công + Hiệu Ứng Bắn Pháo */}
            {newBooking && (
                <BookingSuccessCard booking={newBooking} formatCurrency={formatCurrency} />
            )}

            {bookingToCancel && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
                    <div className="bg-white rounded-3xl border border-slate-100 max-w-md w-full p-6 shadow-2xl space-y-5 animate-scale-up">
                        <div className="flex items-center gap-3 text-amber-500">
                            <div className="p-2 bg-amber-50 rounded-xl">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">Confirm Cancellation</h3>
                        </div>

                        <p className="text-sm font-medium text-slate-400 leading-relaxed">
                            You are requesting to cancel booking <span className="font-mono font-bold text-blue-600">{bookingToCancel.bookingCode}</span>. This action cannot be undone. Please select a reason:
                        </p>

                        {/* Danh sách lý do dạng Radio Buttons */}
                        <div className="space-y-2.5">
                            {predefinedReasons.map((reason) => (
                                <label key={reason} className="flex items-start gap-3 p-3 border border-slate-100 rounded-xl hover:bg-slate-50/80 cursor-pointer transition-all">
                                    <input
                                        type="radio"
                                        name="cancelReason"
                                        checked={cancelReason === reason}
                                        onChange={() => setCancelReason(reason)}
                                        className="mt-0.5 w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300"
                                    />
                                    <span className="text-sm font-bold text-slate-700">{reason}</span>
                                </label>
                            ))}
                        </div>

                        {cancelReason === 'Want to change to another time slot or date' && (
                            <div className="mt-3">
                                <ReschedulePicker
                                    branchId={bookingToCancel.branchId} // Truyền branchId của đơn hiện tại vào
                                    onDateTimeSelect={(date, slotId, timeLabel) => {
                                        setRescheduleData({ date, slotId, timeLabel });
                                    }}
                                />
                            </div>
                        )}

                        {/* Textarea nhập tay nếu tích chọn 'Lý do khác' */}
                        {cancelReason === 'Other reason' && (
                            <textarea
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                placeholder="Please enter detailed reason here..."
                                rows={3}
                                className="w-full border border-slate-200 rounded-2xl p-3.5 text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                            />
                        )}

                        {/* Cụm nút hành động */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button
                                onClick={() => { setBookingToCancel(null); setCustomReason(''); }}
                                disabled={isCanceling}
                                className="border border-slate-200 hover:bg-slate-50 text-slate-600 font-extrabold py-3 px-4 rounded-xl text-sm transition-all"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleConfirmCancel}
                                disabled={isCanceling}
                                className="bg-rose-500 hover:bg-rose-600 text-white font-extrabold py-3 px-4 rounded-xl text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                {isCanceling ? 'Canceling...' : 'Confirm Cancel'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Khối Thống Kê */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                        <div className={`p-3.5 rounded-xl ${stat.bg} shrink-0`}>{stat.icon}</div>
                        <div className="space-y-0.5">
                            <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bảng Dữ Liệu */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                            <th className="py-4 px-6">{t('bookingHistory.table.id')}</th>
                            <th className="py-4 px-6">{t('bookingHistory.table.package')}</th>
                            <th className="py-4 px-6">{t('bookingHistory.table.dateTime')}</th>
                            <th className="py-4 px-6">{t('bookingHistory.table.vehicle')}</th>
                            <th className="py-4 px-6">{t('bookingHistory.table.status')}</th>
                            <th className="py-4 px-6">{t('bookingHistory.table.price')}</th>
                            <th className="py-4 px-6 text-right">{t('bookingHistory.table.actions')}</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-600">
                        {sortedBookings.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-8 text-center text-slate-400">{t('bookingHistory.empty.title')}</td>
                            </tr>
                        ) : (
                            sortedBookings.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50/40 transition-colors">
                                    <td className="py-4 px-6 font-mono font-bold text-blue-600">{item.bookingCode}</td>
                                    <td className="py-4 px-6 text-slate-900 font-bold">{item.washPackageName}</td>
                                    <td className="py-4 px-6">
                                        <div>{item.bookingDate}</div>
                                        <div className="text-xs text-slate-400 mt-0.5">{item.startTime} - {item.endTime}</div>
                                    </td>
                                    <td className="py-4 px-6 font-semibold">
                                        <div>{item.vehiclePlate}</div>
                                        <div className="text-xs text-slate-400">{item.vehicleName}</div>
                                    </td>
                                    <td className="py-4 px-6">
                                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusStyles(item.status)}`}>
                                            {t(`bookingHistory.status.${item.status.replace(' ', '')}` as any, { defaultValue: item.status })}
                                          </span>
                                    </td>
                                    <td className="py-4 px-6 font-extrabold text-slate-900">{formatCurrency(item.totalPrice)}</td>
                                    <td className="py-4 px-6 text-right space-x-3">
                                        <button
                                            onClick={() => setSelectedBooking(item)}
                                            className="text-blue-600 hover:text-blue-700 font-bold text-xs"
                                        >
                                            {t('bookingHistory.actions.viewDetails')}
                                        </button>
                                        {(item.status === 'Confirmed' || item.status === 'Pending') && (
                                            <button
                                                onClick={() => setBookingToCancel(item)}
                                                className="text-rose-500 hover:text-rose-600 font-bold text-xs inline-flex items-center gap-0.5"
                                            >
                                                <XCircle className="w-3.5 h-3.5" />
                                                <span>{t('bookingHistory.actions.cancel')}</span>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};