import type {
    CreateBookingInput,
    BookingResponseData,
    MyBookingRecord
} from '../../../domain/models/booking/booking.model.ts';

export interface IBookingRepository {
    createBooking(bookingData: CreateBookingInput): Promise<BookingResponseData>;
    getMyBookings(): Promise<MyBookingRecord[]>;
    cancelBooking(id: string, reason: string): Promise<void>;
}