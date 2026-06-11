import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import type { GLTF } from 'three-stdlib'
import type { JSX } from "react";

type GLTFResult = GLTF & {
    nodes: {
        [key: string]: THREE.Mesh
    }
    materials: {
        [key: string]: THREE.Material
    }
}

export function Model(props: JSX.IntrinsicElements['group']) {
    const { nodes } = useGLTF('/car_wash.glb') as unknown as GLTFResult
    const deltaY = -20;

    return (
        <group {...props} dispose={null}>
            {/* Trục xoay mặc định của mô hình */}
            <group rotation={[-Math.PI / 2, 0, 0]}>

                {/* ========================================================
                    P HẦ N  1 :  4  M Á Y  H Ú T  B Ụ I  ( C Ụ M  B Ê N  P H Ả I )
                    Nằm rải rác thành một hàng dọc ở khoảng sân trống bên phải
                    ======================================================== */}

                {/* Máy hút bụi số 1 (Nằm xa nhất về phía sau bên phải) */}
                {nodes.vacuum_cleaner_1_lambert1_0 && (
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.vacuum_cleaner_1_lambert1_0.geometry}
                        position={[0, -3.029 + deltaY, 0]}
                    >
                        {/* Màu Đen Kim Loại Titan */}
                        <meshStandardMaterial color="#22252a" metalness={0.7} roughness={0.2} />
                    </mesh>
                )}

                {/* Máy hút bụi số 2 */}
                {nodes.vacuum_cleaner_2_lambert1_0 && (
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.vacuum_cleaner_2_lambert1_0.geometry}
                        position={[0, 4.403 + deltaY, 0]}
                    >
                        <meshStandardMaterial color="#22252a" metalness={0.7} roughness={0.2} />
                    </mesh>
                )}

                {/* Máy hút bụi số 3 */}
                {nodes.vacuum_cleaner_3_lambert1_0 && (
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.vacuum_cleaner_3_lambert1_0.geometry}
                        position={[0, 12.519 + deltaY, 0]}
                    >
                        <meshStandardMaterial color="#22252a" metalness={0.7} roughness={0.2} />
                    </mesh>
                )}

                {/* Máy hút bụi số 4 (Nằm gần tòa nhà trung tâm nhất) */}
                {nodes.vacuum_cleaner_4_lambert1_0 && (
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.vacuum_cleaner_4_lambert1_0.geometry}
                        position={[0, 20.805 + deltaY, 0]}
                    >
                        <meshStandardMaterial color="#22252a" metalness={0.7} roughness={0.2} />
                    </mesh>
                )}


                {/* ========================================================
                    P HẦ N  2 :  C Á C  C Ộ T  V À  B I Ể N  S Ố  R Ử A  X E
                    Các thanh chắn chia buồng và các biển số từ 1 đến 8
                    ======================================================== */}

                {/* Cột số 1 (Đầu buồng rửa phía bên phải) */}
                {nodes.t1_typeBlinn4_0 && (
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.t1_typeBlinn4_0.geometry}
                        position={[-0.19, -28.712, 7.516]}
                        rotation={[Math.PI / 2, Math.PI / 2, 0]}
                        scale={[1, 1, 0.156]}
                    >
                        <meshStandardMaterial color="#ff4400" metalness={0.4} roughness={0.2} />
                    </mesh>
                )}

                {/* Cột số 2 */}
                {nodes.t2_typeBlinn3_0 && (
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.t2_typeBlinn3_0.geometry}
                        position={[2.438, -21.567, 7.517]}
                        rotation={[Math.PI / 2, Math.PI / 2, 0]}
                        scale={[1, 1, 0.188]}
                    >
                        <meshStandardMaterial color="#ff4400" metalness={0.4} roughness={0.2} />
                    </mesh>
                )}

                {/* Cột số 3 */}
                {nodes.t3_typeBlinn5_0 && (
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.t3_typeBlinn5_0.geometry}
                        position={[2.672, -14.437, 7.504]}
                        rotation={[Math.PI / 2, Math.PI / 2, 0]}
                        scale={[1, 1, 0.099]}
                    >
                        <meshStandardMaterial color="#ff4400" metalness={0.4} roughness={0.2} />
                    </mesh>
                )}

                {/* Cột số 4 (Sát tòa nhà trung tâm - vòm bên phải) */}
                {nodes.t4_typeBlinn6_0 && (
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.t4_typeBlinn6_0.geometry}
                        position={[2.688, -7.171, 7.48]}
                        rotation={[Math.PI / 2, Math.PI / 2, 0]}
                        scale={[1, 1, 0.084]}
                    >
                        <meshStandardMaterial color="#ff4400" metalness={0.4} roughness={0.2} />
                    </mesh>
                )}

                {/* Cột số 5 (Sát tòa nhà trung tâm - vòm bên trái) */}
                {nodes.t5_typeBlinn7_0 && (
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.t5_typeBlinn7_0.geometry}
                        position={[2.283, 6.966, 7.503]}
                        rotation={[Math.PI / 2, Math.PI / 2, 0]}
                        scale={[1, 1, 0.253]}
                    >
                        <meshStandardMaterial color="#ff4400" metalness={0.4} roughness={0.2} />
                    </mesh>
                )}

                {/* Cột số 6 */}
                {nodes.t6_typeBlinn9_0 && (
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.t6_typeBlinn9_0.geometry}
                        position={[2.458, 14.297, 7.508]}
                        rotation={[Math.PI / 2, Math.PI / 2, 0]}
                        scale={[1, 1, 0.191]}
                    >
                        <meshStandardMaterial color="#ff4400" metalness={0.4} roughness={0.2} />
                    </mesh>
                )}

                {/* Cột số 7 */}
                {nodes.t7_typeBlinn10_0 && (
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.t7_typeBlinn10_0.geometry}
                        position={[2.587, 21.809, 7.484]}
                        rotation={[Math.PI / 2, Math.PI / 2, 0]}
                        scale={[1, 1, 0.129]}
                    >
                        <meshStandardMaterial color="#ff4400" metalness={0.4} roughness={0.2} />
                    </mesh>
                )}

                {/* Cột số 8 (Cuối buồng rửa phía bên trái) */}
                {nodes.t8_typeBlinn11_0 && (
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.t8_typeBlinn11_0.geometry}
                        position={[-0.199, 28.131, 7.498]}
                        rotation={[Math.PI / 2, Math.PI / 2, 0]}
                        scale={[1, 1, 0.159]}
                    >
                        <meshStandardMaterial color="#ff4400" metalness={0.4} roughness={0.2} />
                    </mesh>
                )}


                {/* ========================================================
                    P HẦ N  3 :  T Ò A  N H À  C H Í N H  V À  M Á I  V Ò M
                    Khung kiến trúc chủ đạo nằm ở vị trí trung tâm scene
                    ======================================================== */}

                {/* Chữ "CAR WASH" (Nằm trên đỉnh tòa nhà hình trụ chính giữa) */}
                {nodes.car_wash_typeBlinn1_0 && (
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.car_wash_typeBlinn1_0.geometry}
                        position={[3.554, -1.821, 12.613]}
                        rotation={[Math.PI / 2, Math.PI / 2, 0]}
                        scale={0.054}
                    >
                        {/* Màu Vàng chữ nổi thương hiệu */}
                        <meshStandardMaterial color="#ffcc00" roughness={0.1} />
                    </mesh>
                )}

                {/* Mái vòm che số 1 (Cánh bên phải trạm rửa) */}
                {nodes.wash_lambert1_0 && (
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.wash_lambert1_0.geometry}
                    >
                        {/* Màu Xanh Dương của mái che bạt */}
                        <meshStandardMaterial color="#0055ff" metalness={0.2} roughness={0.4} />
                    </mesh>
                )}

                {/* Mái vòm che số 2 (Cánh bên trái trạm rửa) */}
                {nodes.wash_lambert1_0_1 && (
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.wash_lambert1_0_1.geometry}
                    >
                        <meshStandardMaterial color="#0055ff" metalness={0.2} roughness={0.4} />
                    </mesh>
                )}

                {/* Mái vòm che số 3 (Các chi tiết viền / ống nối nhỏ của mái che) */}
                {nodes.wash_lambert1_0_2 && (
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.wash_lambert1_0_2.geometry}
                    >
                        <meshStandardMaterial color="#0055ff" metalness={0.2} roughness={0.4} />
                    </mesh>
                )}

                {/* Tòa nhà hình trụ ở CHÍNH GIỮA (Nơi điều khiển / văn phòng trạm rửa) */}
                {nodes.building_lambert1_0 && (
                    <mesh
                        castShadow
                        receiveShadow
                        geometry={nodes.building_lambert1_0.geometry}
                    >
                        {/* Màu Xám Bạc hiện đại của bê tông / kim loại */}
                        <meshStandardMaterial color="#cbd5e1" metalness={0.5} roughness={0.3} />
                    </mesh>
                )}

            </group>
        </group>
    )
}

useGLTF.preload('/car_wash.glb')