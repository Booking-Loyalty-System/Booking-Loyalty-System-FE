import React from "react";
import { Car, Truck, Edit2, Trash2, History } from "lucide-react";
import type { Vehicle } from "@/features/products/domain/models/vehicle/vehicle.model.ts";

interface VehicleCardProps {
  car: Vehicle;
  onDelete: (id: string) => void;
}

// 1. NHỚ THÊM onDelete VÀO ĐÂY BÊN CẠNH car
export const VehicleCard: React.FC<VehicleCardProps> = ({ car, onDelete }) => {
  const getIconBgClass = (type: string) => {
    switch (type) {
      case "Small":
        return "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "Medium":
        return "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
      case "Large":
        return "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400";
      default:
        return "bg-slate-50 dark:bg-slate-500/10 text-slate-600 dark:text-slate-400";
    }
  };

  return (
    <div
      className={`bg-white dark:bg-[#111] rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between ${
        car.isPrimary
          ? "border-blue-500 ring-4 ring-blue-500/10 dark:ring-blue-500/20 shadow-md"
          : "border-slate-100 dark:border-white/5 shadow-sm hover:shadow-md"
      }`}
    >
      <div>
        <div className="flex items-center justify-between border-b border-slate-50 dark:border-white/5 pb-4 mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${getIconBgClass(car.vehicleType)}`}
          >
            {car.vehicleType === "Large" ? (
              <Truck className="w-6 h-6" />
            ) : (
              <Car className="w-6 h-6" />
            )}
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <Edit2 className="w-4 h-4" />
            </button>

            {/* 2. GẮN SỰ KIỆN onClick VÀO NÚT THÙNG RÁC */}
            <button
              onClick={() => onDelete(car.id)}
              className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50/50 dark:hover:bg-rose-500/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Vehicle Type</p>
            <p className="text-base font-extrabold text-slate-900 dark:text-white">
              {car.vehicleType}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Name / Model</p>
            <p className="text-base font-extrabold text-slate-900 dark:text-white">
              {car.brand} - {car.vehicleName}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Color</p>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{car.color}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">Plate</p>
              <p className="text-sm font-black text-blue-600 dark:text-blue-400">
                {car.licensePlate}
              </p>
            </div>
          </div>
        </div>
      </div>
      <button className="mt-6 w-full flex items-center justify-center gap-2 border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400 py-2 rounded-xl text-sm font-bold hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors">
        <History className="w-4 h-4" /> View History
      </button>
    </div>
  );
};
