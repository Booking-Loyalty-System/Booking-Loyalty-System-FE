export interface CreateBookingInput {
    vehicleId: string;
    washPackageId: string;
    branchId: string; // Bổ sung chi nhánh
    bookingDate: string; // "YYYY-MM-DD"
    startTime: string; // "HH:mm"
    voucherCode?: string; // Mã voucher nếu có
    usePoints?: number; // Số điểm muốn sử dụng để giảm giá
}

export interface BookingResponseData {
    id: string;
    bookingCode: string; // Mã đặt lịch hiển thị cho khách (VD: BW-12345)
    vehicleId: string;
    vehicleName?: string;
    licensePlate?: string;
    washPackageId: string;
    serviceName?: string;
    branchId: string;
    bookingDate: string;
    startTime: string;
    status: 'Pending' | 'Confirmed' | 'CheckedIn' | 'Queued' | 'InProgress' | 'Completed' | 'CheckedOut' | 'Cancelled' | 'NoShow';
    totalAmount: number; // Tổng tiền sau khi trừ giảm giá
    pointsEarned?: number; // Số điểm dự kiến nhận được
    createdAt: string;
    cancelReason?: string;
    cancelledBy?: 'Customer' | 'Staff';
}
