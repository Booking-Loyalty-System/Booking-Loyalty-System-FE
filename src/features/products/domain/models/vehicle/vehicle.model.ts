export type VehicleType = 'Small' | 'Medium' | 'Large';

// ------------------------------------------
// 📥 LAYER RESPONSE (Dữ liệu API trả về)
// ------------------------------------------
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

// ------------------------------------------
// 📤 LAYER REQUEST (Dữ liệu gửi lên API khi POST/PUT)
// ------------------------------------------
export interface VehicleRequest {
    licensePlate: string;
    vehicleType: VehicleType; // Khớp 100% với Swagger cần nhận
    vehicleName: string;
    brand: string;
    model: string;
    color: string;
    isPrimary: boolean;
}

// ------------------------------------------
// 🌟 LAYER DOMAIN / UI STATE (Dùng cho nội bộ Frontend xài)
// ------------------------------------------
// Giúp code React của ông luôn được dùng chữ 'type' ngắn gọn, sạch sẽ
export interface Vehicle {
    id: string;
    customerId: string;
    licensePlate: string;
    type: VehicleType;
    vehicleName: string;
    brand: string;
    model: string;
    color: string;
    isPrimary: boolean;
    createdAt: string;
}

export interface CreateVehicleInput {
    licensePlate: string;
    type: VehicleType;
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