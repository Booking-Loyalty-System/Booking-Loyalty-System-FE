import type {DateSlot} from "../time-slot/time-slot.dto.ts";
import type {Vehicle} from "@/features/products/domain/models/vehicle/vehicle.model.ts";
import type {WashPackage} from "@/features/products/domain/models/wash-package/wash-package.model.ts";

import type { Voucher } from "../voucher/voucher.model.ts";

export interface CreateBookingInput {
    vehicleId: string;
    washPackageId: string;
    branchId: string;
    bookingDate: string;
    startTime: string;
    rewardRedemptionId?: string;
    promotionCode?: string;
}

export interface BookingResponseData {
    id: string;
    vehicleId: string;
    washPackageId: string;
    bookingDate: string;
    startTime: string;
    vehicleName: string
    licensePlate: string;
    serviceName: string;
    totalAmount: number;
    status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
    createdAt: string;
    voucherId?: string;
    discountAmount?: number;
    totalPrice?: number;
    bookingCode: string
}

export interface BookingSummaryProps {
    selectedPackageId: string;
    selectedTime: string;
    currentVehicle?: Vehicle;
    currentPackage?: WashPackage;
    selectedDateSlot?: DateSlot;
    isBooking: boolean;
    onConfirmBooking: () => void;
    selectedVoucher?: Voucher | null;
    appliedPromotion?: any | null; // using any temporarily to avoid import loops if needed, or import Promotion
    onApplyPromotion?: (code: string) => Promise<boolean | string>;
    onRemovePromotion?: () => void;
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