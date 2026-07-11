import { httpClient } from '@/core/http/httpClient';
import { ENDPOINTS } from '@/core/api/endpoints';
import type { IStaffBookingRepository } from './staff.repository.interface';
import type { BookingResponseData } from '../../../domain/models/booking/booking.model';
import type { ApiResponse } from '../../../domain/apiResponse';
import type { StaffProfile } from "@/features/products/domain/models/staff/staff.dto.ts";

export interface UpdateBookingStatusPayload {
    targetStatus: number;
    staffId?: string;
    reason?: string;
}

export class StaffBookingRepositoryImplement implements IStaffBookingRepository {
    async getStaffBookings(date: string): Promise<BookingResponseData[]> {
        const response = await httpClient.get<ApiResponse<BookingResponseData[]>>(
            `${ENDPOINTS.STAFF.BOOKINGS}?date=${date}`
        );
        return response.data;
    }

    async updateBookingStatus(bookingId: string, payload: UpdateBookingStatusPayload): Promise<BookingResponseData> {
        const response = await httpClient.patch<ApiResponse<BookingResponseData>>(
            `${ENDPOINTS.STAFF.BOOKINGS}/${bookingId}/status`,
            payload
        );
        return response.data;
    }

    async getProfile(): Promise<StaffProfile> {
        const response = await httpClient.get<ApiResponse<StaffProfile>>(
            `${ENDPOINTS.STAFF.PROFILE}`);
        return response.data;
    }

    async getStaffById(id: string): Promise<StaffProfile> {
        const response = await httpClient.get<ApiResponse<StaffProfile>>(
            `${ENDPOINTS.STAFF.ID(id)}`);
        return response.data;
    }

    async createStaff(payload: any): Promise<StaffProfile> {
        const response = await httpClient.post<ApiResponse<StaffProfile>>(
            `${ENDPOINTS.STAFF.STAFF}`,
            payload
        );
        return response.data;
    }
}
