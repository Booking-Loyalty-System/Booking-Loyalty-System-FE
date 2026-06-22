import { useQuery } from '@tanstack/react-query';
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

    return {
        customerMe,
        isLoading,
        error,
    };
};