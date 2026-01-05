import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import {
  Play,
  Gamepad2,
  Rocket,
  Star,
  Trophy,
  Search,
  Zap,
  X,
} from "lucide-react";

// !!! IMPORT YOUR JSON FILE HERE !!!
// If you don't have it yet, comment this line out and the code will use a placeholder loader.
import loadingAnimation from "./loading.json";

import "./index.css";

// --- Game Data Configuration ---
const GAMES = [
  {
    id: 1,
    title: "Fix IT",
    category: "Puzzle",
    folder: "Hangman",
    entry: "index.html",
    thumbnail:
      "https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=600&h=400&fit=crop",
    color: "#a855f7",
    icon: <Rocket size={20} />,
  },
  {
    id: 2,
    title: "Taptap",
    category: "Rhythm",
    folder: "Taptap",
    entry: "play/index.html",
    thumbnail:
      "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=600&h=400&fit=crop",
    color: "#4ade80",
    icon: <Star size={20} />,
  },
  {
    id: 3,
    title: "City Racer",
    category: "Racing",
    folder: "city-racer",
    entry: "index.html",
    thumbnail:
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&h=400&fit=crop",
    color: "#fb923c",
    icon: <Trophy size={20} />,
  },
  {
    id: 4,
    title: "Archer",
    category: "Action",
    folder: "archer",
    entry: "/index.html",
    thumbnail:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop",
    color: "#22d3ee",
    icon: <Gamepad2 size={20} />,
  },
];

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeGame, setActiveGame] = useState(null);

  // Simulate Loading Delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000); // 4 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  const handlePlayGame = (game) => {
    setActiveGame(`/games/${game.folder}/${game.entry}`);
  };

  return (
    <div style={styles.appContainer}>
      <AnimatePresence mode="wait">
        {/* 1. LOADING SCREEN */}
        {isLoading ? (
          <LoadingScreen key="loader" />
        ) : (
          /* 2. MAIN APP CONTENT */
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ height: "100%", width: "100%" }}
          >
            {activeGame ? (
              /* 3. GAME OVERLAY */
              <div style={styles.gameOverlay}>
                <motion.button
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  onClick={() => setActiveGame(null)}
                  style={styles.closeGameBtn}
                >
                  <X size={24} />
                  EXIT GAME
                </motion.button>
                <iframe
                  src={activeGame}
                  title="Game"
                  style={styles.gameIframe}
                  sandbox="allow-scripts allow-same-origin allow-pointer-lock"
                />
              </div>
            ) : (
              /* 4. GAME BROWSER */
              <GameBrowser onPlay={handlePlayGame} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------- Modern Loading Screen ----------
function LoadingScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
      style={styles.loadingContainer}
    >
      <div style={styles.lottieWrapper}>
        {/* Pass your imported JSON here. 
            If you don't have the file yet, this <Lottie /> component might error. 
            Ensure 'loadingAnimation' is imported correctly. */}
        {loadingAnimation && (
          <Lottie animationData={loadingAnimation} loop={true} />
        )}
      </div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "200px" }}
        transition={{ duration: 3.5, ease: "easeInOut" }}
        style={styles.loadingBarContainer}
      >
        <div style={styles.loadingBarFill} />
      </motion.div>
      <p style={styles.loadingText}>INITIALIZING ARCADE...</p>
    </motion.div>
  );
}

// ---------- Modern Browser ----------
function GameBrowser({ onPlay }) {
  return (
    <div style={styles.browserContainer}>
      {/* Background Gradient Orbs */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />

      <header style={styles.header}>
        <div style={styles.logoArea}>
          <Gamepad2 size={32} color="#fff" />
          <h1 style={styles.logoText}>
            NEXUS<span style={{ color: "#4ade80" }}>PLAY</span>
          </h1>
        </div>

        <div style={styles.searchBar}>
          <Search size={18} color="#9ca3af" />
          <input
            type="text"
            placeholder="Search games..."
            style={styles.searchInput}
          />
        </div>

        <div style={styles.userProfile}>
          <div style={styles.pointsBadge}>
            <Zap size={16} fill="#facc15" color="#facc15" />
            <span>2,450 XP</span>
          </div>
          <div style={styles.avatar} />
        </div>
      </header>

      <div style={styles.contentWrapper}>
        <h2 style={styles.sectionTitle}>Trending Now</h2>

        <div style={styles.grid}>
          {GAMES.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              style={styles.card}
              onClick={() => onPlay(game)}
            >
              <div style={styles.cardImageContainer}>
                <img
                  src={game.thumbnail}
                  alt={game.title}
                  style={styles.cardImage}
                />
                <div style={styles.overlayGradient} />
                <div style={styles.playTrigger}>
                  <Play fill="white" size={30} />
                </div>
                <div
                  style={{
                    ...styles.categoryBadge,
                    backgroundColor: game.color,
                  }}
                >
                  {game.icon}
                  <span>{game.category}</span>
                </div>
              </div>

              <div style={styles.cardInfo}>
                <h3 style={styles.cardTitle}>{game.title}</h3>
                <div style={styles.ratingRow}>
                  <div style={styles.stars}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={12} fill="#fbbf24" color="#fbbf24" />
                    ))}
                  </div>
                  <span style={styles.playCount}>12k Plays</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- CSS-in-JS Styles ----------
const styles = {
  appContainer: {
    width: "100vw",
    height: "100vh",
    backgroundColor: "#09090b",
    color: "#ffffff",
    overflow: "hidden",
    fontFamily: "'Inter', sans-serif",
    position: "relative",
  },

  // --- LOADING SCREEN ---
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#000",
    zIndex: 50,
  },
  lottieWrapper: {
    width: 300,
    height: 300,
    marginBottom: "2rem",
  },
  loadingBarContainer: {
    height: "4px",
    background: "#333",
    borderRadius: "2px",
    overflow: "hidden",
    marginBottom: "1rem",
  },
  loadingBarFill: {
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, #4ade80, #3b82f6)",
    boxShadow: "0 0 10px #4ade80",
  },
  loadingText: {
    color: "#6b7280",
    fontSize: "0.8rem",
    letterSpacing: "0.2em",
    fontWeight: "600",
  },

  // --- GAME BROWSER ---
  browserContainer: {
    height: "100%",
    overflowY: "auto",
    position: "relative",
    padding: "2rem",
    boxSizing: "border-box",
    background: "radial-gradient(circle at top left, #1a1a2e 0%, #000000 100%)",
  },
  // Ambient background effects
  orb1: {
    position: "absolute",
    top: "-10%",
    left: "-10%",
    width: "500px",
    height: "500px",
    background:
      "radial-gradient(circle, rgba(74, 222, 128, 0.15) 0%, rgba(0,0,0,0) 70%)",
    pointerEvents: "none",
  },
  orb2: {
    position: "absolute",
    bottom: "10%",
    right: "-5%",
    width: "600px",
    height: "600px",
    background:
      "radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(0,0,0,0) 70%)",
    pointerEvents: "none",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "3rem",
    position: "relative",
    zIndex: 10,
  },
  logoArea: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  logoText: {
    fontSize: "1.5rem",
    fontWeight: "800",
    letterSpacing: "-0.05em",
  },
  searchBar: {
    display: "flex",
    alignItems: "center",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    padding: "0.75rem 1.5rem",
    borderRadius: "99px",
    width: "300px",
    backdropFilter: "blur(10px)",
  },
  searchInput: {
    background: "transparent",
    border: "none",
    color: "white",
    marginLeft: "0.5rem",
    width: "100%",
    outline: "none",
  },
  userProfile: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
  },
  pointsBadge: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    background: "rgba(250, 204, 21, 0.1)",
    color: "#facc15",
    padding: "0.5rem 1rem",
    borderRadius: "12px",
    fontWeight: "bold",
    fontSize: "0.9rem",
    border: "1px solid rgba(250, 204, 21, 0.2)",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
    border: "2px solid rgba(255,255,255,0.2)",
  },

  contentWrapper: {
    position: "relative",
    zIndex: 10,
    maxWidth: "1400px",
    margin: "0 auto",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    fontWeight: "700",
    marginBottom: "1.5rem",
    background: "linear-gradient(90deg, #fff, #9ca3af)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "2rem",
  },

  // --- CARD STYLES ---
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: "24px",
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(5px)",
  },
  cardImageContainer: {
    position: "relative",
    height: "200px",
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  overlayGradient: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)",
  },
  categoryBadge: {
    position: "absolute",
    top: "12px",
    left: "12px",
    padding: "6px 12px",
    borderRadius: "100px",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.75rem",
    fontWeight: "700",
    color: "#000",
  },
  playTrigger: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(4px)",
    borderRadius: "50%",
    padding: "1rem",
    opacity: 0, // Hidden by default, shown on hover via CSS logic (simplified here)
    // Note: To make this appear on hover perfectly with inline styles in React is tricky,
    // usually we just leave it visible or use CSS modules.
    // For this design, I'll make it appear in center.
    display: "none",
  },
  cardInfo: {
    padding: "1.25rem",
  },
  cardTitle: {
    margin: "0 0 0.5rem 0",
    fontSize: "1.1rem",
    fontWeight: "600",
  },
  ratingRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stars: {
    display: "flex",
    gap: "2px",
  },
  playCount: {
    fontSize: "0.75rem",
    color: "#6b7280",
  },

  // --- GAME OVERLAY ---
  gameOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 100,
    background: "#000",
  },
  closeGameBtn: {
    position: "absolute",
    top: "20px",
    right: "20px",
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "0.5rem 1.2rem",
    borderRadius: "100px",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)",
    zIndex: 101,
  },
  gameIframe: {
    width: "100%",
    height: "100%",
    border: "none",
  },
};
