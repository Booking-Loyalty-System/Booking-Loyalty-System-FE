export interface Voucher {
    id: string;
    code: string;
    title: string;
    description: string;
    discountValue: number; // Số tiền giảm giá bằng VND (ví dụ: 100000, 250000).
    requiredPoints: number; // Số điểm cần dùng để đổi
    status: 'Active' | 'Used' | 'Expired';
    expiryDate: string;
    isFreeWash?: boolean; // Cờ đánh dấu đây là voucher miễn phí rửa xe
    washPackageId?: string; // Gói dịch vụ áp dụng (nếu chỉ áp dụng cho một gói cụ thể)
}
