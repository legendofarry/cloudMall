import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import {
  Gamepad2,
  Rocket,
  Star,
  X,
  Youtube,
  ArrowLeft,
  Heart,
  MessageCircle,
  User, // Added User icon
  Settings,
  LogOut,
  Trophy,
} from "lucide-react";

// !!! IMPORT YOUR JSON FILE HERE !!!
import loadingAnimation from "./loading.json";

const GlobalStyles = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
      body { 
        font-family: "Montserrat", sans-serif;
        margin: 0;
        overflow: hidden; /* Prevent scrolling on the main page */
        background-color: #000;
      }
      a,p,span,button,h1,h2,h3,h4,h5,h6 {font-family: "Montserrat", sans-serif;}
      .hover-target { cursor: pointer; }
    `}
  </style>
);

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

// --- Social Media Data ---
const SOCIAL_FEED = [
  {
    id: 1,
    username: "kids_fun",
    title: "Funny Cartoons",
    embedId: "Tjs0xC4mszY",
    likes: "12.4K",
    comments: "128",
    caption: "😂😂😂",
  },
  {
    id: 2,
    username: "kids_music",
    title: "Kids Songs",
    embedId: "b0bkYBjZmsA",
    likes: "9.1K",
    comments: "54",
    caption: "Sing along 🎶",
  },
  // ... more data
];

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeGame, setActiveGame] = useState(null);

  // Navigation States
  const [isArcadeOpen, setIsArcadeOpen] = useState(false);
  const [isSocialOpen, setIsSocialOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // New State

  // Simulate Loading Delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handlePlayGame = (game) => {
    setActiveGame(`/games/${game.folder}/${game.entry}`);
  };

  return (
    <div style={styles.appContainer}>
      <GlobalStyles />
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
              <GameBrowser
                onPlayGame={handlePlayGame}
                isArcadeOpen={isArcadeOpen}
                setIsArcadeOpen={setIsArcadeOpen}
                isSocialOpen={isSocialOpen}
                setIsSocialOpen={setIsSocialOpen}
                isProfileOpen={isProfileOpen}
                setIsProfileOpen={setIsProfileOpen}
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
        transition={{ duration: 2.5, ease: "easeInOut" }}
        style={styles.loadingBarContainer}
      >
        <div style={styles.loadingBarFill} />
      </motion.div>
      <p style={styles.loadingText}>INITIALIZING SYSTEM...</p>
    </motion.div>
  );
}

// ---------- Main Browser ----------
function GameBrowser({
  onPlayGame,
  isArcadeOpen,
  setIsArcadeOpen,
  isSocialOpen,
  setIsSocialOpen,
  isProfileOpen,
  setIsProfileOpen,
}) {
  // hoveredSide can be: 'arcade' | 'watch' | 'profile' | null
  const [hoveredSide, setHoveredSide] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const videoRefs = useRef([]);

  // Detect Mobile View
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // --- Interaction Handlers ---

  const handleMouseEnter = (side) => {
    if (!isMobile) setHoveredSide(side);
  };

  const handleMouseLeave = () => {
    if (!isMobile) setHoveredSide(null);
  };

  const handleCardClick = (side) => {
    if (isMobile) {
      if (hoveredSide !== side) {
        setHoveredSide(side);
      }
    }
  };

  const handleButtonClick = (e, setOpenAction) => {
    e.stopPropagation();
    setOpenAction(true);
  };

  const Header = () => (
    <div style={styles.floatingHeader}>
      <Gamepad2 size={24} color="#fff" />
      <span style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: 1 }}>
        CLOUD<span style={{ color: "#4ade80" }}>MALL</span>
      </span>
    </div>
  );

  return (
    <div style={styles.browserContainer}>
      <Header />

      {/* --- SPLIT MENU WRAPPER (Now 3 Sections) --- */}
      <div style={styles.splitMenuWrapper}>
        {/* 1. ARCADE */}
        <motion.div
          style={styles.splitSection}
          animate={{
            // Logic: If this is active -> 2.5. If something else is active -> 0.6. If none -> 1.
            flex: hoveredSide === "arcade" ? 2.5 : hoveredSide ? 0.6 : 1,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          onMouseEnter={() => handleMouseEnter("arcade")}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleCardClick("arcade")}
        >
          <div
            style={{
              ...styles.splitBg,
              backgroundImage:
                'url("https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop")',
            }}
          />
          <div style={styles.overlayArcade} />

          <div style={styles.splitContent}>
            <motion.div
              animate={{ scale: hoveredSide === "arcade" ? 1.1 : 1 }}
              style={{ marginBottom: 15 }}
            >
              <Gamepad2
                size={hoveredSide === "arcade" ? (isMobile ? 50 : 80) : 40}
                color="#fff"
              />
            </motion.div>

            <h2
              style={{
                ...styles.splitTitle,
                fontSize: isMobile ? "1.5rem" : "3rem", // Adjusted for 3 cards
              }}
            >
              ARCADE
            </h2>

            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: hoveredSide === "arcade" ? 1 : 0,
                height: hoveredSide === "arcade" ? "auto" : 0,
              }}
              style={styles.splitHiddenContent}
            >
              {!isMobile && (
                <ul style={styles.featureList}>
                  <li>
                    <span>Puzzles</span>
                  </li>
                  <li>
                    <span>Action</span>
                  </li>
                </ul>
              )}
              <button
                style={styles.splitBtn}
                onClick={(e) => handleButtonClick(e, setIsArcadeOpen)}
              >
                PLAY
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* 2. WATCH */}
        <motion.div
          style={styles.splitSection}
          animate={{
            flex: hoveredSide === "watch" ? 2.5 : hoveredSide ? 0.6 : 1,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          onMouseEnter={() => handleMouseEnter("watch")}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleCardClick("watch")}
        >
          <div
            style={{
              ...styles.splitBg,
              backgroundImage:
                'url("https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1974&auto=format&fit=crop")',
            }}
          />
          <div style={styles.overlaySocial} />

          <div style={styles.splitContent}>
            <motion.div
              animate={{ scale: hoveredSide === "watch" ? 1.1 : 1 }}
              style={{ marginBottom: 15 }}
            >
              <Youtube
                size={hoveredSide === "watch" ? (isMobile ? 50 : 80) : 40}
                color="#fff"
              />
            </motion.div>

            <h2
              style={{
                ...styles.splitTitle,
                fontSize: isMobile ? "1.5rem" : "3rem",
              }}
            >
              WATCH
            </h2>

            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: hoveredSide === "watch" ? 1 : 0,
                height: hoveredSide === "watch" ? "auto" : 0,
              }}
              style={styles.splitHiddenContent}
            >
              {!isMobile && (
                <ul style={styles.featureList}>
                  <li>
                    <span>Videos</span>
                  </li>
                  <li>
                    <span>Music</span>
                  </li>
                </ul>
              )}
              <button
                style={styles.splitBtn}
                onClick={(e) => handleButtonClick(e, setIsSocialOpen)}
              >
                OPEN
              </button>
            </motion.div>
          </div>
        </motion.div>

        {/* 3. PROFILE (NEW) */}
        <motion.div
          style={styles.splitSection}
          animate={{
            flex: hoveredSide === "profile" ? 2.5 : hoveredSide ? 0.6 : 1,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          onMouseEnter={() => handleMouseEnter("profile")}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleCardClick("profile")}
        >
          <div
            style={{
              ...styles.splitBg,
              backgroundImage:
                'url("https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop")',
            }}
          />
          <div style={styles.overlayProfile} />

          <div style={styles.splitContent}>
            <motion.div
              animate={{ scale: hoveredSide === "profile" ? 1.1 : 1 }}
              style={{ marginBottom: 15 }}
            >
              <User
                size={hoveredSide === "profile" ? (isMobile ? 50 : 80) : 40}
                color="#fff"
              />
            </motion.div>

            <h2
              style={{
                ...styles.splitTitle,
                fontSize: isMobile ? "1.5rem" : "3rem",
              }}
            >
              PROFILE
            </h2>

            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{
                opacity: hoveredSide === "profile" ? 1 : 0,
                height: hoveredSide === "profile" ? "auto" : 0,
              }}
              style={styles.splitHiddenContent}
            >
              {!isMobile && (
                <ul style={styles.featureList}>
                  <li>
                    <span>Stats</span>
                  </li>
                  <li>
                    <span>Settings</span>
                  </li>
                </ul>
              )}
              <button
                style={styles.splitBtn}
                onClick={(e) => handleButtonClick(e, setIsProfileOpen)}
              >
                VIEW
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* --- ARCADE MODAL --- */}
      <AnimatePresence>
        {isArcadeOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={styles.modalOverlay}
          >
            <div style={styles.modalContent}>
              <div style={styles.modalHeader}>
                <h2 style={styles.modalTitle}>ARCADE GAMES</h2>
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

      {/* --- SOCIAL MODAL --- */}
      <AnimatePresence>
        {isSocialOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            style={styles.modalOverlay}
          >
            <div style={styles.instaModalContent}>
              <div style={styles.instaStickyHeader}>
                <button
                  onClick={() => setIsSocialOpen(false)}
                  style={styles.instaBackBtn}
                >
                  <ArrowLeft size={24} />
                </button>
                <span style={styles.instaHeaderTitle}>CloudGram</span>
                <div style={{ width: 24 }} />
              </div>

              <div style={styles.instaFeed}>
                {SOCIAL_FEED.map((post, i) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    style={styles.instaPost}
                  >
                    <div style={styles.instaMediaContainer}>
                      <iframe
                        ref={(el) => (videoRefs.current[i] = el)}
                        src={`.embedId}?enablejsapi=1&mute=0&playsinline=1&controls=1&rel=0`}
                        title={post.title}
                        style={styles.instaIframe}
                        allow="autoplay; encrypted-media"
                        allowFullScreen
                      />
                    </div>
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
                      </div>
                    </div>
                    <div style={styles.instaFooter}>
                      <div style={styles.instaLikes}>{post.likes} likes</div>
                      <div style={styles.instaCaption}>
                        <span style={styles.instaUsernameInline}>
                          {post.username}
                        </span>
                        {post.caption}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- PROFILE MODAL (NEW) --- */}
      <AnimatePresence>
        {isProfileOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            style={styles.modalOverlay}
          >
            <div
              style={{
                ...styles.instaModalContent,
                height: "60vh",
                justifyContent: "center",
              }}
            >
              <button
                onClick={() => setIsProfileOpen(false)}
                style={{ ...styles.closeBtn, top: 10, right: 10 }}
              >
                <X size={20} />
              </button>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "2rem",
                }}
              >
                <div
                  style={{
                    width: "100px",
                    height: "100px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <User size={50} color="#fff" />
                </div>
                <h2 style={{ color: "white", marginBottom: "0.5rem" }}>
                  Gamer One
                </h2>
                <p style={{ color: "#888", marginBottom: "2rem" }}>
                  Level 12 • 4500 Points
                </p>

                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    gap: "10px",
                    flexDirection: "column",
                  }}
                >
                  <button style={styles.profileBtn}>
                    <Trophy size={18} /> Achievements
                  </button>
                  <button style={styles.profileBtn}>
                    <Settings size={18} /> Settings
                  </button>
                  <button
                    style={{ ...styles.profileBtn, background: "#ef4444" }}
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------- STYLES ----------
const styles = {
  appContainer: {
    width: "100vw",
    height: "100vh",
    backgroundColor: "#000",
    color: "#ffffff",
    overflow: "hidden",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#111",
    zIndex: 999,
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

  // --- SPLIT MENU LAYOUT ---
  browserContainer: {
    height: "100%",
    width: "100%",
    position: "relative",
    overflow: "hidden",
  },
  floatingHeader: {
    position: "absolute",
    top: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(5px)",
    padding: "8px 16px",
    borderRadius: "50px",
    border: "1px solid rgba(255,255,255,0.1)",
    whiteSpace: "nowrap",
  },
  splitMenuWrapper: {
    display: "flex",
    flexDirection: "row", // ALWAYS ROW
    width: "100%",
    height: "100%",
  },
  splitSection: {
    position: "relative",
    height: "100%",
    cursor: "pointer",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    borderRight: "1px solid rgba(255,255,255,0.1)",
  },
  splitBg: {
    position: "absolute",
    inset: 0,
    backgroundSize: "cover",
    backgroundPosition: "center",
    transition: "transform 1s ease",
    zIndex: 0,
  },
  overlayArcade: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(135deg, rgba(124, 58, 237, 0.9), rgba(37, 99, 235, 0.9))",
    zIndex: 1,
  },
  overlaySocial: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(135deg, rgba(219, 39, 119, 0.9), rgba(225, 29, 72, 0.9))",
    zIndex: 1,
  },
  // New Overlay for Profile (Orange/Amber)
  overlayProfile: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(135deg, rgba(245, 158, 11, 0.9), rgba(217, 119, 6, 0.9))",
    zIndex: 1,
  },
  splitContent: {
    position: "relative",
    zIndex: 10,
    textAlign: "center",
    width: "100%",
    padding: "0 5px", // Reduced padding to fit 3 columns on mobile
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  splitTitle: {
    fontWeight: "900",
    lineHeight: "1",
    margin: "0",
    textShadow: "0 10px 30px rgba(0,0,0,0.3)",
    letterSpacing: "-1px",
    // fontSize is handled inline for responsiveness
  },
  splitHiddenContent: {
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  featureList: {
    listStyle: "none",
    padding: 0,
    margin: "15px 0",
    textAlign: "center",
    opacity: 0.8,
    fontWeight: "500",
    fontSize: "0.9rem",
    lineHeight: "1.6",
  },
  splitBtn: {
    marginTop: "10px",
    padding: "8px 20px",
    borderRadius: "50px",
    background: "#fff",
    color: "#000",
    border: "none",
    fontWeight: "800",
    fontSize: "0.75rem",
    cursor: "pointer",
    letterSpacing: "1px",
    boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
    textTransform: "uppercase",
  },

  // Profile specific
  profileBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    background: "#333",
    color: "white",
    border: "none",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    fontSize: "0.9rem",
    fontWeight: "600",
  },

  // --- MODALS ---
  modalOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 100,
    background: "rgba(0,0,0,0.9)",
    backdropFilter: "blur(15px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
  },
  modalContent: {
    width: "100%",
    maxWidth: "1100px",
    height: "90vh",
    background: "#1a1a1d",
    borderRadius: "24px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    border: "1px solid #333",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  modalTitle: {
    fontSize: "1.5rem",
    fontWeight: "800",
    margin: 0,
    color: "#fff",
  },
  modalCloseBtn: {
    background: "#333",
    border: "none",
    color: "#fff",
    borderRadius: "50%",
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "1.5rem",
    overflowY: "auto",
    padding: "0.5rem",
  },
  card: {
    backgroundColor: "#27272a",
    borderRadius: "20px",
    overflow: "hidden",
    cursor: "pointer",
    border: "1px solid #3f3f46",
  },
  cardImageContainer: {
    position: "relative",
    height: "160px",
    width: "100%",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  categoryBadge: {
    position: "absolute",
    top: "10px",
    left: "10px",
    padding: "5px 10px",
    borderRadius: "100px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "0.7rem",
    fontWeight: "700",
    color: "#000",
  },
  cardInfo: { padding: "1rem" },
  cardTitle: { margin: "0 0 0.5rem 0", fontSize: "1.1rem", fontWeight: "700" },
  stars: { display: "flex", gap: "3px" },

  // --- INSTAGRAM MODAL ---
  instaModalContent: {
    width: "100%",
    maxWidth: "450px",
    height: "90vh",
    background: "#000",
    border: "1px solid #333",
    borderRadius: "20px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 0 50px rgba(0,0,0,0.8)",
    overflow: "hidden",
    position: "relative",
  },
  instaStickyHeader: {
    height: "60px",
    paddingLeft: "1rem",
    borderBottom: "1px solid #262626",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
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
  instaHeaderTitle: { fontWeight: "bold", fontSize: "1.1rem" },
  instaFeed: { flex: 1, overflowY: "auto", paddingBottom: "2rem" },
  instaPost: {
    marginBottom: "1.5rem",
    borderBottom: "1px solid #1a1a1a",
    paddingBottom: "1rem",
  },
  instaMediaContainer: {
    width: "100%",
    aspectRatio: "1/1",
    backgroundColor: "#111",
  },
  instaIframe: { width: "100%", height: "100%", border: "none" },
  instaActionBar: { display: "flex", padding: "0.8rem 1rem" },
  instaActionLeft: { display: "flex", gap: "1rem" },
  actionIcon: { cursor: "pointer" },
  instaFooter: { padding: "0 1rem" },
  instaLikes: { fontWeight: "bold", marginBottom: "0.3rem" },
  instaCaption: { fontSize: "0.9rem", lineHeight: "1.4" },
  instaUsernameInline: { fontWeight: "bold", marginRight: "0.5rem" },

  // --- FULL SCREEN GAME ---
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
    padding: "0.5rem 1.5rem",
    borderRadius: "100px",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)",
    zIndex: 201,
  },
  iframe: { width: "100%", height: "100%", border: "none", flex: 1 },
};
