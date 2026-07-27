"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";
import { useCart } from "../../components/CartContext";

export default function CartPage() {
  const { items, updateQty, total, clearCart } = useCart();
  const [tableId, setTableId] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);
  const router = useRouter();

  async function placeOrder() {
    setError("");
    setPlacing(true);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, tableId: tableId || null, notes }),
    });
    const data = await res.json();
    setPlacing(false);
    if (!res.ok) {
      if (res.status === 401) {
        router.push("/login?next=/cart");
        return;
      }
      setError(data.error || "Could not place order.");
      return;
    }
    clearCart();
    router.push(`/track/${data.order.id}`);
  }

  return (
    <main className="min-h-screen bg-char-900 pb-24">
      <Navbar />
      <section className="mx-auto max-w-2xl px-5 py-10">
        <h1 className="font-display text-3xl font-semibold text-char-50">Your order</h1>

        {items.length === 0 ? (
          <p className="mt-8 text-char-400">Your cart is empty. Head to the menu to add something delicious.</p>
        ) : (
          <>
            <div className="ticket-edge mt-8 rounded-ticket border border-char-700 bg-char-850 p-6 pt-8 font-mono">
              {items.map((line) => (
                <div key={line.menuId} className="flex items-center justify-between border-b border-dashed border-char-700 py-3">
                  <div>
                    <p className="text-char-50">{line.name}</p>
                    <p className="text-xs text-char-400">₹{line.price} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(line.menuId, line.qty - 1)} className="focus-ring h-7 w-7 rounded-ticket border border-char-600 text-char-100">−</button>
                    <span className="w-6 text-center text-char-50">{line.qty}</span>
                    <button onClick={() => updateQty(line.menuId, line.qty + 1)} className="focus-ring h-7 w-7 rounded-ticket border border-char-600 text-char-100">+</button>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between pt-4">
                <span className="text-char-200">Total</span>
                <span className="text-lg text-saffron-400">₹{total}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <input
                value={tableId}
                onChange={(e) => setTableId(e.target.value)}
                placeholder="Table number (optional — leave blank for takeaway)"
                className="focus-ring w-full rounded-ticket border border-char-700 bg-char-850 px-4 py-2.5 text-char-50 placeholder:text-char-400"
              />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notes for the kitchen (allergies, spice level, etc.)"
                className="focus-ring w-full rounded-ticket border border-char-700 bg-char-850 px-4 py-2.5 text-char-50 placeholder:text-char-400"
                rows={2}
              />
            </div>

            {error && <p className="mt-3 text-sm text-chili-400">{error}</p>}

            <button
              onClick={placeOrder}
              disabled={placing}
              className="focus-ring mt-6 w-full rounded-ticket bg-saffron-400 py-3 font-display font-semibold text-char-950 hover:bg-saffron-300 disabled:opacity-60"
            >
              {placing ? "Sending to kitchen…" : "Place order"}
            </button>
          </>
        )}
      </section>
    </main>
  );
}
