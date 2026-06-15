import type { IStaffBookingRepository } from './staff.repository.interface';
import type { BookingResponseData } from '../../../domain/models/booking/booking.model';

const MOCK_BOOKINGS: BookingResponseData[] = [
    {
        id: '1',
        bookingCode: 'BW-001',
        vehicleId: 'v1',
        licensePlate: '29A-123.45',
        washPackageId: 'p1',
        serviceName: 'Rửa xe tiêu chuẩn',
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
        serviceName: 'Rửa xe cao cấp',
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
        serviceName: 'Rửa xe tiêu chuẩn',
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
        serviceName: 'Rửa xe cao cấp',
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
        serviceName: 'Rửa xe tiêu chuẩn',
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

    async getStaffBookings(date: string): Promise<BookingResponseData[]> {
        console.log(`[Mock] Fetching bookings for ${date}`);
        return Promise.resolve(this.bookings);
    }

    async checkInBooking(bookingId: string): Promise<BookingResponseData> {
        return this.updateStatus(bookingId, 'CheckedIn');
    }

    async queueBooking(bookingId: string): Promise<BookingResponseData> {
        return this.updateStatus(bookingId, 'Queued');
    }

    async startService(bookingId: string, staffId: string): Promise<BookingResponseData> {
        console.log(`[Mock] Service started by staff ${staffId}`);
        return this.updateStatus(bookingId, 'InProgress');
    }

    async finishService(bookingId: string): Promise<BookingResponseData> {
        return this.updateStatus(bookingId, 'Completed');
    }

    async checkoutBooking(bookingId: string): Promise<BookingResponseData> {
        return this.updateStatus(bookingId, 'CheckedOut');
    }

    async cancelBookingByStaff(bookingId: string, reason: string): Promise<BookingResponseData> {
        console.log(`[Mock] Booking ${bookingId} cancelled by staff. Reason: ${reason}`);
        const index = this.bookings.findIndex(b => b.id === bookingId);
        if (index === -1) throw new Error('Booking not found');
        this.bookings[index] = { 
            ...this.bookings[index], 
            status: 'Cancelled',
            cancelReason: reason,
            cancelledBy: 'Staff'
        };
        return Promise.resolve(this.bookings[index]);
    }

    async markAsNoShow(bookingId: string): Promise<BookingResponseData> {
        console.log(`[Mock] Booking ${bookingId} marked as NoShow`);
        return this.updateStatus(bookingId, 'NoShow');
    }

    private updateStatus(bookingId: string, status: BookingResponseData['status']): Promise<BookingResponseData> {
        const index = this.bookings.findIndex(b => b.id === bookingId);
        if (index === -1) throw new Error('Booking not found');
        this.bookings[index] = { ...this.bookings[index], status };
        console.log(`[Mock] Updated booking ${bookingId} to ${status}`);
        return Promise.resolve(this.bookings[index]);
    }
}
