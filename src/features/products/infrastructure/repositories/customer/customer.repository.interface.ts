import type { Customer, UpdateCustomerInput } from "@/features/products/domain/models/customer/customer.dto.ts";

export interface ICustomerRepository {
    getMe(): Promise<Customer>;
    updateMe(data: UpdateCustomerInput): Promise<Customer>;
}