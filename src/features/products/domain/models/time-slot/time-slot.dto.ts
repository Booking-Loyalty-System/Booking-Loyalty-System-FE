export interface DateSlot {
    dayName: string;
    dayNum: string;
    fullDate: string;
    apiDate: string;
}

export interface TimeSlot {
    time: string;
    availableSlots: number;
    totalSlots: number;
    status: 'available' | 'full' | 'limited';
}

export interface DateTimeSelectionProps {
    dynamicDateSlots: DateSlot[];
    timeSlots: TimeSlot[];
    selectedDate: string;
    onSelectDate: (date: string) => void;
    selectedTime: string;
    onSelectTime: (time: string) => void;
}

export interface BranchTimeSlotGroupDto {
    timeSlotId: string;
    startTime: string;
    endTime: string;
    slotRatio: string;
    isAvailable: boolean;
}

export interface DailyTimeSlotsSummaryDto {
    date: string; // YYYY-MM-DD
    dayOfWeek: string;
    timeSlots: BranchTimeSlotGroupDto[];
}