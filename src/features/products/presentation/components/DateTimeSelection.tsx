import { useTranslation } from "react-i18next";
import { ChevronDown, Clock, Info } from "lucide-react";
import type { DailyTimeSlotsSummaryDto } from "../../domain/models/time-slot/time-slot.dto.ts";
import { useEffect, useState } from "react";

export interface DynamicDateSlot {
    apiDate: string;
    dayName: string;
    dayNum: string | number;
}

// Định nghĩa lại Props nhận data thật từ API gối đầu
interface DateTimeSelectionProps {
    dynamicDateSlots: DynamicDateSlot[];
    weeklySummary: DailyTimeSlotsSummaryDto[]; // Thêm cục data 7 ngày từ React Query
    selectedDate: string;
    onSelectDate: (date: string) => void;
    selectedTime: string;
    onSelectTime: (time: string) => void;
    isLoadingSlots?: boolean;
}

export const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({
    dynamicDateSlots,
    weeklySummary,
    selectedDate,
    onSelectDate,
    selectedTime,
    onSelectTime,
    isLoadingSlots
}) => {
    const { t } = useTranslation('customer');
    const [visibleDaysCount, setVisibleDaysCount] = useState(7);
    useEffect(() => {
        setVisibleDaysCount(7);
    }, [dynamicDateSlots]);
    const visibleSlots = dynamicDateSlots.slice(0, visibleDaysCount);
    const hasMoreDays = visibleDaysCount < dynamicDateSlots.length;
    const handleShowMore = () => {
        setVisibleDaysCount(prev => Math.min(prev + 7, dynamicDateSlots.length));
    };
    // 1. Tìm danh sách ca giờ thuộc riêng ngày đang được chọn trên UI (selectedDate)
    const currentDayData = weeklySummary.find(slot => slot.date === selectedDate);
    // Nếu API chưa về kịp hoặc trống, fallback về mảng rỗng để tránh crash giao diện
    const activeTimeSlots = currentDayData ? currentDayData.timeSlots : [];

    const isSlotDisabled = (slotTime: string): boolean => {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const vnTime = new Date(utc + (7 * 3600000));
        const todayStr = vnTime.toISOString().split('T')[0];

        if (selectedDate !== todayStr) return false;

        const limitTime = new Date(vnTime.getTime() + 2 * 60 * 60 * 1000);
        const [timePart, modifier] = slotTime.trim().split(' ');
        const timeElements = timePart.split(':').map(Number);
        let hours = timeElements[0];
        const minutes = timeElements[1];

        if (modifier) {
            const upperModifier = modifier.toUpperCase();
            if (upperModifier === 'PM' && hours < 12) hours += 12;
            if (upperModifier === 'AM' && hours === 12) hours = 0;
        }

        const slotDate = new Date(vnTime);
        slotDate.setHours(hours, minutes, 0, 0);

        return slotDate <= limitTime;
    };

    const maxDateSlot = dynamicDateSlots[dynamicDateSlots.length - 1];
    const maxDateString = maxDateSlot
        ? new Date(maxDateSlot.apiDate).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
        : "";

    return (
        <div className="space-y-6">
            {/* --- Phần chọn ngày (Tabs) --- */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#0f172a]">{t('bookWash.dateTime.selectDateTitle', { defaultValue: "Select Date" })}</h3>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                    {visibleSlots.map((slot) => {
                        const isDateSelected = selectedDate === slot.apiDate;
                        const translatedDayName = t(`common.days.${slot.dayName.toLowerCase()}`, { defaultValue: slot.dayName });
                        return (
                            <div
                                key={slot.apiDate}
                                onClick={() => {
                                    onSelectDate(slot.apiDate);
                                    onSelectTime('');
                                }}
                                className={`cursor-pointer border rounded-2xl p-4 text-center transition-all ${isDateSelected
                                    ? 'border-[#1e6ffd] bg-white ring-2 ring-blue-100 font-bold'
                                    : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1]'
                                    }`}
                            >
                                <span className={`block text-xs font-semibold uppercase ${isDateSelected ? 'text-[#1e6ffd]' : 'text-[#64748b]'}`}>
                                    {translatedDayName}
                                </span>
                                <span className={`block text-2xl font-black mt-2 ${isDateSelected ? 'text-[#1e6ffd]' : 'text-[#0f172a]'}`}>
                                    {slot.dayNum}
                                </span>
                            </div>
                        );
                    })}
                </div>
                {hasMoreDays && (
                    <div className="flex justify-center mt-2">
                        <button
                            onClick={handleShowMore}
                            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors"
                        >
                            <span>
                                {t('bookWash.dateTime.showMore', { defaultValue: "Xem tiếp 7 ngày tới" })}
                            </span>
                            <ChevronDown className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {maxDateString && (
                    <div className="flex items-center gap-2 mt-3 p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-700 text-sm">
                        <Info className="w-5 h-5 shrink-0" />
                        <p>
                            {t('bookWash.dateTime.tierLimit', {
                                defaultValue: `Hạng của bạn chỉ được đặt trước tới ngày ${maxDateString}`
                            })}
                        </p>
                    </div>
                )}
            </div>

            {/* --- Phần chọn giờ dịch từ Real-time API --- */}
            <div className="space-y-4 pt-2">
                <h4 className="text-lg font-bold text-[#0f172a]">{t('bookWash.dateTime.availableTimeSlotsTitle', { defaultValue: "Available Time Slots" })}</h4>

                {isLoadingSlots ? (
                    <div className="text-sm font-medium text-blue-500 py-4 flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        {t('bookWash.dateTime.loadingSlots', { defaultValue: "Đang tải dữ liệu ca trống..." })}
                    </div>
                ) : activeTimeSlots.length === 0 ? (
                    <div className="text-sm font-medium text-slate-400 py-4 italic">
                        {t('bookWash.dateTime.selectBranchPrompt', { defaultValue: "Vui lòng chọn chi nhánh để cập nhật ca trống..." })}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                        {activeTimeSlots.map((slot) => {
                            // Định dạng hiển thị giờ (Chuyển hh:mm:ss thành hh:mm ngắn gọn cho chuẩn UI)
                            const displayTime = slot.startTime.substring(0, 5);

                            const isPast = isSlotDisabled(slot.startTime);
                            // Hết chỗ khi backend trả về isAvailable = false hoặc slotRatio chứa chữ 'Full'
                            const isFull = !slot.isAvailable || slot.slotRatio.toLowerCase().includes('full');
                            const isDisabled = isFull || isPast;
                            const isTimeSelected = selectedTime === slot.startTime;

                            let statusClasses: string;

                            if (isDisabled) {
                                statusClasses = 'border-[#e2e8f0] bg-slate-50 text-slate-400 cursor-not-allowed opacity-60';
                            } else if (isTimeSelected) {
                                statusClasses = 'border-[#1e6ffd] ring-2 ring-blue-100 bg-white text-[#1e6ffd]';
                            } else if (slot.slotRatio.includes('1') || slot.slotRatio.includes('2')) {
                                // Nếu còn ít khoang rảnh (1 hoặc 2), chuyển box sang cảnh báo màu cam (Limited)
                                statusClasses = 'border-[#fbd38d] bg-[#fffaf0] text-amber-700';
                            } else {
                                // Còn nhiều khoang rảnh rỗi (Màu xanh lá nhẹ dịu)
                                statusClasses = 'border-[#bbf7d0] bg-[#f0fdf4] text-emerald-800';
                            }

                            return (
                                <div
                                    key={slot.timeSlotId}
                                    onClick={() => !isDisabled && onSelectTime(slot.startTime)}
                                    className={`border rounded-2xl p-4 transition-all relative flex flex-col gap-1 ${!isDisabled ? 'cursor-pointer hover:scale-[1.02]' : ''} ${statusClasses}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-sm font-black">{displayTime}</span>
                                    </div>
                                    <span className="text-xs font-semibold pl-6">
                                        {isDisabled ? (isPast ? t('bookWash.dateTime.closed', { defaultValue: 'Closed' }) : t('bookWash.dateTime.full', { defaultValue: 'Full' })) : slot.slotRatio}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};