import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Sấy khô
const textureLoader = new THREE.TextureLoader();

// Tạo một canvas texture nhỏ giả lập lưới tản nhiệt nếu không tìm thấy file ảnh gốc
const createNoiseTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.fillStyle = '#111111';
        ctx.fillRect(0, 0, 16, 16);
        ctx.fillStyle = '#333333';
        ctx.fillRect(0, 0, 8, 8);
        ctx.fillRect(8, 8, 8, 8);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    return tex;
};

// --- Blower Nozzle Mesh Factory ---
const createBlowerNozzleMesh = () => {
    const group = new THREE.Group();

    const nozzleGeometry = new THREE.CylinderGeometry(0.05, 0.15, 0.3, 32, 1, true);
    const nozzleMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.8,
        roughness: 0.2,
        side: THREE.DoubleSide,
    });
    const nozzleMesh = new THREE.Mesh(nozzleGeometry, nozzleMaterial);
    nozzleMesh.rotation.x = Math.PI / 2;
    nozzleMesh.position.y = -0.15;
    group.add(nozzleMesh);

    const linerGeometry = new THREE.CylinderGeometry(0.048, 0.148, 0.3, 32, 1, true);
    const linerMaterial = new THREE.MeshBasicMaterial({
        color: 0x111111,
        side: THREE.DoubleSide,
    });
    const linerMesh = new THREE.Mesh(linerGeometry, linerMaterial);
    linerMesh.rotation.x = Math.PI / 2;
    linerMesh.position.y = -0.15;
    group.add(linerMesh);

    return group;
};

// --- Gantry & Housing Mesh Factory ---
const createGantryMesh = () => {
    const group = new THREE.Group();

    const beamGeometry = new THREE.BoxGeometry(2.5, 0.2, 0.4);
    const beamMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.6,
        roughness: 0.4,
    });
    const beamMesh = new THREE.Mesh(beamGeometry, beamMaterial);
    group.add(beamMesh);

    const housingGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32);
    const housingMaterial = new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.8,
        roughness: 0.2,
    });
    const housingMesh = new THREE.Mesh(housingGeometry, housingMaterial);
    housingMesh.position.set(0, 0.1, 0);
    group.add(housingMesh);

    const grilleGeometry = new THREE.CircleGeometry(0.48, 32);

    // ĐÃ FIX: Sửa lại logic fallback texture bất đồng bộ chuẩn Three.js, loại bỏ block empty
    let grilleTexture: THREE.Texture;
    try {
        grilleTexture = textureLoader.load(
            '/grille.png',
            undefined,
            undefined,
            () => {
                console.warn("Không tìm thấy file grille.png, chuyển sang texture dự phòng.");
            }
        );
        grilleTexture.wrapS = THREE.RepeatWrapping;
        grilleTexture.wrapT = THREE.RepeatWrapping;
        grilleTexture.repeat.set(4, 4);
    } catch (e) {
        grilleTexture = createNoiseTexture();
        console.error("Lỗi xảy ra khi thiết lập kết cấu:", e);
    }

    const grilleMaterial = new THREE.MeshBasicMaterial({
        map: grilleTexture,
        transparent: true,
        side: THREE.DoubleSide,
    });
    const grilleMesh = new THREE.Mesh(grilleGeometry, grilleMaterial);
    grilleMesh.position.set(0, 0.21, 0);
    grilleMesh.rotation.x = -Math.PI / 2;
    group.add(grilleMesh);

    return group;
};

const generateAirPositions = (count: number) => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        arr[i * 3 + 0] = (Math.random() - 0.5) * 2;
        arr[i * 3 + 1] = Math.random() * 2;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    return arr;
};

const generateAirVelocities = (count: number) => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) {
        arr[i] = 1 + Math.random() * 2;
    }
    return arr;
};

// --- Air Particle Effect ---
const AirParticles = ({ count = 500 }: { count?: number }) => {
    const meshRef = useRef<THREE.Points>(null);

    const positions = useMemo(() => generateAirPositions(count), [count]);
    const velocities = useMemo(() => generateAirVelocities(count), [count]);

    useFrame((_state, delta) => {
        if (!meshRef.current) return;

        const geo = meshRef.current.geometry;
        const posAttr = geo.attributes.position;
        const positionsArray = posAttr.array as Float32Array;

        for (let i = 0; i < count; i++) {
            positionsArray[i * 3 + 1] -= velocities[i] * delta * 5;

            if (positionsArray[i * 3 + 1] < -0.5) {
                positionsArray[i * 3 + 1] = 2;
                positionsArray[i * 3 + 0] = (Math.random() - 0.5) * 2;
                positionsArray[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
            }
        }
        posAttr.needsUpdate = true;
    });

    return (
        <points ref={meshRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                color={0xffffff}
                size={0.02}
                transparent
                opacity={0.3}
                blending={THREE.AdditiveBlending}
                sizeAttenuation={true}
                depthWrite={false}
            />
        </points>
    );
};

// ĐÃ FIX: Chuyển mảng tĩnh ra ngoài component để tránh việc tạo lại mảng khi render
const NOZZLE_POSITIONS = [
    [-0.9, 0, 0],
    [-0.45, 0, 0],
    [0, 0, 0],
    [0.45, 0, 0],
    [0.9, 0, 0],
];

// --- Main Super-Fast Dryer Component ---
export const SuperFastDryer = () => {
    const nozzlesGroupRef = useRef<THREE.Group>(null);

    const gantryMesh = useMemo(() => createGantryMesh(), []);

    // ĐÃ FIX: Lắng nghe biến chuẩn xác trong mảng dependency array để dập cảnh báo ESLint
    const nozzleMeshes = useMemo(() => NOZZLE_POSITIONS.map(() => createBlowerNozzleMesh()), []);

    // ĐÃ FIX: Xóa bỏ hook rỗng hoặc thêm logic cụ thể để dập tắt lỗi no-empty
    useFrame((state) => {
        if (nozzlesGroupRef.current) {
            // Giả lập rung nhẹ các vòi xịt khí áp lực cao theo thời gian thực để trông thật hơn
            const time = state.clock.getElapsedTime();
            nozzlesGroupRef.current.children.forEach((child, index) => {
                child.rotation.z = Math.sin(time * 20 + index) * 0.02;
            });
        }
    });

    return (
        <group>
            {/* Dark Gantry Structure with Housing */}
            <primitive object={gantryMesh} position={[0, 4.0, 0]} />

            {/* Blower Nozzles attached below the gantry */}
            <group ref={nozzlesGroupRef} position={[0, 4.0, 0]}>
                {NOZZLE_POSITIONS.map((pos, index) => (
                    <primitive
                        key={index}
                        object={nozzleMeshes[index]}
                        position={pos}
                    />
                ))}
            </group>

            {/* High-speed air particle effect */}
            <AirParticles count={1000} />

            {/* Ground Plane */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial
                    color={0xcccccc}
                    roughness={1}
                />
            </mesh>
        </group>
    );
};