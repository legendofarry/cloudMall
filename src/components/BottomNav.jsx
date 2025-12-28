// src/components/BottomNav.jsx
import { useEffect, useState } from "react";
import { useInteraction } from "../context/InteractionContext";
import "./BottomNav.css";

/*
  BottomNav
  - Simple, playful bottom navigation for the mall experience.
  - Buttons:
    - Home: scrolls to top
    - Games: scrolls to #games section
    - Shops: scrolls to #shops section
    - Profile: requires auth (opens AuthModal via requireAuth)
  - Highlights the active section using IntersectionObserver.
*/

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: "🏠", target: "top" },
  { id: "games", label: "Games", icon: "🎮", target: "games" },
  { id: "shops", label: "Shops", icon: "🛍️", target: "shops" },
  { id: "profile", label: "Profile", icon: "👤", action: "profile" },
];

export default function BottomNav() {
  const { requireAuth } = useInteraction();
  const [active, setActive] = useState("home");

  useEffect(() => {
    const sections = ["games", "shops"];
    const observers = [];

    function observeId(id) {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActive(id);
            }
          });
        },
        { root: null, threshold: 0.45 }
      );
      obs.observe(el);
      observers.push(obs);
      return obs;
    }

    // observe each section
    sections.forEach(observeId);

    // When scrolled near top, set 'home'
    function onScroll() {
      if (window.scrollY < 120) setActive("home");
    }
    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      observers.forEach((o) => o.disconnect());
    };
  }, []);

  function scrollToTarget(target) {
    if (target === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setActive("home");
      return;
    }
    const el = document.getElementById(target);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  async function handleItemClick(item) {
    if (item.action === "profile") {
      const user = await requireAuth();
      if (!user) return; // cancelled
      // after auth, scroll to top/profile area
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (item.target) {
      scrollToTarget(item.target);
    }
  }

  return (
    <nav
      className="bottom-nav"
      role="navigation"
      aria-label="Bottom navigation"
    >
      <div className="bottom-nav-inner">
        {NAV_ITEMS.map((item) => {
          const isActive = active === (item.target ?? item.id);
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? "active" : ""}`}
              onClick={() => handleItemClick(item)}
              aria-current={isActive ? "true" : "false"}
              aria-label={item.label}
            >
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
