import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const NOZZLE_X_POSITIONS = [-2, -1, 0, 1, 2];
const COUNT = 4000;

export const HighPressureWaterParticles = () => {
    const pointsRef = useRef<THREE.Points>(null);

    const [positions] = useState(() => new Float32Array(COUNT * 3));

    const velocitiesRef = useRef(new Float32Array(COUNT * 3));
    const originalNozzlesRef = useRef(new Float32Array(COUNT));

    const isInitializedRef = useRef(false);

    useFrame((_state, delta) => {
        if (!pointsRef.current) return;

        const posAttr = pointsRef.current.geometry.attributes.position;
        const posArray = posAttr.array as Float32Array;

        const velocities = velocitiesRef.current;
        const originalNozzles = originalNozzlesRef.current;

        if (!isInitializedRef.current) {
            for (let i = 0; i < COUNT; i++) {
                const idx = i * 3;
                const nozzleX = NOZZLE_X_POSITIONS[Math.floor(Math.random() * NOZZLE_X_POSITIONS.length)];
                originalNozzles[i] = nozzleX;

                posArray[idx]     = nozzleX + (Math.random() - 0.5) * 0.02;
                posArray[idx + 1] = 4.05;
                posArray[idx + 2] = (Math.random() - 0.5) * 0.05;

                const theta = Math.random() * Math.PI * 2;
                const spreadRadius = Math.random() * 0.35;
                const speed = Math.random() * 5 + 13;

                velocities[idx]     = Math.cos(theta) * spreadRadius * 6;
                velocities[idx + 1] = -speed;
                velocities[idx + 2] = Math.sin(theta) * spreadRadius * 3;
            }

            isInitializedRef.current = true;
            posAttr.needsUpdate = true;
            return;
        }

        const dt = Math.min(delta, 0.05);

        for (let i = 0; i < COUNT; i++) {
            const idx = i * 3;

            posArray[idx]     += velocities[idx] * dt;
            posArray[idx + 1] += velocities[idx + 1] * dt;
            posArray[idx + 2] += velocities[idx + 2] * dt;

            velocities[idx + 1] -= 15 * dt;

            const distanceFromNozzle = 4.05 - posArray[idx + 1];
            if (distanceFromNozzle > 0.2) {
                const currentNozzleX = originalNozzles[i];
                posArray[idx] += (posArray[idx] > currentNozzleX ? 0.4 : -0.4) * dt * distanceFromNozzle;
            }

            if (posArray[idx + 1] < 0.25) {
                const nozzleX = NOZZLE_X_POSITIONS[Math.floor(Math.random() * NOZZLE_X_POSITIONS.length)];
                originalNozzles[i] = nozzleX;

                posArray[idx]     = nozzleX + (Math.random() - 0.5) * 0.02;
                posArray[idx + 1] = 4.05;
                posArray[idx + 2] = (Math.random() - 0.5) * 0.05;

                const theta = Math.random() * Math.PI * 2;
                const spreadRadius = Math.random() * 0.35;

                velocities[idx]     = Math.cos(theta) * spreadRadius * 6;
                velocities[idx + 1] = -(Math.random() * 5 + 13);
                velocities[idx + 2] = Math.sin(theta) * spreadRadius * 3;
            }
        }

        posAttr.needsUpdate = true;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                color="#7dd3fc"
                size={0.045}
                transparent
                opacity={0.5}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
            />
        </points>
    );
};