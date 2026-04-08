import { useGame } from "../hooks/useGame"

const DEBUG_MODE = true

const gradients = [
  "linear-gradient(90deg, gold, orange)",
  "linear-gradient(90deg, silver, gray)",
  "linear-gradient(90deg, #cd7f32, brown)",
]

export default function UI() {
  const { state, dispatch } = useGame()
  const { status, leaderboard, timer } = state

  // Convert leaderboard ke array
  const sortedLeaderboard = Object.entries(leaderboard)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)

  return (
    <div style={styles.container}>
      
      {/* ======================= */}
      {/* Leaderboard */}
      {/* ======================= */}
      <div style={styles.leaderboard}>
        <div style={styles.scroll}>
          {sortedLeaderboard.map(([name, score], index) => (
            <div
              key={name}
              style={{
                ...styles.player,
                background:
                  gradients[index] || "rgba(255,255,255,0.1)",
              }}
            >
              <span>{index + 1}. {name}</span>
              <span>☃️ {score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ======================= */}
      {/* Start Screen */}
      {/* ======================= */}
      {status === "start" && (
        <div style={styles.center}>
          <h1>🎄 Survival Christmas</h1>
          <p>Ketik di chat = attack</p>
          <p>Gift = bomb 💣</p>
          <p>Like = tambah waktu ❤️</p>

          <button
            onClick={() => dispatch({ type: "START_GAME" })}
            style={styles.button}
          >
            START
          </button>
        </div>
      )}

      {/* ======================= */}
      {/* Gameplay HUD */}
      {/* ======================= */}
      {status === "playing" && (
        <div style={styles.timer}>
          ⏱ {timer}s
        </div>
      )}

      {/* ======================= */}
      {/* Game Over */}
      {/* ======================= */}
      {status === "gameover" && (
        <div style={styles.center}>
          <h1>🎉 Congratulations!</h1>
          <p>Game selesai!</p>

          <button
            onClick={() => dispatch({ type: "START_GAME" })}
            style={styles.button}
          >
            PLAY AGAIN
          </button>
        </div>
      )}

      {/* ======================= */}
      {/* Debug Controls */}
      {/* ======================= */}
      {DEBUG_MODE && status === "playing" && (
        <div style={styles.debug}>
          <button onClick={() => dispatch({ type: "ATTACK", id: Date.now() })}>
            Chat (Attack)
          </button>
          <button onClick={() => dispatch({ type: "LIKE" })}>
            Like
          </button>
          <button onClick={() => dispatch({ type: "BOMB" })}>
            Gift (Bomb)
          </button>
        </div>
      )}
    </div>
  )
}

// =======================
// Styles
// =======================
const styles = {
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    pointerEvents: "none",
    color: "white",
    fontFamily: "sans-serif",
  },

  leaderboard: {
    width: "100%",
    overflow: "hidden",
    whiteSpace: "nowrap",
    background: "rgba(0,0,0,0.4)",
  },

  scroll: {
    display: "inline-flex",
    animation: "scroll 15s linear infinite",
  },

  player: {
    margin: "5px",
    padding: "8px 12px",
    borderRadius: "10px",
    display: "flex",
    gap: "10px",
    fontSize: "14px",
  },

  center: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    pointerEvents: "auto",
  },

  button: {
    padding: "10px 20px",
    marginTop: "10px",
    fontSize: "16px",
    cursor: "pointer",
  },

  timer: {
    position: "absolute",
    top: "50px",
    left: "50%",
    transform: "translateX(-50%)",
    fontSize: "24px",
  },

  debug: {
    position: "absolute",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: "10px",
    pointerEvents: "auto",
  },
}
