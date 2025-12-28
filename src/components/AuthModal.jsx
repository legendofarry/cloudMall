// src/components/AuthModal.jsx
import React from "react";
import AuthBox from "./AuthBox";
import "./AuthModal.css";

/*
  Simple modal wrapper that displays AuthBox.
  Props:
    - open: boolean
    - onClose: () => void
*/
export default function AuthModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="auth-modal-overlay" role="dialog" aria-modal="true">
      <div className="auth-modal-card">
        <button
          type="button"
          className="auth-modal-close"
          aria-label="Close authentication"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="auth-modal-content">
          <AuthBox />
        </div>
      </div>
    </div>
  );
}
