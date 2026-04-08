import { useRef, useEffect, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { useGLTF, useAnimations, Billboard, Text } from "@react-three/drei"
import { SkeletonUtils } from "three-stdlib"
import * as THREE from "three"

export default function Snowman({
  id,
  name,
  hp,
  attackable,
  ...props
}) {
  const group = useRef()
  const nameRef = useRef()

  // Load model
  const { scene, animations } = useGLTF("/models/snowman.glb")

  // Clone (fix skinned mesh)
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene])

  // Animations
  const { actions } = useAnimations(animations, group)

  // Play Run animation dengan random offset
  useEffect(() => {
    if (actions?.Run) {
      const action = actions.Run
      action.reset()
      action.time = Math.random() * action.getClip().duration
      action.play()
    }
  }, [actions])

  // Animate position + name opacity
  useFrame((_, delta) => {
    if (!group.current) return

    // Target Z
    const targetZ = hp <= 0 ? -40 : 0

    // Smooth lerp
    group.current.position.z = THREE.MathUtils.lerp(
      group.current.position.z,
      targetZ,
      5 * delta
    )

    // Name opacity (attackable = visible)
    if (nameRef.current) {
      const targetOpacity = attackable ? 1 : 0.2
      nameRef.current.material.opacity = THREE.MathUtils.lerp(
        nameRef.current.material.opacity,
        targetOpacity,
        5 * delta
      )
    }
  })

  return (
    <group ref={group} {...props} dispose={null}>
      
      {/* Snowman Model */}
      <primitive object={clonedScene} />

      {/* Name Billboard */}
      <Billboard position={[0, 2.5, 0]}>
        <Text
          ref={nameRef}
          fontSize={0.4}
          color="red"
          anchorX="center"
          anchorY="middle"
        >
          {name}
          <meshStandardMaterial
            color="red"
            emissive="red"
            transparent
            opacity={0.2}
          />
        </Text>
      </Billboard>

    </group>
  )
}

// Preload
useGLTF.preload("/models/snowman.glb")
