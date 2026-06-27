import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Clock, Phone, Map, Loader2, Navigation, CheckCircle2 } from 'lucide-react';
import { MapModal } from './MapModal';
import { useBranch } from '../../application/useBranch';
import type { NearestBranchesProps } from "@/features/products/domain/models/branch/branch.model.ts";

export const NearestBranches: React.FC<NearestBranchesProps> = ({ selectedBranchId, onSelectBranch }) => {
    const { t } = useTranslation('customer');
    const [isMapOpen, setIsMapOpen] = useState(false);
    const [userLocation, setUserLocation] = useState<{ lat: number, lon: number } | null>(null);
    const [modalActiveBranchId, setModalActiveBranchId] = useState<string>('');
    const { branches, isLoading, error } = useBranch();

    const handleOpenMap = (branchId?: string) => {
        setModalActiveBranchId(branchId || '');
        setIsMapOpen(true);
    };

    const calculateDistance = (
        lat1: number, lon1: number,
        lat2: number, lon2: number
    ): number => {
        const R = 6371;
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
            },
            (err) => console.log("Unable to retrieve user location:", err)
        );
    }, []);

    const sortedBranches = useMemo(() => {
        if (!userLocation) return branches;

        return [...branches].sort((a, b) => {
            const distA = calculateDistance(userLocation.lat, userLocation.lon, a.latitude, a.longitude);
            const distB = calculateDistance(userLocation.lat, userLocation.lon, b.latitude, b.longitude);
            return distA - distB;
        });
    }, [branches, userLocation]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="w-9 h-9 text-[#1e6ffd] animate-spin" />
                <p className="text-slate-500 text-sm font-medium">{t('bookWash.branch.findingNearest', { defaultValue: "Finding the nearest branches..." })}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center p-8 bg-red-50 border border-red-100 rounded-2xl max-w-4xl mx-auto my-6 shadow-sm">
                <p className="text-red-600 font-bold text-lg">{t('bookWash.branch.connectionFailed', { defaultValue: "Data Connection Failed" })}</p>
                <p className="text-red-400 text-sm mt-1">{t('bookWash.branch.connectionFailedDesc', { defaultValue: "Please check your network connection or backend system." })}</p>
            </div>
        );
    }

    if (branches.length === 0) {
        return (
            <div className="text-center p-12 bg-slate-50 border border-slate-200 rounded-2xl max-w-4xl mx-auto my-6">
                <p className="text-slate-500 font-medium text-lg">{t('bookWash.branch.noActiveBranches', { defaultValue: "No active branches found at the moment." })}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 w-full max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">{t('bookWash.branch.selectTitle', { defaultValue: "Select Branch" })}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{t('bookWash.branch.sortedByProximity', { defaultValue: "Automatically sorted based on your proximity" })}</p>
                </div>
                <button
                    type="button"
                    onClick={() => handleOpenMap()}
                    className="flex items-center justify-center gap-2 bg-[#1e6ffd] hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold shadow-md shadow-blue-500/10 active:scale-95 transition-all text-xs self-start sm:self-center"
                >
                    <Map className="w-3.5 h-3.5" /> {t('bookWash.branch.overviewMap', { defaultValue: "Overview Map" })}
                </button>
            </div>

            {/* Grid Cards Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedBranches.map((branch) => {
                    const distance = userLocation
                        ? calculateDistance(userLocation.lat, userLocation.lon, branch.latitude, branch.longitude).toFixed(1)
                        : null;

                    const isSelected = selectedBranchId === branch.id;

                    return (
                        <div
                            key={branch.id}
                            onClick={() => onSelectBranch(branch.id)}
                            className={`group relative bg-white border rounded-2xl p-5 cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                                isSelected
                                    ? 'border-blue-600 ring-2 ring-blue-500/10 bg-blue-50/5 shadow-md shadow-blue-500/5'
                                    : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
                            }`}
                        >
                            <div>
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                                            {branch.branchName}
                                        </h3>
                                        {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                                    </div>
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                        branch.status === 'Active'
                                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                            : 'bg-slate-100 text-slate-500'
                                    }`}>
                                        {branch.status === 'Active' ? t('bookWash.branch.statusOpen', { defaultValue: 'Open' }) : t('bookWash.branch.statusClosed', { defaultValue: 'Closed' })}
                                    </span>
                                </div>

                                {/* Distance Badge */}
                                {distance && (
                                    <div className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-blue-50 rounded-md text-[11px] font-bold text-blue-600 border border-blue-100">
                                        <Navigation className="w-2.5 h-2.5 fill-current" />
                                        {t('bookWash.branch.kmAway', { n: distance, defaultValue: `${distance} km away` })}
                                    </div>
                                )}

                                {/* Info List */}
                                <div className="space-y-2.5 mt-4 border-t border-slate-50 pt-3">
                                    <div className="flex items-start gap-2.5 text-xs text-slate-500">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                        <span className="line-clamp-2">{branch.address}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-xs text-slate-500">
                                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span>{branch.operatingHours || '08:00 AM - 10:00 PM'}</span>
                                    </div>
                                    <div className="flex items-center gap-2.5 text-xs text-slate-500">
                                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span className="font-semibold text-slate-600">{branch.hotline}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleOpenMap(branch.id);
                                }}
                                className={`mt-4 w-full py-2 text-xs font-bold rounded-xl border transition-all duration-200 ${
                                    isSelected
                                        ? 'bg-blue-600 text-white border-transparent hover:bg-blue-700'
                                        : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-slate-100'
                                }`}
                            >
                                {t('bookWash.branch.viewOnMap', { defaultValue: "View on Map" })}
                            </button>
                        </div>
                    );
                })}
            </div>

            <MapModal
                isOpen={isMapOpen}
                onClose={() => setIsMapOpen(false)}
                branches={branches}
                selectedBranchId={modalActiveBranchId}
            />
        </div>
    );
};