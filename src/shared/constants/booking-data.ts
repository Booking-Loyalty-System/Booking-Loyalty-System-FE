import type { DateSlot, TimeSlot } from '../../features/products/domain/models/time-slot/time-slot.dto';

export const TIME_SLOTS: TimeSlot[] = [
    { time: '08:00 AM', availableSlots: 2, totalSlots: 4, status: 'available' },
    { time: '09:00 AM', availableSlots: 0, totalSlots: 4, status: 'full' },
    { time: '10:00 AM', availableSlots: 1, totalSlots: 4, status: 'limited' },
    { time: '11:00 AM', availableSlots: 3, totalSlots: 4, status: 'available' },
    { time: '12:00 PM', availableSlots: 0, totalSlots: 4, status: 'full' },
    { time: '01:00 PM', availableSlots: 2, totalSlots: 4, status: 'available' },
    { time: '02:00 PM', availableSlots: 4, totalSlots: 4, status: 'available' },
    { time: '03:00 PM', availableSlots: 1, totalSlots: 4, status: 'limited' },
    { time: '04:00 PM', availableSlots: 0, totalSlots: 4, status: 'full' },
    { time: '05:00 PM', availableSlots: 3, totalSlots: 4, status: 'available' },
    { time: '06:00 PM', availableSlots: 4, totalSlots: 4, status: 'available' },
];

export const generateUpcomingDates = (daysCount: number = 7): DateSlot[] => {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dates: DateSlot[] = [];

    for (let i = 0; i < daysCount; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);

        const dayName = weekdays[d.getDay()];
        const dayNum = String(d.getDate()).padStart(2, '0');
        const monthName = months[d.getMonth()];

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const apiDate = `${year}-${month}-${dayNum}`;

        dates.push({ dayName, dayNum, fullDate: `${dayName} ${monthName} ${dayNum}`, apiDate });
    }
    return dates;
};

export const convertTo24HourFormat = (time12h: string): string => {
    if (!time12h) return '';

    const [time, modifier] = time12h.split(' ');

    // ĐÃ FIX: Sửa biến timePart thành biến time chuẩn xác
    const timeElements = time.split(':').map(Number);
    let hours = timeElements[0];
    const minutes = timeElements[1]; // Đã giữ nguyên làm const thỏa mãn prefer-const

    // ĐÃ FIX: Sử dụng toán tử so sánh number chuẩn chỉnh, loại bỏ xung đột ép kiểu string
    const upperModifier = modifier ? modifier.toUpperCase() : '';
    if (upperModifier === 'PM' && hours < 12) {
        hours += 12;
    }
    if (upperModifier === 'AM' && hours === 12) {
        hours = 0;
    }

    // ĐÃ FIX: padStart chuỗi cho cả phút và giờ để đảm bảo định dạng hh:mm:ss sắc nét
    const finalHours = String(hours).padStart(2, '0');
    const finalMinutes = String(minutes).padStart(2, '0');

    return `${finalHours}:${finalMinutes}:00`;
};