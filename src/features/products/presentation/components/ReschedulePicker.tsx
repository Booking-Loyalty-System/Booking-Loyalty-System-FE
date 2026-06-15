import React, { useState, useEffect } from 'react';
import type { DailyTimeSlotsSummaryDto, BranchTimeSlotGroupDto } from '@/features/products/domain/models/time-slot/time-slot.dto.ts';
import { useTimeSlot } from '@/features/products/application/useTimeSlot.ts';

interface ReschedulePickerProps {
    branchId: string;
    onDateTimeSelect: (date: string, slotId: string, timeLabel: string) => void;
}

export const ReschedulePicker: React.FC<ReschedulePickerProps> = ({ branchId, onDateTimeSelect }) => {
    console.log("ID Chi nhánh nhận được tại Picker:", branchId);

    const formatDateToYYYYMMDD = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const today = new Date();
    const todayStr = formatDateToYYYYMMDD(today);

    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 6);
    const maxDateStr = formatDateToYYYYMMDD(maxDate);

    const [selectedDate, setSelectedDate] = useState<string>(todayStr);
    const [activeSlotId, setActiveSlotId] = useState<string>('');

    const { weeklySummary, isLoading } = useTimeSlot({
        branchId,
        startDate: selectedDate
    });

    const currentDayData = weeklySummary?.find((day: DailyTimeSlotsSummaryDto) => {
        const pureBackendDate = day.date?.split('T')[0];
        return pureBackendDate === selectedDate;
    });

    const availableTimeSlots: BranchTimeSlotGroupDto[] = currentDayData ? currentDayData.timeSlots : [];

    // Tự động log kiểm tra cấu trúc dữ liệu thực tế từ API bắn về
    useEffect(() => {
        if (availableTimeSlots.length > 0) {
            console.log("Dữ liệu timeSlots thực tế từ API:", availableTimeSlots);
        }
    }, [availableTimeSlots]);

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const date = e.target.value;
        setSelectedDate(date);
        setActiveSlotId('');
    };

    const handleSlotClick = (slot: BranchTimeSlotGroupDto) => {
        setActiveSlotId(slot.timeSlotId);
        // Thêm phòng vệ tránh crash khi click
        const start = slot.startTime?.slice(0, 5) || '??:??';
        onDateTimeSelect(selectedDate, slot.timeSlotId, start);
    };

    return (
        <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-4 animate-fade-in text-left">
            {/* Chọn Ngày */}
            <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Chọn ngày đổi lịch (Trong 7 ngày tới)
                </label>
                <input
                    type="date"
                    min={todayStr}
                    max={maxDateStr}
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-500 transition-all bg-white cursor-pointer"
                />
            </div>

            {/* Chọn Giờ */}
            <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Khung giờ còn trống tại chi nhánh hiện tại
                </label>

                {isLoading ? (
                    <div className="text-xs text-slate-400 font-medium py-2 animate-pulse">
                        Đang tải khung giờ trống...
                    </div>
                ) : availableTimeSlots.length === 0 ? (
                    <div className="text-xs text-amber-500 font-bold py-2">
                        Không có lịch hẹn trống nào cho ngày này.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                        {availableTimeSlots.map((slot: BranchTimeSlotGroupDto) => {
                            const isSelected = activeSlotId === slot.timeSlotId;
                            const isDisabled = !slot.isAvailable;

                            // Trích xuất an toàn sử dụng Optional Chaining kết hợp fallback mặc định
                            const displayStartTime = slot.startTime?.slice(0, 5) || '??:??';

                            return (
                                <button
                                    key={slot.timeSlotId}
                                    type="button"
                                    disabled={isDisabled}
                                    onClick={() => handleSlotClick(slot)}
                                    className={`py-2.5 px-3 text-xs font-bold rounded-xl border transition-all truncate text-center ${
                                        isSelected
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                                            : isDisabled
                                                ? 'bg-slate-100 border-slate-100 text-slate-300 cursor-not-allowed line-through'
                                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                                    }`}
                                >
                                    {displayStartTime}
                                    {isDisabled && (
                                        <span className="block text-[9px] font-medium text-slate-400/80 mt-0.5">
                                            (Hết chỗ)
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};