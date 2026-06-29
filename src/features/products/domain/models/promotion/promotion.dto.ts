export interface Promotion {
    id: string;
    name: string; // Thêm trường name để hứng data từ API thật
    title?: string; // Sửa title thành optional (?) để phòng trường hợp mock data của bạn vẫn đang dùng title
    description: string;
    code: string;
    discountType: 'Percentage' | 'FixedAmount';
    discountValue: number;
    startDate: string;
    endDate: string;
    conditions?: string[]; // Thêm optional (?) vì API hiện tại không trả về mảng này
    isActive: boolean;
    bannerImage?: string;
    targetTiers?: string[]; // Thêm optional (?) vì API hiện tại không trả về mảng này
    maxUses?: number | null; // Có thể thêm các trường này để khớp với Swagger
    usedCount?: number;
    minSpend?: number | null;
}

export interface PromotionResponse {
    promotions: Promotion[];
}

export interface ValidatePromotionRequest {
    code: string;
    serviceId: string;
}

export interface ValidatePromotionResponse {
    isValid: boolean;
    promotion?: Promotion;
    errorMessage?: string;
}