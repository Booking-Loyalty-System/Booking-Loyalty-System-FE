import type { CreateBookingInput, BookingResponseData } from '../../../domain/models/booking/booking.model.ts';

export interface IBookingRepository {
    createBooking(bookingData: CreateBookingInput): Promise<BookingResponseData>;
}