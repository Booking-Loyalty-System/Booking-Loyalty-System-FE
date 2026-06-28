import React, { useState } from "react";
import { Plus } from "lucide-react";
import { useVehicle } from "../../application/useVehicle";
import {
  detectVehicleType,
  VEHICLE_NAMES_BY_BRAND,
} from "@/shared/constants/vehicle-data";
import type { VehicleFormData } from "@/features/products/domain/models/vehicle/vehicle.model.ts";
import { VehicleFormModal } from "../components/VehicleFormModal";
import { VehicleCard } from "../components/VehicleCard";
import { useTranslation } from "react-i18next";

export const MyVehicles: React.FC = () => {
  // 💡 Thêm 'vehicles' và 'isLoading' từ hook để render danh sách xe bên dưới
  const { vehicles, isLoading, isCreating, createVehicle, deleteVehicle } =
    useVehicle();
  const { t } = useTranslation('customer');
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

  const currentVehicleNames = VEHICLE_NAMES_BY_BRAND[formData.brand] || [];

  const handleDeleteVehicle = async (id: string) => {
    if (window.confirm(t("vehicles.deleteConfirm", { defaultValue: "Bạn có chắc chắn muốn xóa phương tiện này không?" }))) {
      try {
        await deleteVehicle(id);
      } catch (error) {
        console.error("Lỗi khi xóa xe:", error);
        alert(t("vehicles.deleteError", { defaultValue: "Xóa thất bại, vui lòng thử lại!" }));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-20 text-slate-500 font-medium">
        {t("vehicles.loading", { defaultValue: "Loading vehicles..." })}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-slate-900">{t("vehicles.title", { defaultValue: "My Vehicles" })}</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition active:scale-95"
        >
          <Plus className="w-4 h-4" /> {t("vehicles.addVehicle", { defaultValue: "Add Vehicle" })}
        </button>
      </div>

      {/* Grid danh sách xe đã lưu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles && vehicles.length > 0 ? (
          vehicles.map((car) => (
            <VehicleCard key={car.id} car={car} onDelete={handleDeleteVehicle} />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-400">
            <p className="text-lg font-semibold">{t('vehicles.noVehicles', { defaultValue: "Bạn chưa có xe nào." })}</p>
            <p className="text-sm mt-1">{t('vehicles.addFirst', { defaultValue: "Hãy thêm xe đầu tiên của bạn!" })}</p>
          </div>
        )}
      </div>

      {/* Modal Form Thêm Xe */}
      <VehicleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        handleInputChange={handleInputChange}
        onSubmit={async (e: React.FormEvent) => {
          e.preventDefault();

          // 💡 SỬA LỖI 400: Map dữ liệu UI sang đúng định dạng API cần (VehicleRequest)
          const inputData = {
            licensePlate: formData.licensePlate,
            vehicleType: formData.type, // Giữ nguyên chữ 'type' để khớp với CreateVehicleInput
            vehicleName: formData.vehicleName,
            brand: formData.brand,
            model: formData.model,
            color: formData.color,
            isPrimary: formData.isPrimary,
          };

          try {
            await createVehicle(inputData);

            // Reset form về trạng thái ban đầu sau khi thành công
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
          } catch (error) {
            console.error("Lỗi khi tạo xe:", error);
          }
        }}
        isCreating={isCreating}
        currentVehicleNames={currentVehicleNames}
      />
    </div>
  );
};
