// src/components/AuthBox.jsx
import { useState } from "react";
import { login, signup } from "../firebase/authFunctions";
import PinLocationButton from "./PinLocationButton";
import AvatarPicker from "./AvatarPicker";
import "./AuthBox.css";
import "./AvatarPicker.css";

export default function AuthBox() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [location, setLocation] = useState(null);
  const [avatarId, setAvatarId] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!username) {
          setError("Please choose a fun username ✨");
          setBusy(false);
          return;
        }
        if (!location) {
          setError("Pin your location so we can place you in the mall 🧭");
          setBusy(false);
          return;
        }
        // avatarId can be null; user can pick later
        await signup(email, password, username, location, avatarId);
      }
    } catch (err) {
      setError(err.message || String(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mall-entrance">
      <div className="mall-backdrop" aria-hidden="true">
        <div className="shop-sign left">Toys</div>
        <div className="shop-sign center">Games</div>
        <div className="shop-sign right">Snacks</div>
      </div>

      <div className="entrance-card" role="region" aria-label="CloudMall Auth">
        <header className="entrance-header">
          <div className="logo-arc" aria-hidden="true">
            <span className="logo-dot" />
            <span className="logo-dot" />
            <span className="logo-dot" />
          </div>
          <h1 className="title">Welcome to CloudMall</h1>
          <p className="tagline">
            A playful place for kids to discover & connect 🌈
          </p>
        </header>

        <div className="tab-row" role="tablist" aria-label="Login or sign up">
          <button
            className={`tab ${isLogin ? "active" : ""}`}
            role="tab"
            aria-selected={isLogin}
            onClick={() => {
              setIsLogin(true);
              setError("");
            }}
          >
            Login
          </button>
          <button
            className={`tab ${!isLogin ? "active" : ""}`}
            role="tab"
            aria-selected={!isLogin}
            onClick={() => {
              setIsLogin(false);
              setError("");
            }}
          >
            Sign Up
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="field-label">Email</span>
            <input
              className="input"
              type="email"
              placeholder="you@cloudmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          {!isLogin && (
            <label className="field">
              <span className="field-label">Username</span>
              <input
                className="input"
                type="text"
                placeholder="Pick a fun name (e.g. StarRunner)"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </label>
          )}

          <label className="field">
            <span className="field-label">Password</span>
            <input
              className="input"
              type="password"
              placeholder="Your secret pass"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {!isLogin && (
            <>
              <div className="pin-section">
                <PinLocationButton
                  onPin={(loc) => {
                    setLocation(loc);
                    setError("");
                  }}
                  className="pin-button"
                >
                  📍 Pin My Mall Spot
                </PinLocationButton>

                <div className="pin-hint" aria-live="polite">
                  {location ? (
                    <span className="pinned">
                      📌 Pinned: {location.lat.toFixed(4)},{" "}
                      {location.lng.toFixed(4)}
                    </span>
                  ) : (
                    <span className="unpinned">
                      You are not pinned yet — required to enter the mall
                    </span>
                  )}
                </div>
              </div>

              <div style={{ marginTop: ".6rem" }}>
                <div
                  style={{
                    fontWeight: 800,
                    color: "#eaf0ff",
                    marginBottom: ".4rem",
                  }}
                >
                  Choose an avatar
                </div>
                <AvatarPicker
                  value={avatarId}
                  onChange={(id) => setAvatarId(id)}
                />
              </div>
            </>
          )}

          {error && (
            <div className="error" role="alert">
              {error}
            </div>
          )}

          <div className="actions">
            <button className="primary" type="submit" disabled={busy}>
              {busy
                ? isLogin
                  ? "Signing in..."
                  : "Creating account..."
                : isLogin
                ? "Enter Mall (Login)"
                : "Enter Mall (Sign Up)"}
            </button>

            <button
              type="button"
              className="ghost"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
            >
              {isLogin ? "Need an account?" : "Already have one?"}
            </button>
          </div>
        </form>

        <footer className="entrance-footer" aria-hidden="true">
          <div className="floor-lights">
            <span className="light" />
            <span className="light" />
            <span className="light" />
            <span className="light" />
            <span className="light" />
          </div>
        </footer>
      </div>
    </div>
  );
}
