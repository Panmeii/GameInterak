import { createContext, useContext, useReducer, useEffect } from "react"
import { insertCoin } from "playroomkit"

// =======================
// Context
// =======================
const GameContext = createContext()

// =======================
// Initial State
// =======================
const initialState = {
  status: "start", // start | playing | gameover
  timer: 60,
  snowmen: [],
  leaderboard: {},
}

// =======================
// Reducer
// =======================
function gameReducer(state, action) {
  switch (action.type) {
    case "START_GAME":
      return {
        ...state,
        status: "playing",
        timer: 60,
        snowmen: [],
        leaderboard: {},
      }

    case "TICK":
      if (state.timer <= 0) {
        return { ...state, status: "gameover" }
      }
      return { ...state, timer: state.timer - 1 }

    case "SPAWN_SNOWMAN":
      return {
        ...state,
        snowmen: [...state.snowmen, action.payload],
      }

    case "ATTACK":
      return {
        ...state,
        snowmen: state.snowmen.map((s) =>
          s.id === action.id && s.attackable
            ? { ...s, hp: s.hp - 1 }
            : s
        ),
      }

    case "BOMB":
      return {
        ...state,
        snowmen: state.snowmen.map((s) => ({
          ...s,
          hp: s.hp - 3,
        })),
      }

    case "LIKE":
      return {
        ...state,
        timer: Math.min(state.timer + 1, 60),
      }

    case "REMOVE_SNOWMAN":
      return {
        ...state,
        snowmen: state.snowmen.filter((s) => s.id !== action.id),
      }

    case "UPDATE_LEADERBOARD":
      const current = state.leaderboard[action.name] || 0
      return {
        ...state,
        leaderboard: {
          ...state.leaderboard,
          [action.name]: current + action.score,
        },
      }

    default:
      return state
  }
}

// =======================
// Provider
// =======================
export function GameProvider({ children, value }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  // =======================
  // Timer Logic
  // =======================
  useEffect(() => {
    if (state.status !== "playing") return

    const interval = setInterval(() => {
      dispatch({ type: "TICK" })
    }, 1000)

    return () => clearInterval(interval)
  }, [state.status])

  // =======================
  // TikTok Live Integration
  // =======================
  useEffect(() => {
    insertCoin({
      liveMode: "tiktok",
      onTikTokLiveEvent: (event) => {
        if (event.type === "chat") {
          dispatch({ type: "ATTACK", id: event.userId })
        }

        if (event.type === "gift") {
          dispatch({ type: "BOMB" })
        }

        if (event.type === "like") {
          dispatch({ type: "LIKE" })
        }
      },
    })
  }, [])

  // =======================
  // Spawn Snowmen
  // =======================
  useEffect(() => {
    if (state.status !== "playing") return

    const interval = setInterval(() => {
      const id = Date.now()

      const snowman = {
        id,
        name: `Snowman-${id}`,
        hp: 3,
        attackable: false,
        spawnedAt: Date.now(),
      }

      dispatch({ type: "SPAWN_SNOWMAN", payload: snowman })

      // delay attackable (1.8s)
      setTimeout(() => {
        snowman.attackable = true
      }, 1800)

      // respawn/remove (3s)
      setTimeout(() => {
        dispatch({ type: "REMOVE_SNOWMAN", id })
      }, 3000)
    }, 2000)

    return () => clearInterval(interval)
  }, [state.status])

  return (
    <GameContext.Provider value={{ state, dispatch, ...value }}>
      {children}
    </GameContext.Provider>
  )
}

// =======================
// Hook
// =======================
export function useGame() {
  return useContext(GameContext)
}
