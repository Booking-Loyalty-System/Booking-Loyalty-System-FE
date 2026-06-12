import React from 'react';
import { Sparkles, ShieldAlert, Droplet } from 'lucide-react';
import { useWashPackage } from '@/features/products/application/useWashPackage';
import type { WashPackage } from '@/features/products/domain/models/wash-package/wash-package.model';

interface PackageStepProps {
    onSelect: (pkg: WashPackage) => void;
    selectedPackageId?: string;
}

const getPackageUIVisual = (packageName: string | null) => {
    const name = packageName?.toLowerCase() || '';
    if (name.includes('premium') || name.includes('vip')) {
        return {
            icon: <Sparkles className="w-5 h-5 text-purple-500" />,
            colorClass: 'bg-purple-50',
            borderClass: 'hover:border-purple-200'
        };
    }
    if (name.includes('ceramic') || name.includes('nano')) {
        return {
            icon: <ShieldAlert className="w-5 h-5 text-orange-500" />,
            colorClass: 'bg-orange-50',
            borderClass: 'hover:border-orange-200'
        };
    }
    return {
        icon: <Droplet className="w-5 h-5 text-blue-500" />,
        colorClass: 'bg-blue-50',
        borderClass: 'hover:border-blue-200'
    };
};

export const PackageStep: React.FC<PackageStepProps> = ({ onSelect, selectedPackageId }) => {
    const { washPackages, isLoading, error } = useWashPackage();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading awesome packages...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 text-red-600">
                <p>Failed to load wash packages. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Choose Wash Package</h2>
                <p className="text-gray-500">Pick the treatment your car deserves</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {washPackages.map((pkg) => {
                    const isSelected = selectedPackageId === pkg.id;
                    const visual = getPackageUIVisual(pkg.name);

                    return (
                        <div
                            key={pkg.id}
                            onClick={() => onSelect(pkg)}
                            className={`cursor-pointer bg-white border-2 rounded-2xl p-6 transition-all duration-200 flex flex-col gap-5 relative ${
                                isSelected ? 'border-blue-600 ring-4 ring-blue-50 shadow-sm' : `border-gray-50 ${visual.borderClass}`
                            }`}
                        >
                            <div className={`w-12 h-12 ${visual.colorClass} rounded-2xl flex items-center justify-center`}>
                                {visual.icon}
                            </div>
                            
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold text-gray-900">{pkg.name}</h3>
                                <p className="text-sm text-gray-500 line-clamp-2">{pkg.description}</p>
                            </div>

                            <div className="flex items-baseline gap-2 pt-2 mt-auto">
                                <span className="text-3xl font-black text-gray-900">${pkg.price}</span>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    / {pkg.durationMinutes} mins
                                </span>
                            </div>

                            {pkg.features && (
                                <ul className="space-y-2 pt-4 border-t border-gray-50">
                                    {pkg.features.slice(0, 3).map((feature, i) => (
                                        <li key={i} className="text-xs font-semibold text-gray-600 flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
