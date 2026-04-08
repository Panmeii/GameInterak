import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF, useTexture } from "@react-three/drei"

import { SCROLL_SPEED } from "../App"
import Explosion from "./Explosion"

export default function Grave({ photo, ...props }) {
  const group = useRef()

  const { nodes, materials } = useGLTF("/models/grave.glb")

  // Texture foto player
  const texture = useTexture(photo)

  // Scroll mengikuti gameboard
  useFrame((_, delta) => {
    if (!group.current) return
    group.current.position.z -= SCROLL_SPEED * delta
  })

  return (
    <group ref={group} {...props} dispose={null}>
      
      {/* Explosion saat spawn grave */}
      <Explosion
        limitX={1}
        limitY={5}
        limitZ={3}
        scale={0.15}
        multicolor={false}
      />

      {/* Model Grave */}
      <mesh
        geometry={nodes.Grave.geometry}
        material={materials.Grave}
      />

      {/* Foto Player */}
      <mesh position={[0, 1.2, 0.1]}>
        <planeGeometry args={[0.8, 0.8]} />
        <meshBasicMaterial map={texture} transparent />
      </mesh>

    </group>
  )
}

// Preload
useGLTF.preload("/models/grave.glb")
