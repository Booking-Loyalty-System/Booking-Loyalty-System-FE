import type { IVoucherRepository } from "./voucher.repository.interface.ts";
import type { Voucher } from "../../../domain/models/voucher/voucher.model.ts";
import type { Customer } from "../../../domain/models/customer/customer.dto.ts";

const VOUCHER_STORAGE_KEY = 'mock_vouchers';
const CUSTOMER_STORAGE_KEY = 'mock_customer';

const DEFAULT_VOUCHERS: Voucher[] = [
    {
        id: "v_1",
        code: "WASHVND100",
        title: "Voucher Giảm giá 100.000đ",
        description: "Giảm ngay 100.000đ khi thanh toán dịch vụ rửa xe",
        discountValue: 100000,
        requiredPoints: 150,
        status: "Active",
        expiryDate: "2026-08-22"
    },
    {
        id: "v_2",
        code: "FREEBASIC",
        title: "Rửa xe Cơ bản Miễn phí",
        description: "Đổi lấy một lượt rửa xe cơ bản hoàn toàn miễn phí",
        discountValue: 150000, // Tương đương giá trị gói Basic
        requiredPoints: 200,
        status: "Active",
        expiryDate: "2026-07-22",
        isFreeWash: true
    },
    {
        id: "v_3",
        code: "WASHVND250",
        title: "Voucher Giảm giá 250.000đ",
        description: "Giảm ngay 250.000đ khi thanh toán dịch vụ rửa xe",
        discountValue: 250000,
        requiredPoints: 350,
        status: "Used",
        expiryDate: "2026-05-15"
    }
];

export class VoucherRepositoryMock implements IVoucherRepository {
    private getStoredVouchers(): Voucher[] {
        const stored = localStorage.getItem(VOUCHER_STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(VOUCHER_STORAGE_KEY, JSON.stringify(DEFAULT_VOUCHERS));
            return DEFAULT_VOUCHERS;
        }
        return JSON.parse(stored);
    }

    private saveVouchers(vouchers: Voucher[]): void {
        localStorage.setItem(VOUCHER_STORAGE_KEY, JSON.stringify(vouchers));
    }

    async getMyVouchers(): Promise<Voucher[]> {
        await new Promise(resolve => setTimeout(resolve, 300));
        return this.getStoredVouchers();
    }

    async redeemVoucher(rewardId: string): Promise<Voucher> {
        await new Promise(resolve => setTimeout(resolve, 400));
        
        // Định nghĩa các phần thưởng tương ứng
        const rewardsMap: Record<string, Omit<Voucher, 'id' | 'code' | 'status' | 'expiryDate'>> = {
            'rw_1': {
                title: 'Rửa xe Cơ bản Miễn phí',
                description: 'Đổi lấy một lượt rửa xe cơ bản hoàn toàn miễn phí',
                discountValue: 150000,
                requiredPoints: 200,
                isFreeWash: true
            },
            'rw_2': {
                title: 'Voucher Giảm giá 100.000đ',
                description: 'Giảm ngay 100.000đ khi thanh toán dịch vụ rửa xe',
                discountValue: 100000,
                requiredPoints: 150
            },
            'rw_3': {
                title: 'Đặt lịch Giờ vàng VIP',
                description: 'Quyền ưu tiên lựa chọn và đặt trước các khung giờ cao điểm',
                discountValue: 0,
                requiredPoints: 300
            },
            'rw_4': {
                title: 'Rửa xe Cao cấp Miễn phí',
                description: 'Đổi lấy một lượt rửa xe cao cấp (Premium) miễn phí',
                discountValue: 250000,
                requiredPoints: 400,
                isFreeWash: true
            },
            'rw_5': {
                title: 'Voucher Giảm giá 250.000đ',
                description: 'Giảm ngay 250.000đ khi thanh toán dịch vụ rửa xe',
                discountValue: 250000,
                requiredPoints: 350
            }
        };

        const reward = rewardsMap[rewardId];
        if (!reward) throw new Error("Phần thưởng không tồn tại!");

        // Lấy thông tin khách hàng hiện tại để trừ điểm
        const customerStr = localStorage.getItem(CUSTOMER_STORAGE_KEY);
        if (!customerStr) throw new Error("Không tìm thấy thông tin khách hàng!");

        const customer: Customer = JSON.parse(customerStr);
        if (customer.totalPoints < reward.requiredPoints) {
            throw new Error("Bạn không đủ điểm tích lũy để đổi quà!");
        }

        // Trừ điểm và lưu lại
        customer.totalPoints -= reward.requiredPoints;
        localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customer));

        // Tạo voucher mới
        const newVoucher: Voucher = {
            id: `v_${Date.now()}`,
            code: `REDEEM${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
            title: reward.title,
            description: reward.description,
            discountValue: reward.discountValue,
            requiredPoints: reward.requiredPoints,
            status: 'Active',
            expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 60 ngày hạn
            isFreeWash: reward.isFreeWash
        };

        const currentVouchers = this.getStoredVouchers();
        currentVouchers.unshift(newVoucher); // Đưa lên đầu danh sách
        this.saveVouchers(currentVouchers);

        // Phát tín hiệu reload thông tin customer cho React Query
        window.dispatchEvent(new Event('customer_points_changed'));

        return newVoucher;
    }

    async useVoucher(voucherId: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 200));
        const currentVouchers = this.getStoredVouchers();
        const updated = currentVouchers.map(v => 
            v.id === voucherId ? { ...v, status: 'Used' as const } : v
        );
        this.saveVouchers(updated);
    }
}
