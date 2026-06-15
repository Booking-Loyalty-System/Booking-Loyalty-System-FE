import { useQuery } from '@tanstack/react-query';
import { CustomerRepositoryImplement } from '../infrastructure/repositories/customer/customer.repository.implement.ts';
import type { Customer } from '../domain/models/customer/customer.dto.ts';

const customerRepository = new CustomerRepositoryImplement();

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