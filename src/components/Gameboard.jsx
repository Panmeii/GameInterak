import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"

import { SCROLL_SPEED, GAMEBOARD_LENGTH } from "../App"

export default function Gameboard(props) {
  const group = useRef()

  const { nodes, materials } = useGLTF("/models/gameboard.glb")

  // =======================
  // Scrolling Logic
  // =======================
  useFrame((_, delta) => {
    if (!group.current) return

    group.current.position.z -= SCROLL_SPEED * delta

    // reset posisi (loop)
    if (group.current.position.z < -2 * GAMEBOARD_LENGTH) {
      group.current.position.z += 3 * GAMEBOARD_LENGTH
    }
  })

  return (
    <group ref={group} {...props} dispose={null}>
      
      {/* Main Ground */}
      <mesh
        geometry={nodes.Ground.geometry}
        material={materials.Ground}
      />

      {/* Presents */}
      <mesh
        geometry={nodes.Presents.geometry}
        material={materials.Presents}
      />

      {/* Trees */}
      <mesh
        geometry={nodes.Trees.geometry}
        material={materials.Trees}
      />

      {/* Benches */}
      <mesh
        geometry={nodes.Benches.geometry}
        material={materials.Benches}
      />

      {/* Arches */}
      <mesh
        geometry={nodes.Arches.geometry}
        material={materials.Arches}
      />

      {/* Decorations */}
      <mesh
        geometry={nodes.Decorations.geometry}
        material={materials.Decorations}
      />

    </group>
  )
}

// Preload biar lebih cepat
useGLTF.preload("/models/gameboard.glb")
