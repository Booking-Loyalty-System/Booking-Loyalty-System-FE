import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export const GlassWiperEffect = ({ carPos }: { carPos: [number, number, number] }) => {
    const wiperRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (wiperRef.current) {
            const time = state.clock.getElapsedTime();
            const kínhLáiZ = carPos[2] + -9.0;
            const biênĐộLau = 0.8; // Chỉ lau trong phạm vi 0.8 đơn vị

            // 1. ĐỘ CAO (TRỤC Y): Giữ ở mức vừa tầm kính (ví dụ 1.2)
            wiperRef.current.position.y = carPos[1] + 3.2;

            // 2. TỊNH TIẾN SANG TRÁI (TRỤC X):
            wiperRef.current.position.x = carPos[0] + 1.75;

            // 3. CHIỀU DÀI XE (TRỤC Z): Di chuyển qua lại dọc thân xe
            wiperRef.current.position.z = kínhLáiZ + Math.sin(time * 2) * biênĐộLau;

            // Xoay nhẹ theo chiều di chuyển
            wiperRef.current.rotation.y = Math.sin(time * 2) * 0.2;
        }
    });

    return (
        <mesh ref={wiperRef}>
            <boxGeometry args={[0.05, 0.4, 0.8]} />
            <meshStandardMaterial
                color="#fbbf24"
                transparent
                opacity={0.9}
                roughness={1}
            />
        </mesh>
    );
};