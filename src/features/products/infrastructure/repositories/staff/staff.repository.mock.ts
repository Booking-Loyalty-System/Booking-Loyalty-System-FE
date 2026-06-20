import type { IStaffBookingRepository } from './staff.repository.interface';
import type { BookingResponseData } from '../../../domain/models/booking/booking.model';
import type { UpdateBookingStatusPayload } from './staff.repository.implement';

const MOCK_BOOKINGS: BookingResponseData[] = [
    {
        id: '1',
        bookingCode: 'BW-001',
        vehicleId: 'v1',
        licensePlate: '29A-123.45',
        washPackageId: 'p1',
        serviceName: 'Standard Wash',
        branchId: 'b1',
        bookingDate: '2026-06-12',
        startTime: '09:00',
        status: 'Confirmed',
        totalAmount: 100000,
        createdAt: '2026-06-12T08:00:00Z',
    },
    {
        id: '2',
        bookingCode: 'BW-002',
        vehicleId: 'v2',
        licensePlate: '30K-999.99',
        washPackageId: 'p2',
        serviceName: 'Premium Wash',
        branchId: 'b1',
        bookingDate: '2026-06-12',
        startTime: '10:00',
        status: 'CheckedIn',
        totalAmount: 250000,
        createdAt: '2026-06-12T09:00:00Z',
    },
    {
        id: '3',
        bookingCode: 'BW-003',
        vehicleId: 'v3',
        licensePlate: '51G-123.45',
        washPackageId: 'p1',
        serviceName: 'Standard Wash',
        branchId: 'b1',
        bookingDate: '2026-06-12',
        startTime: '11:00',
        status: 'Completed',
        totalAmount: 100000,
        createdAt: '2026-06-12T10:00:00Z',
    },
    {
        id: '4',
        bookingCode: 'BW-004',
        vehicleId: 'v4',
        licensePlate: '43A-555.55',
        washPackageId: 'p2',
        serviceName: 'Premium Wash',
        branchId: 'b1',
        bookingDate: '2026-06-12',
        startTime: '12:00',
        status: 'Cancelled',
        totalAmount: 250000,
        createdAt: '2026-06-12T11:00:00Z',
        cancelReason: 'Khách đổi ý',
        cancelledBy: 'Customer'
    },
    {
        id: '5',
        bookingCode: 'BW-005',
        vehicleId: 'v5',
        licensePlate: '75A-666.66',
        washPackageId: 'p1',
        serviceName: 'Standard Wash',
        branchId: 'b1',
        bookingDate: '2026-06-12',
        startTime: '13:00',
        status: 'Cancelled',
        totalAmount: 100000,
        createdAt: '2026-06-12T12:00:00Z',
        cancelReason: 'Thiết bị bảo trì đột xuất',
        cancelledBy: 'Staff'
    },
];

export class StaffBookingRepositoryMock implements IStaffBookingRepository {
    private bookings = [...MOCK_BOOKINGS];

    /**
     * Giả lập API lấy danh sách booking theo ngày.
     */
    async getStaffBookings(date: string): Promise<BookingResponseData[]> {
        console.log(`[Mock] Fetching bookings for ${date}`);
        return Promise.resolve(this.bookings);
    }

    /**
     * Đồng bộ hóa hàm update mới theo Interface thực tế.
     * TẠI SAO DÙNG HÀM NÀY?
     * Để khớp với Clean Architecture khi repository thật sử dụng một Endpoint chung cho việc cập nhật trạng thái.
     */
    async updateBookingStatus(bookingId: string, payload: UpdateBookingStatusPayload): Promise<BookingResponseData> {
        console.log(`[Mock] Updating status for ${bookingId} to ${payload.targetStatus}`);
        
        let targetStatusString: BookingResponseData['status'] = 'Pending';
        switch(payload.targetStatus) {
            case 0: targetStatusString = 'Pending'; break;
            case 1: targetStatusString = 'Confirmed'; break;
            case 2: targetStatusString = 'CheckedIn'; break;
            case 3: targetStatusString = 'Queued'; break;
            case 4: targetStatusString = 'InProgress'; break;
            case 5: targetStatusString = 'Completed'; break;
            case 6: targetStatusString = 'NoShow'; break;
            case 7: targetStatusString = 'CheckedOut'; break;
            case 8: targetStatusString = 'Cancelled'; break;
        }

        return this.updateStatusInternal(bookingId, targetStatusString, payload.washBayName);
    }

    private updateStatusInternal(bookingId: string, status: BookingResponseData['status'], washBayName?: string): Promise<BookingResponseData> {
        const index = this.bookings.findIndex(b => b.id === bookingId);
        if (index === -1) throw new Error('Booking not found');
        
        this.bookings[index] = { 
            ...this.bookings[index], 
            status,
            // Cập nhật washBayName nếu được gửi lên, hoặc giữ nguyên giá trị cũ, hoặc xóa nếu chuyển trạng thái hoàn thành
            washBayName: washBayName !== undefined 
                ? washBayName 
                : (status === 'Completed' || status === 'CheckedOut' || status === 'Cancelled' ? undefined : this.bookings[index].washBayName)
        };
        
        console.log(`[Mock] Updated booking ${bookingId} to ${status}${this.bookings[index].washBayName ? ` on bay ${this.bookings[index].washBayName}` : ''}`);
        return Promise.resolve(this.bookings[index]);
    }
}
