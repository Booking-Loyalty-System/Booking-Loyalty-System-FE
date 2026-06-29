import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { WashStationEquipment } from './wash-station-equipment.tsx';
import { MovingParticles } from './particles.tsx';
import { HighPressureWaterParticles } from "@/shared/high-pressure-water-particle.tsx";
import { SuperFastDryer } from "@/shared/super-fast-dryer.tsx";
import { useEffect, useRef } from "react";
import { Model as GlcCarModel } from './Glc.tsx';
import { WindowWashParticles } from "@/shared/window-wash-particles.tsx";
import { TireWashParticles } from "@/shared/tier-wash-particles.tsx";
import { GlassWiperEffect } from '@/shared/glass-wiper-effect.tsx';

export const CarWithEffects = ({
    currentStep,
    activePackage = []
}: {
    currentStep: number | string;
    activePackage?: string[];
}) => {
    const carGroupRef = useRef<THREE.Group>(null);
    const CAR_POSITION: [number, number, number] = [-3.55, -0.1, 2.8];
    const VISUAL_CAR_POS: [number, number, number] = [0.023, -0.1, -5.146];

    const serviceMapping: Record<string, string> = {
        "Exterior wash": "exterior_wash",
        "Full exterior wash": "exterior_wash",
        "Tire cleaning": "tire_cleaning",
        "Window cleaning": "window_cleaning",

        // Map dọn nội thất từ tên tiếng Anh sang key chức năng
        "Interior vacuum": "interior_vacuum",
        "Dashboard polish": "dashboard_polish",
        "Air freshener": "air_freshener",
        "Interior deep clean": "interior_cleaning",
        "Leather conditioning": "leather_conditioning",

        "Tire shine": "tire_shine",
        "Wax coating": "wax_coating",
        "Ceramic spray": "ceramic_spray",
        "Engine bay cleaning": "engine_cleaning",

        // Map trực tiếp từ các type key của gói dữ liệu mô phỏng sandbox
        "exterior_wash": "exterior_wash",
        "tire_cleaning": "tire_cleaning",
        "window_cleaning": "window_cleaning",
        "interior_vacuum": "interior_vacuum",
        "dashboard_polish": "dashboard_polish",
        "leather_conditioning": "leather_conditioning",
        "air_freshener": "air_freshener",
        "wax_coating": "wax_coating",
        "engine_cleaning": "engine_cleaning",
        "ceramic_spray": "ceramic_spray"
    };

    let currentServiceName = "";
    if (typeof currentStep === 'number' && activePackage.length > 0) {
        currentServiceName = activePackage[currentStep - 1] || "";
    } else if (typeof currentStep === 'string') {
        currentServiceName = currentStep;
    }

    const stepStr = serviceMapping[currentServiceName] || currentServiceName || "idle";
    const stepNum = typeof currentStep === 'number' ? currentStep : 0;

    useFrame(() => {
        if (carGroupRef.current) {
            carGroupRef.current.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                    const mesh = child as THREE.Mesh;
                    const material = mesh.material as THREE.MeshStandardMaterial;
                    const matName = material.name.toLowerCase();

                    const isTire = matName.includes('tire');
                    const isGlass = matName.includes('glass');

                    if (isTire) {
                        if (stepStr === 'tire_cleaning') {
                            material.color.lerp(new THREE.Color('#ffffff'), 0.1);
                            material.roughness = 0.9;
                        } else if (stepStr === 'tire_shine' || stepStr === 'super_fast_dryer') {
                            material.color.lerp(new THREE.Color('#050505'), 0.1);
                            material.roughness = 0.3;
                        } else {
                            material.color.lerp(new THREE.Color('#1c1917'), 0.1);
                            material.roughness = 0.8;
                        }
                    }
                    else if (isGlass) {
                        if (stepStr === 'window_cleaning') {
                            material.color.lerp(new THREE.Color('#bae6fd'), 0.1);
                        } else {
                            material.color.lerp(new THREE.Color('#262626'), 0.1);
                        }
                    }
                    else {
                        material.color.lerp(new THREE.Color('#111111'), 0.05);
                        material.metalness = 0.85;

                        if (['wax_coating', 'ceramic_spray', 'super_fast_dryer'].includes(stepStr)) {
                            material.roughness = 0.05;
                        } else {
                            material.roughness = 0.15;
                        }
                    }
                }
            });
        }
    });

    useEffect(() => {
        if (carGroupRef.current) {
            console.log("--- KHỞI ĐỘNG TRẠM RỬA XE GLC ĐEN ---");
            console.log(`Gói dịch vụ đang chạy: ${currentServiceName || 'Mặc định'}`);
            console.log(`Key Hiệu ứng hiện tại: "${stepStr}" | Number Key = ${stepNum}`);
        }
    }, [currentStep, activePackage, currentServiceName, stepStr, stepNum]);

    return (
        <group>
            <WashStationEquipment currentStep={stepNum} />

            <group ref={carGroupRef}>
                <GlcCarModel
                    position={CAR_POSITION}
                    scale={[0.02, 0.02, 0.02]}
                    stepStr={stepStr}
                />
            </group>

            {/* ==============================================================
                🌊 HỆ THỐNG HIỆU ỨNG HẠT VÀ LINH KIỆN THEO BƯỚC
                ============================================================== */}

            {stepStr === 'exterior_wash' && <HighPressureWaterParticles />}

            {stepStr === 'tire_cleaning' && <TireWashParticles carPos={VISUAL_CAR_POS} />}

            {stepStr === 'window_cleaning' && (
                <>
                    <MovingParticles isWater={true} />
                    <WindowWashParticles carPos={CAR_POSITION} />
                    <GlassWiperEffect carPos={CAR_POSITION} />
                </>
            )}

            {/* Kích hoạt hạt dọn dẹp cho mọi bước liên quan đến nội thất xe */}
            {['interior_vacuum', 'dashboard_polish', 'leather_conditioning', 'air_freshener', 'interior_cleaning'].includes(stepStr) && (
                <MovingParticles isWater={false} />
            )}

            {stepStr === 'wax_coating' && <MovingParticles isWater={false} />}
            {stepStr === 'ceramic_spray' && <SuperFastDryer />}

            {/* BƯỚC ĐỘNG CƠ: Khi rửa khoang máy (Nắp capo đang mở) */}
            {stepStr === 'engine_cleaning' && <HighPressureWaterParticles />}

            {stepStr === 'super_fast_dryer' && <SuperFastDryer />}
        </group>
    );
};