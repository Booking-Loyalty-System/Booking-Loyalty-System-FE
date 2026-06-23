import React, { useState } from 'react';
import { X, Sparkles, Receipt, Car, PenTool } from 'lucide-react';
import { type BookingResponseData } from '../../../domain/models/booking/booking.model';

interface CheckoutSummaryModalProps {
    booking: BookingResponseData;
    onClose: () => void;
    onConfirm: () => Promise<void>;
}

export const CheckoutSummaryModal: React.FC<CheckoutSummaryModalProps> = ({ booking, onClose, onConfirm }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleConfirm = async () => {
        setIsSubmitting(true);
        try {
            await onConfirm();
        } finally {
            setIsSubmitting(false);
        }
    };

    // Hàm format tiền tệ VNĐ
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-extrabold text-slate-900">Xác Nhận Thanh Toán</h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                        disabled={isSubmitting}
                    >
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                <div className="space-y-5 mb-6">

                    {/* Mã Code */}
                    <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex justify-between items-center">
                        <p className="text-sm font-semibold text-blue-600">Mã lịch đặt</p>
                        <code className="text-xl font-black text-blue-700">{booking.bookingCode || "N/A"}</code>
                    </div>

                    {/* Thông tin Xe & Dịch vụ */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-1.5 text-slate-500 mb-2">
                                <Car className="w-4 h-4" />
                                <p className="text-xs font-bold uppercase tracking-wider">Thông tin xe</p>
                            </div>
                            <p className="font-bold text-slate-900 text-sm truncate">{booking.vehicleName || 'Chưa cập nhật'}</p>
                            <p className="text-xs font-semibold text-slate-500 mt-1">{booking.licensePlate || '---'}</p>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex items-center gap-1.5 text-slate-500 mb-2">
                                <PenTool className="w-4 h-4" />
                                <p className="text-xs font-bold uppercase tracking-wider">Dịch vụ</p>
                            </div>
                            <p className="font-bold text-slate-900 text-sm truncate">{booking.serviceName || 'N/A'}</p>
                            <p className="text-xs font-semibold text-slate-500 mt-1">
                                {booking.startTime} - {booking.bookingDate}
                            </p>
                        </div>
                    </div>

                    {/* Tổng tiền từ API */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-slate-600">Tổng thanh toán</span>
                            <span className="text-3xl font-black text-rose-600">
                                {formatCurrency(booking.totalAmount || 0)}
                            </span>
                        </div>
                    </div>

                    {/* Điểm thưởng Loyalty */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-emerald-700">
                                <Sparkles className="w-5 h-5" />
                                <p className="font-bold text-sm">Điểm tích luỹ</p>
                            </div>
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-100/50 px-2.5 py-1 rounded-full">
                                Tính tự động sau khi thu tiền
                            </span>
                        </div>
                    </div>
                </div>

                {/* Ghi chú */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-6">
                    <p className="text-xs text-amber-800 flex items-center gap-2 font-medium">
                        <Receipt className="w-4 h-4 shrink-0" />
                        <span>Hệ thống sẽ tự động cộng điểm và cập nhật hạng thành viên (nếu đủ điều kiện) sau khi bạn xác nhận.</span>
                    </p>
                </div>

                {/* Nút hành động */}
                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 hover:text-slate-800 transition-colors"
                        disabled={isSubmitting}
                    >
                        Hủy bỏ
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-[2] py-3 px-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex justify-center items-center gap-2"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                Đang xử lý...
                            </>
                        ) : 'Xác nhận thu tiền'}
                    </button>
                </div>
            </div>
        </div>
    );
};