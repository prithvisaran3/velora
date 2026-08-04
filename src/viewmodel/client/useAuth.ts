"use client";

import { useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  User,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/infrastructure/firebase/client";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUpWithEmail = async (name: string, email: string, phone: string, pass: string) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(res.user, { displayName: name });
      
      // Save customer profile in Firestore
      try {
        await setDoc(doc(db, "users", res.user.uid), {
          uid: res.user.uid,
          name,
          email,
          phone,
          createdAt: new Date().toISOString(),
        }, { merge: true });
      } catch (e) {
        console.warn("[Firestore Profile Save Warning]", e);
      }

      return { ok: true as const, user: res.user };
    } catch (err: any) {
      return { ok: false as const, error: err.message };
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      return { ok: true as const, user: res.user };
    } catch (err: any) {
      return { ok: false as const, error: err.message };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Merge user profile document
      try {
        await setDoc(doc(db, "users", result.user.uid), {
          uid: result.user.uid,
          name: result.user.displayName || "Customer",
          email: result.user.email || "",
          photoURL: result.user.photoURL || "",
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (e) {
        console.warn("[Firestore Google Profile Warning]", e);
      }

      return { ok: true as const, user: result.user };
    } catch (error: any) {
      return { ok: false as const, error: error.message };
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return {
    user,
    isLoading,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    logout,
  };
}
