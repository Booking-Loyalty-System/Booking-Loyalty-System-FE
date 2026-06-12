import type { ReactNode } from "react";

export type VehicleType = 'Small' | 'Medium' | 'Large';

export interface VehicleResponse {
    id: string;
    customerId: string;
    licensePlate: string;
    vehicleType: VehicleType; // Khớp 100% với tên biến từ Backend API
    vehicleName: string;
    brand: string;
    model: string;
    color: string;
    isPrimary: boolean;
    isDeleted: boolean;
    createdAt: string;
}

export interface VehicleRequest {
    licensePlate: string;
    vehicleType: VehicleType; // Khớp 100% với Swagger cần nhận
    vehicleName: string;
    brand: string;
    model: string;
    color: string;
    isPrimary: boolean;
}

export interface Vehicle {
    type: ReactNode;
    id: string;
    customerId: string;
    licensePlate: string;
    vehicleType: VehicleType;
    vehicleName: string;
    brand: string;
    model: string;
    color: string;
    isPrimary: boolean;
    createdAt: string;
}

export interface CreateVehicleInput {
    licensePlate: string;
    vehicleType: VehicleType;
    vehicleName: string;
    brand: string;
    model: string;
    color: string;
    isPrimary: boolean;
}

export interface VehicleFormData {
    licensePlate: string;
    type: 'Small' | 'Medium' | 'Large';
    vehicleName: string;
    brand: string;
    model: string;
    color: string;
    isPrimary: boolean;
}

export interface VehicleItem {
    id: string;
    vehicleName: string;
    vehicleType: string;
    color: string;
    licensePlate: string;
    [key: string]: unknown;
}

export interface VehicleSelectionProps {
    vehicles: VehicleItem[];
    selectedVehicleId: string;
    onSelectVehicle: (id: string) => void;
    onAddNewVehicle: () => void;
}