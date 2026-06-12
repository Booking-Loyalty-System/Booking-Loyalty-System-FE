import type { CreateBookingInput, BookingResponseData } from '../../../domain/models/booking/booking.model.ts';

export interface IBookingRepository {
    createBooking(bookingData: CreateBookingInput): Promise<BookingResponseData>;
    getMyBookings(): Promise<BookingResponseData[]>;
    cancelBooking(bookingId: string): Promise<{ success: boolean; message: string }>;
    getBookingById(bookingId: string): Promise<BookingResponseData>;
}
