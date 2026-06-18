import type {DateSlot} from "../time-slot/time-slot.dto.ts";
import type {Vehicle} from "@/features/products/domain/models/vehicle/vehicle.model.ts";
import type {WashPackage} from "@/features/products/domain/models/wash-package/wash-package.model.ts";

export interface CreateBookingInput {
    vehicleId: string;
    washPackageId: string;
    branchId: string;
    bookingDate: string;
    startTime: string;
}

/**
 * Interface chính cho dữ liệu Booking từ API.
 * 🌟 MỞ RỘNG CHO STAFF: Thêm các field cần thiết để staff vận hành (licensePlate, bookingCode, v.v.)
 */
export interface BookingResponseData {
    id: string;
    bookingCode: string;
    vehicleId: string;
    licensePlate?: string;
    vehicleName?: string;
    washPackageId: string;
    serviceName?: string;
    branchId: string;
    bookingDate: string;
    startTime: string;
    endTime?: string;
    washBayName?: string;
    totalAmount: number;
    // Mở rộng bộ trạng thái đầy đủ cho quy trình Staff
    status: 'Pending' | 'Confirmed' | 'CheckedIn' | 'Queued' | 'InProgress' | 'Completed' | 'CheckedOut' | 'Cancelled' | 'NoShow';
    qrData?: string | null;
    createdAt: string;
    cancelReason?: string;
    cancelledBy?: 'Staff' | 'Customer';
}

export interface BookingSummaryProps {
    selectedPackageId: string;
    selectedTime: string;
    currentVehicle?: Vehicle;
    currentPackage?: WashPackage;
    selectedDateSlot?: DateSlot;
    isBooking: boolean;
    onConfirmBooking: () => void;
}

export interface MyBookingRecord {
    id: string;
    branchId: string;
    bookingCode: string;
    washPackageName: string;
    durationMinutes: number;
    bookingDate: string;
    startTime: string;
    endTime: string;
    washBayName: string;
    vehiclePlate: string;
    vehicleName: string;
    totalPrice: number;
    status: string;
    qrData: string | null;
    createdAt: string;
}
