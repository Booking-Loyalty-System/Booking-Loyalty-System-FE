import type { BookingResponseData } from '../../../domain/models/booking/booking.model';

export interface IStaffBookingRepository {
    // Lấy danh sách booking trong ngày (có thể lọc theo trạng thái)
    getStaffBookings(date: string): Promise<BookingResponseData[]>;
    
    // Thao tác vận hành
    checkInBooking(bookingId: string): Promise<BookingResponseData>;
    queueBooking(bookingId: string): Promise<BookingResponseData>;
    startService(bookingId: string, staffId: string): Promise<BookingResponseData>;
    finishService(bookingId: string): Promise<BookingResponseData>;
    checkoutBooking(bookingId: string): Promise<BookingResponseData>;
    cancelBookingByStaff(bookingId: string, reason: string): Promise<BookingResponseData>;
    markAsNoShow(bookingId: string): Promise<BookingResponseData>;
}
