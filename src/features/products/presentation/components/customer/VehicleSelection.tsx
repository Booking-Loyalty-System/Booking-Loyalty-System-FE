import React from 'react';
import { useTranslation } from 'react-i18next';
import { Car, Plus } from 'lucide-react';
import type { VehicleSelectionProps } from "@/features/products/domain/models/vehicle/vehicle.model.ts";

export const VehicleSelection: React.FC<VehicleSelectionProps> = ({
    vehicles, selectedVehicleId, onSelectVehicle, onAddNewVehicle
}) => {
    const { t } = useTranslation('customer');
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#0f172a] dark:text-white">{t('bookWash.vehicle.selectTitle', { defaultValue: "Select Vehicle" })}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => {
                    const isSelected = selectedVehicleId === vehicle.id;
                    return (
                        <div
                            key={vehicle.id}
                            onClick={() => onSelectVehicle(vehicle.id)}
                            className={`cursor-pointer bg-white dark:bg-[#13151A] border rounded-2xl p-5 transition-all duration-200 flex flex-col gap-4 relative group ${isSelected ? 'border-[#1e6ffd] dark:border-blue-500 ring-2 ring-blue-50 dark:ring-blue-900/30 shadow-sm' : 'border-[#e2e8f0] dark:border-white/5 hover:border-[#cbd5e1] dark:hover:border-white/20'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-50 dark:bg-blue-900/30 text-[#1e6ffd] dark:text-blue-400' : 'bg-slate-50 dark:bg-white/5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}>
                                    <Car className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#0f172a] dark:text-white">{vehicle.vehicleName}</h4>
                                    <p className="text-xs text-[#64748b] dark:text-slate-400 font-medium">{vehicle.vehicleType}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 text-sm pt-3 border-t border-[#f1f5f9] dark:border-white/5">
                                <div>
                                    <span className="block text-xs text-[#94a3b8] dark:text-slate-500 font-medium">{t('bookWash.vehicle.color', { defaultValue: "Color" })}</span>
                                    <span className="font-semibold text-[#1e293b] dark:text-slate-200">{vehicle.color}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-[#94a3b8] dark:text-slate-500 font-medium">{t('bookWash.vehicle.plate', { defaultValue: "Plate" })}</span>
                                    <span className={`font-bold ${isSelected ? 'text-[#1e6ffd] dark:text-blue-400' : 'text-blue-600 dark:text-blue-500'}`}>{vehicle.licensePlate}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div onClick={onAddNewVehicle} className="cursor-pointer border-2 border-dashed border-[#cbd5e1] dark:border-white/10 hover:border-[#1e6ffd] dark:hover:border-blue-500 bg-white dark:bg-[#13151A] hover:bg-blue-50/10 dark:hover:bg-blue-900/10 rounded-2xl p-5 transition-all duration-200 flex flex-col items-center justify-center min-h-[142px] group">
                    <div className="w-10 h-10 bg-slate-50 dark:bg-white/5 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/20 rounded-full flex items-center justify-center text-slate-400 group-hover:text-[#1e6ffd] dark:group-hover:text-blue-400 mb-2">
                        <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400 group-hover:text-[#1e6ffd] dark:group-hover:text-blue-400">{t('bookWash.vehicle.addNew', { defaultValue: "Add New Vehicle" })}</span>
                </div>
            </div>
        </div>
    );
};