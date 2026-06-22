import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { CustomerRepositoryImplement } from '../infrastructure/repositories/customer/customer.repository.implement.ts';
import { CustomerRepositoryMock } from '../infrastructure/repositories/customer/customer.repository.mock.ts';
import type { Customer } from '../domain/models/customer/customer.dto.ts';

// Cờ useMock được cấu hình qua biến môi trường VITE_USE_MOCK (mặc định là false để chạy API thật)
const useMock = import.meta.env.VITE_USE_MOCK === 'true';

// Khởi tạo repository tương ứng tùy theo cờ useMock
const customerRepository = useMock 
    ? new CustomerRepositoryMock() 
    : new CustomerRepositoryImplement();

export const useCustomerMe = () => {
    const {
        data: customerMe = null,
        isLoading,
        error
    } = useQuery<Customer | null>({
        queryKey: ['customer_me'],
        queryFn: () => customerRepository.getMe(),
        staleTime: 1000 * 60 * 5, // Cache trong 5 phút
    });
    
    const queryClient = useQueryClient();

    // Lắng nghe sự kiện đổi điểm (từ Booking hoặc Voucher mock) để reload thông tin
    useEffect(() => {
        const handlePointsChanged = () => {
            queryClient.invalidateQueries({ queryKey: ['customer_me'] });
        };
        window.addEventListener('customer_points_changed', handlePointsChanged);
        return () => window.removeEventListener('customer_points_changed', handlePointsChanged);
    }, [queryClient]);

    return {
        customerMe,
        isLoading,
        error,
    };
};