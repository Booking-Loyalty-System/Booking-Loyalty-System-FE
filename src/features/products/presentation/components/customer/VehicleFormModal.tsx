import React from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2, X } from 'lucide-react';
import { CAR_BRANDS } from "@/shared/constants/vehicle-data.ts";
import type {VehicleFormData} from "@/features/products/domain/models/vehicle/vehicle.model.ts";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    formData: VehicleFormData;
    setFormData: React.Dispatch<React.SetStateAction<VehicleFormData>>;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    isCreating: boolean;
    currentVehicleNames: string[];
}

export const VehicleFormModal: React.FC<Props> = ({
                                                      isOpen, onClose, formData, handleInputChange, onSubmit, isCreating, currentVehicleNames
                                                  }) => {
    const { t } = useTranslation('customer');
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#13151A] rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]">

                <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
                    <div>
                        <h2 className="text-xl font-bold text-blue-950 dark:text-white">{t('bookWash.vehicleModal.title', { defaultValue: "Add New Vehicle" })}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 transition">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
                    {/* License Plate */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">{t('bookWash.vehicleModal.licensePlate', { defaultValue: "License Plate *" })}</label>
                        <input type="text" name="licensePlate" value={formData.licensePlate} onChange={handleInputChange} required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-black/20 font-bold text-blue-950 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 transition" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">{t('bookWash.vehicleModal.brand', { defaultValue: "Brand *" })}</label>
                            <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} list="brand-suggestions" required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-black/20 font-semibold text-blue-950 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 transition" />
                            <datalist id="brand-suggestions">
                                {CAR_BRANDS.map((b) => <option key={b} value={b} />)}
                            </datalist>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">{t('bookWash.vehicleModal.name', { defaultValue: "Vehicle Name *" })}</label>
                            <input type="text" name="vehicleName" value={formData.vehicleName} onChange={handleInputChange} list="name-suggestions" required className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-black/20 font-semibold text-blue-950 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 transition" />
                            <datalist id="name-suggestions">
                                {currentVehicleNames.map((name) => <option key={name} value={name} />)}
                            </datalist>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">{t('bookWash.vehicleModal.model', { defaultValue: "Model" })}</label>
                            <input type="text" name="model" value={formData.model} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-black/20 font-semibold text-blue-950 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">{t('bookWash.vehicleModal.color', { defaultValue: "Color" })}</label>
                            <input type="text" name="color" value={formData.color} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-black/20 font-semibold text-blue-950 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1.5">{t('bookWash.vehicleModal.type', { defaultValue: "Vehicle Type *" })}</label>
                        <select name="type" value={formData.type} onChange={handleInputChange} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 dark:bg-[#13151A] font-bold text-blue-950 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition">
                            <option value="Small">{t('bookWash.vehicleModal.optionSmall', { defaultValue: "Small (Sedan)" })}</option>
                            <option value="Medium">{t('bookWash.vehicleModal.optionMedium', { defaultValue: "Medium (SUV / CUV)" })}</option>
                            <option value="Large">{t('bookWash.vehicleModal.optionLarge', { defaultValue: "Large (Pickup)" })}</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                        <input type="checkbox" id="isPrimary" name="isPrimary" checked={formData.isPrimary} onChange={handleInputChange} className="w-4 h-4 border-slate-300 dark:border-white/10 rounded dark:bg-black/20" />
                        <label htmlFor="isPrimary" className="text-sm font-bold text-slate-600 dark:text-slate-300">{t('bookWash.vehicleModal.setAsPrimary', { defaultValue: "Set as primary vehicle" })}</label>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/10 mt-6">
                        <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition">{t('bookWash.vehicleModal.cancel', { defaultValue: "Cancel" })}</button>
                        <button type="submit" disabled={isCreating} className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition shadow-sm active:scale-95 disabled:opacity-50">
                            {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
                            <span>{isCreating ? t('bookWash.vehicleModal.saving', { defaultValue: 'Saving...' }) : t('bookWash.vehicleModal.save', { defaultValue: 'Save Vehicle' })}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};