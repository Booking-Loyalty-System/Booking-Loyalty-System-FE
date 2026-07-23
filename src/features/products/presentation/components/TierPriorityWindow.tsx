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
            <div className="bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-[#111] border border-sky-300/90 dark:border-white/10 rounded-2xl p-6 h-40 animate-pulse flex items-center justify-center">
                <span className="text-sky-600 dark:text-blue-400 font-medium">{t('bookWash.priority.loading', { defaultValue: "Đang tải thông tin hạng thành viên..." })}</span>
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
        <div className="bg-gradient-to-br from-sky-50 via-white to-blue-50 dark:bg-gradient-to-br dark:from-slate-900 dark:to-[#111] border border-sky-300/90 dark:border-white/10 rounded-2xl p-6 space-y-4 shadow-[0_4px_20px_rgba(14,165,233,0.15)] relative overflow-hidden group">
            {/* Background effects */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-sky-400/35 dark:bg-blue-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-sky-400/46 transition-colors duration-700"></div>
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-cyan-400/29 dark:bg-purple-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-cyan-400/40 transition-colors duration-700"></div>

            {/* --- Phần Header & Mô tả --- */}
            <div className="flex items-start gap-3 relative z-10">
                <Info className="w-5 h-5 text-sky-500 dark:text-blue-400 mt-0.5 shrink-0" />
                <div>
                    <h4 className="text-base font-bold text-slate-800 dark:text-white">{t('bookWash.priority.title', { defaultValue: "Tier-Based Priority Booking Window" })}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
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
                            className={
                                isCurrentTier
                                    ? "bg-gradient-to-br from-sky-200 to-blue-200 dark:bg-amber-500/10 border-2 border-sky-500 dark:border-amber-500/50 rounded-xl p-4 text-center shadow-md"
                                    : "bg-sky-50/80 dark:bg-[#13151A] border border-sky-200 dark:border-white/10 rounded-xl p-4 text-center"
                            }
                        >
                            <span
                                className={`block text-xs font-semibold ${isCurrentTier ? 'text-sky-700 dark:text-amber-400' : 'text-slate-400 dark:text-slate-400'}`}
                            >
                                {t(`loyaltyTier.tiers.${tier.tierName.toLowerCase()}`, { defaultValue: tier.tierName })}
                            </span>
                            <span
                                className={`text-sm font-bold ${isCurrentTier ? 'text-sky-800 dark:text-amber-400' : 'text-slate-700 dark:text-white'}`}
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