import type { ApiResponse } from '../../../domain/apiResponse.ts';
import { httpClient } from '@/core/http/httpClient.ts';
import { ENDPOINTS } from '@/core/api/endpoints';
import type { IPaymentRepository } from './payment.repository.interface.ts';

export class PaymentRepositoryImplement implements IPaymentRepository {
    async createCheckoutUrl(bookingId: string): Promise<string> {
        // Khớp chính xác phương thức POST /api/payments/bookings/{bookingId}/checkout từ Swagger
        const response = await httpClient.post<ApiResponse<{ paymentUrl: string } | string>>(
            ENDPOINTS.PAYMENT.BOOKINGS(bookingId)
        );

        // Xử lý linh hoạt tùy vào cấu trúc Backend trả về chuỗi URL trực tiếp hay bọc trong Object
        if (typeof response.data === 'string') {
            return response.data;
        }
        return (response.data as any).paymentUrl || '';
    }

    async createPayOsUrl(bookingId: string): Promise<string> {
        const response = await httpClient.post<{ checkoutUrl: string }>(
            ENDPOINTS.PAYMENT.CREATE_PAY_OS_URL(bookingId)
        );

        // Bây giờ TypeScript đã biết `response` có chứa `checkoutUrl`, hết báo lỗi đỏ!
        return response?.checkoutUrl || '';
    }
}