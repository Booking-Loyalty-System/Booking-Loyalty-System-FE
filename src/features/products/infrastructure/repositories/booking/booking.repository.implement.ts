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

    async confirmBooking(id: string): Promise<BookingResponseData> {
        const response = await httpClient.patch<ApiResponse<BookingResponseData>>(
            ENDPOINTS.BOOKING.CONFIRM(id)
        );
        return (response?.data || response || {}) as BookingResponseData;
    }

    async checkInBooking(id: string, staffId: string): Promise<BookingResponseData> {
        const response = await httpClient.patch<ApiResponse<BookingResponseData>>(
            ENDPOINTS.BOOKING.CHECK_IN(id),
            undefined, // Không có body
            { params: { staffId } } // Truyền qua Query Params theo chuẩn ASP.NET Core
        );
        return (response?.data || response || {}) as BookingResponseData;
    }

    async queueBooking(id: string, bayId: string): Promise<BookingResponseData> {
        const response = await httpClient.patch<ApiResponse<BookingResponseData>>(
            ENDPOINTS.BOOKING.QUEUE(id),
            undefined,
            { params: { bayId } }
        );
        return (response?.data || response || {}) as BookingResponseData;
    }

    async startBooking(id: string, bayId: string): Promise<BookingResponseData> {
        const response = await httpClient.patch<ApiResponse<BookingResponseData>>(
            ENDPOINTS.BOOKING.START(id),
            undefined,
            { params: { bayId } }
        );
        return (response?.data || response || {}) as BookingResponseData;
    }

    async checkOutBooking(id: string): Promise<BookingResponseData> {
        const response = await httpClient.patch<ApiResponse<BookingResponseData>>(
            ENDPOINTS.BOOKING.CHECKOUT(id)
        );
        return (response?.data || response || {}) as BookingResponseData;
    }

    async staffCancelBooking(id: string, cancel: string): Promise<BookingResponseData> {
        const response = await httpClient.patch<ApiResponse<BookingResponseData>>(
            ENDPOINTS.BOOKING.STAFF_CANCEL(id),
            undefined,
            { params: { cancel } }
        );
        return (response?.data || response || {}) as BookingResponseData;
    }

    async noShowBooking(id: string): Promise<BookingResponseData> {
        const response = await httpClient.patch<ApiResponse<BookingResponseData>>(
            ENDPOINTS.BOOKING.NO_SHOW(id)
        );
        return (response?.data || response || {}) as BookingResponseData;
    }

    async completed(id: string): Promise<BookingResponseData> {
        const response = await httpClient.patch<ApiResponse<BookingResponseData>>(
            ENDPOINTS.BOOKING.COMPLETED(id)
        );
        return (response?.data || response || {}) as BookingResponseData;
    }

    async scan_qr(qr: string): Promise<BookingResponseData> {
        const response = await httpClient.get<ApiResponse<BookingResponseData>>(
            ENDPOINTS.BOOKING.QR,
            {
                params: {
                    payload: qr
                }
            }
        );
        return (response?.data || response || {}) as BookingResponseData;
    }

    async downloadInvoice(id: string): Promise<any> {
        const response = await httpClient.get<any>(
            ENDPOINTS.BOOKING.DOWNLOAD_INVOICE(id),
            { responseType: 'blob' }
        );
        return response.data || response;
    }
}