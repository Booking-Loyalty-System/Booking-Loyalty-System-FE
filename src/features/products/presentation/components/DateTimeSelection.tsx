import { Clock } from "lucide-react";
import type { DateTimeSelectionProps } from "@/features/products/domain/models/time-slot/time-slot.model.ts";

export const DateTimeSelection: React.FC<DateTimeSelectionProps> = ({
                                                                        dynamicDateSlots, timeSlots, selectedDate, onSelectDate, selectedTime, onSelectTime
                                                                    }) => {

    const isSlotDisabled = (slotTime: string): boolean => {
        // 1. Lấy thời gian hiện tại theo giờ Việt Nam (UTC+7)
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        const vnTime = new Date(utc + (7 * 3600000));

        const todayStr = vnTime.toISOString().split('T')[0];

        // Nếu không phải hôm nay thì không chặn
        if (selectedDate !== todayStr) return false;

        // 2. Tính thời điểm giới hạn (Giờ hiện tại + 2 tiếng)
        const limitTime = new Date(vnTime.getTime() + 2 * 60 * 60 * 1000);

        // 3. Xử lý chuỗi giờ (Hỗ trợ có hoặc không có AM/PM)
        // Cắt bỏ khoảng trắng 2 đầu và tách phần giờ với chữ AM/PM (nếu có)
        const [timePart, modifier] = slotTime.trim().split(' ');
        const timeElements = timePart.split(':').map(Number);
        let hours = timeElements[0];
        const minutes = timeElements[1];

        // Chuyển đổi sang hệ 24h nếu có AM/PM
        if (modifier) {
            const upperModifier = modifier.toUpperCase();
            if (upperModifier === 'PM' && hours < 12) {
                hours += 12;
            }
            if (upperModifier === 'AM' && hours === 12) {
                hours = 0;
            }
        }

        const slotDate = new Date(vnTime);
        slotDate.setHours(hours, minutes, 0, 0);

        return slotDate <= limitTime;
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-[#0f172a]">Select Date</h3>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
                    {dynamicDateSlots.map((slot) => {
                        const isDateSelected = selectedDate === slot.apiDate;
                        return (
                            <div
                                key={slot.apiDate}
                                onClick={() => {
                                    onSelectDate(slot.apiDate);
                                    onSelectTime('');
                                }}
                                className={`cursor-pointer border rounded-2xl p-4 text-center transition-all ${
                                    isDateSelected
                                        ? 'border-[#1e6ffd] bg-white ring-2 ring-blue-100 font-bold'
                                        : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1]'
                                }`}
                            >
                                <span className={`block text-xs font-semibold uppercase ${isDateSelected ? 'text-[#1e6ffd]' : 'text-[#64748b]'}`}>
                                    {slot.dayName}
                                </span>
                                <span className={`block text-2xl font-black mt-2 ${isDateSelected ? 'text-[#1e6ffd]' : 'text-[#0f172a]'}`}>
                                    {slot.dayNum}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* --- Phần chọn giờ --- */}
            <div className="space-y-4 pt-2">
                <h4 className="text-lg font-bold text-[#0f172a]">Available Time Slots</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {timeSlots.map((slot, index) => {
                        const isPast = isSlotDisabled(slot.time);
                        const isFull = slot.status === 'full';
                        const isDisabled = isFull || isPast;
                        const isTimeSelected = selectedTime === slot.time;

                        let statusClasses: string;

                        if (isDisabled) {
                            statusClasses = 'border-[#e2e8f0] bg-slate-50 text-slate-400 cursor-not-allowed opacity-60';
                        } else if (isTimeSelected) {
                            statusClasses = 'border-[#1e6ffd] ring-2 ring-blue-100 bg-white';
                        } else if (slot.status === 'limited') {
                            statusClasses = 'border-[#fbd38d] bg-[#fffaf0]';
                        } else {
                            statusClasses = 'border-[#bbf7d0] bg-[#f0fdf4]';
                        }

                        return (
                            <div
                                key={index}
                                onClick={() => !isDisabled && onSelectTime(slot.time)}
                                className={`border rounded-2xl p-4 transition-all relative flex flex-col gap-1 ${!isDisabled ? 'cursor-pointer' : ''} ${statusClasses}`}
                            >
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm font-black">{slot.time}</span>
                                </div>
                                <span className="text-xs font-semibold pl-6">
                                    {isDisabled ? (isPast ? 'Closed' : 'Full') : `${slot.availableSlots} slots left`}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};