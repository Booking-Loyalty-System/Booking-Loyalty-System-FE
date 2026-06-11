import React, { useEffect, useState, useRef } from 'react';
import { X, Navigation } from 'lucide-react';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

import type { MapModalProps } from '@/features/products/domain/models/branch/branch.model.ts';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as unknown as Record<string, string>)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
});

interface RoutingFoundEvent {
    routes: Array<{
        summary: {
            totalDistance: number;
            totalTime: number;
        };
    }>;
}

interface ExtendedRoutingControl extends L.Control {
    on: (type: string, fn: (e: unknown) => void) => this;
}

const defaultCenter: [number, number] = [10.762622, 106.660172];

export const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose, branches, selectedBranchId }) => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<L.Map | null>(null);
    const markersGroupRef = useRef<L.LayerGroup | null>(null);

    // ĐÃ FIX: Cập nhật kiểu dữ liệu cho Ref chứa bộ định tuyến đường đi
    const routingControlRef = useRef<ExtendedRoutingControl | null>(null);

    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [activeMarker, setActiveMarker] = useState<string | null>(null);
    const [routeInfo, setRouteInfo] = useState<{ distance: string; time: number; branchName: string } | null>(null);

    // 1. Đồng bộ selectedBranchId vào state
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                setActiveMarker(selectedBranchId || null);
            }, 0);
            return () => clearTimeout(timer);
        } else {
            const timer = setTimeout(() => {
                setActiveMarker(null);
                setRouteInfo(null);
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isOpen, selectedBranchId]);

    // 2. Lấy vị trí người dùng qua GPS trình duyệt
    useEffect(() => {
        if (isOpen && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => console.error("Lỗi lấy vị trí GPS:", error),
                { enableHighAccuracy: true }
            );
        }
    }, [isOpen]);

    // 3. Khởi tạo Bản đồ
    useEffect(() => {
        if (!isOpen || !mapContainerRef.current) return;

        const map = L.map(mapContainerRef.current).setView(defaultCenter, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        const markersGroup = L.layerGroup().addTo(map);

        mapRef.current = map;
        markersGroupRef.current = markersGroup;

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                markersGroupRef.current = null;
                routingControlRef.current = null;
            }
        };
    }, [isOpen]);

    // 4. Vẽ Marker và tính toán đường đi
    useEffect(() => {
        if (!isOpen || !mapRef.current || !markersGroupRef.current) return;

        const map = mapRef.current;
        const markersGroup = markersGroupRef.current;

        markersGroup.clearLayers();
        if (routingControlRef.current) {
            map.removeControl(routingControlRef.current);
            routingControlRef.current = null;
        }

        const bounds = L.latLngBounds([]);

        if (userLocation) {
            const userLatLng = L.latLng(userLocation.lat, userLocation.lng);
            bounds.extend(userLatLng);

            L.circleMarker(userLatLng, {
                radius: 8,
                fillColor: "#1e6ffd",
                fillOpacity: 1,
                color: "#ffffff",
                weight: 2
            }).addTo(markersGroup).bindPopup("<b class='text-blue-600'>Vị trí của bạn</b>");
        }

        branches.forEach(branch => {
            const branchLatLng = L.latLng(branch.latitude, branch.longitude);
            bounds.extend(branchLatLng);

            const marker = L.marker(branchLatLng).addTo(markersGroup);

            const popupContent = `
                <div class="p-1">
                    <h4 class="font-bold text-sm text-[#1e3a8a]">${branch.branchName}</h4>
                    <p class="text-xs text-slate-500 mt-0.5">${branch.address}</p>
                    <p class="text-xs font-semibold text-[#1e6ffd] mt-1">📞 ${branch.hotline}</p>
                </div>
            `;
            marker.bindPopup(popupContent);

            marker.on('click', () => {
                setActiveMarker(branch.id);
            });

            if (activeMarker === branch.id) {
                setTimeout(() => {
                    if (mapRef.current) marker.openPopup();
                }, 100);
            }
        });

        if (activeMarker && userLocation) {
            const targetBranch = branches.find(b => b.id === activeMarker);
            if (targetBranch) {
                // ĐÃ FIX: Ép kiểu đối tượng trả về thành ExtendedRoutingControl để hỗ trợ phương thức .on() hợp lệ
                const routingControl = (L as unknown as Record<string, Record<string, (options: unknown) => ExtendedRoutingControl>>).Routing.control({
                    waypoints: [
                        L.latLng(userLocation.lat, userLocation.lng),
                        L.latLng(targetBranch.latitude, targetBranch.longitude)
                    ],
                    routeWhileDragging: false,
                    addWaypoints: false,
                    fitSelectedRoutes: true,
                    show: false,
                    lineOptions: {
                        styles: [{ color: '#1e6ffd', weight: 5, opacity: 0.85 }]
                    },
                    createMarker: function() { return null; }
                }).addTo(map);

                routingControlRef.current = routingControl;

                // Giờ đây phương thức .on() hoàn toàn hợp lệ trong mắt TypeScript compiler
                routingControl.on('routesfound', (e: unknown) => {
                    const eventData = e as RoutingFoundEvent;
                    const routes = eventData.routes;
                    const summary = routes[0].summary;
                    setRouteInfo({
                        distance: (summary.totalDistance / 1000).toFixed(2),
                        time: Math.round(summary.totalTime / 60) * 2,
                        branchName: targetBranch.branchName
                    });
                });
            }
        } else if (bounds.isValid()) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }

    }, [isOpen, userLocation, branches, activeMarker]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col relative">

                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-slate-100">
                    <h3 className="font-bold text-lg text-slate-800">Our Branches & Your Location (Leaflet OSS)</h3>
                    <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Map Body */}
                <div className="w-full relative h-[500px]">
                    <div ref={mapContainerRef} className="w-full h-full z-10" />

                    {/* Banner hiển thị thông tin Khoảng cách thực tế dưới chân Bản đồ */}
                    {routeInfo && (
                        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-xl border border-blue-100 z-[1000] flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div>
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Đang hiển thị lộ trình đến</p>
                                <h4 className="font-bold text-slate-800 text-sm sm:text-base">{routeInfo.branchName}</h4>
                            </div>
                            <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-slate-100 pt-2 sm:pt-0 sm:pl-4 justify-between sm:justify-start">
                                <div className="text-center sm:text-left">
                                    <p className="text-xs text-slate-400">Đường bộ gần nhất</p>
                                    <p className="font-extrabold text-blue-600 text-lg">{routeInfo.distance} km</p>
                                </div>
                                <div className="text-center sm:text-left">
                                    <p className="text-xs text-slate-400">Dự kiến di chuyển</p>
                                    <p className="font-extrabold text-emerald-600 text-lg">~{routeInfo.time} phút</p>
                                </div>
                                <button
                                    onClick={() => {
                                        const target = branches.find(b => b.id === activeMarker);
                                        if (target) {
                                            // ĐÃ FIX: Sửa cú pháp Deep Link đồng bộ chuẩn xác sang bản đồ Google Maps
                                            window.open(`https://www.google.com/maps/dir/?api=1&destination=${target.latitude},${target.longitude}`, '_blank');
                                        }
                                    }}
                                    className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors ml-2"
                                    title="Mở ứng dụng Google Maps điều hướng"
                                >
                                    <Navigation className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};