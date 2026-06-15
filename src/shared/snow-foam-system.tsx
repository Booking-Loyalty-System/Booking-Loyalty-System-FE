import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
//Phun bọt tuyết
const generateFoamPositions = (count: number) => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        // Hạt xuất phát tạm thời ở tâm, useFrame sẽ định vị lại theo béc phun
        arr[i * 3 + 0] = (Math.random() - 0.5) * 4;
        arr[i * 3 + 1] = 4.0;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return arr;
};

const generateFoamDirections = (count: number) => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        // Hướng phun: chủ yếu bắn chéo sang hai bên hoặc bắn thẳng xuống
        arr[i * 3 + 0] = (Math.random() - 0.5) * 2; // Khuyếch tán trục X
        arr[i * 3 + 1] = -2 - Math.random() * 2;    // Lao nhanh xuống trục Y
        arr[i * 3 + 2] = (Math.random() - 0.5) * 1; // Khuyếch tán trục Z
    }
    return arr;
};

// ============================================================================
// COMPONENT CHÍNH: Giàn Phun Bọt Tuyết Chuyển Động
// ============================================================================
export const SnowFoamSystem = ({ currentStep }: { currentStep: number }) => {
    const gantryRef = useRef<THREE.Group>(null);
    const particlesRef = useRef<THREE.Points>(null);
    const count = 1500; // Tăng số lượng hạt bọt nhìn cho dày đặc, trắng xóa

    // Cache dữ liệu hạt
    const initialPositions = useMemo(() => generateFoamPositions(count), [count]);
    const foamDirections = useMemo(() => generateFoamDirections(count), [count]);

    // Danh sách tọa độ các béc phun đính trên thanh ngang
    const nozzleXPositions = [-1.8, -0.9, 0, 0.9, 1.8];

    useFrame((_state, delta) => {
        // --- 1. LOGIC CHUYỂN ĐỘNG CỦA GIÀN PHUN ---
        if (gantryRef.current) {
            if (currentStep === 2) {
                // Cố định độ cao Y ở mức 3.8m (sát đỉnh khung chữ U)
                gantryRef.current.position.y = THREE.MathUtils.lerp(gantryRef.current.position.y, 3.8, 0.05);

                // Cho giàn phun chạy DỌC theo trục Z (từ -2 mét đến 2 mét dọc thân xe)
                const time = _state.clock.getElapsedTime();
                const targetZ = Math.sin(time * 1.0) * 2.0; // Chạy lướt tới lui dọc thân xe
                gantryRef.current.position.z = THREE.MathUtils.lerp(gantryRef.current.position.z, targetZ, 0.05);
            } else {
                // Khi ở bước khác, thu giàn về vị trí trung tâm (Z = 0) và đưa lên đỉnh (Y = 4.1)
                gantryRef.current.position.y = THREE.MathUtils.lerp(gantryRef.current.position.y, 4.1, 0.05);
                gantryRef.current.position.z = THREE.MathUtils.lerp(gantryRef.current.position.z, 0, 0.05);
            }
        }

        // --- 2. LOGIC HIỆU ỨNG HẠT BỌT TUYẾT PHUN RA ---
        if (!particlesRef.current || !gantryRef.current) return;

        const geo = particlesRef.current.geometry;
        const posAttr = geo.attributes.position;
        const posArray = posAttr.array as Float32Array;

        for (let i = 0; i < count; i++) {
            if (currentStep === 2) {
                // Hạt bọt rơi và khuyếch tán dựa trên hướng ngẫu nhiên ban đầu
                posArray[i * 3 + 0] += foamDirections[i * 3 + 0] * delta;
                posArray[i * 3 + 1] += foamDirections[i * 3 + 1] * delta;
                posArray[i * 3 + 2] += foamDirections[i * 3 + 2] * delta;

                // Thêm hiệu ứng gió/lắc nhẹ cho bọt tuyết bồng bềnh
                posArray[i * 3 + 0] += Math.sin(_state.clock.getElapsedTime() + i) * 0.01;

                // Khi bọt rơi chạm đất (Y < 0) hoặc bay quá xa -> Reset lại vị trí tại một béc phun ngẫu nhiên
                // Khi bọt rơi chạm đất (Y < 0) -> Reset lại vị trí bắn ra từ thanh dầm
                if (posArray[i * 3 + 1] < 0) {
                    const randomNozzleX = nozzleXPositions[Math.floor(Math.random() * nozzleXPositions.length)];

                    posArray[i * 3 + 0] = randomNozzleX + (Math.random() - 0.5) * 0.1; // Ăn theo béc X
                    posArray[i * 3 + 1] = 3.6; // Bắn từ độ cao thanh dầm xuống (Y cố định dưới béc)

                    // SỬA TẠI ĐÂY: Lấy tọa độ Z hiện tại của giàn phun cộng thêm một chút ngẫu nhiên để bọt phủ dày
                    const currentGantryZ = gantryRef.current.position.z;
                    posArray[i * 3 + 2] = currentGantryZ + (Math.random() - 0.5) * 0.3;
                }
            } else {
                // Nếu không phải bước 2, giấu toàn bộ hạt bọt xuống dưới mặt đất
                posArray[i * 3 + 1] = -10;
            }
        }
        posAttr.needsUpdate = true;
    });

    return (
        <group>
            {/* CƠ KHÍ: Giàn cơ cấu cơ học thanh ngang phun bọt */}
            <group ref={gantryRef} position={[0, 4.1, 0]}>
                {/* Thanh dầm ngang mang béc màu trắng/bạc đặc trưng của hệ thống bọt */}
                <mesh>
                    <boxGeometry args={[4.4, 0.15, 0.3]} />
                    <meshStandardMaterial color="#e2e8f0" metalness={0.7} roughness={0.3} />
                </mesh>

                {/* Thiết kế các béc phun bọt hình phễu loe to béc rộng */}
                {nozzleXPositions.map((x, i) => (
                    <group key={i} position={[x, -0.1, 0]}>
                        {/* Đầu nối béc */}
                        <mesh>
                            <cylinderGeometry args={[0.03, 0.03, 0.08, 12]} />
                            <meshStandardMaterial color="#475569" metalness={0.8} />
                        </mesh>
                        {/* Phễu phun loe loét loãng bọt */}
                        <mesh position={[0, -0.06, 0]}>
                            <cylinderGeometry args={[0.08, 0.04, 0.08, 12, 1, true]} />
                            <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.2} side={THREE.DoubleSide} />
                        </mesh>
                    </group>
                ))}
            </group>

            {/* HIỆU ỨNG: Các hạt bọt tuyết trắng xóa */}
            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[initialPositions, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    color="#ffffff"
                    size={0.07}            // Kích thước hạt bọt to, xốp mịn
                    transparent
                    opacity={0.85}
                    blending={THREE.NormalBlending}
                    depthWrite={false}
                />
            </points>
        </group>
    );
};