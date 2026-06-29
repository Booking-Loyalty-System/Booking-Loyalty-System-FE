import { useMutation } from '@tanstack/react-query';
import { PaymentRepositoryImplement } from '../infrastructure/repositories/payment/payment.repository.implement.ts';

const paymentRepository = new PaymentRepositoryImplement();

export const usePayment = () => {
    const createVNPayUrlMutation = useMutation({
        mutationFn: (bookingId: string) => paymentRepository.createCheckoutUrl(bookingId),
        onError: (error) => {
            console.error("Lỗi hệ thống khi sinh mã thanh toán VNPay:", error);
        }
    });

    const createPayOsUrlMutation = useMutation({
        mutationFn: (bookingId: string) => paymentRepository.createPayOsUrl(bookingId),
        onError: (error) => {
            console.error("Lỗi hệ thống khi sinh mã thanh toán PayOS:", error);
        }
    });

    return {
        createVNPayUrl: createVNPayUrlMutation.mutateAsync,
        createPayOsUrl: createPayOsUrlMutation.mutateAsync,
        isCreatingUrl: createVNPayUrlMutation.isPending,
        isCreatingPayOsUrl: createPayOsUrlMutation.isPending,
    };
};