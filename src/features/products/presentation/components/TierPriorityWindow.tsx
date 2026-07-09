import React from 'react';
import { useTranslation } from 'react-i18next';
import { Info } from 'lucide-react';
// Lưu ý: Cập nhật lại đường dẫn import cho đúng với cấu trúc dự án của bạn
import { useTier } from '@/features/products/application/useTier';
import { useCustomerMe } from '@/features/products/application/useCustomer';

export const TierPriorityWindow: React.FC = () => {
    const { t } = useTranslation('customer');
    // 1. Lấy dữ liệu từ cả 2 hooks
    const { tiers, isLoading: isLoadingTiers } = useTier();
    const { customerMe, isLoading: isLoadingCustomer } = useCustomerMe();

    // 2. Xử lý trạng thái đang tải (Loading State)
    if (isLoadingTiers || isLoadingCustomer) {
        return (
            <div className="bg-[#eff6ff] dark:bg-gradient-to-br dark:from-slate-900 dark:to-[#111] border border-[#bfdbfe] dark:border-white/10 rounded-2xl p-6 h-40 animate-pulse flex items-center justify-center">
                <span className="text-[#1e6ffd] dark:text-blue-400 font-medium">{t('bookWash.priority.loading', { defaultValue: "Đang tải thông tin hạng thành viên..." })}</span>
            </div>
        );
    }

    // 3. Sắp xếp danh sách Tiers theo thứ tự thời gian đặt trước (Booking Window) tăng dần
    // Để đảm bảo giao diện luôn hiển thị từ hạng thấp đến hạng cao (ví dụ: 7 -> 10 -> 12 -> 14)
    const sortedTiers = [...tiers].sort((a, b) => a.bookingWindow - b.bookingWindow);

    // 4. Lấy thông tin hạng của user hiện tại
    const currentTierName = customerMe?.tier || 'Unknown';
    // Tìm object tier chi tiết tương ứng với hạng của user để lấy số ngày (bookingWindow)
    const currentTierInfo = tiers.find(tInfo => tInfo.tierName === currentTierName);

    return (
        <div className="bg-[#eff6ff] dark:bg-gradient-to-br dark:from-slate-900 dark:to-[#111] border border-[#bfdbfe] dark:border-white/10 rounded-2xl p-6 space-y-4 shadow-sm relative overflow-hidden group">
            {/* Background effects similar to Current Tier */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-blue-500/30 transition-colors duration-700"></div>
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-purple-500/30 transition-colors duration-700"></div>

            {/* --- Phần Header & Mô tả --- */}
            <div className="flex items-start gap-3 relative z-10">
                <Info className="w-5 h-5 text-[#1e6ffd] dark:text-blue-400 mt-0.5 shrink-0" />
                <div>
                    <h4 className="text-base font-bold text-[#1e3a8a] dark:text-white">{t('bookWash.priority.title', { defaultValue: "Tier-Based Priority Booking Window" })}</h4>
                    <p className="text-sm text-[#1e40af] dark:text-slate-300 mt-0.5">
                        {t('bookWash.priority.descTemplate', {
                            tier: t(`loyaltyTier.tiers.${currentTierName.toLowerCase()}`, { defaultValue: currentTierName }),
                            days: currentTierInfo?.bookingWindow || 0,
                            defaultValue: `As a ${currentTierName} member, you can book up to ${currentTierInfo?.bookingWindow || 0} days in advance.`
                        })}
                    </p>
                </div>
            </div>

            {/* --- Phần Hiển thị các khối Hạng (Tier Boxes) --- */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 relative z-10">
                {sortedTiers.map((tier) => {
                    // Logic so sánh: Nếu tên hạng của vòng lặp trùng với hạng của user thì là true
                    const isCurrentTier = tier.tierName === currentTierName;

                    return (
                        <div
                            key={tier.id}
                            // Thay đổi class linh hoạt dựa trên isCurrentTier
                            className={
                                isCurrentTier
                                    ? "bg-[#fef3c7] dark:bg-amber-500/10 border-2 border-[#f59e0b] dark:border-amber-500/50 rounded-xl p-4 text-center shadow-sm" // Style nổi bật (Gold/Orange)
                                    : "bg-white dark:bg-[#111] border border-[#e2e8f0] dark:border-white/10 rounded-xl p-4 text-center"                 // Style bình thường (Trắng/Xám)
                            }
                        >
                            <span
                                className={`block text-xs font-semibold ${isCurrentTier ? 'text-[#b45309] dark:text-amber-400' : 'text-[#94a3b8] dark:text-slate-400'}`}
                            >
                                {t(`loyaltyTier.tiers.${tier.tierName.toLowerCase()}`, { defaultValue: tier.tierName })}
                            </span>
                            <span
                                className={`text-sm font-bold ${isCurrentTier ? 'text-[#b45309] dark:text-amber-400' : 'text-[#0f172a] dark:text-white'}`}
                            >
                                {tier.bookingWindow} {t('bookWash.priority.days', { defaultValue: 'days' })}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};