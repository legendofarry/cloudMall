// src/firebase/auth.js
import { getAuth } from "firebase/auth";
import { app } from "./firebaseConfig";

export const auth = getAuth(app);
