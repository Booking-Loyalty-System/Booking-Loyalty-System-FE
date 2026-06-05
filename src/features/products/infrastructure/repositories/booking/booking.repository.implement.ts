import type { ApiResponse } from '../../../domain/apiResponse.ts';
import { httpClient } from '@/core/http/httpClient.ts';
import { ENDPOINTS } from '@/core/api/endpoints';
import type { IBookingRepository } from '../booking/booking.repository.interface.ts';
import type { CreateBookingInput, BookingResponseData } from '../../../domain/models/booking/booking.model.ts';

export class BookingRepositoryImplement implements IBookingRepository {
    // Gọi API để tạo một lịch đặt rửa xe mới
    async createBooking(bookingData: CreateBookingInput): Promise<BookingResponseData> {
        // Tương tự như authRepository.login hoặc vehicleRepository.createVehicle
        const response = await httpClient.post<ApiResponse<BookingResponseData>>(
            ENDPOINTS.BOOKING.BOOKING,
            bookingData
        );

        // Trả về response.data vì interceptor của bạn đã bóc tách lớp ngoài cùng của Axios rồi
        return response.data;
    }
}