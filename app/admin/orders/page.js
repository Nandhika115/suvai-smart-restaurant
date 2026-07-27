"use client";

import { useEffect, useState } from "react";

const STAGES = ["received", "preparing", "ready", "served", "billed"];
const NEXT_LABEL = {
  received: "Start preparing",
  preparing: "Mark ready",
  ready: "Mark served",
  served: "Mark billed",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/orders");
    const data = await res.json();
    setOrders(data.orders || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 6000);
    return () => clearInterval(interval);
  }, []);

  async function advance(order) {
    const idx = STAGES.indexOf(order.status);
    const nextStatus = STAGES[idx + 1];
    if (!nextStatus) return;
    await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    load();
  }

  async function cancel(order) {
    await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-char-50">Orders</h1>
      <p className="mt-1 text-sm text-char-400">Auto-refreshes every 6 seconds. Move each ticket through the kitchen flow.</p>

      {loading ? (
        <p className="mt-6 text-char-400">Loading…</p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {STAGES.filter((s) => s !== "billed").map((stage) => (
            <div key={stage} className="rounded-ticket border border-char-800 bg-char-900 p-4">
              <h2 className="font-mono text-xs uppercase tracking-widest text-char-400">{stage} ({orders.filter((o) => o.status === stage).length})</h2>
              <div className="mt-3 space-y-3">
                {orders.filter((o) => o.status === stage).map((o) => (
                  <div key={o.id} className="ticket-edge rounded-ticket border border-char-700 bg-char-850 p-4 pt-6 font-mono text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-char-50">#{o.id.slice(-6).toUpperCase()}</span>
                      <span className="text-saffron-400">₹{o.total}</span>
                    </div>
                    <p className="mt-1 text-xs text-char-400">{o.tableId ? `Table ${o.tableId}` : "Takeaway"} &middot; {o.customerName}</p>
                    <ul className="mt-2 space-y-0.5 text-xs text-char-200">
                      {o.items.map((line) => (
                        <li key={line.menuId}>{line.qty}× {line.name}</li>
                      ))}
                    </ul>
                    {o.notes && <p className="mt-2 text-xs italic text-char-400">"{o.notes}"</p>}
                    <div className="mt-3 flex gap-2">
                      <button onClick={() => advance(o)} className="focus-ring flex-1 rounded-ticket bg-saffron-400 py-1.5 text-xs font-semibold text-char-950 hover:bg-saffron-300">
                        {NEXT_LABEL[stage]}
                      </button>
                      <button onClick={() => cancel(o)} className="focus-ring rounded-ticket border border-char-700 px-2 text-xs text-chili-400 hover:border-chili-400">
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
