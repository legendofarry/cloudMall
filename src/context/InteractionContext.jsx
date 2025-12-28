// src/context/InteractionContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import AuthModal from "../components/AuthModal";

/*
  InteractionContext provides:
    - requireAuth(): Promise<user>  => if user exists resolves immediately; otherwise opens auth modal and resolves when user logs in.
  Usage:
    const { requireAuth } = useInteraction();
    await requireAuth();
    // now safe to run an action that requires an authenticated user
*/

const InteractionContext = createContext();

export function InteractionProvider({ children }) {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  // queue of resolve functions to call when user signs in
  const [pendingResolves, setPendingResolves] = useState([]);

  // When user becomes logged-in, resolve pending promises and close modal
  useEffect(() => {
    if (user && pendingResolves.length > 0) {
      pendingResolves.forEach((resolve) => {
        try {
          resolve(user);
        } catch (err) {
          // ignore
        }
      });
      setPendingResolves([]);
      setAuthModalOpen(false);
    }
  }, [user, pendingResolves]);

  function requireAuth() {
    if (user) {
      return Promise.resolve(user);
    }

    setAuthModalOpen(true);

    return new Promise((resolve, reject) => {
      setPendingResolves((q) => [...q, resolve]);

      // Optional: we could also add reject on modal cancel. For now,
      // the modal is dismissable, so we remove the resolve if cancelled.
    });
  }

  function handleCancelAuthModal() {
    setAuthModalOpen(false);
    // Clear pending resolves with null (reject)
    pendingResolves.forEach((resolve) => {
      try {
        resolve(null);
      } catch (e) {}
    });
    setPendingResolves([]);
  }

  const value = useMemo(
    () => ({
      requireAuth,
    }),
    [user, pendingResolves]
  );

  return (
    <InteractionContext.Provider value={value}>
      {children}
      <AuthModal open={authModalOpen} onClose={handleCancelAuthModal} />
    </InteractionContext.Provider>
  );
}

export function useInteraction() {
  return useContext(InteractionContext);
}
