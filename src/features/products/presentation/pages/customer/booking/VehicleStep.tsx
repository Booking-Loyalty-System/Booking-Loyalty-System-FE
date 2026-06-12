import React, { useState } from "react";
import { Car, Plus } from "lucide-react";
import { useVehicle } from "@/features/products/application/useVehicle";
import type {
  Vehicle,
  VehicleFormData,
} from "@/features/products/domain/models/vehicle/vehicle.model";
import { VehicleFormModal } from "../VehicleFormModal";
import {
  detectVehicleType,
  VEHICLE_NAMES_BY_BRAND,
} from "@/shared/constants/vehicle-data";
import { toast } from "sonner";

interface VehicleStepProps {
  onSelect: (vehicle: Vehicle) => void;
  selectedVehicleId?: string;
}

export const VehicleStep: React.FC<VehicleStepProps> = ({
  onSelect,
  selectedVehicleId,
}) => {
  const { vehicles, isLoading, error, isCreating, createVehicle } =
    useVehicle();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<VehicleFormData>({
    licensePlate: "",
    type: "Small",
    vehicleName: "",
    brand: "",
    model: "",
    color: "",
    isPrimary: false,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      };
      if (name === "brand") {
        updated.vehicleName = "";
        updated.type = "Small";
      }
      if (name === "vehicleName") {
        updated.type = detectVehicleType(updated.brand, value);
      }
      return updated;
    });
  };

  const handleAddNew = () => {
    setIsModalOpen(true);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Map the formData to match CreateVehicleInput exactly
      const payload = {
        licensePlate: formData.licensePlate,
        vehicleType: formData.type, // Map 'type' to 'vehicleType'
        vehicleName: formData.vehicleName,
        brand: formData.brand,
        model: formData.model,
        color: formData.color,
        isPrimary: formData.isPrimary,
      };

      const newVehicle = await createVehicle(payload);
      toast.success("New vehicle added and selected!");
      onSelect(newVehicle); // Tự động chọn xe vừa thêm
      setIsModalOpen(false);

      // Reset form
      setFormData({
        licensePlate: "",
        type: "Small",
        vehicleName: "",
        brand: "",
        model: "",
        color: "",
        isPrimary: false,
      });
    } catch (error) {
      console.error("Lỗi khi tạo xe nhanh:", error);
      toast.error("Failed to add vehicle");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Retrieving your vehicles...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600">
        <p>Failed to load vehicles. Please try again.</p>
      </div>
    );
  }

  const currentVehicleNames = VEHICLE_NAMES_BY_BRAND[formData.brand] || [];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Select Your Vehicle
        </h2>
        <p className="text-gray-500">Which car are we washing today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => {
          const isSelected = selectedVehicleId === vehicle.id;
          return (
            <div
              key={vehicle.id}
              onClick={() => onSelect(vehicle)}
              className={`cursor-pointer bg-white border-2 rounded-2xl p-5 transition-all duration-200 flex flex-col gap-4 relative group ${
                isSelected
                  ? "border-blue-600 ring-4 ring-blue-50 shadow-sm"
                  : "border-gray-100 hover:border-blue-200"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-blue-50 text-blue-600"
                      : "bg-gray-50 text-gray-400"
                  }`}
                >
                  <Car className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">
                    {vehicle.vehicleName}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-tighter">
                    {vehicle.type}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 text-sm pt-3 border-t border-gray-50">
                <div>
                  <span className="block text-[10px] text-gray-400 font-bold uppercase">
                    Color
                  </span>
                  <span className="font-bold text-gray-700">
                    {vehicle.color}
                  </span>
                </div>
                <div>
                  <span className="block text-[10px] text-gray-400 font-bold uppercase">
                    License Plate
                  </span>
                  <span className="font-black text-blue-600 tracking-wider">
                    {vehicle.licensePlate}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        <div
          onClick={handleAddNew}
          className="cursor-pointer border-2 border-dashed border-gray-200 hover:border-blue-400 bg-gray-50/30 hover:bg-blue-50/10 rounded-2xl p-5 transition-all duration-200 flex flex-col items-center justify-center min-h-[140px] group"
        >
          <div className="w-10 h-10 bg-white shadow-sm rounded-full flex items-center justify-center text-gray-400 group-hover:text-blue-600 mb-2 transition-colors">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-gray-400 group-hover:text-blue-600 transition-colors">
            Add Vehicle
          </span>
        </div>
      </div>

      <VehicleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        handleInputChange={handleInputChange}
        onSubmit={onSubmit}
        isCreating={isCreating}
        currentVehicleNames={currentVehicleNames}
      />
    </div>
  );
};
