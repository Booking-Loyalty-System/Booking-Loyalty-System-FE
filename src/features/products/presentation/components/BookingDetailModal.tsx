import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, CheckCircle2, Calendar, Car, Clock, ShieldCheck, MessageSquare, Star, FileText, Loader2 } from 'lucide-react';
import type { MyBookingRecord } from '../../domain/models/booking/booking.model.ts';
import { useBooking } from '../../application/useBooking.ts';
import { useAuth } from '../../application/useAuth.ts';
import { StaffImageUploader } from './staff/StaffImageUploader.tsx';
interface Props {
    booking: MyBookingRecord | null;
    onClose: () => void;
}

export const BookingDetailModal: React.FC<Props> = ({ booking, onClose }) => {
    const { downloadInvoice, isDownloadingInvoice } = useBooking({ loadMyBookings: false });
    const { role } = useAuth();
    
    if (!booking) return null;
    
    const isStaff = role === 'Staff' || role === 'Admin';


    const qrValue = booking.bookingCode || booking.id || "";
    const hasFeedback = !!booking.feedbackResponse;

    const handleDownload = async () => {
        if (booking.id) {
            await downloadInvoice(booking.id);
        }
    };
    const isComplex = hasFeedback || (booking.images && booking.images.length > 0) || isStaff;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className={`bg-white rounded-2xl p-5 md:p-6 w-full shadow-2xl relative transition-all duration-300 max-h-[95vh] overflow-y-auto ${isComplex ? 'max-w-2xl' : 'max-w-sm'}`}>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 z-10 bg-white rounded-full p-1 shadow-sm border border-slate-100">
                    <X size={20} />
                </button>

                <div className={isComplex ? "md:grid md:grid-cols-5 md:gap-8" : ""}>
                    {/* Cột trái (Thông tin cơ bản) */}
                    <div className={`${isComplex ? "md:col-span-2 md:border-r md:border-slate-100 md:pr-8" : ""}`}>
                        <div className="text-center mb-4 mt-2">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CheckCircle2 size={24} />
                            </div>
                            <h2 className="text-lg font-bold text-blue-950 leading-tight">Chi tiết đặt lịch</h2>
                            <p className="font-mono text-sm font-bold text-blue-600 mt-1">{booking.bookingCode}</p>
                        </div>

                        <div className="flex justify-center mb-5">
                            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                                <QRCodeSVG
                                    value={qrValue}
                                    size={isComplex ? 110 : 130}
                                    level="H"
                                    includeMargin={false}
                                />
                            </div>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between border-b pb-2 border-slate-100">
                                <span className="text-slate-400 flex items-center gap-1.5"><Car size={16} /> Xe</span>
                                <span className="font-bold text-blue-950">{booking.vehicleName} ({booking.vehiclePlate})</span>
                            </div>
                            <div className="flex justify-between border-b pb-2 border-slate-100">
                                <span className="text-slate-400 flex items-center gap-1.5"><Calendar size={16} /> Ngày</span>
                                <span className="font-bold text-blue-950">{booking.bookingDate}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2 border-slate-100">
                                <span className="text-slate-400 flex items-center gap-1.5"><Clock size={16} /> Giờ</span>
                                <span className="font-bold text-blue-950">{booking.startTime}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400 flex items-center gap-1.5"><ShieldCheck size={16} /> Gói</span>
                                <span className="font-bold text-blue-950 text-right max-w-[150px] truncate" title={booking.washPackageName}>{booking.washPackageName}</span>
                            </div>
                        </div>

                        {booking.status === 'Cancelled' && (booking.cancelReason || booking.cancellationReason) && (
                            <div className="mt-4 p-3 bg-rose-50 border border-rose-100 rounded-xl">
                                <div className="text-[10px] font-black text-rose-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                                    <X size={12} className="text-rose-500" /> Lý do hủy
                                </div>
                                <div className="text-sm font-bold text-rose-700 italic leading-snug">
                                    "{booking.cancelReason || booking.cancellationReason}"
                                </div>
                            </div>
                        )}
                        
                        {/* Nếu không complex thì nút hiển thị ở đây */}
                        {!isComplex && (
                            <div className="pt-4 border-t border-slate-100 mt-5 flex gap-2">
                                {(booking.status === 'Completed' || booking.status === 'CheckedOut') && (
                                    <button
                                        onClick={handleDownload}
                                        disabled={isDownloadingInvoice}
                                        className="flex-1 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold py-2.5 px-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                                    >
                                        {isDownloadingInvoice ? (
                                            <><Loader2 size={14} className="animate-spin" /><span>Đang xuất...</span></>
                                        ) : (
                                            <><FileText size={14} /><span className="hidden sm:inline">Tải hóa đơn (PDF)</span><span className="sm:hidden">Hóa đơn</span></>
                                        )}
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center shadow-sm cursor-pointer"
                                >
                                    Đóng
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Cột phải (Ảnh, Đánh giá, Nút) */}
                    {isComplex && (
                        <div className="md:col-span-3 flex flex-col mt-6 md:mt-0 pt-6 md:pt-0 border-t border-slate-100 md:border-0">
                            <div className="flex-1">
                                {/* Phần hiển thị ảnh xe & Upload cho Staff */}
                                <div className="space-y-4">
                                    <h4 className="text-sm font-black text-slate-700 flex items-center gap-1.5">
                                        <Car size={16} className="text-blue-500" />
                                        Ảnh trạng thái xe
                                    </h4>
                                    
                                    {booking.images && booking.images.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-3">
                                            {booking.images.map((img) => (
                                                <div key={img.id} className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm group">
                                                    <img src={img.imageUrl} alt={img.type} className="w-full h-28 md:h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
                                                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent text-white text-[11px] font-bold p-2 pt-4 text-center">
                                                        {img.type === "BeforeWash" ? "Trước rửa" : "Sau rửa"}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl border border-slate-100">Chưa có ảnh nào được tải lên.</p>
                                    )}

                                    {isStaff && (booking.status === "CheckedIn" || booking.status === "InProgress") && (
                                        <StaffImageUploader bookingId={booking.id} type="BeforeWash" />
                                    )}
                                    {isStaff && (booking.status === "Completed" || booking.status === "CheckedOut") && (
                                        <StaffImageUploader bookingId={booking.id} type="AfterWash" />
                                    )}
                                </div>

                                {hasFeedback && booking.feedbackResponse && (
                                    <div className="mt-5 bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                                <MessageSquare size={14} className="text-slate-400" />
                                                Đánh giá của bạn
                                            </h4>
                                            <div className="flex items-center gap-1 text-amber-500 bg-white px-2 py-1 rounded-full border border-amber-100 shadow-sm">
                                                <Star className="w-3.5 h-3.5 fill-current" />
                                                <span className="text-xs font-black">{booking.feedbackResponse.overallRating}/5</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-bold text-slate-500">
                                            <div className="bg-white border border-slate-100 p-2 rounded-lg shadow-sm">
                                                <div className="text-slate-400 mb-1">Nhân viên</div>
                                                <div className="text-amber-500 flex items-center justify-center gap-1">
                                                    <span>{booking.feedbackResponse.staffRating}</span><Star className="w-2.5 h-2.5 fill-current" />
                                                </div>
                                            </div>
                                            <div className="bg-white border border-slate-100 p-2 rounded-lg shadow-sm">
                                                <div className="text-slate-400 mb-1">Dịch vụ</div>
                                                <div className="text-amber-500 flex items-center justify-center gap-1">
                                                    <span>{booking.feedbackResponse.serviceRating}</span><Star className="w-2.5 h-2.5 fill-current" />
                                                </div>
                                            </div>
                                            <div className="bg-white border border-slate-100 p-2 rounded-lg shadow-sm">
                                                <div className="text-slate-400 mb-1">Giá cả</div>
                                                <div className="text-amber-500 flex items-center justify-center gap-1">
                                                    <span>{booking.feedbackResponse.priceRating}</span><Star className="w-2.5 h-2.5 fill-current" />
                                                </div>
                                            </div>
                                        </div>

                                        {booking.feedbackResponse.comment && (
                                            <div className="bg-white border border-slate-100 p-3 rounded-lg shadow-sm">
                                                <p className="text-[10px] font-bold text-slate-400 mb-1 uppercase">Bình luận</p>
                                                <p className="text-xs font-medium text-slate-700 italic">"{booking.feedbackResponse.comment}"</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Nút nằm ở dưới cùng cột phải */}
                            <div className="mt-6 flex gap-2">
                                {(booking.status === 'Completed' || booking.status === 'CheckedOut') && (
                                    <button
                                        onClick={handleDownload}
                                        disabled={isDownloadingInvoice}
                                        className="flex-1 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
                                    >
                                        {isDownloadingInvoice ? (
                                            <><Loader2 size={16} className="animate-spin" /><span>Đang xuất...</span></>
                                        ) : (
                                            <><FileText size={16} /><span>Tải hóa đơn (PDF)</span></>
                                        )}
                                    </button>
                                )}
                                <button
                                    onClick={onClose}
                                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center shadow-sm cursor-pointer"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};