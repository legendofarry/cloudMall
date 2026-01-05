import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import {
  Play,
  Gamepad2,
  Rocket,
  Star,
  X,
  Youtube,
  Tv,
  Music,
  Smile,
  ArrowLeft,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";

// !!! IMPORT YOUR JSON FILE HERE !!!
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

// --- Social Media / Video Data (Instagram Style) ---
const SOCIAL_FEED = [
  {
    id: 1,
    username: "toon_central",
    userImg:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop",
    title: "Funny Cartoons Compilation",
    location: "Fun Zone",
    embedId: "j6dcnl65814",
    likes: "12.4K",
    comments: "128",
    caption: "Can't stop laughing at this one! 😂 #cartoons #funny",
  },
  {
    id: 2,
    username: "music_kids_official",
    userImg:
      "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop",
    title: "Top Hits 2024",
    location: "Studio Vibes",
    embedId: "Mh85R-S-il8",
    likes: "8,342",
    comments: "45",
    caption: "Dance along with us! 💃🕺 #music #dance",
  },
  {
    id: 3,
    username: "edu_play_learn",
    userImg:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    title: "Learn Colors & Shapes",
    location: "Classroom",
    embedId: "Q4k8K2eY5aU",
    likes: "25.1K",
    comments: "932",
    caption: "Learning is magical ✨ Watch until the end for a surprise!",
  },
];

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Navigation States
  const [isArcadeOpen, setIsArcadeOpen] = useState(false);
  const [isSocialOpen, setIsSocialOpen] = useState(false);

  // Active Media States
  const [activeGame, setActiveGame] = useState(null);

  // NOTE: For Instagram style, we play videos inline, so we don't need a full-screen overlay state for videos anymore.

  // Simulate Loading Delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  const handlePlayGame = (game) => {
    setActiveGame(`/games/${game.folder}/${game.entry}`);
  };

  return (
    <div style={styles.appContainer}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loader" />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ height: "100%", width: "100%" }}
          >
            {activeGame ? (
              /* --- GAME PLAYER OVERLAY --- */
              <div style={styles.fullScreenOverlay}>
                <motion.button
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  onClick={() => setActiveGame(null)}
                  style={styles.closeBtn}
                >
                  <X size={24} />
                  EXIT GAME
                </motion.button>
                <iframe
                  src={activeGame}
                  title="Game"
                  style={styles.iframe}
                  sandbox="allow-scripts allow-same-origin allow-pointer-lock"
                />
              </div>
            ) : (
              /* --- MAIN MENU BROWSER --- */
              <GameBrowser
                onPlayGame={handlePlayGame}
                isArcadeOpen={isArcadeOpen}
                setIsArcadeOpen={setIsArcadeOpen}
                isSocialOpen={isSocialOpen}
                setIsSocialOpen={setIsSocialOpen}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------- Loading Screen ----------
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

// ---------- Main Browser & Modals ----------
function GameBrowser({
  onPlayGame,
  isArcadeOpen,
  setIsArcadeOpen,
  isSocialOpen,
  setIsSocialOpen,
}) {
  return (
    <div style={styles.browserContainer}>
      {/* Background Ambience */}
      <div style={styles.orb1} />
      <div style={styles.orb2} />

      <header style={styles.header}>
        <div style={styles.logoArea}>
          <Gamepad2 size={32} color="#fff" />
          <h1 style={styles.logoText}>
            CLOUD<span style={{ color: "#4ade80" }}>MALL</span>
          </h1>
        </div>
      </header>

      {/* --- MAIN MENU SELECTION --- */}
      <div style={styles.mainMenuWrapper}>
        {/* 1. ARCADE BUTTON SECTION */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsArcadeOpen(true)}
          style={styles.bigMenuCard}
        >
          <div style={styles.menuCardBgArcade} />
          <div style={styles.menuContent}>
            <Gamepad2 size={60} color="#fff" style={{ marginBottom: "1rem" }} />
            <h2 style={styles.menuTitle}>Arcade Zone</h2>
            <p style={styles.menuDesc}>Play exciting games!</p>
            <button style={styles.exploreBtn}>ENTER ARCADE</button>
          </div>
        </motion.div>

        {/* 2. SOCIAL BUTTON SECTION */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsSocialOpen(true)}
          style={styles.bigMenuCard}
        >
          <div style={styles.menuCardBgSocial} />
          <div style={styles.menuContent}>
            <Youtube size={60} color="#fff" style={{ marginBottom: "1rem" }} />
            <h2 style={styles.menuTitle}>Watch & Chill</h2>
            <p style={styles.menuDesc}>Trending videos!</p>
            <button style={styles.exploreBtn}>OPEN FEED</button>
          </div>
        </motion.div>
      </div>

      {/* --- ARCADE MODAL (Standard Grid) --- */}
      <AnimatePresence>
        {isArcadeOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={styles.modalOverlay}
          >
            <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>Choose Your Game</h2>
                <button
                  onClick={() => setIsArcadeOpen(false)}
                  style={styles.modalCloseBtn}
                >
                  <X size={28} />
                </button>
              </div>

              <div style={styles.grid}>
                {GAMES.map((game, i) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -10, scale: 1.02 }}
                    style={styles.card}
                    onClick={() => onPlayGame(game)}
                  >
                    <div style={styles.cardImageContainer}>
                      <img
                        src={game.thumbnail}
                        alt={game.title}
                        style={styles.cardImage}
                      />
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
                      <div style={styles.stars}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={12}
                            fill="#fbbf24"
                            color="#fbbf24"
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SOCIAL MODAL (INSTAGRAM VIEW) --- */}
      <AnimatePresence>
        {isSocialOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={styles.modalOverlay}
          >
            {/* Phone-like container */}
            <div style={styles.instaModalContent}>
              {/* Insta Header */}
              <div style={styles.instaStickyHeader}>
                <button
                  onClick={() => setIsSocialOpen(false)}
                  style={styles.instaBackBtn}
                >
                  <ArrowLeft size={24} />
                </button>
                <span style={styles.instaHeaderTitle}>CloudGram</span>
                <div style={{ width: 24 }} /> {/* Spacer */}
              </div>

              {/* Feed Container */}
              <div style={styles.instaFeed}>
                {SOCIAL_FEED.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={styles.instaPost}
                  >
                    {/* Post Header */}
                    <div style={styles.instaPostHeader}>
                      <div style={styles.instaUserGroup}>
                        <div style={styles.instaAvatarRing}>
                          <img
                            src={post.userImg}
                            alt="user"
                            style={styles.instaAvatar}
                          />
                        </div>
                        <div style={styles.instaUserInfo}>
                          <span style={styles.instaUsername}>
                            {post.username}
                          </span>
                          <span style={styles.instaLocation}>
                            {post.location}
                          </span>
                        </div>
                      </div>
                      <MoreHorizontal size={20} color="#fff" />
                    </div>

                    {/* Post Media (YouTube Embed acting as the post content) */}
                    <div style={styles.instaMediaContainer}>
                      <iframe
                        src={`https://www.youtube.com/embed/${post.embedId}?controls=1&modestbranding=1&rel=0`}
                        title={post.title}
                        style={styles.instaIframe}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>

                    {/* Action Bar */}
                    <div style={styles.instaActionBar}>
                      <div style={styles.instaActionLeft}>
                        <Heart
                          size={26}
                          color="#fff"
                          style={styles.actionIcon}
                        />
                        <MessageCircle
                          size={26}
                          color="#fff"
                          style={styles.actionIcon}
                        />
                        <Send
                          size={26}
                          color="#fff"
                          style={styles.actionIcon}
                        />
                      </div>
                      <Bookmark size={26} color="#fff" />
                    </div>

                    {/* Likes & Caption */}
                    <div style={styles.instaFooter}>
                      <div style={styles.instaLikes}>{post.likes} likes</div>
                      <div style={styles.instaCaption}>
                        <span style={styles.instaUsernameInline}>
                          {post.username}
                        </span>
                        {post.caption}
                      </div>
                      <div style={styles.instaComments}>
                        View all {post.comments} comments
                      </div>
                      <div style={styles.instaTime}>2 hours ago</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------- CSS-in-JS Styles ----------
const styles = {
  appContainer: {
    width: "100vw",
    height: "100vh",
    marginBottom: "50px",
    backgroundColor: "#09090b",
    color: "#ffffff",
    overflow: "hidden",
    position: "relative",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  },

  // --- LOADING ---
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
  lottieWrapper: { width: 300, height: 300, marginBottom: "2rem" },
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

  // --- BROWSER ---
  browserContainer: {
    height: "100%",
    width: "100%",
    position: "relative",
    padding: "2rem",
    boxSizing: "border-box",
    background: "radial-gradient(circle at center, #1a1a2e 0%, #000 100%)",
    overflowY: "auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "2rem",
    position: "relative",
    zIndex: 10,
  },
  logoArea: { display: "flex", alignItems: "center", gap: "0.75rem" },
  logoText: { fontSize: "2rem", fontWeight: "800", letterSpacing: "-0.05em" },

  // --- MAIN MENU SELECTION ---
  mainMenuWrapper: {
    display: "flex",
    gap: "3rem",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "60vh",
    position: "relative",
    zIndex: 10,
    flexWrap: "wrap",
    paddingBottom: "150px",
  },
  bigMenuCard: {
    position: "relative",
    width: "350px",
    height: "450px",
    borderRadius: "24px",
    overflow: "hidden",
    cursor: "pointer",
    boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
    border: "1px solid rgba(255,255,255,0.1)",
    flexShrink: 0,
  },
  menuCardBgArcade: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)",
    opacity: 0.8,
  },
  menuCardBgSocial: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(135deg, #db2777 0%, #e11d48 100%)",
    opacity: 0.8,
  },
  menuContent: {
    position: "absolute",
    inset: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    padding: "2rem",
    textAlign: "center",
  },
  menuTitle: {
    fontSize: "2.5rem",
    fontWeight: "800",
    margin: "0 0 0.5rem 0",
    textShadow: "0 2px 10px rgba(0,0,0,0.3)",
  },
  menuDesc: {
    fontSize: "1.1rem",
    opacity: 0.9,
    marginBottom: "2rem",
  },
  exploreBtn: {
    padding: "0.8rem 2rem",
    borderRadius: "100px",
    border: "none",
    background: "white",
    color: "#000",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(255,255,255,0.3)",
  },

  // --- STANDARD MODAL (Arcade) ---
  modalOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 100,
    background: "rgba(0,0,0,0.8)",
    backdropFilter: "blur(10px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
  },
  modalContent: {
    width: "100%",
    maxWidth: "1200px",
    height: "85vh",
    background: "rgba(20, 20, 25, 0.95)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "24px",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    paddingBottom: "1rem",
  },
  modalTitle: {
    fontSize: "2rem",
    fontWeight: "bold",
    margin: 0,
    color: "#fff",
  },
  modalCloseBtn: {
    background: "rgba(255,255,255,0.1)",
    border: "none",
    color: "#fff",
    borderRadius: "50%",
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "2rem",
    overflowY: "auto",
    padding: "1rem",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: "20px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.3s ease",
    border: "1px solid rgba(255,255,255,0.05)",
  },
  cardImageContainer: {
    position: "relative",
    height: "180px",
    width: "100%",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
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
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  },
  cardInfo: { padding: "1.25rem" },
  cardTitle: { margin: "0 0 0.5rem 0", fontSize: "1.1rem", fontWeight: "600" },
  stars: { display: "flex", gap: "2px" },

  // --- INSTAGRAM STYLE MODAL ---
  instaModalContent: {
    width: "100%",
    maxWidth: "480px", // Mobile width
    height: "90vh",
    background: "#000",
    border: "1px solid #262626",
    borderRadius: "32px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 0 50px rgba(0,0,0,0.8)",
    overflow: "hidden",
  },
  instaStickyHeader: {
    height: "60px",
    borderBottom: "1px solid #262626",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 1rem",
    backgroundColor: "#000",
    zIndex: 10,
    flexShrink: 0,
  },
  instaBackBtn: {
    background: "transparent",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },
  instaHeaderTitle: {
    fontWeight: "bold",
    fontSize: "1rem",
    fontFamily: "Instagram Sans, sans-serif",
  },
  instaFeed: {
    flex: 1,
    overflowY: "auto",
    scrollbarWidth: "none", // Hide scrollbar Firefox
    msOverflowStyle: "none", // Hide scrollbar IE
    paddingBottom: "2rem",
  },
  instaPost: {
    marginBottom: "1rem",
    borderBottom: "1px solid #1a1a1a",
    paddingBottom: "1rem",
  },
  instaPostHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.75rem 1rem",
  },
  instaUserGroup: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  instaAvatarRing: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    padding: "2px",
    background:
      "linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  instaAvatar: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #000",
  },
  instaUserInfo: {
    display: "flex",
    flexDirection: "column",
  },
  instaUsername: {
    fontWeight: "bold",
    fontSize: "0.9rem",
    lineHeight: "1.1",
  },
  instaLocation: {
    fontSize: "0.75rem",
    color: "#a8a8a8",
  },
  instaMediaContainer: {
    width: "100%",
    aspectRatio: "1/1", // Square aspect ratio typically, or 4:5
    backgroundColor: "#111",
    position: "relative",
  },
  instaIframe: {
    width: "100%",
    height: "100%",
    border: "none",
    display: "block",
  },
  instaActionBar: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.75rem 1rem",
  },
  instaActionLeft: {
    display: "flex",
    gap: "1rem",
  },
  actionIcon: {
    cursor: "pointer",
  },
  instaFooter: {
    padding: "0 1rem",
  },
  instaLikes: {
    fontWeight: "bold",
    fontSize: "0.9rem",
    marginBottom: "0.5rem",
  },
  instaCaption: {
    fontSize: "0.9rem",
    lineHeight: "1.4",
    marginBottom: "0.25rem",
  },
  instaUsernameInline: {
    fontWeight: "bold",
    marginRight: "0.5rem",
  },
  instaComments: {
    color: "#a8a8a8",
    fontSize: "0.9rem",
    marginBottom: "0.25rem",
    cursor: "pointer",
  },
  instaTime: {
    color: "#737373",
    fontSize: "0.7rem",
    textTransform: "uppercase",
  },

  // --- GAME PLAYER ---
  fullScreenOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 200,
    background: "#000",
    display: "flex",
    flexDirection: "column",
  },
  closeBtn: {
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
    zIndex: 201,
  },
  iframe: {
    width: "100%",
    height: "100%",
    border: "none",
    flex: 1,
  },
};
