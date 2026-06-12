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
            vehicleId: bookingData.vehicleId,
            washPackageId: bookingData.washPackageId,
            branchId: bookingData.branchId,
            bookingDate: bookingData.bookingDate,
            startTime: bookingData.startTime,
            status: 'Pending',
            totalAmount: 150000, // Hardcoded mock amount
            createdAt: new Date().toISOString(),
            // Optional fields you can include to test the UI:
            serviceName: 'Premium Care Mock',
            pointsEarned: 150 
        };
        // === END MOCK DATA ===

        // Real API call (commented out or left below the return for now)
        /*
        const response = await httpClient.post<ApiResponse<BookingResponseData>>(
            ENDPOINTS.BOOKING.BOOKING,
            bookingData
        );
        return response.data;
        */
    }

    async getMyBookings(): Promise<BookingResponseData[]> {
        // === START MOCK DATA ===
        console.log('[Mock] Fetching my bookings');
        return [
            {
                id: 'bk-001',
                bookingCode: 'AWP123456',
                vehicleId: 'v-01',
                vehicleName: 'Honda Civic',
                washPackageId: 'pkg-01',
                serviceName: 'Premium Care',
                branchId: 'br-01',
                bookingDate: '2026-06-10',
                startTime: '09:00',
                status: 'Completed',
                totalAmount: 300000,
                createdAt: '2026-06-08T10:00:00.000Z'
            },
            {
                id: 'bk-002',
                bookingCode: 'AWP789012',
                vehicleId: 'v-02',
                licensePlate: '51F-123.45',
                washPackageId: 'pkg-02',
                serviceName: 'Basic Shine',
                branchId: 'br-02',
                bookingDate: '2026-06-12',
                startTime: '10:00',
                status: 'Pending',
                totalAmount: 150000,
                createdAt: '2026-06-11T08:30:00.000Z'
            }
        ];
        // === END MOCK DATA ===

        /*
        const response = await httpClient.get<ApiResponse<BookingResponseData[]>>(
            ENDPOINTS.BOOKING.BOOKING
        );
        return response.data;
        */
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