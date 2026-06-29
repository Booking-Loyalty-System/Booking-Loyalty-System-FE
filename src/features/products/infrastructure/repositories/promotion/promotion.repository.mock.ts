import type { IPromotionRepository } from "./promotion.repository.interface.ts";
import type { Promotion, ValidatePromotionRequest, ValidatePromotionResponse } from "../../../domain/models/promotion/promotion.dto.ts";

const mockPromotions: Promotion[] = [
    {
        id: 'promo_1',
        name: 'Weekend Special - 30% Off',
        title: 'Weekend Special - 30% Off',
        description: 'Get 30% off on all premium wash services every weekend',
        code: 'WEEKEND30',
        discountType: 'Percentage',
        discountValue: 30,
        startDate: '2026-05-01T00:00:00Z',
        endDate: '2026-05-31T23:59:59Z',
        conditions: ['Valid on Saturdays and Sundays', 'Cannot be combined with other offers', 'Booking required in advance'],
        isActive: true,
        targetTiers: ['All']
    },
    {
        id: 'promo_2',
        name: 'Early Bird Special',
        title: 'Early Bird Special',
        description: '20% off on bookings before 9 AM',
        code: 'EARLY20',
        discountType: 'Percentage',
        discountValue: 20,
        startDate: '2026-05-01T00:00:00Z',
        endDate: '2026-05-25T23:59:59Z',
        conditions: ['Valid for bookings between 6 AM and 9 AM'],
        isActive: true,
        targetTiers: ['All']
    },
    {
        id: 'promo_3',
        name: 'Exclusive for Gold: Free Upgrade',
        title: 'Exclusive for Gold: Free Upgrade',
        description: 'Fixed discount 100.000đ for Gold members',
        code: 'GOLDVIP',
        discountType: 'FixedAmount',
        discountValue: 100000,
        startDate: '2026-05-01T00:00:00Z',
        endDate: '2026-06-15T23:59:59Z',
        conditions: ['Valid for Gold members only', 'Limited to one use per month'],
        isActive: true,
        targetTiers: ['Gold']
    }
];

export class PromotionRepositoryMock implements IPromotionRepository {
    async getPromotions(): Promise<Promotion[]> {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(mockPromotions);
            }, 600);
        });
    }

    async validatePromotion(request: ValidatePromotionRequest): Promise<ValidatePromotionResponse> {
        return new Promise(resolve => {
            setTimeout(() => {
                const promo = mockPromotions.find(p => p.code === request.code && p.isActive);
                if (promo) {
                    resolve({ isValid: true, promotion: promo });
                } else {
                    resolve({ isValid: false, errorMessage: 'Invalid or expired promotion code' });
                }
            }, 500);
        });
    }
}
