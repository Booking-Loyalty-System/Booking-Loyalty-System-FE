import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import type { GLTF } from 'three-stdlib'
import type { JSX } from "react";
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

type GLTFAction = THREE.AnimationClip;

type GLTFResult = GLTF & {
    nodes: {
        Body: THREE.Mesh
        TireMaterial: THREE.Mesh
        GlassMaterial: THREE.Mesh
        Door: THREE.Mesh
        Hood: THREE.Mesh
    }
    materials: {
        ['material.body']: THREE.MeshStandardMaterial
        ['material.tire']: THREE.MeshStandardMaterial
        ['material.glass']: THREE.MeshStandardMaterial
        ['material.door']: THREE.MeshStandardMaterial
        ['material.hood']: THREE.MeshStandardMaterial
    }
    animations: GLTFAction[]
}

type ModelProps = JSX.IntrinsicElements['group'] & {
    stepStr?: string;
};

export function Model({ stepStr, ...props }: ModelProps) {
    const { nodes, materials } = useGLTF('/glc.glb') as unknown as GLTFResult

    const doorRef = useRef<THREE.Group>(null);
    const hoodRef = useRef<THREE.Group>(null);

    useFrame(() => {
        // --- 1. XỬ LÝ MỞ/ĐÓNG CỬA XE (Rửa nội thất) ---
        if (doorRef.current) {
            // Kiểm tra bao quát toàn bộ các biến thể chuỗi dọn dẹp nội thất
            const isInteriorStep = [
                'interior_vacuum',
                'dashboard_polish',
                'leather_conditioning',
                'air_freshener',
                'interior_cleaning'
            ].includes(stepStr || '');

            // Đổi thành dấu trừ (-Math.PI / 2) để hướng mở quay ra NGOÀI xe vuông góc 90 độ
            const targetDoorRot = isInteriorStep ? (-Math.PI / 2) : 0;

            // Giữ nguyên trục .z để quét ngang mặt đất chuẩn bản lề
            doorRef.current.rotation.z = THREE.MathUtils.lerp(doorRef.current.rotation.z, targetDoorRot, 0.1);
        }

        // --- 2. XỬ LÝ MỞ/ĐÓNG NẮP CAPO (Rửa động cơ) ---
        if (hoodRef.current) {
            // Khi stepStr khớp chính xác với 'engine_cleaning', nắp capo sẽ mở lên
            const targetHoodRotX = stepStr === 'engine_cleaning' ? - 0.8 : 0;

            hoodRef.current.rotation.x = THREE.MathUtils.lerp(hoodRef.current.rotation.x, targetHoodRotX, 0.1);
        }
    });

    // 📌 GIỮ NGUYÊN TOÀN BỘ TỌA ĐỘ VÀ BẢN LỀ GỐC CỦA BẠN (HOÀN TOÀN KHÔNG ĐỤNG VÀO)
    const HOOD_HINGE_Y = -190;
    const HOOD_HINGE_Z = 125;

    const DOOR_X = 82;
    const DOOR_Y = -100;
    const DOOR_Z = -115;

    return (
        <group {...props} dispose={null}>
            <mesh geometry={nodes.Body.geometry} material={materials['material.body']} position={[178.656, 0, -397.337]} rotation={[-Math.PI / 2, 0, 0]} scale={1.067} />
            <mesh geometry={nodes.TireMaterial.geometry} material={materials['material.tire']} position={[178.656, 0, -397.337]} rotation={[-Math.PI / 2, 0, 0]} scale={1.067} />
            <mesh geometry={nodes.GlassMaterial.geometry} material={materials['material.glass']} position={[178.656, 0, -397.337]} rotation={[-Math.PI / 2, 0, 0]} scale={1.067} />

            {/* Gắn ref vào Door */}
            <group position={[178.656, 0, -397.337]} rotation={[-Math.PI / 2, 0, 0]} scale={1.067}>
                {/* Group này tọa lạc ngay mép bản lề trước của cánh cửa */}
                <group ref={doorRef} position={[DOOR_X, DOOR_Y, DOOR_Z]}>
                    {/* Mesh thực tế dịch chuyển ngược hướng để bù trừ lại vị trí khít ban đầu */}
                    <mesh
                        geometry={nodes.Door.geometry}
                        material={materials['material.door']}
                        position={[-DOOR_X, -DOOR_Y, -DOOR_Z]}
                    />
                </group>
            </group>

            {/* Gắn ref vào Hood */}
            <group position={[178.656, 0, -397.337]} rotation={[-Math.PI / 2, 0, 0]} scale={1.067}>
                {/* Group này đặt đúng vị trí thanh bản lề của xe */}
                <group ref={hoodRef} position={[0, HOOD_HINGE_Y, HOOD_HINGE_Z]}>
                    {/* Mesh nắp capo được kéo ngược lại một khoảng tương ứng để khi đóng nó khít 100% */}
                    <mesh
                        geometry={nodes.Hood.geometry}
                        material={materials['material.hood']}
                        position={[0, -HOOD_HINGE_Y, -HOOD_HINGE_Z]}
                    />
                </group>
            </group>
        </group>
    )
}

useGLTF.preload('/glc.glb')