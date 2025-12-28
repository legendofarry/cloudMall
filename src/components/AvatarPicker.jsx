// src/components/AvatarPicker.jsx
import { useState } from "react";
import "./AvatarPicker.css";

/*
  AvatarPicker
  - Props:
    - value: selected avatar id
    - onChange: (avatarId) => void
  - Simple, kid-friendly avatar cards with emoji + name.
*/

const AVATARS = [
  { id: "astro", label: "Astro", emoji: "🪐", color: "#7c5cff" },
  { id: "bunny", label: "Bunny", emoji: "🐰", color: "#ffb86b" },
  { id: "rocket", label: "Rocket", emoji: "🚀", color: "#5ef3ff" },
  { id: "panda", label: "Panda", emoji: "🐼", color: "#ffd97a" },
  { id: "wizard", label: "Wizard", emoji: "🪄", color: "#caa2ff" },
  { id: "cat", label: "Kitty", emoji: "🐱", color: "#ff9fd6" },
];

export default function AvatarPicker({ value = null, onChange }) {
  const [selected, setSelected] = useState(value);

  function handleSelect(id) {
    setSelected(id);
    if (typeof onChange === "function") onChange(id);
  }

  return (
    <div className="avatar-grid" role="list" aria-label="Choose an avatar">
      {AVATARS.map((a) => (
        <button
          key={a.id}
          className={`avatar-card ${selected === a.id ? "selected" : ""}`}
          onClick={() => handleSelect(a.id)}
          type="button"
          role="listitem"
          aria-pressed={selected === a.id}
        >
          <div className="avatar-emoji" style={{ background: a.color }}>
            <span aria-hidden="true" className="emoji">
              {a.emoji}
            </span>
          </div>
          <div className="avatar-name">{a.label}</div>
          {selected === a.id && <div className="avatar-check">✓</div>}
        </button>
      ))}
    </div>
  );
}
