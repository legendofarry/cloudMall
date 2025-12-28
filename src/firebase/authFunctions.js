// src/firebase/authFunctions.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "./auth";
import { createUserProfile } from "./firestore";

// CONTENT MODERATION FUNCTION
function moderateContent(text) {
  // Basic content filtering for kids safety
  const inappropriateWords = [
    "violence",
    "hate",
    "abuse",
    "explicit",
    // Add more as needed - this should be comprehensive in production
  ];

  const lowerText = String(text || "").toLowerCase();
  for (const word of inappropriateWords) {
    if (lowerText.includes(word)) {
      throw new Error(
        "Username contains inappropriate content. Please choose a kid-friendly name!"
      );
    }
  }

  return true;
}

// SIGN UP with username, location and avatarId
export async function signup(
  email,
  password,
  username,
  location,
  avatarId = null
) {
  try {
    if (!username) {
      throw new Error("Username is required for sign up.");
    }

    if (
      !location ||
      typeof location.lat !== "number" ||
      typeof location.lng !== "number"
    ) {
      throw new Error(
        "Location is required for sign up. Please pin your location."
      );
    }

    // Moderate username
    moderateContent(username);

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // Create Firestore user document with location, areaId and avatarId
    await createUserProfile(user.uid, {
      email: user.email,
      username: username,
      avatarId: avatarId ?? null,
      location: location, // {lat, lng}
      areaId: `${Math.floor(location.lat * 100)}_${Math.floor(
        location.lng * 100
      )}`, // Simple area grouping
      createdAt: new Date(),
      activityScore: 0,
      following: [],
      followers: [],
      isActive: true,
      verified: false,
      reportCount: 0,
      lastActive: new Date(),
      // onboardingComplete will be set in createUserProfile to false by default
    });

    return userCredential;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}

// LOGIN
export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

// LOGOUT
export function logout() {
  return signOut(auth);
}
