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