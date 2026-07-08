import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, CheckCircle2, Calendar, Car, Clock, ShieldCheck, MessageSquare, Star, FileText, Loader2 } from 'lucide-react';
import type { MyBookingRecord } from '../../domain/models/booking/booking.model.ts';
import { useBooking } from '../../application/useBooking.ts';

interface Props {
    booking: MyBookingRecord | null;
    onClose: () => void;
}

export const BookingDetailModal: React.FC<Props> = ({ booking, onClose }) => {
    const { downloadInvoice, isDownloadingInvoice } = useBooking({ loadMyBookings: false });
    if (!booking) return null;

    const qrValue = booking.bookingCode || booking.id || "";
    const hasFeedback = !!booking.feedbackResponse;

    const handleDownload = async () => {
        if (booking.id) {
            await downloadInvoice(booking.id);
        }
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className={`bg-white rounded-3xl p-8 w-full shadow-2xl relative transition-all duration-300 max-h-[90vh] overflow-y-auto ${hasFeedback ? 'max-w-md' : 'max-w-sm'}`}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <X size={24} />
                </button>

                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Chi tiết đặt lịch</h2>
                    <p className="font-mono font-bold text-blue-600">{booking.bookingCode}</p>
                </div>

                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <QRCodeSVG
                            value={qrValue}
                            size={160}
                            level="H"
                            includeMargin={false}
                        />
                    </div>
                </div>

                <div className="space-y-4 text-sm">
                    <div className="flex justify-between border-b pb-2 border-slate-100">
                        <span className="text-slate-400 flex items-center gap-2"><Car size={16} /> Xe</span>
                        <span className="font-bold text-slate-900">{booking.vehicleName} ({booking.vehiclePlate})</span>
                    </div>
                    <div className="flex justify-between border-b pb-2 border-slate-100">
                        <span className="text-slate-400 flex items-center gap-2"><Calendar size={16} /> Ngày</span>
                        <span className="font-bold text-slate-900">{booking.bookingDate}</span>
                    </div>
                    <div className="flex justify-between border-b pb-2 border-slate-100">
                        <span className="text-slate-400 flex items-center gap-2"><Clock size={16} /> Giờ</span>
                        <span className="font-bold text-slate-900">{booking.startTime}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-400 flex items-center gap-2"><ShieldCheck size={16} /> Gói</span>
                        <span className="font-bold text-slate-900">{booking.washPackageName}</span>
                    </div>
                </div>

                {(booking.status === 'Completed' || booking.status === 'CheckedOut') && (
                    <div className="pt-4 border-t border-slate-100 mb-4">
                        <button
                            onClick={handleDownload}
                            disabled={isDownloadingInvoice}
                            className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold py-3 px-4 rounded-2xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                        >
                            {isDownloadingInvoice ? (
                                <>
                                    <Loader2 size={14} className="animate-spin" />
                                    <span>Đang xuất hóa đơn...</span>
                                </>
                            ) : (
                                <>
                                    <FileText size={14} />
                                    <span>Tải hóa đơn điện tử (PDF)</span>
                                </>
                            )}
                        </button>
                    </div>
                )}

                {hasFeedback && booking.feedbackResponse && (
                    <div className="mt-6 pt-5 border-t-2 border-dashed border-slate-100 bg-slate-50/70 rounded-2xl p-4 space-y-3.5">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                <MessageSquare size={14} className="text-slate-400" />
                                Đánh giá của bạn
                            </h4>
                            <div className="flex items-center gap-0.5 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span className="text-xs font-black">{booking.feedbackResponse.overallRating}/5</span>
                            </div>
                        </div>

                        {/* Điểm số chi tiết từng mục */}
                        <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold text-slate-500">
                            <div className="bg-white border border-slate-100 p-2 rounded-xl shadow-sm">
                                <div className="text-slate-400 font-medium mb-0.5">Nhân viên</div>
                                <div className="text-amber-500 flex items-center justify-center gap-0.5">
                                    <span>{booking.feedbackResponse.staffRating}</span>
                                    <Star className="w-2.5 h-2.5 fill-current" />
                                </div>
                            </div>
                            <div className="bg-white border border-slate-100 p-2 rounded-xl shadow-sm">
                                <div className="text-slate-400 font-medium mb-0.5">Dịch vụ</div>
                                <div className="text-amber-500 flex items-center justify-center gap-0.5">
                                    <span>{booking.feedbackResponse.serviceRating}</span>
                                    <Star className="w-2.5 h-2.5 fill-current" />
                                </div>
                            </div>
                            <div className="bg-white border border-slate-100 p-2 rounded-xl shadow-sm">
                                <div className="text-slate-400 font-medium mb-0.5">Giá cả</div>
                                <div className="text-amber-500 flex items-center justify-center gap-0.5">
                                    <span>{booking.feedbackResponse.priceRating}</span>
                                    <Star className="w-2.5 h-2.5 fill-current" />
                                </div>
                            </div>
                        </div>

                        {/* Ý kiến đóng góp nội dung */}
                        {booking.feedbackResponse.comment && (
                            <div className="bg-white border border-slate-100 p-3 rounded-xl shadow-sm">
                                <p className="text-xs font-semibold text-slate-400 mb-1 text-left">Nội dung bình luận:</p>
                                <p className="text-sm font-bold text-slate-700 italic text-left">
                                    "{booking.feedbackResponse.comment}"
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};