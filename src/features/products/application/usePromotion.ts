import { useState, useEffect } from 'react';
import type { Promotion, ValidatePromotionRequest, ValidatePromotionResponse } from '../domain/models/promotion/promotion.dto.ts';
import { PromotionRepositoryImplement } from '../infrastructure/repositories/promotion/promotion.repository.implement.ts';
import { PromotionRepositoryMock } from '../infrastructure/repositories/promotion/promotion.repository.mock.ts';

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';
const promotionRepository = USE_MOCK ? new PromotionRepositoryMock() : new PromotionRepositoryImplement();

export const usePromotion = () => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPromotions = async () => {
        setIsLoading(true);
        try {
            const data = await promotionRepository.getPromotions();
            setPromotions(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch promotions');
        } finally {
            setIsLoading(false);
        }
    };

    const validatePromotion = async (request: ValidatePromotionRequest): Promise<ValidatePromotionResponse> => {
        try {
            return await promotionRepository.validatePromotion(request);
        } catch (err: any) {
            return { isValid: false, errorMessage: err.message || 'Failed to validate promotion' };
        }
    };

    useEffect(() => {
        fetchPromotions();
    }, []);

    return {
        promotions,
        isLoading,
        error,
        validatePromotion,
        refreshPromotions: fetchPromotions
    };
};
