import { useFrame } from "@react-three/fiber";
import { useRef, useState} from "react";
import * as THREE from "three";

export const MovingParticles = ({ isWater }: { isWater: boolean }) => {
    const count = 1200; // Tăng số lượng hạt nhìn cho dày dặn
    const pointsRef = useRef<THREE.Points>(null);

    const [positions] = useState(() => {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i += 3) {
            arr[i] = (Math.random() - 0.5) * 4;
            arr[i + 1] = Math.random() * 2 + 1.5;   // Phát ra từ giàn khung phun phía trên
            arr[i + 2] = (Math.random() - 0.5) * 6;
        }
        return arr;
    });

    useFrame((_state, delta: number) => {
        if (!pointsRef.current) return;
        const geo = pointsRef.current.geometry;
        const posAttr = geo.attributes.position;
        const speed = isWater ? 5 * delta : 2.5 * delta;

        for (let i = 0; i < count * 3; i += 3) {
            posAttr.array[i + 1] -= speed; // Rơi xuống

            if (isWater) {
                posAttr.array[i] += (Math.random() - 0.5) * 0.02; // Bắn chéo nhẹ lung tung
            }

            // Khi hạt chạm đất (Y < 0)
            if (posAttr.array[i + 1] < 0) {
                posAttr.array[i + 1] = 3.3; // Reset độ cao lên đỉnh thanh ngang

                // SỬA TẠI ĐÂY: Đổi 'arr[i]' thành 'posAttr.array[i]' để sửa lỗi TS2304
                posAttr.array[i] = (Math.random() - 0.5) * 3.5;
            }
        }
        posAttr.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial
                color={isWater ? '#38bdf8' : '#fbbf24'}
                size={isWater ? 0.03 : 0.05}
                transparent
                opacity={0.6}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

export const FoamParticles = () => {
    const count = 800;
    const ref = useRef<THREE.Points>(null);
    const [positions] = useState(() => {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count * 3; i += 3) {
            arr[i] = Math.random() > 0.5 ? 2.6 : -2.6; // Bắn ra từ 2 cột bên sườn của khung
            arr[i + 1] = Math.random() * 2.5 + 0.5;
            arr[i + 2] = (Math.random() - 0.5) * 5;
        }
        return arr;
    });

    // Trong component FoamParticles
    useFrame((_state, delta: number) => {
        if (!ref.current) return;
        const posAttr = ref.current.geometry.attributes.position;

        for (let i = 0; i < count * 3; i += 3) {
            if (posAttr.array[i] > 0) {
                posAttr.array[i] -= 4 * delta;
                // Chỉnh lại giới hạn va chạm sườn xe: Thay vì 0.6, hãy điều chỉnh số này nếu bọt xuyên qua xe
                if (posAttr.array[i] < 0.6) posAttr.array[i] = 2.6;
            } else {
                posAttr.array[i] += 4 * delta;
                if (posAttr.array[i] > -0.6) posAttr.array[i] = -2.6;
            }
            posAttr.array[i + 1] -= 0.6 * delta;
        }
        posAttr.needsUpdate = true;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <pointsMaterial color="#ffffff" size={0.07} transparent opacity={0.8} />
        </points>
    );
};
