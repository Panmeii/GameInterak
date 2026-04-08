import { Environment, OrbitControls } from "@react-three/drei"
import { useGame } from "../hooks/useGame"
import { GAMEBOARD_LENGTH } from "../App"

import Gameboard from "./Gameboard"
import Snowman from "./Snowman"
import Grave from "./Grave"
import Santa from "./Santa"
import Explosion from "./Explosion"
import Final from "./Final"

export default function Experience() {
  const { state } = useGame()

  const { status, snowmen, showBomb } = state

  return (
    <>
      {/* Lighting */}
      <Environment preset="sunset" />

      <directionalLight
        position={[5, 10, 5]}
        intensity={1.5}
        castShadow
      />

      {/* Controls (debug / dev) */}
      <OrbitControls />

      {/* Game Over Screen */}
      {status === "gameover" && <Final />}

      {/* Game Scene */}
      {status === "playing" && (
        <>
          {/* Gameboards (loop illusion) */}
          <Gameboard position={[0, 0, 0]} />
          <Gameboard position={[0, 0, 42]} />
          <Gameboard position={[0, 0, -GAMEBOARD_LENGTH]} />

          {/* Snowmen */}
          {snowmen.map((snowman) =>
            snowman.hp > 0 ? (
              <Snowman key={snowman.id} {...snowman} />
            ) : (
              <Grave key={snowman.id} {...snowman} />
            )
          )}

          {/* Bomb Effect */}
          {showBomb && <Explosion />}

          {/* Player */}
          <Santa position={[0, 0, 6]} />
        </>
      )}
    </>
  )
}
