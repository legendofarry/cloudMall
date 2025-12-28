// src/components/MallMapModal.jsx
import { useState, useEffect } from "react";
import { completeOnboarding } from "../firebase/firestore";
import "./MallMapModal.css";

/*
  MallMapModal (updated)
  - Requires parentNearby checkbox AND parentName, parentContact, governmentId (all required)
  - Props:
      - open: boolean
      - uid: string (user id)
      - onClose: () => void
*/

export default function MallMapModal({ open, uid, onClose }) {
  const [parentNearby, setParentNearby] = useState(false);
  const [parentName, setParentName] = useState("");
  const [parentContact, setParentContact] = useState("");
  const [governmentId, setGovernmentId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setParentNearby(false);
      setParentName("");
      setParentContact("");
      setGovernmentId("");
      setError("");
    }
  }, [open]);

  if (!open) return null;

  async function handleComplete() {
    setError("");
    // Validate strict requirements
    if (!parentNearby) {
      setError("A parent or guardian must be physically present to supervise.");
      return;
    }
    if (!parentName.trim()) {
      setError("Parent / guardian name is required.");
      return;
    }
    if (!parentContact.trim()) {
      setError("Parent contact (phone or email) is required.");
      return;
    }
    if (!governmentId.trim()) {
      setError("Parent government ID number is required.");
      return;
    }

    setBusy(true);
    try {
      await completeOnboarding(uid, {
        parentName: parentName.trim(),
        parentContact: parentContact.trim(),
        parentNearby,
        governmentId: governmentId.trim(),
      });
      onClose?.();
    } catch (err) {
      console.error(err);
      setError("Failed to complete onboarding. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="mall-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Mall onboarding"
    >
      <div className="mall-modal">
        <header className="mall-modal-header">
          <h2>Welcome to CloudMall 🎉</h2>
          <p>
            Before you explore, a parent or guardian must confirm supervision.
          </p>
        </header>

        <div className="mall-map">
          <div className="map-area">
            <div className="map-shop">Arcade</div>
            <div className="map-shop">Toy Hub</div>
            <div className="map-shop">Snack Bar</div>
            <div className="map-shop">Avatar Studio</div>
          </div>
        </div>

        <div className="mall-questions">
          <label className="mall-question">
            <input
              type="checkbox"
              checked={parentNearby}
              onChange={(e) => setParentNearby(e.target.checked)}
            />
            <span>
              I confirm a parent or guardian is physically present nearby to
              supervise (required).
            </span>
          </label>

          <label className="mall-field">
            <span>Parent / Guardian name</span>
            <input
              value={parentName}
              onChange={(e) => setParentName(e.target.value)}
              placeholder="Parent name"
            />
          </label>

          <label className="mall-field">
            <span>Parent contact (phone or email)</span>
            <input
              value={parentContact}
              onChange={(e) => setParentContact(e.target.value)}
              placeholder="Phone or email"
            />
          </label>

          <label className="mall-field">
            <span>Parent government ID number</span>
            <input
              value={governmentId}
              onChange={(e) => setGovernmentId(e.target.value)}
              placeholder="e.g. ID / passport number"
            />
          </label>

          {error && (
            <div className="mall-error" role="alert">
              {error}
            </div>
          )}

          <div className="mall-actions">
            <button
              className="mall-primary"
              onClick={handleComplete}
              disabled={busy}
            >
              {busy ? "Finishing..." : "Start Exploring the Mall!"}
            </button>
            <button
              className="mall-ghost"
              onClick={() => onClose?.()}
              disabled={busy}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
