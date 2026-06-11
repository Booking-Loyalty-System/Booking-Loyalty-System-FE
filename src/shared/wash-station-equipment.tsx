import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
//Cọ rửa tự động
export const WashStationEquipment = ({ currentStep }: { currentStep: number }) => {
    const leftBrushRef = useRef<THREE.Mesh>(null);
    const rightBrushRef = useRef<THREE.Mesh>(null);

    useFrame((_state, delta: number) => {
        // Chỉ chạy animation xoay chổi nếu đang ở đúng bước 3
        if (currentStep === 3) {
            if (leftBrushRef.current) {
                leftBrushRef.current.rotation.y += 5 * delta;
                leftBrushRef.current.position.x = THREE.MathUtils.lerp(leftBrushRef.current.position.x, 2.4, 0.05);
            }
            if (rightBrushRef.current) {
                rightBrushRef.current.rotation.y -= 5 * delta;
                rightBrushRef.current.position.x = THREE.MathUtils.lerp(rightBrushRef.current.position.x, -2.4, 0.05);
            }
        }
    });

    return (
        <group position={[0, 0, 0]}>
            {/* GIÀN KHUNG CHỮ U CỐ ĐỊNH - LUÔN LUÔN HIỂN THỊ */}
            <group>
                <mesh position={[2.8, 2.1, 0]}>
                    <boxGeometry args={[0.2, 4.2, 0.4]} />
                    <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
                </mesh>
                <mesh position={[-2.8, 2.1, 0]}>
                    <boxGeometry args={[0.2, 4.2, 0.4]} />
                    <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
                </mesh>
                <mesh position={[0, 4.2, 0]}>
                    <boxGeometry args={[5.8, 0.2, 0.4]} />
                    <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
                </mesh>
                {[ -2, -1, 0, 1, 2 ].map((x, i) => (
                    <mesh key={i} position={[x, 4.05, 0]}>
                        <cylinderGeometry args={[0.04, 0.06, 0.15, 8]} />
                        <meshStandardMaterial color="#94a3b8" metalness={0.9} />
                    </mesh>
                ))}
            </group>

            {/* SỬA TẠI ĐÂY: Chỉ render cặp trụ màu xanh khi đang ở Bước 3 (Cọ rửa tự động) */}
            {currentStep === 3 && (
                <>
                    {/* Chổi bên trái sườn xe */}
                    <mesh ref={leftBrushRef} position={[1.6, 1.6, 0.5]}>
                        <cylinderGeometry args={[0.45, 0.45, 3.2, 16]} />
                        <meshStandardMaterial color="#2563eb" roughness={0.8} wireframe />
                    </mesh>

                    {/* Chổi bên phải sườn xe */}
                    <mesh ref={rightBrushRef} position={[-1.6, 1.6, 0.5]}>
                        <cylinderGeometry args={[0.45, 0.45, 3.2, 16]} />
                        <meshStandardMaterial color="#2563eb" roughness={0.8} wireframe />
                    </mesh>
                </>
            )}
        </group>
    );
};