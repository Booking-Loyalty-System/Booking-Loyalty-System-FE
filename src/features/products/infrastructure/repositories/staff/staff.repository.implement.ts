import { httpClient } from '@/core/http/httpClient';
import { ENDPOINTS } from '@/core/api/endpoints';
import type { IStaffBookingRepository } from './staff.repository.interface';
import type { BookingResponseData } from '../../../domain/models/booking/booking.model';
import type { ApiResponse } from '../../../domain/apiResponse';
import type {StaffProfile} from "@/features/products/domain/models/staff/staff.dto.ts";

export interface UpdateBookingStatusPayload {
    targetStatus: number;
    staffId?: string;
    reason?: string;
}

export class StaffBookingRepositoryImplement implements IStaffBookingRepository {
    /**
     * Lấy danh sách booking cho nhân viên theo ngày.
     * TẠI SAO LỌC Ở BACKEND?
     * 1. Hiệu năng: Backend/Database sử dụng Index để tìm kiếm theo ngày cực nhanh (miliseconds).
     * 2. Băng thông: Chỉ tải về dữ liệu cần thiết của ngày đó, tránh tải toàn bộ lịch sử booking gây lag app.
     * 3. Bảo mật: Backend sẽ tự động dựa vào Token của Staff để lọc đúng Branch (chi nhánh) mà nhân viên đó thuộc về.
     */
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
        // Thay url này bằng cấu hình ENDPOINTS của ông nếu có. VD: ENDPOINTS.STAFF.PROFILE
        const response = await httpClient.get<ApiResponse<StaffProfile>>(
            `${ENDPOINTS.STAFF.PROFILE}`);
        return response.data;
    }
}
