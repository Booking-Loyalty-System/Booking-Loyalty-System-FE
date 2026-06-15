import type { Customer } from "@/features/products/domain/models/customer/customer.dto.ts";

export interface ICustomerRepository {
    getMe(): Promise<Customer>;
}