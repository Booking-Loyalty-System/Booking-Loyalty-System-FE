import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Branch } from '@/features/products/domain/models/branch/branch.model.ts';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Setup icon default cho Leaflet (tránh lỗi đường dẫn icon)
delete (L.Icon.Default.prototype as unknown as Record<string, string>)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

interface LandingInteractiveMapProps {
    branches: Branch[];
    selectedBranchId: string | null;
    onSelectBranch: (id: string) => void;
}

const defaultCenter: [number, number] = [10.762622, 106.660172];

export const LandingInteractiveMap: React.FC<LandingInteractiveMapProps> = ({
    branches,
    selectedBranchId,
    onSelectBranch
}) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<L.Map | null>(null);
    const markersGroupRef = useRef<L.LayerGroup | null>(null);

    // 1. Khởi tạo bản đồ
    useEffect(() => {
        if (!mapContainerRef.current) return;

        // Tránh khởi tạo nhiều lần khi re-render ở React 18 (Strict Mode)
        if (mapRef.current) return;

        const map = L.map(mapContainerRef.current, {
            center: defaultCenter,
            zoom: 12,
            zoomControl: false, // Tắt nút zoom mặc định để tự CSS lại nếu cần
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        L.control.zoom({
            position: 'bottomright'
        }).addTo(map);

        const markersGroup = L.layerGroup().addTo(map);
        markersGroupRef.current = markersGroup;
        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, []);

    // 2. Render Markers khi danh sách branches thay đổi
    useEffect(() => {
        if (!mapRef.current || !markersGroupRef.current) return;

        const markersGroup = markersGroupRef.current;
        markersGroup.clearLayers();

        const bounds = L.latLngBounds([]);
        let hasValidBranches = false;

        branches.forEach(branch => {
            if (branch.latitude && branch.longitude) {
                const isSelected = selectedBranchId === branch.id;

                // Custom icon màu sắc dựa trên việc có đang được select hay không
                const customIcon = L.divIcon({
                    className: 'custom-leaflet-marker',
                    html: `
                        <div style="
                            position: relative;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                        ">
                            <div style="
                                width: 32px;
                                height: 32px;
                                background-color: ${isSelected ? '#2563eb' : '#64748b'};
                                border: 3px solid white;
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
                                transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
                                transition: all 0.2s ease-in-out;
                                cursor: pointer;
                            ">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                                    <circle cx="7" cy="17" r="2"/>
                                    <path d="M9 17h6"/>
                                    <circle cx="17" cy="17" r="2"/>
                                </svg>
                            </div>
                            <div style="
                                background: rgba(15, 23, 42, 0.9);
                                color: white;
                                padding: 2px 8px;
                                border-radius: 4px;
                                font-size: 10px;
                                font-weight: bold;
                                margin-top: 4px;
                                white-space: nowrap;
                                opacity: ${isSelected ? '1' : '0.9'};
                            ">
                                ${branch.branchName.replace("AutoWash ", "")}
                            </div>
                        </div>
                    `,
                    iconSize: [40, 50],
                    iconAnchor: [20, 25]
                });

                const marker = L.marker([branch.latitude, branch.longitude], { icon: customIcon });
                marker.bindPopup(`<b>${branch.branchName}</b><br/>${branch.address}`);

                // Khi click vào marker trên bản đồ
                marker.on('click', () => {
                    onSelectBranch(branch.id);
                    mapRef.current?.setView([branch.latitude, branch.longitude], 15, {
                        animate: true,
                        duration: 0.5
                    });
                });

                markersGroup.addLayer(marker);
                bounds.extend([branch.latitude, branch.longitude]);
                hasValidBranches = true;
            }
        });

        // Chỉ fitBounds lần đầu tiên khi vừa load danh sách chi nhánh (không zoom khi click)
        if (hasValidBranches && !selectedBranchId) {
            mapRef.current.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [branches, selectedBranchId, onSelectBranch]);

    return (
        <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200">
            <div ref={mapContainerRef} className="w-full h-full z-0" style={{ minHeight: '400px' }} />

            {/* Overlay City Label */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3.5 py-2 rounded-xl shadow-md border border-slate-100 z-[1000] pointer-events-none">
                <p className="text-xs font-black text-slate-800">Ho Chi Minh City</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                    {branches.length} Active Branches
                </p>
            </div>
        </div>
    );
};
