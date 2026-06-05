import type { IVehicleRepository } from './vehicle.repository.interface.ts';
import type { Vehicle, CreateVehicleInput } from '../../../domain/models/vehicle/vehicle.model.ts';
import type { ApiResponse } from '../../../domain/apiResponse.ts';
import { httpClient } from '@/core/http/httpClient.ts';
import { ENDPOINTS } from '@/core/api/endpoints';

export class VehicleRepositoryImplement implements IVehicleRepository {
    async getMyVehicles(): Promise<Vehicle[]> {
        // Sử dụng httpClient và ENDPOINTS tương tự Auth
        const response = await httpClient.get<ApiResponse<Vehicle[]>>(
            ENDPOINTS.VEHICLES.VEHICLE // Giả định bạn đã định nghĩa key này trong ENDPOINTS
        );

        // Vì interceptor trả về response.data (ApiResponse),
        // chúng ta truy cập vào .data bên trong để lấy List Vehicle
        return response.data;
    }

    async createVehicle(data: CreateVehicleInput): Promise<Vehicle> {
        // Gọi đến POST /api/vehicles dựa theo ảnh image_f0014b.png
        const response = await httpClient.post<ApiResponse<Vehicle>>(
            ENDPOINTS.VEHICLES.VEHICLE,
            data
        );

        return response.data;
    }
}