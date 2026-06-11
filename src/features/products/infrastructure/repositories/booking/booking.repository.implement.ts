import type { ApiResponse } from '../../../domain/apiResponse.ts';
import { httpClient } from '@/core/http/httpClient.ts';
import { ENDPOINTS } from '@/core/api/endpoints';
import type { IBookingRepository } from './booking.repository.interface.ts';
import type { CreateBookingInput, BookingResponseData } from '../../../domain/models/booking/booking.model.ts';

export class BookingRepositoryImplement implements IBookingRepository {
    // Gọi API để tạo một lịch đặt rửa xe mới
    async createBooking(bookingData: CreateBookingInput): Promise<BookingResponseData> {
        // === START MOCK DATA ===
        console.log('[Mock] Creating booking:', bookingData);
        return {
            id: 'bk-' + Math.random().toString(36).substring(7),
            bookingCode: 'AWP' + Math.floor(Math.random() * 1000000),
            status: 'Pending',
            totalAmount: 150000,
            startTime: '2026-06-11 08:00',
            branchName: 'AutoWash Central',
            packageName: 'Basic Shine'
        };
        // === END MOCK DATA ===

        const response = await httpClient.post<ApiResponse<BookingResponseData>>(
            ENDPOINTS.BOOKING.BOOKING,
            bookingData
        );

        return response.data;
    }

    async getMyBookings(): Promise<BookingResponseData[]> {
        /* === START MOCK DATA ===
        console.log('[Mock] Fetching my bookings');
        return [
            {
                id: 'bk-001',
                bookingCode: 'AWP123456',
                status: 'Completed',
                totalAmount: 300000,
                startTime: '2026-06-10 09:00',
                branchName: 'AutoWash Central',
                packageName: 'Premium Care'
            },
            {
                id: 'bk-002',
                bookingCode: 'AWP789012',
                status: 'Pending',
                totalAmount: 150000,
                startTime: '2026-06-12 10:00',
                branchName: 'AutoWash South',
                packageName: 'Basic Shine'
            }
        ];
        === END MOCK DATA === */

        const response = await httpClient.get<ApiResponse<BookingResponseData[]>>(
            ENDPOINTS.BOOKING.BOOKING
        );
        return response.data;
    }

    async cancelBooking(bookingId: string): Promise<{ success: boolean; message: string }> {
        const response = await httpClient.delete<ApiResponse<{ success: boolean; message: string }>>(
            `${ENDPOINTS.BOOKING.BOOKING}/${bookingId}`
        );
        return response.data;
    }

    async getBookingById(bookingId: string): Promise<BookingResponseData> {
        const response = await httpClient.get<ApiResponse<BookingResponseData>>(
            `${ENDPOINTS.BOOKING.BOOKING}/${bookingId}`
        );
        return response.data;
    }
}
