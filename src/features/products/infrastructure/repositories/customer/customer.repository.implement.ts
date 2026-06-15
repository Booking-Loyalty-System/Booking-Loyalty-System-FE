import { httpClient } from "@/core/http/httpClient.ts";
import type { ApiResponse } from "@/features/products/domain/apiResponse.ts";
import { ENDPOINTS } from "@/core/api/endpoints.ts";
import type { Customer } from "@/features/products/domain/models/customer/customer.dto.ts";
import type { ICustomerRepository } from "@/features/products/infrastructure/repositories/customer/customer.repository.interface.ts";

export class CustomerRepositoryImplement implements ICustomerRepository {
    // Lấy thông tin profile của khách hàng đang đăng nhập
    async getMe(): Promise<Customer> {
        const response = await httpClient.get<ApiResponse<Customer>>(
            ENDPOINTS.CUSTOMER.ME
        );
        return response.data;
    }
}