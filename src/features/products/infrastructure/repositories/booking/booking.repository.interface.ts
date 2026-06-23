import type {
    CreateBookingInput,
    BookingResponseData,
    MyBookingRecord
} from '../../../domain/models/booking/booking.model.ts';

export interface IBookingRepository {
    createBooking(bookingData: CreateBookingInput): Promise<BookingResponseData>;
    getMyBookings(): Promise<MyBookingRecord[]>;
    cancelBooking(id: string, reason: string): Promise<void>;

    // --- Các API dành cho Staff ---
    confirmBooking(id: string): Promise<BookingResponseData>;
    checkInBooking(id: string, staffId: string): Promise<BookingResponseData>;
    queueBooking(id: string, bayId: string): Promise<BookingResponseData>;
    startBooking(id: string, bayId: string): Promise<BookingResponseData>;
    checkOutBooking(id: string): Promise<BookingResponseData>;
    staffCancelBooking(id: string, cancel: string): Promise<BookingResponseData>;
    noShowBooking(id: string): Promise<BookingResponseData>;
    scan_qr(qr: string): Promise<BookingResponseData>;
}