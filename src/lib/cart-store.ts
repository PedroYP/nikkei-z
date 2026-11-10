"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PRODUCTS } from "@/lib/data";

export interface CartItem {
  slug: string;
  qty: number;
}

export type DeliveryMode = "delivery" | "pickup";
export type PaymentMethod = "yape" | "tarjeta" | "efectivo";

interface CartState {
  items: CartItem[];
  deliveryMode: DeliveryMode;
  paymentMethod: PaymentMethod;
  isCartOpen: boolean;
  add: (slug: string, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  setDeliveryMode: (mode: DeliveryMode) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  openCart: () => void;
  closeCart: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      deliveryMode: "delivery",
      paymentMethod: "yape",
      isCartOpen: false,
      add: (slug, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.slug === slug);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.slug === slug ? { ...i, qty: Math.min(i.qty + qty, 30) } : i
              ),
            };
          }
          return { items: [...state.items, { slug, qty }] };
        }),
      remove: (slug) => set((state) => ({ items: state.items.filter((i) => i.slug !== slug) })),
      setQty: (slug, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.slug !== slug)
              : state.items.map((i) => (i.slug === slug ? { ...i, qty: Math.min(qty, 30) } : i)),
        })),
      clear: () => set({ items: [] }),
      setDeliveryMode: (mode) => set({ deliveryMode: mode }),
      setPaymentMethod: (method) => set({ paymentMethod: method }),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
    }),
    {
      name: "sumi-cart",
      partialize: (state) => ({
        items: state.items,
        deliveryMode: state.deliveryMode,
        paymentMethod: state.paymentMethod,
      }),
    }
  )
);

/* ---------- Selectores derivados ---------- */

export function cartCount(items: CartItem[]): number {
  return items.reduce((acc, i) => acc + i.qty, 0);
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((acc, i) => {
    const product = PRODUCTS.find((p) => p.slug === i.slug);
    return acc + (product ? product.price * i.qty : 0);
  }, 0);
}
