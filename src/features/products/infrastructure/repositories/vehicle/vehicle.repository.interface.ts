import type { Vehicle, CreateVehicleInput } from '@/features/products/domain/models/vehicle/vehicle.model.ts';

export interface IVehicleRepository {
    getMyVehicles(): Promise<Vehicle[]>;
    createVehicle(data: CreateVehicleInput): Promise<Vehicle>;
    deleteVehicle(id: string): Promise<void>;
}