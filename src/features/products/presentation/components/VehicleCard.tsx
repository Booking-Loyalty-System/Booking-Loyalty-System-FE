import React from 'react';
import { Car, Truck, Edit2, Trash2, History } from 'lucide-react';
import type {Vehicle} from "@/features/products/domain/models/vehicle/vehicle.model.ts";

interface VehicleCardProps {
    car: Vehicle;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ car }) => {
    const getIconBgClass = (type: string) => {
        switch (type) {
            case 'Small': return 'bg-blue-50 text-blue-600';
            case 'Medium': return 'bg-emerald-50 text-emerald-600';
            case 'Large': return 'bg-amber-50 text-amber-600';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    return (
        <div className={`bg-white rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between ${
            car.isPrimary ? 'border-blue-500 ring-4 ring-blue-500/10 shadow-md' : 'border-slate-100 shadow-sm hover:shadow-md'
        }`}>
            <div>
                <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getIconBgClass(car.type)}`}>
                        {car.type === 'Large' ? <Truck className="w-6 h-6" /> : <Car className="w-6 h-6" />}
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50"><Edit2 className="w-4 h-4" /></button>
                        <button className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50/50"><Trash2 className="w-4 h-4" /></button>
                    </div>
                </div>
                <div className="space-y-3">
                    <div>
                        <p className="text-xs font-semibold text-slate-400">Vehicle Type</p>
                        <p className="text-base font-extrabold text-slate-900">{car.type}</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-slate-400">Name / Model</p>
                        <p className="text-base font-extrabold text-slate-900">{car.brand} - {car.vehicleName}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><p className="text-xs font-semibold text-slate-400">Color</p><p className="text-sm font-bold text-slate-800">{car.color}</p></div>
                        <div><p className="text-xs font-semibold text-slate-400">Plate</p><p className="text-sm font-black text-blue-600">{car.licensePlate}</p></div>
                    </div>
                </div>
            </div>
            <button className="mt-6 w-full flex items-center justify-center gap-2 border-2 border-blue-600 text-blue-600 py-2 rounded-xl text-sm font-bold hover:bg-blue-50">
                <History className="w-4 h-4" /> View History
            </button>
        </div>
    );
};