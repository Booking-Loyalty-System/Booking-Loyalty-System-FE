import type { BookingResponseData } from '../../../domain/models/booking/booking.model';
import type {
    UpdateBookingStatusPayload
} from "@/features/products/infrastructure/repositories/staff/staff.repository.implement.ts";

export interface IStaffBookingRepository {
    // Lấy danh sách booking trong ngày (có thể lọc theo trạng thái)
    getStaffBookings(date: string): Promise<BookingResponseData[]>;

    updateBookingStatus(bookingId: string, payload: UpdateBookingStatusPayload): Promise<BookingResponseData>;
}
