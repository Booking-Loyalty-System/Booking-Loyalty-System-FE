import type { ApiResponse } from '../../../domain/apiResponse.ts';
import { httpClient } from '@/core/http/httpClient.ts';
import { ENDPOINTS } from '@/core/api/endpoints';
import type { IBookingRepository } from '../booking/booking.repository.interface.ts';
import type { CreateBookingInput, BookingResponseData } from '../../../domain/models/booking/booking.model.ts';

export class BookingRepositoryImplement implements IBookingRepository {
    async createBooking(bookingData: CreateBookingInput): Promise<BookingResponseData> {
        const response = await httpClient.post<ApiResponse<BookingResponseData>>(
            ENDPOINTS.BOOKING.BOOKING,
            bookingData
        );

        return response.data;
    }


}