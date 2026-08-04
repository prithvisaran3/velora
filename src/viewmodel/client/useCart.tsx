"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Saree } from "@/model/domain/types";

const CART_KEY = "velora_cart_items";
const CART_EVENT = "velora_cart_updated";

interface CartContextType {
  cartItems: Saree[];
  cartCount: number;
  totalPaise: number;
  isLoaded: boolean;
  addToCart: (saree: Saree) => void;
  removeFromCart: (sareeId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType>({
  cartItems: [],
  cartCount: 0,
  totalPaise: 0,
  isLoaded: false,
  addToCart: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
});

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<Saree[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadCartFromStorage = () => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        setCartItems(JSON.parse(stored));
      } else {
        setCartItems([]);
      }
    } catch (e) {
      console.error("Failed to read cart from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    loadCartFromStorage();

    const handleStorageChange = () => loadCartFromStorage();
    window.addEventListener(CART_EVENT, handleStorageChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(CART_EVENT, handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const saveCart = (updated: Saree[]) => {
    setCartItems(updated);
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event(CART_EVENT));
    } catch (e) {
      console.error("Failed to write cart to localStorage", e);
    }
  };

  const addToCart = (saree: Saree) => {
    // Single unit rule: if already in cart, do not duplicate
    if (cartItems.some((item) => item.id === saree.id)) return;
    const updated = [...cartItems, saree];
    saveCart(updated);
  };

  const removeFromCart = (sareeId: string) => {
    const updated = cartItems.filter((item) => item.id !== sareeId);
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const totalPaise = cartItems.reduce((acc, item) => acc + item.priceInPaise, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount: cartItems.length,
        totalPaise,
        isLoaded,
        addToCart,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  return useContext(CartContext);
}
