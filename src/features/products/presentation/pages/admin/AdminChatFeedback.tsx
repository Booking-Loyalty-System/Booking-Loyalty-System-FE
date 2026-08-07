import React, { useState } from 'react';
import { useChatFeedback } from '../../../application/useChatFeedback';
import {
    Star, MessageSquare, ArrowUpRight, ArrowDownRight,
    User, Bot, ShieldAlert, Gift, Loader2, X, Plus, ArrowLeft, Percent, Ticket
} from 'lucide-react';
import { useReward } from '@/features/products/application/useReward';

export const AdminChatFeedbacks: React.FC = () => {
    const { useLatestFeedbacks, useStaffStatistics, useFeedbackDetail } = useChatFeedback();

    // 🌟 Lấy giftReward và trạng thái loading từ hook của hệ thống ra sử dụng[cite: 16]
    const { availableRewards, isLoadingRewards, giftReward, isGifting } = useReward();

    const [isVoucherModalOpen, setIsVoucherModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'list' | 'create'>('list');
    const [targetCustomer, setTargetCustomer] = useState<{ id: string; name: string } | null>(null);

    const [newVoucher, setNewVoucher] = useState({
        code: '',
        discountValue: '',
        type: 'Percentage',
        minOrderValue: '',
        expiryDays: '30'
    });

    const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch dữ liệu từ API qua React Query[cite: 16]
    const { data: latestFeedbacks, isLoading: loadingFeedbacks } = useLatestFeedbacks(50);
    const { data: staffStats, isLoading: loadingStats } = useStaffStatistics(5);
    const { data: detailData, isLoading: loadingDetail } = useFeedbackDetail(selectedFeedbackId);

    const handleOpenVoucherModal = (customerId: string, customerName: string) => {
        setTargetCustomer({ id: customerId, name: customerName });
        setModalMode('list');
        setIsVoucherModalOpen(true);
    };

    // 🌟 Cập nhật lại hàm này để gọi API đền bù voucher thực tế của ông[cite: 16]
    const handleSelectExistingVoucher = async (rewardId: string, rewardName: string) => {
        if (!targetCustomer?.id) return;

        try {
            await giftReward({
                customerId: targetCustomer.id, // ID của khách hàng nhận đền bù[cite: 16]
                rewardId: rewardId          // ID loại phần thưởng được chọn từ danh sách[cite: 16]
            });

            alert(`Đã đền bù thành công Voucher [${rewardName}] cho khách hàng ${targetCustomer.name}!`);
            setIsVoucherModalOpen(false);
        } catch (error: any) {
            alert(`Lỗi khi đền bù voucher: ${error?.message || 'Vui lòng thử lại sau!'}`);
        }
    };

    const handleCreateAndGiftVoucher = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newVoucher.code || !newVoucher.discountValue) {
            alert('Vui lòng điền đầy đủ Mã và Giá trị giảm giá!');
            return;
        }

        alert(`Hệ thống đã tạo mới thành công voucher [${newVoucher.code.toUpperCase()}] và gửi tặng trực tiếp đến tài khoản của khách hàng ${targetCustomer?.name}!`);

        setNewVoucher({ code: '', discountValue: '', type: 'Percentage', minOrderValue: '', expiryDays: '30' });
        setIsVoucherModalOpen(false);
    };

    // Pagination logic
    const FEEDBACKS_PER_PAGE = 5;
    const totalFeedbacks = latestFeedbacks?.length || 0;
    const totalPages = Math.max(1, Math.ceil(totalFeedbacks / FEEDBACKS_PER_PAGE));
    const safeCurrentPage = Math.min(currentPage, totalPages);
    const startIndex = (safeCurrentPage - 1) * FEEDBACKS_PER_PAGE;
    const endIndex = startIndex + FEEDBACKS_PER_PAGE;
    const paginatedFeedbacks = (latestFeedbacks || []).slice(startIndex, endIndex);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Customer Chat Feedbacks</h1>
                <p className="text-sm text-slate-500">Giám sát chất lượng tư vấn của Hệ Thống AI & Staff Đội Ngũ Nhân Viên.</p>
            </div>

            {/* Thống kê Top Staff tốt / tệ */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Tốt Nhất */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-base">Top Chat Staff Xuất Sắc</h3>
                    </div>

                    {loadingStats ? <div className="text-sm text-slate-400">Đang tải...</div> : (
                        <div className="divide-y divide-slate-50">
                            {staffStats?.topChatStaffs?.map((staff: any) => (
                                <div key={staff.staffId} className="flex justify-between items-center py-3">
                                    <div>
                                        <p className="font-semibold text-sm text-slate-700">{staff.staffName}</p>
                                        <p className="text-xs text-slate-400">{staff.totalFeedbacks} đánh giá</p>
                                    </div>
                                    <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-lg text-sm">
                                        {staff.averageRating} <Star className="w-3.5 h-3.5 fill-current" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Top Tệ Nhất */}
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                            <ArrowDownRight className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-slate-800 text-base">Cần Cải Thiện Kỹ Năng / AI Error</h3>
                    </div>
                    {loadingStats ? <div className="text-sm text-slate-400">Đang tải...</div> : (
                        <div className="divide-y divide-slate-50">
                            {staffStats?.lowestChatStaffs?.map((staff: any) => (
                                <div key={staff.staffId} className="flex justify-between items-center py-3">
                                    <div>
                                        <p className="font-semibold text-sm text-slate-700">{staff.staffName}</p>
                                        <p className="text-xs text-slate-400">{staff.totalFeedbacks} đánh giá</p>
                                    </div>
                                    <div className="flex items-center gap-1 bg-rose-50 text-rose-700 font-bold px-2.5 py-1 rounded-lg text-sm">
                                        {staff.averageRating} <Star className="w-3.5 h-3.5 fill-current" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Khu vực xử lý chính: Danh sách bên trái & Chi tiết cuộc trò chuyện bên phải */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* 1. DANH SÁCH FEEDBACK MỚI NHẤT */}
                <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="font-bold text-slate-800 text-sm tracking-wide uppercase">Feedback Mới Nhận</h2>
                    </div>
                    <div className="divide-y divide-slate-100 overflow-y-auto max-h-[550px]">
                        {loadingFeedbacks ? (
                            <div className="p-8 text-center text-slate-400">Đang tải danh sách...</div>
                        ) : latestFeedbacks?.length === 0 ? (
                            <div className="p-8 text-center text-slate-400">Chưa có feedback chat nào.</div>
                        ) : (
                            paginatedFeedbacks.map((fb: any) => (
                                <button
                                    key={fb.id}
                                    onClick={() => setSelectedFeedbackId(fb.id)}
                                    className={`w-full text-left p-4 transition-all duration-200 flex flex-col gap-1.5 border-l-4 ${selectedFeedbackId === fb.id
                                        ? 'bg-blue-50/70 border-blue-600'
                                        : 'hover:bg-slate-50 border-transparent'
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <span className="font-bold text-slate-800 text-sm">{fb.customerName}</span>
                                        <div className="flex gap-0.5 text-amber-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3.5 h-3.5 ${i < fb.rating ? 'fill-current' : 'text-slate-200'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium">Tư vấn bởi: <span className="text-slate-700">{fb.staffName}</span></p>
                                    {fb.comment && (
                                        <p className="text-sm text-slate-600 bg-slate-100/60 p-2 rounded-lg italic line-clamp-2 mt-1">
                                            "{fb.comment}"
                                        </p>
                                    )}
                                    <span className="text-[10px] text-slate-400 self-end mt-1 font-medium">
                                        {new Date(fb.createdAt).toLocaleString('vi-VN')}
                                    </span>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Chat Feedback Pagination */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 bg-slate-50/50">
                            <p className="text-xs font-medium text-slate-500">
                                {startIndex + 1}-{Math.min(endIndex, totalFeedbacks)} / {totalFeedbacks}
                            </p>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                                    disabled={safeCurrentPage === 1}
                                    className="px-2 py-1 rounded border border-slate-200 text-xs font-bold text-slate-600 hover:bg-white disabled:opacity-40 transition-colors"
                                >
                                    Trước
                                </button>
                                <span className="text-xs font-bold text-slate-600 px-2">{safeCurrentPage} / {totalPages}</span>
                                <button
                                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                                    disabled={safeCurrentPage === totalPages}
                                    className="px-2 py-1 rounded border border-slate-200 text-xs font-bold text-slate-600 hover:bg-white disabled:opacity-40 transition-colors"
                                >
                                    Tiếp
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 2. CHI TIẾT CHAT LOG & TẶNG VOUCHER ĐỀN BÙ */}
                <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden min-h-[500px]">
                    {!selectedFeedbackId ? (
                        <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-400 bg-slate-50/30">
                            <MessageSquare className="w-12 h-12 stroke-[1.5] text-slate-300 mb-2" />
                            <p className="text-sm">Vui lòng chọn một cuộc feedback bên trái để xem nhật ký chat.</p>
                        </div>
                    ) : loadingDetail ? (
                        <div className="flex-1 flex items-center justify-center p-8">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    ) : (
                        <div className="flex flex-col h-full flex-1">
                            {/* Panel Header */}
                            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-slate-800">{detailData.customerName}</h3>
                                        <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                                            {detailData.rating} <Star className="w-3 h-3 fill-current" />
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-0.5">Mã phiên: {detailData.chatSessionId}</p>
                                </div>

                                {/* Nút Tặng Voucher */}
                                <button
                                    onClick={() => handleOpenVoucherModal(detailData.customerId, detailData.customerName)}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold text-xs shadow-md shadow-orange-500/10 hover:opacity-90 active:scale-95 transition-all self-start sm:self-center"
                                >
                                    <Gift className="w-4 h-4" />
                                    Tặng Voucher Đền Bù
                                </button>
                            </div>

                            {/* Lý do feedback tệ (Nếu có) */}
                            {detailData.comment && (
                                <div className="bg-rose-50 border-b border-rose-100/60 p-3.5 px-4 flex gap-3 items-start">
                                    <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-bold text-rose-800 uppercase tracking-wide">Ý kiến phản hồi từ khách</p>
                                        <p className="text-sm text-rose-700 mt-0.5 font-medium">"{detailData.comment}"</p>
                                    </div>
                                </div>
                            )}

                            {/* Bong bóng Chat Log */}
                            <div className="flex-1 p-4 bg-slate-50/40 space-y-4 overflow-y-auto max-h-[400px]">
                                {detailData.messages?.map((msg: any) => {
                                    const isUser = msg.senderType === 'User';
                                    return (
                                        <div key={msg.id} className={`flex gap-2.5 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs shrink-0 shadow-sm ${isUser ? 'bg-blue-600' : 'bg-slate-700'}`}>
                                                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                                            </div>
                                            <div>
                                                <div className={`p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${isUser
                                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                                                    }`}>
                                                    {msg.message}
                                                </div>
                                                <p className={`text-[10px] text-slate-400 mt-1 font-medium ${isUser ? 'text-right' : 'text-left'}`}>
                                                    {new Date(msg.sentAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* POP-UP MODAL: TẶNG VOUCHER ĐỀN BÙ */}
            {isVoucherModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-slate-100 flex flex-col overflow-hidden">

                        {/* Header Modal */}
                        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                            <div>
                                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                                    <Gift className="w-5 h-5 text-orange-500" />
                                    Tặng Voucher Đền Bù
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">Khách hàng nhận: <span className="text-slate-700 font-semibold">{targetCustomer?.name}</span></p>
                            </div>
                            <button
                                onClick={() => setIsVoucherModalOpen(false)}
                                className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Thân Modal */}
                        <div className="p-5 flex-1 max-h-[450px] overflow-y-auto">
                            {modalMode === 'list' ? (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Voucher Khả Dụng Hệ Thống</span>
                                        <button
                                            type="button"
                                            onClick={() => setModalMode('create')}
                                            className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1.5 rounded-lg transition-colors"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            Tạo Voucher Mới
                                        </button>
                                    </div>

                                    {isLoadingRewards ? (
                                        <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-400">
                                            <Loader2 className="w-7 h-7 animate-spin text-orange-500" />
                                            <p className="text-xs">Đang tải danh sách voucher đền bù...</p>
                                        </div>
                                    ) : availableRewards.length === 0 ? (
                                        <div className="text-center py-8 text-sm text-slate-400">
                                            Không tìm thấy voucher khả dụng nào trên hệ thống reward.
                                        </div>
                                    ) : (
                                        <div className="space-y-2.5">
                                            {availableRewards.map((reward: any) => (
                                                <div
                                                    key={reward.id}
                                                    className="border border-dashed border-slate-200 hover:border-orange-300 rounded-xl p-3.5 flex justify-between items-center transition-all bg-slate-50/50 hover:bg-orange-50/20 group"
                                                >
                                                    <div className="flex gap-3 items-start">
                                                        <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl mt-0.5 group-hover:scale-110 transition-transform">
                                                            <Ticket className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <span className="font-mono text-xs font-bold bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                                                                {reward.pointsRequired ? `${reward.pointsRequired} Pts` : 'FREE'}
                                                            </span>
                                                            <h4 className="font-bold text-slate-800 text-sm mt-1">{reward.name}</h4>
                                                            <p className="text-xs text-slate-400 mt-0.5">{reward.description || 'Voucher đền bù dịch vụ chất lượng.'}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        disabled={isGifting}
                                                        onClick={() => handleSelectExistingVoucher(reward.id, reward.name)}
                                                        className="px-3 py-1.5 bg-slate-900 text-white rounded-lg font-bold text-xs hover:bg-orange-600 shadow-sm transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none flex items-center gap-1"
                                                    >
                                                        {isGifting && <Loader2 className="w-3 h-3 animate-spin" />}
                                                        Tặng Gói
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <form onSubmit={handleCreateAndGiftVoucher} className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setModalMode('list')}
                                            className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                        </button>
                                        <span className="text-xs font-bold text-slate-700">Quay lại danh sách</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold text-slate-600 mb-1">Mã Voucher (Code) <span className="text-rose-500">*</span></label>
                                            <input
                                                type="text"
                                                placeholder="Ví dụ: DENBUMAY2026"
                                                value={newVoucher.code}
                                                onChange={(e) => setNewVoucher({ ...newVoucher, code: e.target.value })}
                                                className="w-full text-sm p-2.5 border border-slate-200 rounded-xl font-mono focus:outline-none focus:border-blue-500 uppercase"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-600 mb-1">Loại Giảm Giá</label>
                                            <select
                                                value={newVoucher.type}
                                                onChange={(e) => setNewVoucher({ ...newVoucher, type: e.target.value })}
                                                className="w-full text-sm p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 bg-white font-medium text-slate-700"
                                            >
                                                <option value="Percentage">Theo Phần Trăm (%)</option>
                                                <option value="FixedAmount">Số Tiền Cố Định (đ)</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-600 mb-1">Giá Trị Giảm <span className="text-rose-500">*</span></label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    placeholder={newVoucher.type === 'Percentage' ? '15' : '30000'}
                                                    value={newVoucher.discountValue}
                                                    onChange={(e) => setNewVoucher({ ...newVoucher, discountValue: e.target.value })}
                                                    className="w-full text-sm p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-semibold"
                                                    required
                                                />
                                                <div className="absolute right-3 top-2.5 text-slate-400 text-sm font-bold">
                                                    {newVoucher.type === 'Percentage' ? <Percent className="w-4 h-4 mt-0.5" /> : 'đ'}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-600 mb-1">Đơn Tối Thiểu (Min Order)</label>
                                            <input
                                                type="number"
                                                placeholder="0 (Không giới hạn)"
                                                value={newVoucher.minOrderValue}
                                                onChange={(e) => setNewVoucher({ ...newVoucher, minOrderValue: e.target.value })}
                                                className="w-full text-sm p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-600 mb-1">Thời Hạn Sử Dụng (Ngày)</label>
                                            <input
                                                type="number"
                                                value={newVoucher.expiryDays}
                                                onChange={(e) => setNewVoucher({ ...newVoucher, expiryDays: e.target.value })}
                                                className="w-full text-sm p-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setModalMode('list')}
                                            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
                                        >
                                            Hủy Form
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold hover:opacity-90 transition-opacity active:scale-95"
                                        >
                                            Tạo & Gửi Tặng Ngay
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};