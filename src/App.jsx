// src/App.jsx
import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import {
  InteractionProvider,
  useInteraction,
} from "./context/InteractionContext";
import MallMapModal from "./components/MallMapModal";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase/firestore";
import "./index.css";

/*
  App: browse-first homepage. Interactive actions call requireAuth() to prompt auth modal.
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

      <main style={{ padding: "2rem" }}>
        <h2 style={{ marginTop: 0 }}>CloudMall — Welcome</h2>
        <p>
          Browse shops, watch demo games and walk around the mall without
          signing in.
        </p>

        <section style={{ marginTop: "1.5rem" }}>
          <h3>Featured games</h3>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <GameCard id="g1" title="Balloon Pop" />
            <GameCard id="g2" title="Color Match" />
            <GameCard id="g3" title="Mini Racer" />
          </div>
        </section>

        <section style={{ marginTop: "1.5rem" }}>
          <h3>Shops</h3>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <ShopCard name="Toy Hub" />
            <ShopCard name="Arcade Corner" />
            <ShopCard name="Snack Bar" />
          </div>
        </section>

        <div style={{ marginTop: 24 }}>
          {user ? (
            <div>
              <strong>Signed in as:</strong> {user.email}
            </div>
          ) : (
            <div style={{ color: "#9fa8d6" }}>
              You are browsing as a guest — sign in when you want to interact.
            </div>
          )}
        </div>
      </main>
    </>
  );
}

// Replace only the GameCard component in src/App.jsx with this updated version

function GameCard({ id, title }) {
  const { requireAuth } = useInteraction();

  // Play is available to everyone (guest or signed-in)
  function handlePlay() {
    // Replace with actual game-launch logic
    alert(`Starting ${title} — enjoy! (no sign-in required)`);
  }

  // Saving a score requires authentication
  async function handleSaveScore() {
    const user = await requireAuth();
    if (!user) {
      // user cancelled/didn't authenticate
      return alert("Sign in to save your score and appear on the leaderboard.");
    }

    // Proceed with saving score / leaderboard logic
    // Example placeholder:
    const fakeScore = Math.floor(Math.random() * 1000);
    alert(`${user.email} saved a score of ${fakeScore} for ${title}!`);
    // TODO: call your API / firestore to persist the score
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
          Save Score
        </button>
      </div>
    </div>
  );
}

function ShopCard({ name }) {
  const { requireAuth } = useInteraction();

  async function handleFavorite() {
    const user = await requireAuth();
    if (!user) {
      return;
    }
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
  return (
    <InteractionProvider>
      <HomeContent />
    </InteractionProvider>
  );
}
