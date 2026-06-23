import type { IVehicleRepository } from "./vehicle.repository.interface.ts";
import type { Vehicle, CreateVehicleInput } from "../../../domain/models/vehicle/vehicle.model.ts";

const VEHICLES_STORAGE_KEY = "mock_vehicles";

const DEFAULT_VEHICLES: Vehicle[] = [
    {
        id: "v_1",
        customerId: "mock_customer_id_01",
        licensePlate: "29A-12345",
        vehicleType: "Medium",
        vehicleName: "Honda Civic",
        brand: "Honda",
        model: "Civic 2022",
        color: "Trắng",
        isPrimary: true,
        createdAt: "2026-06-20T08:00:00Z"
    },
    {
        id: "v_2",
        customerId: "mock_customer_id_01",
        licensePlate: "30E-99999",
        vehicleType: "Large",
        vehicleName: "Toyota Camry",
        brand: "Toyota",
        model: "Camry 2021",
        color: "Đen",
        isPrimary: false,
        createdAt: "2026-06-21T09:00:00Z"
    }
];

export class VehicleRepositoryMock implements IVehicleRepository {
    private getStoredVehicles(): Vehicle[] {
        const stored = localStorage.getItem(VEHICLES_STORAGE_KEY);
        if (!stored) {
            localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(DEFAULT_VEHICLES));
            return DEFAULT_VEHICLES;
        }
        return JSON.parse(stored);
    }

    private saveVehicles(vehicles: Vehicle[]): void {
        localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(vehicles));
    }

    async getMyVehicles(): Promise<Vehicle[]> {
        await new Promise(resolve => setTimeout(resolve, 300));
        return this.getStoredVehicles();
    }

    async createVehicle(data: CreateVehicleInput): Promise<Vehicle> {
        await new Promise(resolve => setTimeout(resolve, 400));
        const vehicles = this.getStoredVehicles();
        const newVehicle: Vehicle = {
            id: `v_${Date.now()}`,
            customerId: "mock_customer_id_01",
            licensePlate: data.licensePlate,
            vehicleType: data.vehicleType,
            vehicleName: data.vehicleName,
            brand: data.brand,
            model: data.model,
            color: data.color,
            isPrimary: data.isPrimary,
            createdAt: new Date().toISOString()
        };

        if (data.isPrimary) {
            vehicles.forEach(v => v.isPrimary = false);
        }

        vehicles.push(newVehicle);
        this.saveVehicles(vehicles);
        return newVehicle;
    }
}
