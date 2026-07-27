"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../../components/Navbar";

const STAGES = ["received", "preparing", "ready", "served", "billed"];
const LABELS = {
  received: "Order received",
  preparing: "In the kitchen",
  ready: "Ready to serve",
  served: "Served",
  billed: "Billed",
  cancelled: "Cancelled",
};

export default function TrackOrderPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch(`/api/orders/${orderId}`);
    const data = await res.json();
    if (!res.ok) return setError(data.error);
    setOrder(data.order);
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  const stageIndex = order ? STAGES.indexOf(order.status) : -1;

  return (
    <main className="min-h-screen bg-char-900 pb-24">
      <Navbar />
      <section className="mx-auto max-w-xl px-5 py-10">
        <h1 className="font-display text-3xl font-semibold text-char-50">Order #{typeof orderId === "string" ? orderId.slice(-6).toUpperCase() : ""}</h1>

        {error && <p className="mt-6 text-chili-400">{error}</p>}

        {order && (
          <>
            <div className="mt-8 flex justify-between">
              {STAGES.map((stage, i) => (
                <div key={stage} className="flex flex-1 flex-col items-center text-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border-2 font-mono text-sm ${
                      order.status === "cancelled"
                        ? "border-char-700 text-char-700"
                        : i <= stageIndex
                        ? "border-saffron-400 bg-saffron-400 text-char-950"
                        : "border-char-700 text-char-400"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <p className="mt-2 text-xs text-char-400">{LABELS[stage]}</p>
                  {i < STAGES.length - 1 && <div className={`mt-[-28px] h-0.5 w-full translate-y-[14px] ${i < stageIndex ? "bg-saffron-400" : "bg-char-700"}`} />}
                </div>
              ))}
            </div>

            {order.status === "cancelled" && (
              <p className="mt-6 rounded-ticket border border-chili-500/40 bg-chili-500/10 p-4 text-chili-400">This order was cancelled.</p>
            )}

            <div className="ticket-edge mt-10 rounded-ticket border border-char-700 bg-char-850 p-6 pt-8 font-mono">
              {order.items.map((line) => (
                <div key={line.menuId} className="flex justify-between border-b border-dashed border-char-700 py-2 text-sm">
                  <span className="text-char-100">{line.qty} × {line.name}</span>
                  <span className="text-char-200">₹{line.qty * line.price}</span>
                </div>
              ))}
              <div className="flex justify-between pt-3">
                <span className="text-char-200">Total</span>
                <span className="text-saffron-400">₹{order.total}</span>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-char-400">This page refreshes automatically — no need to reload.</p>
          </>
        )}
      </section>
    </main>
  );
}
