"use client";

import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("sro_cart");
      if (saved) setItems(JSON.parse(saved));
    } catch {
      // ignore corrupt cart data
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) window.localStorage.setItem("sro_cart", JSON.stringify(items));
  }, [items, loaded]);

  function addItem(menuItem) {
    setItems((prev) => {
      const existing = prev.find((i) => i.menuId === menuItem.id);
      if (existing) {
        return prev.map((i) => (i.menuId === menuItem.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { menuId: menuItem.id, name: menuItem.name, price: menuItem.price, qty: 1 }];
    });
  }

  function updateQty(menuId, qty) {
    setItems((prev) =>
      qty <= 0 ? prev.filter((i) => i.menuId !== menuId) : prev.map((i) => (i.menuId === menuId ? { ...i, qty } : i))
    );
  }

  function clearCart() {
    setItems([]);
  }

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
