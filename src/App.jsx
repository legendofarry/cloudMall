// src/App.jsx
import { useEffect, useState } from "react";
import {
  InteractionProvider,
  useInteraction,
} from "./context/InteractionContext";
import MallMapModal from "./components/MallMapModal";
import BottomNav from "./components/BottomNav";
import { useAuth } from "./context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase/firestore";
import "./index.css";
import "./components/BottomNav.css";

/*
  Updated App: includes BottomNav.
  Sections have ids ("games", "shops") so the bottom nav can scroll to them.
*/

function HomeContent() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchProfile() {
      if (!user) {
        setProfile(null);
        setShowOnboarding(false);
        return;
      }
      try {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        const data = snap.exists() ? snap.data() : null;
        if (!mounted) return;
        setProfile(data);
        if (data && data.onboardingComplete !== true) {
          setShowOnboarding(true);
        } else {
          setShowOnboarding(false);
        }
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      }
    }
    fetchProfile();
    return () => {
      mounted = false;
    };
  }, [user]);

  return (
    <>
      {showOnboarding && user && (
        <MallMapModal
          open={showOnboarding}
          uid={user.uid}
          onClose={() => setShowOnboarding(false)}
        />
      )}

      <main
        style={{
          padding: "2rem",
          paddingBottom: "140px",
          backgroundColor: "#E0F7FA", // Light sky blue background
          backgroundImage:
            "radial-gradient(#4DD0E1 10%, transparent 11%), radial-gradient(#4DD0E1 10%, transparent 11%)",
          backgroundSize: "60px 60px",
          backgroundPosition: "0 0, 30px 30px", // Polka dot pattern
          fontFamily: "'Comic Neue', 'Nunito', sans-serif", // Suggesting a round font
          minHeight: "100vh",
        }}
      >
        {/* HERO SECTION: The Mall Entrance */}
        <section
          id="hero"
          style={{
            marginBottom: 32,
            textAlign: "center",
            backgroundColor: "#FFFFFF",
            borderRadius: "30px",
            padding: "2rem",
            border: "5px solid #FF6B6B", // Salmon pink border
            boxShadow: "0 8px 0 #FF6B6B", // 3D cartoon shadow effect
            position: "relative",
          }}
        >
          {/* Decorative "Sign" hanging effect */}
          <div
            style={{
              position: "absolute",
              top: -15,
              left: "50%",
              transform: "translateX(-50%)",
              width: 100,
              height: 15,
              background: "rgba(0,0,0,0.1)",
              borderRadius: 10,
            }}
          ></div>

          <h1
            style={{
              margin: 0,
              fontSize: "2.5rem",
              color: "#FF6B6B",
              textTransform: "uppercase",
              letterSpacing: "2px",
              textShadow: "2px 2px 0px #FFD93D", // Yellow shadow
            }}
          >
            🎈 CloudMall
          </h1>
          <p
            style={{
              color: "#546E7A",
              fontSize: "1.1rem",
              fontWeight: "bold",
              marginTop: "10px",
              lineHeight: "1.4",
            }}
          >
            Welcome to the fun zone! 🏃‍♂️💨 <br />
            Explore, play, and collect cool stuff!
          </p>
        </section>

        {/* GAMES SECTION: The Arcade Floor */}
        <section
          id="games"
          style={{
            marginTop: "2rem",
            backgroundColor: "#FFF9C4", // Light Yellow
            padding: "1.5rem",
            borderRadius: "25px",
            border: "4px dashed #FBC02D",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "1rem",
            }}
          >
            <span style={{ fontSize: "2rem" }}>🕹️</span>
            <h2 style={{ margin: 0, color: "#F57F17", fontSize: "1.5rem" }}>
              Arcade Zone
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center", // Center cards for better mobile look
            }}
          >
            {/* Note: Ensure your GameCard components have rounded corners and shadows to match! */}
            <GameCard id="g1" title="Balloon Pop 🎈" />
            <GameCard id="g2" title="Color Match 🎨" />
            <GameCard id="g3" title="Mini Racer 🏎️" />
          </div>
        </section>

        {/* SHOPS SECTION: The Shopping Avenue */}
        <section
          id="shops"
          style={{
            marginTop: "2rem",
            backgroundColor: "#F3E5F5", // Light Purple
            padding: "1.5rem",
            borderRadius: "25px",
            border: "4px solid #AB47BC",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "1rem",
            }}
          >
            <span style={{ fontSize: "2rem" }}>🛍️</span>
            <h2 style={{ margin: 0, color: "#8E24AA", fontSize: "1.5rem" }}>
              Shopping Ave
            </h2>
          </div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <ShopCard name="Toy Hub 🧸" />
            <ShopCard name="Arcade Corner 🎟️" />
            <ShopCard name="Snack Bar 🍿" />
          </div>
        </section>

        {/* AUTH SECTION: The Visitor Badge */}
        <section
          style={{
            marginTop: 40,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "15px 30px",
              borderRadius: "50px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              border: "2px solid #4DD0E1",
            }}
          >
            {user ? (
              <div style={{ color: "#00838F", fontWeight: "bold" }}>
                <span style={{ marginRight: 8 }}>😎</span>
                VIP Member: {user.email}
              </div>
            ) : (
              <div style={{ color: "#00838F", textAlign: "center" }}>
                <span
                  style={{ display: "block", fontSize: "0.9rem", opacity: 0.8 }}
                >
                  👾 Guest Pass
                </span>
                <span style={{ fontWeight: "bold" }}>
                  Tap Profile to join the club!
                </span>
              </div>
            )}
          </div>
        </section>
      </main>

      <BottomNav />
    </>
  );
}

function GameCard({ id, title }) {
  const { requireAuth } = useInteraction();

  function handlePlay() {
    alert(`Starting ${title} — enjoy! (no sign-in required)`);
  }

  async function handleSaveScore() {
    const user = await requireAuth();
    if (!user)
      return alert("Sign in to save your score and appear on the leaderboard.");
    const fakeScore = Math.floor(Math.random() * 1000);
    alert(`${user.email} saved a score of ${fakeScore} for ${title}!`);
  }

  return (
    <div
      style={{
        width: 220,
        padding: 12,
        borderRadius: 12,
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <div style={{ fontWeight: 800 }}>{title}</div>
      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <button
          onClick={handlePlay}
          style={{
            flex: 1,
            padding: "8px 10px",
            borderRadius: 8,
            background: "#7c5cff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Play
        </button>
        <button
          onClick={handleSaveScore}
          style={{
            padding: "8px 10px",
            borderRadius: 8,
            background: "#ffd670",
            color: "#000",
            border: "none",
            cursor: "pointer",
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}

function ShopCard({ name }) {
  const { requireAuth } = useInteraction();

  async function handleFavorite() {
    const user = await requireAuth();
    if (!user) return;
    alert(`${user.email} favorited ${name}!`);
  }

  return (
    <div
      style={{
        width: 220,
        padding: 12,
        borderRadius: 12,
        background: "rgba(255,255,255,0.02)",
      }}
    >
      <div style={{ fontWeight: 800 }}>{name}</div>
      <div style={{ marginTop: 8 }}>
        <button
          onClick={handleFavorite}
          style={{
            padding: "8px 10px",
            borderRadius: 8,
            background: "#ff7ab6",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Favorite
        </button>
      </div>
    </div>
  );
}

export default function App() {
  // The InteractionProvider is expected to be wired in src/main.jsx around <App />
  // but if it's not, wrap here:
  return (
    <InteractionProvider>
      <HomeContent />
    </InteractionProvider>
  );
}
