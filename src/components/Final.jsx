import { useRef, useEffect } from "react"
import { useGLTF, useAnimations } from "@react-three/drei"
import * as THREE from "three"

export default function Final(props) {
  const group = useRef()

  // Load model + animations
  const { scene, animations } = useGLTF("/models/final.glb")

  const { actions } = useAnimations(animations, group)

  // Play semua animasi looping
  useEffect(() => {
    if (!actions) return

    Object.values(actions).forEach((action) => {
      action.reset()
      action.setLoop(THREE.LoopRepeat, Infinity)
      action.fadeIn(0.5).play()
    })

    return () => {
      Object.values(actions).forEach((action) => {
        action.fadeOut(0.5)
      })
    }
  }, [actions])

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={scene} />
    </group>
  )
}

// Preload
useGLTF.preload("/models/final.glb")
