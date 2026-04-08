import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Instances, Instance } from "@react-three/drei"
import * as THREE from "three"

// =======================
// Animated Box
// =======================
function AnimatedBox({ data }) {
  const ref = useRef()

  useFrame((_, delta) => {
    if (!ref.current) return

    // Move toward target
    ref.current.position.lerp(data.target, data.speed * delta)

    // Scale down over time
    ref.current.scale.lerp(new THREE.Vector3(0, 0, 0), 2 * delta)
  })

  return (
    <Instance
      ref={ref}
      position={[0, 0, 0]}
      scale={[1, 1, 1]}
      color={data.color}
    />
  )
}

// =======================
// Explosion Component
// =======================
export default function Explosion({
  nb = 20,
  limitX = 2,
  limitY = 2,
  limitZ = 2,
  multicolor = true,
  scale = 0.2,
}) {
  // Generate particles data
  const particles = useMemo(() => {
    const colors = multicolor
      ? ["green", "red", "white", "blue", "yellow"]
      : ["red"]

    return new Array(nb).fill().map(() => {
      return {
        target: new THREE.Vector3(
          (Math.random() - 0.5) * limitX,
          Math.random() * limitY,
          (Math.random() - 0.5) * limitZ
        ),
        speed: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      }
    })
  }, [nb, limitX, limitY, limitZ, multicolor])

  return (
    <Instances limit={nb}>
      {/* Shared geometry + material */}
      <boxGeometry args={[scale, scale, scale]} />
      <meshStandardMaterial />

      {/* Particles */}
      {particles.map((data, i) => (
        <AnimatedBox key={i} data={data} />
      ))}
    </Instances>
  )
}
