import * as THREE from 'three'
import React from 'react'
import { useGLTF } from '@react-three/drei'
import type { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    ID3358: THREE.Mesh
    ID3358_1: THREE.Mesh
    ID3358_2: THREE.Mesh
    ID3358_3: THREE.Mesh
    ID3358_4: THREE.Mesh
    ID3358_5: THREE.Mesh
    ID3358_6: THREE.Mesh
    ID3358_7: THREE.Mesh
    ID3358_8: THREE.Mesh
    ID3358_9: THREE.Mesh
    ID3358_10: THREE.Mesh
    ID3358_11: THREE.Mesh
    ID3358_12: THREE.Mesh
    ID3358_13: THREE.Mesh
    ID3358_14: THREE.Mesh
    ID3358_15: THREE.Mesh
    ID3358_16: THREE.Mesh
  }
  materials: {
    Polar_White: THREE.MeshStandardMaterial
    Interior: THREE.MeshStandardMaterial
    Color_M02: THREE.MeshStandardMaterial
    UnderCarriage: THREE.MeshStandardMaterial
    Color_A07: THREE.MeshStandardMaterial
    Grille: THREE.MeshStandardMaterial
    Color_M08: THREE.MeshStandardMaterial
    ChromeBlack_Windows: THREE.MeshStandardMaterial
    Lights_Glass: THREE.MeshStandardMaterial
    Color_A08: THREE.MeshStandardMaterial
    _2020_Mercedes_Benz_GLS450_wire_088144225: THREE.MeshStandardMaterial
    Color_M03: THREE.MeshStandardMaterial
    Color_M04: THREE.MeshStandardMaterial
    Color_M01: THREE.MeshStandardMaterial
    WindowsTint: THREE.MeshStandardMaterial
    Tyres: THREE.MeshStandardMaterial
    material: THREE.MeshStandardMaterial
  }
}

export function Model(props: React.ComponentProps<'group'>) {
  const { nodes, materials } = useGLTF('/car-optimized.glb') as unknown as GLTFResult

  return React.createElement(
      'group',
      { ...props, dispose: null },
      React.createElement(
          'group',
          { rotation: [-Math.PI / 2, 0, 0], scale: 2.54 },
          React.createElement(
              'group',
              { position: [70.337, 156.432, 0], scale: 0.42 },
              React.createElement('mesh', { geometry: nodes.ID3358.geometry, material: materials.Polar_White, castShadow: true, receiveShadow: true }),
              React.createElement('mesh', { geometry: nodes.ID3358_1.geometry, material: materials.Interior, castShadow: true, receiveShadow: true }),
              React.createElement('mesh', { geometry: nodes.ID3358_2.geometry, material: materials.Color_M02, castShadow: true, receiveShadow: true }),
              React.createElement('mesh', { geometry: nodes.ID3358_3.geometry, material: materials.UnderCarriage, castShadow: true, receiveShadow: true }),
              React.createElement('mesh', { geometry: nodes.ID3358_4.geometry, material: materials.Color_A07, castShadow: true, receiveShadow: true }),
              React.createElement('mesh', { geometry: nodes.ID3358_5.geometry, material: materials.Grille, castShadow: true, receiveShadow: true }),
              React.createElement('mesh', { geometry: nodes.ID3358_6.geometry, material: materials.Color_M08, castShadow: true, receiveShadow: true }),
              React.createElement('mesh', { geometry: nodes.ID3358_7.geometry, material: materials.ChromeBlack_Windows, castShadow: true, receiveShadow: true }),
              React.createElement('mesh', { geometry: nodes.ID3358_8.geometry, material: materials.Lights_Glass, castShadow: true, receiveShadow: true }),
              React.createElement('mesh', { geometry: nodes.ID3358_9.geometry, material: materials.Color_A08, castShadow: true, receiveShadow: true }),
              React.createElement('mesh', { geometry: nodes.ID3358_10.geometry, material: materials._2020_Mercedes_Benz_GLS450_wire_088144225, castShadow: true, receiveShadow: true }),
              React.createElement('mesh', { geometry: nodes.ID3358_11.geometry, material: materials.Color_M03, castShadow: true, receiveShadow: true }),
              React.createElement('mesh', { geometry: nodes.ID3358_12.geometry, material: materials.Color_M04, castShadow: true, receiveShadow: true }),
              React.createElement('mesh', { geometry: nodes.ID3358_13.geometry, material: materials.Color_M01, castShadow: true, receiveShadow: true }),
              React.createElement('mesh', { geometry: nodes.ID3358_14.geometry, material: materials.WindowsTint, castShadow: true, receiveShadow: true }),
              React.createElement('mesh', { geometry: nodes.ID3358_15.geometry, material: materials.Tyres, castShadow: true, receiveShadow: true }),
              React.createElement('mesh', { geometry: nodes.ID3358_16.geometry, material: materials.material, castShadow: true, receiveShadow: true })
          )
      )
  )
}

useGLTF.preload('/car-optimized.glb')