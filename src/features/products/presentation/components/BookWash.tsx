import React, { useState } from 'react';
import { useVehicle } from "@/features/products/application/useVehicle.ts";
import { useWashPackage } from "@/features/products/application/useWashPackage.ts";
import { useBooking } from "@/features/products/application/useBooking.ts";
import { VehicleFormModal } from "@/features/products/presentation/components/VehicleFormModal.tsx";
import type {Vehicle, VehicleFormData, VehicleItem} from "@/features/products/domain/models/vehicle/vehicle.model.ts";
import { detectVehicleType, VEHICLE_NAMES_BY_BRAND } from '@/shared/constants/vehicle-data';

// Import UI Components
import { TierPriorityWindow } from "@/features/products/presentation/components/TierPriorityWindow.tsx";
import { VehicleSelection } from "@/features/products/presentation/components/VehicleSelection.tsx";
import { NearestBranches } from './NearestBranches'; // <-- IMPORT COMPONENT MAP BẠN VỪA LÀM
import { WashPackageSelection } from "@/features/products/presentation/components/WashPackageSelection.tsx";
import { DateTimeSelection } from "@/features/products/presentation/components/DateTimeSelection.tsx";
import { BookingSummary } from "@/features/products/presentation/components/BookingSummary.tsx";

// Import Utils & Constants
import { TIME_SLOTS, generateUpcomingDates, convertTo24HourFormat } from '@/shared/constants/booking-data.ts';
import {toast} from "sonner";
import type {WashPackage} from "@/features/products/domain/models/wash-package/wash-package.model.ts";

export const BookWash: React.FC = () => {
    // 1. API & Data Hooks
    const { vehicles, isLoading: isLoadingVehicles, createVehicle } = useVehicle();
    const { washPackages, isLoading: isLoadingPackages } = useWashPackage();
    const { createBooking, isBooking } = useBooking();

    const dynamicDateSlots = generateUpcomingDates(7);

    // 2. Local States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [vehicleFormData, setVehicleFormData] = useState<VehicleFormData>({
        licensePlate: '', brand: '', vehicleName: '', model: '', color: '', type: 'Small', isPrimary: false
    });

    // 3. Selection States
    const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
    const [selectedBranchId, setSelectedBranchId] = useState<string>(''); // <-- STATE LƯU CHI NHÁNH ĐƯỢC CHỌN
    const [selectedPackageId, setSelectedPackageId] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<string>(dynamicDateSlots[0].apiDate);
    const [selectedTime, setSelectedTime] = useState<string>('');

    // Derived states cho Summary
    const selectedDateSlot = dynamicDateSlots.find(d => d.apiDate === selectedDate);
    const currentVehicle = vehicles.find((v: Vehicle) => v.id === selectedVehicleId);
    const currentPackage = washPackages.find((p: WashPackage) => p.id === selectedPackageId);

    // 4. Handlers
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setVehicleFormData(prev => {
            const updated = { ...prev, [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value };
            if (name === 'brand') { updated.vehicleName = ''; updated.type = 'Small'; }
            if (name === 'vehicleName') { updated.type = detectVehicleType(updated.brand, value); }
            return updated;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            await createVehicle({ ...vehicleFormData, vehicleType: vehicleFormData.type });
            setVehicleFormData({ licensePlate: '', type: 'Small', vehicleName: '', brand: '', model: '', color: '', isPrimary: false });
            setIsModalOpen(false);
        } catch (error) {
            console.error("Lỗi khi tạo xe:", error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleConfirmBooking = async () => {

        if (!selectedVehicleId) return toast.error("Vui lòng chọn xe của bạn!");
        if (!selectedBranchId) return toast.error("Vui lòng chọn chi nhánh!");
        if (!selectedPackageId) return toast.error("Vui lòng chọn gói rửa xe!");
        if (!selectedTime) return toast.error("Vui lòng chọn khung giờ!");

        setIsCreating(true);
        try {
            const apiStartTime = convertTo24HourFormat(selectedTime);
            await createBooking({
                vehicleId: selectedVehicleId,
                branchId: selectedBranchId, // <-- CHUYỀN THÊM BRANCH ID LÊN BACKEND
                washPackageId: selectedPackageId,
                bookingDate: selectedDate,
                startTime: apiStartTime,
            });
            alert("Đặt lịch thành công!");
        } catch (err) {
            console.error("Booking failed:", err);
            alert("Đã xảy ra lỗi, vui lòng thử lại.");
        }
    };

    // 5. Render
    if (isLoadingVehicles || isLoadingPackages) {
        return <div className="p-10 text-center font-medium">Loading billing details and data...</div>;
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start max-w-7xl mx-auto pb-12">
            {/* CỘT TRÁI */}
            <div className="flex-1 space-y-10 w-full">
                <TierPriorityWindow />

                {/* 1. Chọn Xe */}
                <VehicleSelection
                    vehicles={vehicles as unknown as VehicleItem[]}
                    selectedVehicleId={selectedVehicleId}
                    onSelectVehicle={setSelectedVehicleId}
                    onAddNewVehicle={() => setIsModalOpen(true)}
                />

                {/* Form Modal thêm xe */}
                <VehicleFormModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    formData={vehicleFormData}
                    setFormData={setVehicleFormData}
                    handleInputChange={handleInputChange}
                    onSubmit={handleSubmit}
                    isCreating={isCreating}
                    currentVehicleNames={VEHICLE_NAMES_BY_BRAND[vehicleFormData.brand] || []}
                />

                {/* 2. Bản đồ & Chọn Chi nhánh gần nhất (Vị trí mới theo yêu cầu) */}
                <NearestBranches
                    selectedBranchId={selectedBranchId}
                    onSelectBranch={setSelectedBranchId}
                />

                {/* 3. Chọn Gói Rửa */}
                <WashPackageSelection
                    washPackages={washPackages}
                    selectedPackageId={selectedPackageId}
                    onSelectPackage={setSelectedPackageId}
                />

                {/* 4. Chọn Thời Gian */}
                <DateTimeSelection
                    dynamicDateSlots={dynamicDateSlots}
                    timeSlots={TIME_SLOTS}
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    selectedTime={selectedTime}
                    onSelectTime={setSelectedTime}
                />
            </div>

            {/* CỘT PHẢI - Bảng tóm tắt hóa đơn */}
            <BookingSummary
                selectedPackageId={selectedPackageId}
                selectedTime={selectedTime}
                currentVehicle={currentVehicle}
                currentPackage={currentPackage}
                selectedDateSlot={selectedDateSlot}
                isBooking={isBooking}
                onConfirmBooking={handleConfirmBooking}
            />
        </div>
    );
};