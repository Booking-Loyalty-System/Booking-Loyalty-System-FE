import type { IBookingRepository } from "./booking.repository.interface.ts";
import type {
    CreateBookingInput,
    BookingResponseData,
    MyBookingRecord
} from "../../../domain/models/booking/booking.model.ts";
import type { Voucher } from "../../../domain/models/voucher/voucher.model.ts";
import type { Customer } from "../../../domain/models/customer/customer.dto.ts";

const BOOKINGS_STORAGE_KEY = 'mock_bookings';
const VOUCHER_STORAGE_KEY = 'mock_vouchers';
const CUSTOMER_STORAGE_KEY = 'mock_customer';

const DEFAULT_BOOKINGS: MyBookingRecord[] = [
    {
        id: "bk_1",
        branchId: "branch_01",
        bookingCode: "BK829102",
        washPackageName: "Premium Wash",
        durationMinutes: 45,
        bookingDate: "2026-06-20",
        startTime: "10:00",
        endTime: "10:45",
        washBayName: "Wash Bay A",
        vehiclePlate: "29A-12345",
        vehicleName: "Honda Civic",
        totalPrice: 250000,
        status: "Completed",
        qrData: "BK829102",
        createdAt: "2026-06-20T08:00:00Z"
    },
    {
        id: "bk_2",
        branchId: "branch_01",
        bookingCode: "BK100982",
        washPackageName: "Standard Wash",
        durationMinutes: 30,
        bookingDate: "2026-06-22",
        startTime: "15:30",
        endTime: "16:00",
        washBayName: "Wash Bay B",
        vehiclePlate: "30E-99999",
        vehicleName: "Toyota Camry",
        totalPrice: 150000,
        status: "Confirmed",
        qrData: "BK100982",
        createdAt: "2026-06-21T09:00:00Z"
    }
];

export class BookingRepositoryMock implements IBookingRepository {
    private getStoredBookings(): MyBookingRecord[] {
        const stored = localStorage.getItem(BOOKINGS_STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(DEFAULT_BOOKINGS));
            return DEFAULT_BOOKINGS;
        }
        return JSON.parse(stored);
    }

    private saveBookings(bookings: MyBookingRecord[]): void {
        localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
    }

    async getMyBookings(): Promise<MyBookingRecord[]> {
        await new Promise(resolve => setTimeout(resolve, 300));
        return this.getStoredBookings();
    }

    async createBooking(bookingData: CreateBookingInput): Promise<BookingResponseData> {
        await new Promise(resolve => setTimeout(resolve, 500));

        // 1. Giả lập tính toán giá dựa theo gói dịch vụ chọn (mặc định Standard 150k, Premium 250k)
        let basePrice = 150000;
        let washPackageName = "Standard Wash";
        
        if (bookingData.washPackageId.includes("premium") || bookingData.washPackageId.includes("2") || bookingData.washPackageId.includes("vip")) {
            basePrice = 250000;
            washPackageName = "Premium Wash";
        } else if (bookingData.washPackageId.includes("deluxe") || bookingData.washPackageId.includes("3")) {
            basePrice = 400000;
            washPackageName = "Deluxe Coating";
        }

        let discount = 0;
        
        // 2. Xử lý Voucher nếu được truyền vào
        if (bookingData.voucherId) {
            const vouchersStr = localStorage.getItem(VOUCHER_STORAGE_KEY);
            if (vouchersStr) {
                const vouchers: Voucher[] = JSON.parse(vouchersStr);
                const voucherIndex = vouchers.findIndex(v => v.id === bookingData.voucherId);
                
                if (voucherIndex !== -1 && vouchers[voucherIndex].status === 'Active') {
                    const voucher = vouchers[voucherIndex];
                    if (voucher.isFreeWash) {
                        discount = basePrice;
                    } else {
                        discount = Math.min(basePrice, voucher.discountValue);
                    }
                    
                    // Cập nhật trạng thái voucher thành Used
                    vouchers[voucherIndex].status = 'Used';
                    localStorage.setItem(VOUCHER_STORAGE_KEY, JSON.stringify(vouchers));
                }
            }
        }

        const finalPrice = Math.max(0, basePrice - discount);
        const bookingCode = `BK${Math.floor(100000 + Math.random() * 900000)}`;
        const bookingId = `bk_${Date.now()}`;

        // 3. Tự động cộng điểm thưởng cho khách hàng (1 điểm cho mỗi 10.000đ thanh toán)
        const customerStr = localStorage.getItem(CUSTOMER_STORAGE_KEY);
        if (customerStr) {
            const customer: Customer = JSON.parse(customerStr);
            const pointsGained = Math.floor(finalPrice / 10000);
            customer.totalPoints += pointsGained;
            customer.totalWashes += 1;
            customer.totalSpent += finalPrice;
            
            // Logic tự động thăng hạng (Tier Upgrade)
            const getTierByPoints = (points: number) => {
                if (points >= 2000) return 'Diamond';
                if (points >= 1000) return 'Platinum';
                if (points >= 500) return 'Gold';
                return 'Silver';
            };
            
            customer.tier = getTierByPoints(customer.totalPoints);
            
            localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));
            
            // Bắn event báo điểm thay đổi để UI cập nhật ngay
            window.dispatchEvent(new Event('customer_points_changed'));
        }

        // 4. Lưu Booking mới vào danh sách lịch sử
        const newRecord: MyBookingRecord = {
            id: bookingId,
            branchId: bookingData.branchId,
            bookingCode: bookingCode,
            washPackageName: washPackageName,
            durationMinutes: 30,
            bookingDate: bookingData.bookingDate,
            startTime: bookingData.startTime,
            endTime: bookingData.startTime, // Tạm thời bằng startTime
            washBayName: "Wash Bay Auto",
            vehiclePlate: "29A-88888", // Giá trị mặc định nếu ko tìm thấy xe
            vehicleName: "My Vehicle",
            totalPrice: finalPrice,
            status: "Confirmed",
            qrData: bookingCode,
            createdAt: new Date().toISOString()
        };

        const currentBookings = this.getStoredBookings();
        currentBookings.unshift(newRecord);
        this.saveBookings(currentBookings);

        return {
            id: bookingId,
            vehicleId: bookingData.vehicleId,
            washPackageId: bookingData.washPackageId,
            bookingDate: bookingData.bookingDate,
            startTime: bookingData.startTime,
            status: "Confirmed",
            createdAt: newRecord.createdAt,
            voucherId: bookingData.voucherId,
            discountAmount: discount,
            totalPrice: finalPrice
        };
    }

    async cancelBooking(id: string, _reason: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 300));
        const currentBookings = this.getStoredBookings();
        const updated = currentBookings.map(b => 
            b.id === id ? { ...b, status: 'Cancelled' } : b
        );
        this.saveBookings(updated);
    }
}
