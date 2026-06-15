import type { ApiResponse } from '../../../domain/apiResponse.ts';
import { httpClient } from '@/core/http/httpClient.ts';
import { ENDPOINTS } from '@/core/api/endpoints';
import type { IBookingRepository } from '../booking/booking.repository.interface.ts';
import type {
    CreateBookingInput,
    BookingResponseData,
    MyBookingRecord
} from '../../../domain/models/booking/booking.model.ts';

export class BookingRepositoryImplement implements IBookingRepository {
    async createBooking(bookingData: CreateBookingInput): Promise<BookingResponseData> {
        const response = await httpClient.post<ApiResponse<BookingResponseData>>(
            ENDPOINTS.BOOKING.BOOKING,
            bookingData
        );

        return response.data;
    }

    async getMyBookings(): Promise<MyBookingRecord[]> {
        const response = await httpClient.get<ApiResponse<MyBookingRecord[]>>(
            ENDPOINTS.BOOKING.MY_BOOKING
        );
        return response.data;
    }

    async cancelBooking(id: string, reason: string): Promise<void> {
        await httpClient.put<void>(
            ENDPOINTS.BOOKING.CANCEL(id),
            { reason }
        );
    }
}