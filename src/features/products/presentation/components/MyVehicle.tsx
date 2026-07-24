import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useVehicle } from "../../application/useVehicle";
import {
  detectVehicleType,
  VEHICLE_NAMES_BY_BRAND,
} from "@/shared/constants/vehicle-data";
import type {
  VehicleFormData,
  Vehicle,
} from "@/features/products/domain/models/vehicle/vehicle.model.ts";
import { VehicleFormModal } from "../components/VehicleFormModal";
import { VehicleCard } from "../components/VehicleCard";
import { VehicleHistoryCard } from "../components/VehicleHistoryCard";
import { useTranslation } from "react-i18next";

export const MyVehicles: React.FC = () => {
  const {
    vehicles,
    isLoading,
    isCreating,
    isUpdating,
    createVehicle,
    updateVehicle,
    deleteVehicle,
  } = useVehicle();
  const { t } = useTranslation("customer");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // State lưu xe nào đang được mở lịch sử
  const [activeHistory, setActiveHistory] = useState<{
    plate: string;
    name: string;
  } | null>(null);

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
        updated.type = detectVehicleType(updated.brand, value) as any;
      }
      return updated;
    });
  };

  const currentVehicleNames = VEHICLE_NAMES_BY_BRAND[formData.brand] || [];

  const handleEditVehicle = (car: Vehicle) => {
    setEditingId(car.id);
    setFormData({
      licensePlate: car.licensePlate,
      type: (car.type || car.vehicleType || "Small") as
        | "Small"
        | "Medium"
        | "Large",
      vehicleName: car.vehicleName,
      brand: car.brand,
      model: car.model,
      color: car.color,
      isPrimary: car.isPrimary,
    });
    setIsModalOpen(true);
  };

  const handleDeleteVehicle = async (id: string) => {
    if (
      window.confirm(
        t("vehicles.deleteConfirm", {
          defaultValue: "Bạn có chắc chắn muốn xóa phương tiện này không?",
        }),
      )
    ) {
      try {
        await deleteVehicle(id);
        if (activeHistory) setActiveHistory(null);
      } catch (error) {
        console.error("Lỗi khi xóa xe:", error);
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      licensePlate: "",
      type: "Small",
      vehicleName: "",
      brand: "",
      model: "",
      color: "",
      isPrimary: false,
    });
    setIsModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-20 text-slate-500 font-medium">
        Loading vehicles...
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-500 dark:text-white tracking-tight">
          {t("vehicles.title", { defaultValue: "My Vehicles" })}
        </h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition active:scale-95"
        >
          <Plus className="w-4 h-4" />{" "}
          {t("vehicles.addVehicle", { defaultValue: "Add Vehicle" })}
        </button>
      </div>

      {/* Grid Layout gốc, không bị co ép cột */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles && vehicles.length > 0 ? (
          vehicles.map((car) => (
            <VehicleCard
              key={car.id}
              car={car}
              onDelete={handleDeleteVehicle}
              onEdit={() => handleEditVehicle(car)}
              onViewHistory={(plate, name) => setActiveHistory({ plate, name })}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-400">
            <p className="text-lg font-semibold">
              {t("vehicles.noVehicles", {
                defaultValue: "Bạn chưa có xe nào.",
              })}
            </p>
          </div>
        )}
      </div>

      {/* 💡 Modal Lịch Sử (Render độc lập ở ngoài) */}
      {activeHistory && (
        <VehicleHistoryCard
          licensePlate={activeHistory.plate}
          vehicleName={activeHistory.name}
          onClose={() => setActiveHistory(null)}
        />
      )}

      {/* Modal Form Thêm / Cập Nhật Xe */}
      <VehicleFormModal
        isOpen={isModalOpen}
        onClose={resetForm}
        formData={formData}
        setFormData={setFormData}
        handleInputChange={handleInputChange}
        onSubmit={async (e: React.FormEvent) => {
          e.preventDefault();
          const inputData = {
            licensePlate: formData.licensePlate,
            vehicleType: formData.type,
            vehicleName: formData.vehicleName,
            brand: formData.brand,
            model: formData.model,
            color: formData.color,
            isPrimary: formData.isPrimary,
          };
          try {
            if (editingId)
              await updateVehicle({ id: editingId, data: inputData });
            else await createVehicle(inputData);
            resetForm();
          } catch (error) {
            console.error("Lỗi khi lưu xe:", error);
          }
        }}
        isCreating={isCreating || isUpdating}
        currentVehicleNames={currentVehicleNames}
      />
    </div>
  );
};
