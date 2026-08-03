"use client";

import { useState, useEffect } from "react";
import { Saree } from "@/model/domain/types";

const CART_KEY = "velora_cart_items";

export function useCart() {
  const [cartItems, setCartItems] = useState<Saree[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        setCartItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to read cart from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const addToCart = (saree: Saree) => {
    // Single unit rule: if already in cart, do not duplicate
    if (cartItems.some((item) => item.id === saree.id)) return;
    const updated = [...cartItems, saree];
    setCartItems(updated);
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to write cart to localStorage", e);
    }
  };

  const removeFromCart = (sareeId: string) => {
    const updated = cartItems.filter((item) => item.id !== sareeId);
    setCartItems(updated);
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to update cart in localStorage", e);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    try {
      localStorage.removeItem(CART_KEY);
    } catch (e) {
      console.error("Failed to clear cart", e);
    }
  };

  const totalPaise = cartItems.reduce((acc, item) => acc + item.priceInPaise, 0);

  return {
    cartItems,
    cartCount: cartItems.length,
    totalPaise,
    isLoaded,
    addToCart,
    removeFromCart,
    clearCart,
  };
}
