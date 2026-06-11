import React, { useState, useMemo } from 'react';
import { Clock, Calendar as CalendarIcon, AlertCircle } from 'lucide-react';
import { useBranch } from '@/features/products/application/useBranch';
import { useLoyalty } from '@/features/products/application/useLoyalty';
import { format, addDays, isSameDay, isBefore, parse } from 'date-fns';

interface SlotStepProps {
    branchId: string;
    onSelect: (date: string, slot: string) => void;
    selectedDate?: string;
    selectedSlot?: string;
}

export const SlotStep: React.FC<SlotStepProps> = ({ branchId, onSelect, selectedDate: initialDate, selectedSlot: initialSlot }) => {
    // 1. Lấy thông tin Loyalty để biết khách được đặt trước bao nhiêu ngày
    const { useGetLoyaltyInfo } = useLoyalty();
    const { data: loyaltyInfo } = useGetLoyaltyInfo();

    // Tính toán số ngày được phép đặt (mặc định 7 ngày nếu chưa load xong)
    const bookingWindow = useMemo(() => {
        if (loyaltyInfo?.currentTier === 'Platinum') return 14;
        if (loyaltyInfo?.currentTier === 'Gold') return 12;
        if (loyaltyInfo?.currentTier === 'Silver') return 10;
        return 7; // Member hoặc chưa đăng nhập
    }, [loyaltyInfo]);

    // 2. State quản lý ngày đang chọn (mặc định là hôm nay)
    const [activeDate, setActiveDate] = useState<Date>(
        initialDate ? new Date(initialDate) : new Date()
    );

    // 3. Lấy danh sách slot trống từ API
    const formattedDate = format(activeDate, 'yyyy-MM-dd');
    const { useGetAvailableSlots } = useBranch();
    const { data: slots, isLoading, isError } = useGetAvailableSlots(branchId, formattedDate);

    // Helper: Tạo danh sách các ngày trong khung cho phép
    const dates = useMemo(() => {
        return Array.from({ length: bookingWindow }, (_, i) => addDays(new Date(), i));
    }, [bookingWindow]);

    return (
        <div className="space-y-10">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Schedule Your Wash</h2>
                <p className="text-gray-500">
                    As a <span className="text-blue-600 font-bold">{loyaltyInfo?.currentTier || 'Member'}</span>, 
                    you have a <span className="font-bold text-gray-900">{bookingWindow}-day</span> booking window.
                </p>
            </div>

            {/* Date Picker (Horizontal Scroll) */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-blue-500" />
                        Select Date
                    </h3>
                </div>
                
                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                    {dates.map((date) => {
                        const isSelected = isSameDay(date, activeDate);
                        return (
                            <div
                                key={date.toISOString()}
                                onClick={() => {
                                    setActiveDate(date);
                                }}
                                className={`flex-shrink-0 cursor-pointer border-2 rounded-2xl p-4 w-20 text-center transition-all duration-200 ${
                                    isSelected 
                                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-50' 
                                    : 'border-gray-100 hover:border-gray-300 bg-white'
                                }`}
                            >
                                <span className={`block text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'text-blue-600' : 'text-gray-400'}`}>
                                    {format(date, 'EEE')}
                                </span>
                                <span className={`block text-xl font-black mt-1 ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>
                                    {format(date, 'dd')}
                                </span>
                                <span className={`block text-[10px] font-medium mt-1 ${isSelected ? 'text-blue-400' : 'text-gray-400'}`}>
                                    {format(date, 'MMM')}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Time Slots Grid */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    Available Slots for {format(activeDate, 'MMMM dd, yyyy')}
                </h3>

                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-2xl" />
                        ))}
                    </div>
                ) : isError ? (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3">
                        <AlertCircle className="w-5 h-5" />
                        <span>Could not load slots for this date.</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {slots?.map((slot) => {
                            const isSelected = initialSlot === slot.time;
                            const isToday = isSameDay(activeDate, new Date());
                            let isPast = false;

                            if (isToday) {
                                const slotTime = parse(slot.time, 'HH:mm', new Date());
                                isPast = isBefore(slotTime, new Date());
                            }

                            const isFull = !slot.available || isPast;

                            return (
                                <div
                                    key={slot.time}
                                    onClick={() => !isFull && onSelect(formattedDate, slot.time)}
                                    className={`relative p-4 rounded-2xl border-2 transition-all duration-200 ${
                                        isFull 
                                        ? 'bg-gray-50 border-gray-100 opacity-50 cursor-not-allowed' 
                                        : isSelected
                                        ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-50'
                                        : 'border-gray-100 hover:border-blue-300 bg-white cursor-pointer'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={`font-bold ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>
                                            {slot.time}
                                        </span>
                                        {isFull && (
                                            <span className="text-[10px] font-bold text-red-500 uppercase">
                                                {isPast ? 'Expired' : 'Full'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-1 flex items-center justify-between">
                                        <span className="text-[10px] text-gray-500 font-medium">
                                            {slot.maxCapacity - slot.currentBookings} left
                                        </span>
                                        <div className="flex gap-0.5">
                                            {Array.from({ length: 3 }).map((_, i) => (
                                                <div key={i} className={`w-1 h-1 rounded-full ${i < (slot.maxCapacity - slot.currentBookings) ? 'bg-emerald-400' : 'bg-gray-200'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
