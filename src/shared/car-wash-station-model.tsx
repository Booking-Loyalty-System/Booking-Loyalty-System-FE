import * as THREE from 'three'
import React from 'react'
import { useGLTF } from '@react-three/drei'
import type { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
    nodes: {
        [key: string]: THREE.Mesh
    }
    materials: {
        [key: string]: THREE.Material
    }
}

// 🌟 Thay 'props' thành React.ComponentProps<'group'> để fix lỗi TS7006 (implicit any)
export function Model(props: React.ComponentProps<'group'>) {
    // 🌟 Ép kiểu nghiêm ngặt để fix triệt để lỗi TS2339 (property geometry does not exist)
    const { nodes, materials } = useGLTF('/car_wash_3d_free_model.glb') as unknown as GLTFResult

    return (
        <group {...props} dispose={null}>
            <group rotation={[-Math.PI / 2, 0, 0]}>
                <mesh castShadow receiveShadow geometry={nodes.Object_2.geometry} material={materials.back} />
                <mesh castShadow receiveShadow geometry={nodes.Object_3.geometry} material={materials.back_back_137} />
                <mesh castShadow receiveShadow geometry={nodes.Object_4.geometry} material={materials.back_back_143} />
                <mesh castShadow receiveShadow geometry={nodes.Object_5.geometry} material={materials.back_back_149} />
                <mesh castShadow receiveShadow geometry={nodes.Object_6.geometry} material={materials.bottom} />
                <mesh castShadow receiveShadow geometry={nodes.Object_7.geometry} material={materials.bottom_bottom_133} />
                <mesh castShadow receiveShadow geometry={nodes.Object_8.geometry} material={materials.bottom_bottom_139} />
                <mesh castShadow receiveShadow geometry={nodes.Object_9.geometry} material={materials.bottom_bottom_145} />
                <mesh castShadow receiveShadow geometry={nodes.Object_10.geometry} material={materials.front} />
                <mesh castShadow receiveShadow geometry={nodes.Object_11.geometry} material={materials.front_front_138} />
                <mesh castShadow receiveShadow geometry={nodes.Object_12.geometry} material={materials.front_front_144} />
                <mesh castShadow receiveShadow geometry={nodes.Object_13.geometry} material={materials.front_front_150} />
                <mesh castShadow receiveShadow geometry={nodes.Object_14.geometry} material={materials.ground_1} />
                <mesh castShadow receiveShadow geometry={nodes.Object_15.geometry} material={materials.left} />
                <mesh castShadow receiveShadow geometry={nodes.Object_16.geometry} material={materials.left_left_135} />
                <mesh castShadow receiveShadow geometry={nodes.Object_17.geometry} material={materials.right_right_142} />
                <mesh castShadow receiveShadow geometry={nodes.Object_18.geometry} material={materials.right_right_148} />
                <mesh castShadow receiveShadow geometry={nodes.Object_19.geometry} material={materials.left_left_141} />
                <mesh castShadow receiveShadow geometry={nodes.Object_20.geometry} material={materials.left_left_147} />
                <mesh castShadow receiveShadow geometry={nodes.Object_21.geometry} material={materials.right} />
                <mesh castShadow receiveShadow geometry={nodes.Object_22.geometry} material={materials.right_right_136} />
                <mesh castShadow receiveShadow geometry={nodes.Object_23.geometry} material={materials.lighttan} />
                <mesh castShadow receiveShadow geometry={nodes.Object_24.geometry} material={materials.lighttannew} />
                <mesh castShadow receiveShadow geometry={nodes.Object_25.geometry} material={materials.top_top_146} />
                <mesh castShadow receiveShadow geometry={nodes.Object_26.geometry} material={materials.top_top_140} />
                <mesh castShadow receiveShadow geometry={nodes.Object_27.geometry} material={materials.Box88_1} />
                <mesh castShadow receiveShadow geometry={nodes.Object_28.geometry} material={materials.Box88_1} />
                <mesh castShadow receiveShadow geometry={nodes.Object_29.geometry} material={materials.Box88_1} />
                <mesh castShadow receiveShadow geometry={nodes.Object_30.geometry} material={materials.Box88_1} />
                <mesh castShadow receiveShadow geometry={nodes.Object_31.geometry} material={materials.Box88_3236_3} />
                <mesh castShadow receiveShadow geometry={nodes.Object_32.geometry} material={materials.Box88_3236_3} />
                <mesh castShadow receiveShadow geometry={nodes.Object_33.geometry} material={materials.Box88_3236_3} />
                <mesh castShadow receiveShadow geometry={nodes.Object_34.geometry} material={materials.Box88_3236_3} />
                <mesh castShadow receiveShadow geometry={nodes.Object_35.geometry} material={materials.Box88_3236_3} />
                <mesh castShadow receiveShadow geometry={nodes.Object_36.geometry} material={materials.Box88_3236_3} />
                <mesh castShadow receiveShadow geometry={nodes.Object_37.geometry} material={materials.Box88_3224_2} />
                <mesh castShadow receiveShadow geometry={nodes.Object_38.geometry} material={materials.Box88_9134_8} />
                <mesh castShadow receiveShadow geometry={nodes.Object_39.geometry} material={materials.Box88_5670_4} />
                <mesh castShadow receiveShadow geometry={nodes.Object_40.geometry} material={materials.Box88_5670_4} />
                <mesh castShadow receiveShadow geometry={nodes.Object_41.geometry} material={materials.Box88_5670_4} />
                <mesh castShadow receiveShadow geometry={nodes.Object_42.geometry} material={materials.Box88_9122_7} />
                <mesh castShadow receiveShadow geometry={nodes.Object_43.geometry} material={materials.Box88_9214_10} />
                <mesh castShadow receiveShadow geometry={nodes.Object_44.geometry} material={materials.Box88_9162_9} />
                <mesh castShadow receiveShadow geometry={nodes.Object_45.geometry} material={materials.Box88_7558_5} />
                <mesh castShadow receiveShadow geometry={nodes.Object_46.geometry} material={materials.Box88_7558_5} />
                <mesh castShadow receiveShadow geometry={nodes.Object_47.geometry} material={materials.Box88_9216_11} />
                <mesh castShadow receiveShadow geometry={nodes.Object_48.geometry} material={materials.Box88_9110_6} />
                <mesh castShadow receiveShadow geometry={nodes.Object_49.geometry} material={materials.Box88_9236_12} />
                <mesh castShadow receiveShadow geometry={nodes.Object_50.geometry} material={materials.Box88_9288_13} />
                <mesh castShadow receiveShadow geometry={nodes.Object_51.geometry} material={materials.Junction} />
                <mesh castShadow receiveShadow geometry={nodes.Object_52.geometry} material={materials.Left} />
                <mesh castShadow receiveShadow geometry={nodes.Object_53.geometry} material={materials.Right} />
                <mesh castShadow receiveShadow geometry={nodes.Object_54.geometry} material={materials.archwhite2} />
                <mesh castShadow receiveShadow geometry={nodes.Object_55.geometry} material={materials.material} />
                <mesh castShadow receiveShadow geometry={nodes.Object_56.geometry} material={materials.back_back_155} />
                <mesh castShadow receiveShadow geometry={nodes.Object_57.geometry} material={materials.back_back_167} />
                <mesh castShadow receiveShadow geometry={nodes.Object_58.geometry} material={materials.back_back_496} />
                <mesh castShadow receiveShadow geometry={nodes.Object_59.geometry} material={materials.back_back_502} />
                <mesh castShadow receiveShadow geometry={nodes.Object_60.geometry} material={materials.black} />
                <mesh castShadow receiveShadow geometry={nodes.Object_61.geometry} material={materials.bottom_bottom_151} />
                <mesh castShadow receiveShadow geometry={nodes.Object_62.geometry} material={materials.bottom_bottom_163} />
                <mesh castShadow receiveShadow geometry={nodes.Object_63.geometry} material={materials.bottom_bottom_492} />
                <mesh castShadow receiveShadow geometry={nodes.Object_64.geometry} material={materials.bottom_bottom_498} />
                <mesh castShadow receiveShadow geometry={nodes.Object_65.geometry} material={materials.flblonde} />
                <mesh castShadow receiveShadow geometry={nodes.Object_66.geometry} material={materials.flltgrey} />
                <mesh castShadow receiveShadow geometry={nodes.Object_67.geometry} material={materials.front_front_156} />
                <mesh castShadow receiveShadow geometry={nodes.Object_68.geometry} material={materials.front_front_168} />
                <mesh castShadow receiveShadow geometry={nodes.Object_69.geometry} material={materials.front_front_497} />
                <mesh castShadow receiveShadow geometry={nodes.Object_70.geometry} material={materials.front_front_503} />
                <mesh castShadow receiveShadow geometry={nodes.Object_71.geometry} material={materials.iris} />
                <mesh castShadow receiveShadow geometry={nodes.Object_72.geometry} material={materials.iris} />
                <mesh castShadow receiveShadow geometry={nodes.Object_73.geometry} material={materials.right_right_154} />
                <mesh castShadow receiveShadow geometry={nodes.Object_74.geometry} material={materials.left_left_153} />
                <mesh castShadow receiveShadow geometry={nodes.Object_75.geometry} material={materials.left_left_165} />
                <mesh castShadow receiveShadow geometry={nodes.Object_76.geometry} material={materials.left_left_494} />
                <mesh castShadow receiveShadow geometry={nodes.Object_77.geometry} material={materials.left_left_500} />
                <mesh castShadow receiveShadow geometry={nodes.Object_78.geometry} material={materials.silver} />
                <mesh castShadow receiveShadow geometry={nodes.Object_79.geometry} material={materials.top_top_152} />
                <mesh castShadow receiveShadow geometry={nodes.Object_80.geometry} material={materials.material_66} />
                <mesh castShadow receiveShadow geometry={nodes.Object_81.geometry} material={materials.right_right_166} />
                <mesh castShadow receiveShadow geometry={nodes.Object_82.geometry} material={materials.right_right_495} />
                <mesh castShadow receiveShadow geometry={nodes.Object_83.geometry} material={materials.right_right_501} />
                <mesh castShadow receiveShadow geometry={nodes.Object_84.geometry} material={materials.top_top_164} />
                <mesh castShadow receiveShadow geometry={nodes.Object_85.geometry} material={materials.top_top_493} />
                <mesh castShadow receiveShadow geometry={nodes.Object_86.geometry} material={materials.top_top_499} />
                <mesh castShadow receiveShadow geometry={nodes.Object_87.geometry} material={materials.wall_1_2} />
                <mesh castShadow receiveShadow geometry={nodes.Object_88.geometry} material={materials.wall_1_2} />
                <mesh castShadow receiveShadow geometry={nodes.Object_89.geometry} material={materials.wall_6_32} />
                <mesh castShadow receiveShadow geometry={nodes.Object_90.geometry} material={materials.wall_6_32} />
                <mesh castShadow receiveShadow geometry={nodes.Object_91.geometry} material={materials.wall_6_33} />
                <mesh castShadow receiveShadow geometry={nodes.Object_92.geometry} material={materials.white} />
                <mesh castShadow receiveShadow geometry={nodes.Object_93.geometry} material={materials.white_Ailette_6_311} />
                <mesh castShadow receiveShadow geometry={nodes.Object_94.geometry} material={materials.white_Reservoir_265} />
                <mesh castShadow receiveShadow geometry={nodes.Object_95.geometry} material={materials.white_Tour_Fenetre_483} />
                <mesh castShadow receiveShadow geometry={nodes.Object_96.geometry} material={materials.white_frame_293} />
                <mesh castShadow receiveShadow geometry={nodes.Object_97.geometry} material={materials.yellowbrt} />
                <mesh castShadow receiveShadow geometry={nodes.Object_98.geometry} material={materials.white_frame_275} />
                <mesh castShadow receiveShadow geometry={nodes.Object_99.geometry} material={materials.yellowbrt_sweethome3d_opening_on_hinge_1_handleOut_12_297} />
            </group>
        </group>
    )
}

useGLTF.preload('/car_wash_3d_free_model.glb')