"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { IProduct } from "@/lib/types";
import { api } from "@/lib/api";
import { useAuth } from "./AuthContext";

interface WishlistContextType {
  wishlist: IProduct[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (product: IProduct) => Promise<void>;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_LOCAL_KEY = "kartly_wishlist";

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<IProduct[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        try {
          const { products } = await api.getWishlist();
          setWishlist(products || []);
        } catch (e) {
          console.error("Failed to fetch user wishlist from server", e);
        }
      } else {
        try {
          const saved = localStorage.getItem(WISHLIST_LOCAL_KEY);
          if (saved) setWishlist(JSON.parse(saved));
        } catch (e) {}
      }
      setMounted(true);
    };
    loadWishlist();
  }, [user]);

  useEffect(() => {
    if (!mounted || user) return;
    try {
      localStorage.setItem(WISHLIST_LOCAL_KEY, JSON.stringify(wishlist));
    } catch (e) {}
  }, [wishlist, mounted, user]);

  const isWishlisted = (productId: string): boolean => {
    return wishlist.some((p) => (p._id || p.id) === productId);
  };

  const toggleWishlist = async (product: IProduct): Promise<void> => {
    const id = product._id || product.id || "";
    const exists = isWishlisted(id);

    if (exists) {
      setWishlist((prev) => prev.filter((p) => (p._id || p.id) !== id));
      if (user) {
        try {
          await api.removeFromWishlist(id);
        } catch (e) {}
      }
    } else {
      setWishlist((prev) => [...prev, product]);
      if (user) {
        try {
          await api.addToWishlist(id);
        } catch (e) {}
      }
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isWishlisted,
        toggleWishlist,
        count: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error("useWishlist must be used within a WishlistProvider");
  return context;
};
