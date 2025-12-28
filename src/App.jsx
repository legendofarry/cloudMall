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

function GameCard({ id, title }) {
  const { requireAuth } = useInteraction();

  async function handleJoin() {
    const user = await requireAuth();
    if (!user) {
      // user cancelled/didn't sign in
      return;
    }
    alert(`${user.email} joined ${title}!`);
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
      <div style={{ marginTop: 8 }}>
        <button
          onClick={handleJoin}
          style={{
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
