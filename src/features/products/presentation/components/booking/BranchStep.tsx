import React from 'react';
import { MapPin, Clock, Phone, ChevronRight } from 'lucide-react';
import { useBranch } from '@/features/products/application/useBranch';
import type { Branch } from '@/features/products/domain/models/branch/branch.model';

interface BranchStepProps {
    onSelect: (branch: Branch) => void;
    selectedBranchId?: string;
}

export const BranchStep: React.FC<BranchStepProps> = ({ onSelect, selectedBranchId }) => {
    const { useGetAllBranches } = useBranch();
    const { data: branchesData, isLoading, isError } = useGetAllBranches();

    const branches = branchesData || [];

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Finding nearest branches...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center py-20 text-red-600">
                <p>Failed to load branches. Please try again.</p>
            </div>
        );
    }

    if (branches.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900">No Branches Available</h3>
                <p className="text-gray-500 max-w-xs mx-auto">We couldn't find any service branches in your area at the moment.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Select Branch</h2>
                <p className="text-gray-500">Choose the most convenient location for you</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {branches.map((branch) => {
                    const isSelected = selectedBranchId === branch.id;

                    return (
                        <div
                            key={branch.id}
                            onClick={() => onSelect(branch)}
                            className={`cursor-pointer bg-white border-2 rounded-2xl p-6 transition-all duration-200 flex items-start gap-5 relative group ${
                                isSelected ? 'border-blue-600 ring-4 ring-blue-50 shadow-sm' : 'border-gray-50 hover:border-blue-300'
                            }`}
                        >
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <MapPin className="w-8 h-8" />
                            </div>
                            
                            <div className="flex-1 space-y-3">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{branch.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">{branch.address}</p>
                                </div>

                                <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-50">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        {branch.operatingHours}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        {branch.phone}
                                    </div>
                                </div>
                            </div>

                            <div className={`absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${
                                isSelected ? 'bg-blue-600 text-white' : 'bg-gray-50 text-gray-300 group-hover:bg-blue-50 group-hover:text-blue-600'
                            }`}>
                                <ChevronRight className="w-5 h-5" />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
