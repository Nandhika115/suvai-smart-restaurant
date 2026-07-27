"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./CartContext";

export default function Navbar() {
  const [user, setUser] = useState(undefined);
  const { count } = useCart();

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => setUser(null));
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-40 border-b border-char-700 bg-char-900/95 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight text-char-50">
          Suvai <span className="text-saffron-400">OS</span>
        </Link>
        <div className="flex items-center gap-6 font-body text-sm text-char-200">
          <Link href="/menu" className="hover:text-saffron-400">Menu</Link>
          <Link href="/reservations" className="hover:text-saffron-400">Reserve a table</Link>
          {user && (
            <Link href="/orders" className="hover:text-saffron-400">My orders</Link>
          )}
          {user?.role === "admin" && (
            <Link href="/admin" className="hover:text-saffron-400">Dashboard</Link>
          )}
          <Link href="/cart" className="relative flex items-center gap-1 rounded-ticket border border-char-600 px-3 py-1.5 hover:border-saffron-400">
            Cart
            {count > 0 && (
              <span className="ml-1 rounded-full bg-saffron-400 px-1.5 text-xs font-mono font-semibold text-char-950">
                {count}
              </span>
            )}
          </Link>
          {user === undefined ? null : user ? (
            <button onClick={handleLogout} className="text-char-400 hover:text-chili-400">
              Sign out
            </button>
          ) : (
            <Link href="/login" className="rounded-ticket bg-saffron-400 px-3 py-1.5 font-medium text-char-950 hover:bg-saffron-300">
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
