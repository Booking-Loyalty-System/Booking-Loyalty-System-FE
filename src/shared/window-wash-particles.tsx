import {useFrame} from "@react-three/fiber";
import {useMemo, useRef} from "react";
import * as THREE from 'three';

export const WindowWashParticles = ({ carPos }: { carPos: [number, number, number] }) => {
    const pointsRef = useRef<THREE.Points>(null);
    const count = 400;

    const [positions, speeds] = useMemo(() => {
        const pos = new Float32Array(count * 3);
        const spd = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = carPos[0] + (Math.random() - 0.5) * 1.5;
            pos[i * 3 + 1] = carPos[1] + 1.4 + Math.random() * 0.4;
            pos[i * 3 + 2] = carPos[2] + (Math.random() - 0.5) * 2.2;
            spd[i] = 0.5 + Math.random() * 1.2;
        }
        return [pos, spd];
    }, [carPos]);

    useFrame((_, delta) => {
        if (!pointsRef.current) return;
        const attr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;

        for (let i = 0; i < count; i++) {
            attr.array[i * 3 + 1] -= speeds[i] * delta;
            if (attr.array[i * 3 + 1] < carPos[1] + 0.6) {
                attr.array[i * 3] = carPos[0] + (Math.random() - 0.5) * 1.5;
                attr.array[i * 3 + 1] = carPos[1] + 1.4 + Math.random() * 0.3;
                attr.array[i * 3 + 2] = carPos[2] + (Math.random() - 0.5) * 2.2;
            }
        }
        attr.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} count={positions.length / 3} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial color="#e0f2fe" size={0.03} transparent opacity={0.6} />
        </points>
    );
};