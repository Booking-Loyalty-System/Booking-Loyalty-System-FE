import React from 'react';
import { Car, Plus } from 'lucide-react';
import type { VehicleSelectionProps } from "@/features/products/domain/models/vehicle/vehicle.model.ts";

export const VehicleSelection: React.FC<VehicleSelectionProps> = ({
                                                                      vehicles, selectedVehicleId, onSelectVehicle, onAddNewVehicle
                                                                  }) => {
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#0f172a]">Select Vehicle</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => {
                    const isSelected = selectedVehicleId === vehicle.id;
                    return (
                        <div
                            key={vehicle.id}
                            onClick={() => onSelectVehicle(vehicle.id)}
                            className={`cursor-pointer bg-white border rounded-2xl p-5 transition-all duration-200 flex flex-col gap-4 relative group ${
                                isSelected ? 'border-[#1e6ffd] ring-2 ring-blue-50 shadow-sm' : 'border-[#e2e8f0] hover:border-[#cbd5e1]'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-50 text-[#1e6ffd]' : 'bg-slate-50 text-slate-400 group-hover:text-slate-600'}`}>
                                    <Car className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#0f172a]">{vehicle.vehicleName}</h4>
                                    <p className="text-xs text-[#64748b] font-medium">{vehicle.vehicleType}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 text-sm pt-3 border-t border-[#f1f5f9]">
                                <div>
                                    <span className="block text-xs text-[#94a3b8] font-medium">Color</span>
                                    <span className="font-semibold text-[#1e293b]">{vehicle.color}</span>
                                </div>
                                <div>
                                    <span className="block text-xs text-[#94a3b8] font-medium">Plate</span>
                                    <span className={`font-bold ${isSelected ? 'text-[#1e6ffd]' : 'text-blue-600'}`}>{vehicle.licensePlate}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div onClick={onAddNewVehicle} className="cursor-pointer border-2 border-dashed border-[#cbd5e1] hover:border-[#1e6ffd] bg-white hover:bg-blue-50/10 rounded-2xl p-5 transition-all duration-200 flex flex-col items-center justify-center min-h-[142px] group">
                    <div className="w-10 h-10 bg-slate-50 group-hover:bg-blue-50 rounded-full flex items-center justify-center text-slate-400 group-hover:text-[#1e6ffd] mb-2">
                        <Plus className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-500 group-hover:text-[#1e6ffd]">Add New Vehicle</span>
                </div>
            </div>
        </div>
    );
};