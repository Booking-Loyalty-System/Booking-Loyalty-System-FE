import * as THREE from 'three';
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

// 🛠️ CỤM CHỔI CON: Giữ nguyên kích thước bự hoành tráng
const SpinningTireBrush = ({ position, isRightSide }: { position: [number, number, number]; isRightSide: boolean }) => {
    const brushMeshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (brushMeshRef.current) {
            brushMeshRef.current.rotation.y = state.clock.getElapsedTime() * 12;
        }
    });

    return (
        <group position={position}>
            {/* 1. Trục sắt */}
            <mesh position={[0, 0.1, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.7]} />
                <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* 2. Lông chổi vàng bự */}
            <mesh ref={brushMeshRef} position={[0, 0.1, 0]}>
                <cylinderGeometry args={[0.38, 0.38, 0.55, 32]} />
                <meshStandardMaterial color="#f59e0b" roughness={0.9} />
            </mesh>

            {/* 3. Thanh khung cơ khí phía sau */}
            <mesh position={[isRightSide ? 0.08 : -0.08, 0.1, 0]}>
                <boxGeometry args={[0.03, 0.65, 0.12]} />
                <meshStandardMaterial color="#1e293b" metalness={0.5} />
            </mesh>
        </group>
    );
};

// 🚀 CỤM CHÍNH: Quản lý vị trí và đồng bộ hạt nước theo chổi
export const TireWashParticles = ({ carPos }: { carPos: [number, number, number] }) => {
    const pointsRef = useRef<THREE.Points>(null);
    const count = 180;

    // ==========================================
    // ⚙️ KHU VỰC ĐIỀU CHỈNH KHOẢNG CÁCH CHỔI:
    // ==========================================
    const spacingX = 1.7; // ↔️ Trái - Phải: Tăng số này nếu muốn chổi dạt ra xa sườn xe (Cũ là 0.28)
    const spacingZ = 3.85; // ↕️ Trước - Sau: Tăng số này nếu muốn chổi tiến về đầu/đuôi xe (Cũ là 1.43)
    const rearZ = 3.2;
    // ==========================================

    // Tọa độ khoảng cách từ tâm xe đến lốp (Đã đồng bộ theo spacingZ)
    const wheelOffsets = useMemo(() => [
        [0.94, 0.35, spacingZ],   // Trước - Phải
        [0.94, 0.35, -rearZ],  // Sau - Phải
        [-0.94, 0.35, spacingZ],  // Trước - Trái
        [-0.94, 0.35, -rearZ]  // Sau - Trái
    ], [spacingZ, rearZ]);

    const [positions, dynamics] = useMemo(() => {
        const pos = new Float32Array(count * 4 * 3);
        const dyn = new Float32Array(count * 4 * 3);
        let idx = 0, dIdx = 0;

        for (let w = 0; w < 4; w++) {
            const wX = carPos[0] + wheelOffsets[w][0];
            const wY = carPos[1] + wheelOffsets[w][1];
            const wZ = carPos[2] + wheelOffsets[w][2];

            for (let i = 0; i < count; i++) {
                // Hạt nước tự động phun ra từ vị trí chổi mới (spacingX)
                pos[idx] = wX + (wheelOffsets[w][0] > 0 ? spacingX : -spacingX);
                pos[idx + 1] = wY + (Math.random() - 0.5) * 0.3;
                pos[idx + 2] = wZ + (Math.random() - 0.5) * 0.4;

                dyn[dIdx] = (wX - pos[idx]) * (3.5 + Math.random() * 2);
                dyn[dIdx + 1] = (wY - pos[idx + 1]) * (3 + Math.random() * 2) - 1.2;
                dyn[dIdx + 2] = (wZ - pos[idx + 2]) * (3.5 + Math.random() * 2);

                idx += 3; dIdx += 3;
            }
        }
        return [pos, dyn];
    }, [carPos, wheelOffsets, spacingX]);

    useFrame((_, delta) => {
        if (!pointsRef.current) return;
        const attr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
        let idx = 0, dIdx = 0;

        for (let w = 0; w < 4; w++) {
            const wX = carPos[0] + wheelOffsets[w][0];
            const wY = carPos[1] + wheelOffsets[w][1];
            const wZ = carPos[2] + wheelOffsets[w][2];

            for (let i = 0; i < count; i++) {
                attr.array[idx] += dynamics[dIdx] * delta;
                attr.array[idx + 1] += dynamics[dIdx + 1] * delta;
                attr.array[idx + 2] += dynamics[dIdx + 2] * delta;

                const dist = Math.sqrt(Math.pow(attr.array[idx] - wX, 2) + Math.pow(attr.array[idx + 2] - wZ, 2));
                if (dist < 0.05 || attr.array[idx + 1] < carPos[1]) {
                    attr.array[idx] = wX + (wheelOffsets[w][0] > 0 ? spacingX : -spacingX);
                    attr.array[idx + 1] = wY + (Math.random() - 0.5) * 0.3;
                    attr.array[idx + 2] = wZ + (Math.random() - 0.5) * 0.4;
                }
                idx += 3; dIdx += 3;
            }
        }
        attr.needsUpdate = true;
    });

    return (
        <group>
            {/* Render 4 cụm chổi lớn đã được đồng bộ khoảng cách */}
            {wheelOffsets.map((offset, index) => {
                const isRightSide = offset[0] > 0;

                const brushX = carPos[0] + offset[0] + (isRightSide ? spacingX : -spacingX);
                const brushY = carPos[1] + offset[1] - 0.18;
                const brushZ = carPos[2] + offset[2];

                return (
                    <SpinningTireBrush
                        key={index}
                        position={[brushX, brushY, brushZ]}
                        isRightSide={isRightSide}
                    />
                );
            })}

            {/* Hệ thống tia nước */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[positions, 3]} count={positions.length / 3} array={positions} itemSize={3} />
                </bufferGeometry>
                <pointsMaterial color="#1d4ed8" size={0.09} transparent opacity={0.75} blending={THREE.AdditiveBlending} />
            </points>
        </group>
    );
};