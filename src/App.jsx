import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Gamepad2,
  Rocket,
  Star,
  Trophy,
  ArrowLeft,
  X,
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import VoodooModel from "./components/VoodooModel";
import "./index.css";

// --- Game Data Configuration ---
const GAMES = [
  {
    id: 1,
    title: "Fix IT",
    folder: "Hangman",
    entry: "index.html", // /games/Hangman/index.html
    thumbnail:
      "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400&h=250&fit=crop",
    gradient: "linear-gradient(135deg, #a855f7 0%, #2563eb 100%)",
    icon: <Rocket size={24} />,
  },
  {
    id: 2,
    title: "Taptap",
    folder: "Taptap",
    entry: "play/index.html", // /games/Taptap/play/index.html
    thumbnail:
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=400&h=250&fit=crop",
    gradient: "linear-gradient(135deg, #4ade80 0%, #059669 100%)",
    icon: <Star size={24} />,
  },
  {
    id: 3,
    title: "City Racer",
    folder: "city-racer",
    entry: "index.html", // /games/city-racer/index.html
    thumbnail:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=250&fit=crop",
    gradient: "linear-gradient(135deg, #fb923c 0%, #dc2626 100%)",
    icon: <Trophy size={24} />,
  },
  {
    id: 4,
    title: "Archer",
    folder: "archer",
    entry: "/index.html", // /games/archer/index.html
    thumbnail:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=250&fit=crop",
    gradient: "linear-gradient(135deg, #22d3ee 0%, #2563eb 100%)",
    icon: <Gamepad2 size={24} />,
  },
];

export default function App() {
  const [view, setView] = useState("landing"); // landing | browse
  const [activeGame, setActiveGame] = useState(null); // iframe src

  const handlePlayGame = (game) => {
    setActiveGame(`/games/${game.folder}/${game.entry}`);
  };

  const closeGame = () => {
    setActiveGame(null);
  };

  return (
    <div style={styles.appContainer}>
      {/* ---------- GAME IFRAME ---------- */}
      {activeGame && (
        <div style={styles.gameOverlay}>
          <button onClick={closeGame} style={styles.closeGameBtn}>
            <X size={28} />
            Exit Game
          </button>

          <iframe
            src={activeGame}
            title="Game"
            style={styles.gameIframe}
            sandbox="allow-scripts allow-same-origin allow-pointer-lock"
          />
        </div>
      )}

      {/* ---------- MAIN UI ---------- */}
      <AnimatePresence mode="wait">
        {view === "landing" ? (
          <LandingScreen key="landing" onStart={() => setView("browse")} />
        ) : (
          <GameBrowser
            key="browse"
            onBack={() => setView("landing")}
            onPlay={handlePlayGame}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------- Landing Screen ----------
function LandingScreen({ onStart }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={styles.landingWrapper}
    >
      <div style={styles.heroSection}>
        <div style={styles.characterContainer}>
          <Canvas
            style={{ height: "420px", width: "100%" }}
            camera={{ position: [4, 1.8, 4.5], fov: 40 }}
          >
            <ambientLight intensity={1.2} />
            <directionalLight position={[5, 5, 5]} />
            <Environment preset="city" />
            <VoodooModel />
            <OrbitControls enableZoom={false} />
          </Canvas>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        style={styles.startBtn}
      >
        <div style={styles.playIconCircle}>
          <Play fill="white" size={24} />
        </div>
        <span style={styles.startBtnText}>START</span>
      </motion.button>
    </motion.div>
  );
}

// ---------- Game Browser ----------
function GameBrowser({ onBack, onPlay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      style={styles.browserContainer}
    >
      <header style={styles.header}>
        <div>
          <button onClick={onBack} style={styles.backBtn}>
            <ArrowLeft size={18} /> Back to Home
          </button>
          <h1 style={styles.browserTitle}>GAME ARCADE</h1>
        </div>
        <div style={styles.pointsBadge}>
          <Trophy size={20} color="#fde047" />
          <span style={{ fontWeight: "bold" }}>1,250 PTS</span>
        </div>
      </header>

      <div style={styles.gameGrid}>
        {GAMES.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -10 }}
            style={styles.gameCard}
            onClick={() => onPlay(game)} // ← pass game object now
          >
            <div style={styles.thumbnailWrapper}>
              <img
                src={game.thumbnail}
                alt={game.title}
                style={styles.thumbnail}
              />
              <div
                style={{ ...styles.cardIconBadge, background: game.gradient }}
              >
                {game.icon}
              </div>
            </div>

            <div style={styles.cardContent}>
              <div style={styles.cardHeaderRow}>
                <h3 style={styles.gameTitle}>{game.title}</h3>
                <span style={styles.freeBadge}>FREE</span>
              </div>

              <button
                style={{ ...styles.playNowBtn, background: game.gradient }}
              >
                Play Now <Play size={16} fill="white" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ---------- Styles ----------
const styles = {
  appContainer: {
    minHeight: "100%",
    backgroundColor: "#000",
    backgroundImage: "url('bgArt.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "white",
    overflowX: "hidden",
  },

  /* GAME OVERLAY */
  gameOverlay: {
    position: "fixed",
    inset: 0,
    background: "black",
    zIndex: 9999,
  },
  gameIframe: {
    width: "100%",
    height: "100%",
    border: "none",
  },
  closeGameBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10000,
    background: "rgba(0,0,0,0.7)",
    color: "white",
    border: "none",
    padding: "0.75rem 1rem",
    borderRadius: "9999px",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "pointer",
  },

  /* LANDING */
  landingWrapper: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minHeight: "100vh",
  },
  heroSection: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  characterContainer: {
    width: "100%",
    minHeight: "420px",
    maxWidth: 400,
  },
  startBtn: {
    backgroundColor: "white",
    color: "#1f2937",
    display: "flex",
    alignItems: "center",
    width: "80%",
    maxWidth: 400,
    padding: "0.5rem",
    borderRadius: "9999px",
    border: "none",
    cursor: "pointer",
    margin: "0 auto 2rem auto",
  },
  playIconCircle: {
    backgroundColor: "#f97316",
    padding: "0.8rem",
    borderRadius: "50%",
  },
  startBtnText: {
    flex: 1,
    fontSize: "1.5rem",
    fontWeight: "bold",
    textAlign: "center",
    paddingRight: 40,
  },

  /* BROWSER */
  browserContainer: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "2rem 1.5rem",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "3rem",
  },
  backBtn: {
    background: "none",
    border: "none",
    color: "rgba(255,255,255,0.8)",
    cursor: "pointer",
    display: "flex",
    gap: "0.5rem",
  },
  browserTitle: {
    fontSize: "2.5rem",
    fontWeight: 900,
    fontStyle: "italic",
  },
  pointsBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: "0.75rem 1.25rem",
    borderRadius: "1rem",
    display: "flex",
    gap: "0.5rem",
  },
  gameGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "2rem",
  },
  gameCard: {
    background: "white",
    borderRadius: "2rem",
    overflow: "hidden",
    cursor: "pointer",
  },
  thumbnailWrapper: {
    height: 180,
    position: "relative",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  cardIconBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 12,
    borderRadius: 16,
    color: "white",
  },
  cardContent: {
    padding: "1.5rem",
  },
  cardHeaderRow: {
    display: "flex",
    justifyContent: "space-between",
  },
  gameTitle: {
    color: "#1f2937",
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  freeBadge: {
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
    fontSize: "0.75rem",
    padding: "0.25rem 0.75rem",
    borderRadius: "9999px",
  },
  playNowBtn: {
    width: "100%",
    marginTop: "1rem",
    padding: "1rem",
    borderRadius: "1rem",
    border: "none",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
