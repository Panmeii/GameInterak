import { useRef, useEffect, useMemo } from "react"
import { useGLTF, useAnimations } from "@react-three/drei"
import { SkeletonUtils } from "three-stdlib"

export default function Santa(props) {
  const group = useRef()

  // Load model
  const { scene, animations } = useGLTF("/models/santa.glb")

  // Clone biar aman (skinned mesh issue fix)
  const clonedScene = useMemo(() => SkeletonUtils.clone(scene), [scene])

  // Animations
  const { actions } = useAnimations(animations, group)

  // Play "Run" animation saat mount
  useEffect(() => {
    if (actions?.Run) {
      actions.Run.reset().fadeIn(0.2).play()
    }

    return () => {
      if (actions?.Run) {
        actions.Run.fadeOut(0.2)
      }
    }
  }, [actions])

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={clonedScene} />
    </group>
  )
}

// Preload
useGLTF.preload("/models/santa.glb")
