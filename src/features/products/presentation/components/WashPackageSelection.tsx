import React from "react";
import { useTranslation } from "react-i18next";
import {Droplet, ShieldAlert, Sparkles} from "lucide-react";
import type {WashPackageSelectionProps} from "@/features/products/domain/models/wash-package/wash-package.model.ts";

const getPackageUIVisual = (packageName: string | null) => {
    const name = packageName?.toLowerCase() || '';
    if (name.includes('premium') || name.includes('vip') || name.includes('cao cấp')) {
        return { icon: <Sparkles className="w-5 h-5 text-purple-500" />, colorClass: 'bg-purple-50' };
    }
    if (name.includes('ceramic') || name.includes('nano') || name.includes('ultimate')) {
        return { icon: <ShieldAlert className="w-5 h-5 text-orange-500" />, colorClass: 'bg-orange-50' };
    }
    return { icon: <Droplet className="w-5 h-5 text-blue-500" />, colorClass: 'bg-blue-50' };
};

export const WashPackageSelection: React.FC<WashPackageSelectionProps> = ({
                                                                              washPackages, selectedPackageId, onSelectPackage
                                                                          }) => {
    const { t } = useTranslation('customer');
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#0f172a]">{t('bookWash.package.selectTitle', { defaultValue: "Select Wash Package" })}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {washPackages.map((pkg) => {
                    const isSelected = selectedPackageId === pkg.id;
                    const visual = getPackageUIVisual(pkg.name);

                    return (
                        <div
                            key={pkg.id}
                            onClick={() => onSelectPackage(pkg.id)}
                            className={`cursor-pointer bg-white border rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between gap-6 relative ${
                                isSelected ? 'border-[#1e6ffd] ring-2 ring-blue-50 shadow-sm' : 'border-[#e2e8f0] hover:border-[#cbd5e1]'
                            }`}
                        >
                            <div className="space-y-4">
                                <div className={`w-10 h-10 ${visual.colorClass} rounded-xl flex items-center justify-center`}>
                                    {visual.icon}
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#0f172a] text-lg">{pkg.name}</h4>
                                    <p className="text-xs text-[#64748b] mt-1 font-medium line-clamp-2">{pkg.description}</p>
                                </div>
                                <div className="flex items-baseline gap-3 pt-2">
                                    <span className="text-3xl font-extrabold text-[#0f172a]">{pkg.price.toLocaleString('vi-VN')}đ</span>
                                    <span className="text-xs text-[#64748b] font-semibold">⏱ {pkg.durationMinutes} {t('bookWash.package.minutes', { defaultValue: "min" })}</span>
                                </div>
                                {pkg.features && pkg.features.length > 0 && (
                                    <ul className="space-y-2 pt-2 border-t border-[#f1f5f9]">
                                        {pkg.features.map((feature: string, i: number) => (
                                            <li key={i} className="text-xs font-medium text-[#475569] flex items-center gap-2">
                                                <span className="text-emerald-500 font-bold">✓</span> {feature}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {pkg.vehicleType && (
                                    <div className="text-[11px] font-semibold text-blue-600 bg-blue-50/60 inline-block px-2 py-0.5 rounded">
                                        🚗 {t('bookWash.package.forVehicle', { defaultValue: "For:" })} {pkg.vehicleType}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};