"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";

export default function OrdersHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => (r.ok ? r.json() : { orders: [] }))
      .then((d) => {
        setOrders(d.orders || []);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-char-900 pb-24">
      <Navbar />
      <section className="mx-auto max-w-2xl px-5 py-10">
        <h1 className="font-display text-3xl font-semibold text-char-50">My orders</h1>

        {loading ? (
          <p className="mt-8 text-char-400">Loading…</p>
        ) : orders.length === 0 ? (
          <p className="mt-8 text-char-400">No orders yet — head to the menu to place your first one.</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {orders.map((o) => (
              <li key={o.id}>
                <Link
                  href={`/track/${o.id}`}
                  className="flex items-center justify-between rounded-ticket border border-char-700 bg-char-850 px-5 py-4 hover:border-saffron-400"
                >
                  <div>
                    <p className="font-display text-char-50">#{o.id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-char-400">{new Date(o.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-char-100">₹{o.total}</p>
                    <p className="font-mono text-xs uppercase text-saffron-400">{o.status}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
