import React from 'react';
import { Info } from 'lucide-react';

export const TierPriorityWindow: React.FC = () => {
    return (
        <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-2xl p-6 space-y-4">
            <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-[#1e6ffd] mt-0.5 shrink-0" />
                <div>
                    <h4 className="text-base font-bold text-[#1e3a8a]">Tier-Based Priority Booking Window</h4>
                    <p className="text-sm text-[#1e40af] mt-0.5">
                        As a <span className="font-bold text-[#1e6ffd]">Gold</span> member, you can book up to <span className="font-bold text-[#1e40af]">12 days</span> in advance.
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 text-center">
                    <span className="block text-xs text-[#94a3b8] font-medium">Member</span>
                    <span className="text-sm font-bold text-[#0f172a]">7 days</span>
                </div>
                <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 text-center">
                    <span className="block text-xs text-[#94a3b8] font-medium">Silver</span>
                    <span className="text-sm font-bold text-[#0f172a]">10 days</span>
                </div>
                <div className="bg-[#fef3c7] border-2 border-[#f59e0b] rounded-xl p-4 text-center shadow-sm">
                    <span className="block text-xs text-[#b45309] font-semibold">Gold</span>
                    <span className="text-sm font-bold text-[#b45309]">12 days</span>
                </div>
                <div className="bg-white border border-[#e2e8f0] rounded-xl p-4 text-center">
                    <span className="block text-xs text-[#94a3b8] font-medium">Platinum</span>
                    <span className="text-sm font-bold text-[#a855f7]">14 days</span>
                </div>
            </div>
        </div>
    );
};