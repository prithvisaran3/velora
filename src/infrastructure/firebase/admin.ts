import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

if (!getApps().length) {
  try {
    if (process.env.FIRESTORE_EMULATOR_HOST) {
      initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || "velora-storefront-2026",
      });
    } else if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_PRIVATE_KEY.includes("BEGIN PRIVATE KEY")) {
      try {
        initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID || "velora-storefront-2026",
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
          }),
        });
      } catch (certError) {
        initializeApp({
          projectId: process.env.FIREBASE_PROJECT_ID || "velora-storefront-2026",
        });
      }
    } else {
      initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || "velora-storefront-2026",
      });
    }
  } catch (e) {
    if (!getApps().length) {
      initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || "velora-storefront-2026",
      });
    }
  }
}

export const adminDb = getFirestore();
export const adminAuth = getAuth();
