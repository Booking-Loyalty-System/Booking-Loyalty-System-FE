import { useState } from 'react';
import { useFeedback } from '../../../application/useFeedback';
import {
    Star, MessageSquare, ShieldAlert, Eye, X,
    Loader2, Clipboard, ExternalLink, User, Ticket,
    ArrowUpDown, CheckCircle2
} from 'lucide-react';
import { useReward } from '@/features/products/application/useReward';
import { toast } from 'sonner';

export function AdminBookingFeedback() {
    // 🌟 Bổ sung state điều khiển sort tăng/giảm (mặc định true là giảm dần - mới nhất lên đầu)
    const [isDescending, setIsDescending] = useState<boolean>(true);

    // Giả định hook useFeedback hỗ trợ truyền params hoặc bạn có thể filter/sort trực tiếp ở Client nếu API chưa đồng bộ kịp
    const { filteredFeedbacks, isLoadingFiltered, refreshAllAdminData } = useFeedback({ isDescending });

    const { availableRewards, isLoadingRewards, giftReward, isGifting } = useReward();
    const [selectedFeedback, setSelectedFeedback] = useState<any | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const handleCopyId = (id: string, message: string) => {
        navigator.clipboard.writeText(id);
        toast.success(message);
    };

    const handleGiftRewardSubmit = async (rewardId: string, rewardName: string) => {
        if (!selectedFeedback) return;

        try {
            await giftReward({
                customerId: selectedFeedback.customerId,
                rewardId: rewardId,
                bookingId: selectedFeedback.bookingId
            });

            toast.success(`Đã gửi tặng thành công voucher "${rewardName}" cho khách hàng!`);
            setSelectedFeedback(null);
            refreshAllAdminData();
        } catch (error: any) {
            toast.error(error?.message || "Không thể gửi quà tặng đền bù!");
        }
    };

    // Hàm đảo chiều sắp xếp và thông báo dữ liệu thay đổi
    const toggleSortOrder = () => {
        setIsDescending(!isDescending);
        // Nếu dùng client-side sort hoặc trigger API refetch:
        toast.info(`Đang sắp xếp ${!isDescending ? 'mới nhất trước' : 'cũ nhất trước'}`);
    };

    if (isLoadingFiltered) {
        return (
            <div className="flex h-[450px] items-center justify-center">
                <div className="text-center space-y-3">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto text-indigo-600" />
                    <p className="text-slate-400 text-sm font-medium animate-pulse">Đang tối ưu danh sách đánh giá...</p>
                </div>
            </div>
        );
    }

    const FEEDBACKS_PER_PAGE = 5;
    const totalFeedbacks = filteredFeedbacks?.length || 0;
    const totalPages = Math.max(1, Math.ceil(totalFeedbacks / FEEDBACKS_PER_PAGE));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const startIndex = (safeCurrentPage - 1) * FEEDBACKS_PER_PAGE;
    const endIndex = startIndex + FEEDBACKS_PER_PAGE;
    const paginatedFeedbacks = (filteredFeedbacks || []).slice(startIndex, endIndex);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in">
            {/* Header Tiêu đề */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                    <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 tracking-tight">Quản Lý Feedback Khách Hàng</h2>
                    <p className="text-slate-500 text-sm mt-0.5">Quản trị chất lượng dịch vụ booking và thực hiện chiến dịch đền bù, giữ chân khách hàng</p>
                </div>

                {/* 🌟 Nút Bộ lọc Tăng / Giảm theo API `isDescending` */}
                <button
                    onClick={toggleSortOrder}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm rounded-xl border border-slate-200 shadow-2xs transition-all active:scale-95 shrink-0 self-start sm:self-center"
                >
                    <ArrowUpDown className="w-4 h-4 text-slate-500" />
                    Thứ tự: {isDescending ? "Mới nhất trước" : "Cũ nhất trước"}
                </button>
            </div>

            {/* Bảng Danh Sách Feedback */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/70 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="p-4">Mã Booking</th>
                            <th className="p-4">Khách Hàng</th>
                            <th className="p-4 text-center">Sao Trung Bình</th>
                            <th className="p-4">Ý Kiến Đóng Góp</th>
                            <th className="p-4 text-center">Trạng Thái</th>
                            <th className="p-4 text-right">Chi Tiết</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
                        {paginatedFeedbacks.map((item) => {
                            const isNegative = item.overallRating <= 2.5;
                            // Giả định backend trả về field `isGifted` hoặc `hasCompensated` để kiểm tra admin đã đền bù chưa
                            const isCompensated = item.isGifted;

                            return (
                                <tr
                                    key={item.id}
                                    className={`hover:bg-slate-50/60 transition-all duration-150 group 
                                            ${isNegative && !isCompensated ? 'bg-rose-50/20' : ''} 
                                            ${isCompensated ? 'bg-emerald-50/10' : ''}`}
                                >
                                    <td className="p-4 font-bold text-blue-950 group-hover:text-indigo-600 transition-colors">
                                        {item.bookingCode}
                                    </td>
                                    <td className="p-4 font-medium text-slate-700">{item.customerName || "Thành viên ẩn danh"}</td>
                                    <td className="p-4 text-center">
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-2xs border ${isNegative
                                                ? 'bg-rose-50 text-rose-700 border-rose-200/60'
                                                : 'bg-amber-50 text-amber-800 border-amber-200/60'
                                            }`}>
                                                {item.overallRating.toFixed(1)}
                                                <Star className={`w-3.5 h-3.5 ${isNegative ? 'fill-rose-500 text-rose-500' : 'fill-amber-500 text-amber-500'}`} />
                                            </span>
                                    </td>
                                    <td className="p-4 max-w-xs truncate text-slate-500 font-medium">
                                        {item.comment || <span className="text-slate-300 italic font-normal">Chỉ để lại đánh giá sao</span>}
                                    </td>

                                    {/* 🌟 Cột Trạng thái đền bù */}
                                    <td className="p-4 text-center">
                                        {isCompensated ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold rounded-full shadow-2xs">
                                                    <CheckCircle2 className="w-3.5 h-3.5" /> Đã đền bù
                                                </span>
                                        ) : isNegative ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold rounded-full shadow-2xs animate-pulse">
                                                    Chờ xử lý
                                                </span>
                                        ) : (
                                            <span className="text-slate-400 text-xs">—</span>
                                        )}
                                    </td>

                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => setSelectedFeedback(item)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 font-bold text-xs rounded-xl transition-all active:scale-95 shadow-2xs"
                                        >
                                            <Eye className="w-3.5 h-3.5" /> Xem xét
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>

            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 mt-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
                    <p className="text-sm font-medium text-slate-500">
                        Hiển thị {startIndex + 1}-{Math.min(endIndex, totalFeedbacks)} của {totalFeedbacks} đánh giá
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                            disabled={safeCurrentPage === 1}
                            className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Trước
                        </button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, index) => {
                                const pageNumber = index + 1;
                                return (
                                    <button
                                        type="button"
                                        key={pageNumber}
                                        onClick={() => setCurrentPage(pageNumber)}
                                        className={`min-w-9 h-9 px-3 rounded-lg text-sm font-bold transition-colors ${
                                            safeCurrentPage === pageNumber
                                                ? "bg-indigo-600 text-white shadow-sm"
                                                : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}
                        </div>
                        <button
                            type="button"
                            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                            disabled={safeCurrentPage === totalPages}
                            className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Tiếp
                        </button>
                    </div>
                </div>
            )}

            {/* MODAL CHI TIẾT & CHỌN VOUCHER HỆ THỐNG ĐỂ ĐỀN BÙ */}
            {selectedFeedback && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
                    <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col animate-in zoom-in-95 duration-200 max-h-[90vh]">

                        {/* Header Modal */}
                        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="w-5 h-5 text-indigo-600" />
                                <h3 className="font-extrabold text-lg text-blue-950">Chi Tiết Phản Hồi Booking</h3>
                            </div>
                            <button
                                onClick={() => setSelectedFeedback(null)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-200/60 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body Modal */}
                        <div className="p-6 space-y-5 overflow-y-auto flex-1">
                            {/* Khối Khách hàng & Mã Đơn */}
                            <div className="flex items-center justify-between bg-gradient-to-r from-slate-50 to-indigo-50/30 p-4 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-white rounded-xl shadow-2xs border text-indigo-600">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-blue-950">{selectedFeedback.customerName || "Thành viên"}</p>
                                        <button
                                            onClick={() => handleCopyId(selectedFeedback.customerId, "Đã sao chép ID Khách hàng!")}
                                            className="text-[11px] text-slate-400 hover:text-indigo-600 font-mono flex items-center gap-1 mt-0.5 hover:underline"
                                        >
                                            ID: {selectedFeedback.customerId?.substring(0, 8)}... <Clipboard className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                                <a
                                    href={`/admin/bookings/${selectedFeedback.bookingId}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-indigo-600 font-bold bg-white px-3 py-1.5 rounded-xl border shadow-2xs hover:bg-indigo-50/50 transition-colors"
                                >
                                    Đơn: {selectedFeedback.bookingCode} <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </div>

                            {/* Khối Lời Bình Luận */}
                            <div className="space-y-1.5 bg-slate-50/50 p-4 rounded-2xl border border-dashed">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Bình luận từ khách</span>
                                <p className="text-slate-700 italic font-medium leading-relaxed">
                                    "{selectedFeedback.comment || 'Khách hàng không để lại ý kiến bình luận bằng văn bản.'}"
                                </p>
                            </div>

                            {/* Điểm Số Tiêu Chí Thành Phần */}
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: 'Nhân Viên', val: selectedFeedback.staffRating },
                                    { label: 'Dịch Vụ', val: selectedFeedback.serviceRating },
                                    { label: 'Giá Cả', val: selectedFeedback.priceRating }
                                ].map((item) => (
                                    <div key={item.label} className="bg-white p-3 rounded-2xl border text-center shadow-2xs">
                                        <p className="text-xs font-semibold text-slate-400 mb-1">{item.label}</p>
                                        <p className="font-extrabold text-base text-slate-800 flex items-center justify-center gap-1">
                                            {item.val} <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 border-none" />
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* 🌟 VÙNG CHỌN VOUCHER ĐỂ ĐỀN BÙ */}
                            <div className="pt-4 border-t border-slate-100 space-y-4">
                                <div className="flex items-center justify-between text-sm font-bold text-blue-950">
                                    <div className="flex items-center gap-2">
                                        <ShieldAlert className="w-4 h-4 text-rose-500" />
                                        <span>Gửi Tặng Voucher Đền Bù Chăm Sóc Khách Hàng</span>
                                    </div>
                                    {/* Hiển thị badge ngay trong modal nếu đã được tặng rồi */}
                                    {(selectedFeedback.isGifted || selectedFeedback.hasCompensated) && (
                                        <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                                            Đơn này đã được đền bù
                                        </span>
                                    )}
                                </div>

                                {isLoadingRewards ? (
                                    <div className="flex flex-col items-center justify-center py-6 gap-2 text-slate-400">
                                        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                                        <p className="text-xs">Đang tải danh sách voucher khả dụng...</p>
                                    </div>
                                ) : availableRewards?.length === 0 ? (
                                    <div className="text-center py-4 text-xs text-slate-400 italic">
                                        Không tìm thấy mẫu voucher đền bù khả dụng nào được cấu hình trên hệ thống.
                                    </div>
                                ) : (
                                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                                        {availableRewards?.map((reward: any) => (
                                            <div
                                                key={reward.id}
                                                className="border border-dashed border-slate-200 hover:border-indigo-300 rounded-xl p-3 flex justify-between items-center transition-all bg-slate-50/50 hover:bg-indigo-50/20 group"
                                            >
                                                <div className="flex gap-2.5 items-start">
                                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg mt-0.5 group-hover:scale-105 transition-transform">
                                                        <Ticket className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-slate-800 text-xs">{reward.name}</h4>
                                                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                                                            {reward.description || 'Voucher quà tặng từ quản trị viên.'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    disabled={isGifting}
                                                    onClick={() => handleGiftRewardSubmit(reward.id, reward.name)}
                                                    className={`px-3 py-1.5 rounded-lg font-bold text-[11px] shadow-2xs transition-all active:scale-95 flex items-center gap-1 shrink-0
                                                        ${(selectedFeedback.isGifted || selectedFeedback.hasCompensated)
                                                        ? 'bg-slate-200 text-slate-500 cursor-not-allowed hover:bg-slate-200'
                                                        : 'bg-slate-950 hover:bg-indigo-600 text-white disabled:bg-slate-300'
                                                    }`}
                                                >
                                                    {isGifting && <Loader2 className="w-3 h-3 animate-spin" />}
                                                    {(selectedFeedback.isGifted || selectedFeedback.hasCompensated) ? "Tặng thêm" : "Tặng ngay"}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}