"use client";

import { useState, useEffect } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/infrastructure/firebase/client";

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

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
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
    signInWithGoogle,
    logout,
  };
}
