import type { Customer } from "@/features/products/domain/models/customer/customer.dto.ts";
import type { ICustomerRepository } from "@/features/products/infrastructure/repositories/customer/customer.repository.interface.ts";

// Class này giả lập các API liên quan tới Customer để chạy dưới client khi chưa có backend hoàn thiện.
// Dùng tiếng Việt giải thích: Chọn giải pháp Mock này để phát triển nhanh UI/UX của cổng Customer Portal độc lập.
export class CustomerRepositoryMock implements ICustomerRepository {
    private getStoredCustomer(): Customer {
        const stored = localStorage.getItem('mock_customer');
        if (!stored) {
            const defaultCustomer: Customer = {
                id: "cust_01",
                email: "john.doe@gmail.com",
                fullName: "Nguyễn Minh Bằng", // Hợp nhất tên người dùng theo ngữ cảnh
                phoneNumber: "0901234567",
                dateOfBirth: "1995-10-15",
                tier: "Gold",
                totalPoints: 850,
                totalWashes: 5,
                totalSpent: 3175000, // Đơn vị VND (Ví dụ: 3,175,000đ)
                createdAt: "2026-01-01T08:00:00Z"
            };
            localStorage.setItem('mock_customer', JSON.stringify(defaultCustomer));
            return defaultCustomer;
        }
        return JSON.parse(stored);
    }

    async getMe(): Promise<Customer> {
        // Giả lập độ trễ mạng 300ms
        await new Promise(resolve => setTimeout(resolve, 300));
        return this.getStoredCustomer();
    }
}
