import type {DateSlot} from "@/features/products/domain/models/time-slot/time-slot.model.ts";
import type {Vehicle} from "@/features/products/domain/models/vehicle/vehicle.model.ts";
import type {WashPackage} from "@/features/products/domain/models/wash-package/wash-package.model.ts";

export interface CreateBookingInput {
    vehicleId: string;
    washPackageId: string;
    branchId: string;
    bookingDate: string;
    startTime: string;
}

export interface BookingResponseData {
    id: string;
    vehicleId: string;
    washPackageId: string;
    bookingDate: string;
    startTime: string;
    status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
    createdAt: string;
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