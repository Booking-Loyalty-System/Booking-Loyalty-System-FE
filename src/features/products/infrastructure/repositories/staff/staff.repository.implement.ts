import { httpClient } from '@/core/http/httpClient';
import { ENDPOINTS } from '@/core/api/endpoints';
import type { IStaffBookingRepository } from './staff.repository.interface';
import type { BookingResponseData } from '../../../domain/models/booking/booking.model';
import type { ApiResponse } from '../../../domain/apiResponse';

export class StaffBookingRepositoryImplement implements IStaffBookingRepository {
    async getStaffBookings(date: string): Promise<BookingResponseData[]> {
        const response = await httpClient.get<ApiResponse<BookingResponseData[]>>(
            `${ENDPOINTS.STAFF.BOOKINGS}?date=${date}`
        );
        return response.data;
    }

    async checkInBooking(bookingId: string): Promise<BookingResponseData> {
        const response = await httpClient.post<ApiResponse<BookingResponseData>>(
            `${ENDPOINTS.STAFF.BOOKINGS}/${bookingId}/check-in`
        );
        return response.data;
    }

    async queueBooking(bookingId: string): Promise<BookingResponseData> {
        const response = await httpClient.post<ApiResponse<BookingResponseData>>(
            `${ENDPOINTS.STAFF.BOOKINGS}/${bookingId}/queue`
        );
        return response.data;
    }

    async startService(bookingId: string, staffId: string): Promise<BookingResponseData> {
        const response = await httpClient.post<ApiResponse<BookingResponseData>>(
            `${ENDPOINTS.STAFF.BOOKINGS}/${bookingId}/start`,
            { staffId }
        );
        return response.data;
    }

    async finishService(bookingId: string): Promise<BookingResponseData> {
        const response = await httpClient.post<ApiResponse<BookingResponseData>>(
            `${ENDPOINTS.STAFF.BOOKINGS}/${bookingId}/finish`
        );
        return response.data;
    }

    async checkoutBooking(bookingId: string): Promise<BookingResponseData> {
        const response = await httpClient.post<ApiResponse<BookingResponseData>>(
            `${ENDPOINTS.STAFF.BOOKINGS}/${bookingId}/checkout`
        );
        return response.data;
    }

    async cancelBookingByStaff(bookingId: string, reason: string): Promise<BookingResponseData> {
        const response = await httpClient.post<ApiResponse<BookingResponseData>>(
            `${ENDPOINTS.STAFF.BOOKINGS}/${bookingId}/cancel`,
            { reason }
        );
        return response.data;
    }

    async markAsNoShow(bookingId: string): Promise<BookingResponseData> {
        const response = await httpClient.post<ApiResponse<BookingResponseData>>(
            `${ENDPOINTS.STAFF.BOOKINGS}/${bookingId}/no-show`
        );
        return response.data;
    }
}
