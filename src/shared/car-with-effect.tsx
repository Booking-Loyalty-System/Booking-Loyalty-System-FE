import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { WashStationEquipment } from './wash-station-equipment.tsx';
import { MovingParticles } from './particles.tsx';
import {HighPressureWaterParticles} from "@/shared/high-pressure-water-particle.tsx";
import {SuperFastDryer} from "@/shared/super-fast-dryer.tsx";
import {SnowFoamSystem} from "@/shared/snow-foam-system.tsx";

THREE.DefaultLoadingManager.onError = (url: string) => {
    // Chỉ lờ đi nếu đó là file texture.png bị lỗi, các file khác vẫn log để bạn theo dõi
    if (url.includes('texture.png')) {
        return;
    }
    console.error(`Lỗi tải tài nguyên khác: ${url}`);
};

export const CarWithEffects = ({ currentStep }: { currentStep: number }) => {
    const { scene } = useGLTF('/car_1.glb', false, false, (loader) => {
        // Ép hàm báo lỗi của GLTFLoader thành hàm trống (bỏ qua mọi lỗi vặt liên quan đến texture ẩn)
        loader.manager.onError = () => {};
    });

    useFrame(() => {
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                const material = mesh.material as THREE.MeshStandardMaterial;

                if (currentStep === 2) {
                    material.color.lerp(new THREE.Color('#ffffff'), 0.05);
                    material.roughness = 0.9;
                } else if (currentStep === 3) {
                    material.color.lerp(new THREE.Color('#475569'), 0.05);
                    material.roughness = 0.1;
                    material.metalness = 0.8;
                } else {
                    // MÀU SƠN BẠC ÁNH KIM SANG TRỌNG (Đã sửa giúp xe sáng bừng lên)
                    material.color.lerp(new THREE.Color('#475569'), 0.05);
                    material.roughness = 0.1;
                    material.metalness = 0.8;
                }
            }
        });
    });

    return (
        <group>
            {/* Giàn thiết bị cố định giữ nguyên position={[0, 0, 0]} */}
            <WashStationEquipment currentStep={currentStep} />

            {/* THỬ SỬA TỌA ĐỘ XE: Hãy thay đổi số cuối cùng (Trục Z) để dịch xe tới/lui */}
            {/* Nếu xe đang ở sau giàn phun, hãy thử đặt trục Z là 1.5 hoặc 2.0 hoặc -1.5 (tùy thuộc vào hướng đầu xe) */}
            <primitive
                object={scene}
                position={[-3.55, -0.1, 2.8]} // Thử đổi số 0 cũ thành 1.8 (hoặc tăng/giảm cho đến khi cọc chổi nằm ngay giữa sườn xe)
                scale={[0.02, 0.02, 0.02]}
            />

            {/* Hiệu ứng hạt */}
            {currentStep === 1 && <HighPressureWaterParticles />}
            {currentStep === 2 && <SnowFoamSystem currentStep={currentStep} />}
            {currentStep === 3 && <MovingParticles isWater={true} />}
            {currentStep === 4 && <HighPressureWaterParticles />}
            {currentStep === 5 && <SuperFastDryer />}
        </group>
    );
};