import { Canvas } from "@react-three/fiber"
import { EffectComposer, Bloom } from "@react-three/postprocessing"
import { GameProvider } from "./context/GameProvider"
import UI from "./components/UI"

const SNOWMAN_COLUMNS = 4
const SNOWMAN_SPACE_COLUMN = 2.5
const SNOWMAN_SPACE_ROW = 4
const SCROLL_SPEED = 10
const GAMEBOARD_LENGTH = 56

export default function App() {
  return (
    <GameProvider
      value={{
        SNOWMAN_COLUMNS,
        SNOWMAN_SPACE_COLUMN,
        SNOWMAN_SPACE_ROW,
        SCROLL_SPEED,
        GAMEBOARD_LENGTH
      }}
    >
      <Canvas camera={{ position: [0, 8, 12], fov: 90 }}>
        
        {/* Fog */}
        <fog attach="fog" args={["#333", 14, 35]} />

        {/* Scene kamu nanti di sini */}
        
        {/* Post Processing */}
        <EffectComposer>
          <Bloom
            mipmapBlur
            intensity={1.2}
            luminanceThreshold={1}
          />
        </EffectComposer>
      </Canvas>

      {/* UI Overlay */}
      <UI />
    </GameProvider>
  )
}
