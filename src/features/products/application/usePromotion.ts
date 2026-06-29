import { useState, useEffect, useCallback } from 'react';
import type { Promotion, ValidatePromotionRequest, ValidatePromotionResponse } from '../domain/models/promotion/promotion.dto.ts';
import { PromotionRepositoryImplement } from '../infrastructure/repositories/promotion/promotion.repository.implement.ts';

const promotionRepository = new PromotionRepositoryImplement();

export const usePromotion = () => {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPromotions = useCallback(async () => {
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
    }, []);

    const validatePromotion = async (request: ValidatePromotionRequest): Promise<ValidatePromotionResponse> => {
    try {
        return await promotionRepository.validatePromotion(request);
    } catch (err: any) {
        // Ưu tiên lấy thông báo lỗi từ backend (err.response.data) nếu có
        const backendMessage = err.response?.data?.message 
                            || err.response?.data?.title 
                            || err.message;
        return { 
            isValid: false, 
            errorMessage: backendMessage || 'Failed to validate promotion' 
        };
    }
};

    useEffect(() => {
        fetchPromotions();
    }, [fetchPromotions]);

    return {
        promotions,
        isLoading,
        error,
        validatePromotion,
        refreshPromotions: fetchPromotions
    };
};