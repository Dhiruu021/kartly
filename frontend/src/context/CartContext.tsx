"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { ICartItem, IProduct, IFinish } from "@/lib/types";
import { api } from "@/lib/api";

interface AppliedCoupon {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  discountAmount: number;
}

interface CartContextType {
  items: ICartItem[];
  count: number;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  coupon: AppliedCoupon | null;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (product: IProduct, quantity?: number, finish?: IFinish) => void;
  updateQuantity: (productId: string, finishName: string, quantity: number) => void;
  removeItem: (productId: string, finishName: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "kartly_bag";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<ICartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
      const savedCoupon = localStorage.getItem("kartly_coupon");
      if (savedCoupon) {
        setCoupon(JSON.parse(savedCoupon));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {}
  }, [items, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      if (coupon) {
        localStorage.setItem("kartly_coupon", JSON.stringify(coupon));
      } else {
        localStorage.removeItem("kartly_coupon");
      }
    } catch (e) {}
  }, [coupon, mounted]);

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Recalculate coupon discount whenever subtotal changes
  let discount = 0;
  if (coupon && subtotal > 0) {
    if (coupon.discountType === "percentage") {
      discount = (subtotal * coupon.discountValue) / 100;
    } else {
      discount = coupon.discountValue;
    }
    discount = Math.min(discount, subtotal);
  }

  // Free shipping worldwide on orders ₹1,999 or more, else ₹149
  const shipping = subtotal === 0 || subtotal >= 1999 ? 0 : 149;
  const total = Math.max(0, subtotal - discount + shipping);

  const addItem = (product: IProduct, quantity = 1, finish?: IFinish) => {
    const selectedFinish = finish || (product.finishes && product.finishes[0]) || {
      name: "Standard",
      color: "#d8c4a4",
    };

    const price = product.salePrice && product.salePrice > 0 ? product.salePrice : product.price;

    setItems((prev) => {
      const existingIdx = prev.findIndex(
        (it) => it.productId === product._id && it.finishName === selectedFinish.name
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        const newQty = Math.min(updated[existingIdx].quantity + quantity, product.stock || 20);
        updated[existingIdx] = { ...updated[existingIdx], quantity: newQty };
        return updated;
      }

      return [
        ...prev,
        {
          productId: product._id,
          name: product.name,
          slug: product.slug,
          price,
          finishName: selectedFinish.name,
          finishColor: selectedFinish.color,
          quantity: Math.min(quantity, product.stock || 20),
          image: product.image,
          stock: product.stock,
        },
      ];
    });

    setIsDrawerOpen(true);
  };

  const updateQuantity = (productId: string, finishName: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId, finishName);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.finishName === finishName
          ? { ...item, quantity: Math.min(quantity, item.stock || 20) }
          : item
      )
    );
  };

  const removeItem = (productId: string, finishName: string) => {
    setItems((prev) =>
      prev.filter((item) => !(item.productId === productId && item.finishName === finishName))
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
  };

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.validateCoupon(code, subtotal);
      if (res.valid) {
        const applied: AppliedCoupon = {
          code: res.code,
          discountType: res.discountType,
          discountValue: res.discountValue,
          discountAmount: res.discountAmount,
        };
        setCoupon(applied);
        return { success: true, message: res.message };
      }
      return { success: false, message: "Invalid coupon" };
    } catch (err: any) {
      return { success: false, message: err.message || "Failed to apply coupon" };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        subtotal,
        shipping,
        discount,
        total,
        coupon,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
