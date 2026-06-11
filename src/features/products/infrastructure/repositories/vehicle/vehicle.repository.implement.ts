import type { IVehicleRepository } from './vehicle.repository.interface.ts';
import type { Vehicle, CreateVehicleInput } from '../../../domain/models/vehicle/vehicle.model.ts';
import type { ApiResponse } from '../../../domain/apiResponse.ts';
import { httpClient } from '@/core/http/httpClient.ts';
import { ENDPOINTS } from '@/core/api/endpoints';

export class VehicleRepositoryImplement implements IVehicleRepository {
    async getMyVehicles(): Promise<Vehicle[]> {
        /* === START MOCK DATA ===
        console.log('[Mock] Fetching my vehicles');
        return [
            {
                id: 'veh-001',
                customerId: 'mock-customer-id',
                licensePlate: '51G-123.45',
                vehicleName: 'Mercedes-Benz C200',
                type: 'Sedan',
                color: 'Black',
                brand: 'Mercedes',
                model: 'C200',
                isPrimary: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 'veh-002',
                customerId: 'mock-customer-id',
                licensePlate: '51A-999.99',
                vehicleName: 'Toyota Camry',
                type: 'Sedan',
                color: 'White',
                brand: 'Toyota',
                model: 'Camry',
                isPrimary: false,
                createdAt: new Date().toISOString()
            }
        ] as any;
        === END MOCK DATA === */

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