import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";

const env = import.meta.env;
if (
  !env.VITE_FIREBASE_PROJECT_ID ||
  !env.VITE_FIREBASE_API_KEY ||
  !env.VITE_FIREBASE_APP_ID
)
  throw new Error(
    "Missing VITE_FIREBASE_* in .env → restart dev server / rebuild",
  );
export const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  appId: env.VITE_FIREBASE_APP_ID,
});
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});
