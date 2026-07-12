export type VehicleType = 'Small' | 'Medium' | 'Large';

// Dữ liệu thực tế API trả về
export interface VehicleResponse {
    id: string;
    customerId?: string; // Có thể không trả về từ BE
    licensePlate: string;
    type: VehicleType;   // SỬA Ở ĐÂY: Dùng "type" thay vì "vehicleType" để map với BE
    vehicleName: string;
    brand: string;
    model: string;
    color: string;
    isPrimary: boolean;
    createdAt: string;
}

// Model chung dùng trong toàn app
export interface Vehicle {
    id: string;
    customerId?: string;
    licensePlate: string;
    type: VehicleType; // SỬA Ở ĐÂY: Backend trả về "type"
    vehicleType?: VehicleType; // Giữ lại dự phòng nếu cần
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