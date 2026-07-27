"use client";

import { useEffect, useState } from "react";

const STATUS_CYCLE = ["available", "occupied", "cleaning", "reserved"];
const STATUS_STYLE = {
  available: "border-sage-500/40 bg-sage-500/10 text-sage-400",
  occupied: "border-chili-500/40 bg-chili-500/10 text-chili-400",
  reserved: "border-saffron-400/40 bg-saffron-400/10 text-saffron-400",
  cleaning: "border-char-600 bg-char-800 text-char-400",
};

export default function AdminTablesPage() {
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);

  async function load() {
    const [tRes, rRes] = await Promise.all([fetch("/api/tables"), fetch("/api/reservations")]);
    setTables((await tRes.json()).tables || []);
    setReservations((await rRes.json()).reservations || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function cycleStatus(table) {
    const idx = STATUS_CYCLE.indexOf(table.status);
    const next = STATUS_CYCLE[(idx + 1) % STATUS_CYCLE.length];
    await fetch(`/api/tables/${table.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    load();
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-char-50">Tables</h1>
      <p className="mt-1 text-sm text-char-400">Tap a table to cycle its status.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {tables.map((t) => (
          <button
            key={t.id}
            onClick={() => cycleStatus(t)}
            className={`focus-ring rounded-ticket border p-5 text-left ${STATUS_STYLE[t.status]}`}
          >
            <p className="font-display text-xl font-semibold">{t.name}</p>
            <p className="text-xs opacity-80">{t.zone} &middot; seats {t.capacity}</p>
            <p className="mt-2 font-mono text-xs uppercase">{t.status}</p>
          </button>
        ))}
      </div>

      <h2 className="mt-10 font-display text-lg font-semibold text-char-50">Upcoming reservations</h2>
      <div className="mt-3 overflow-x-auto rounded-ticket border border-char-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-char-900 text-char-400">
            <tr>
              <th className="px-4 py-3">Guest</th>
              <th className="px-4 py-3">Party</th>
              <th className="px-4 py-3">Table</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((r) => (
              <tr key={r.id} className="border-t border-char-800 bg-char-900">
                <td className="px-4 py-3 text-char-100">{r.customerName}</td>
                <td className="px-4 py-3 text-char-400">{r.partySize}</td>
                <td className="px-4 py-3 text-char-400">{r.tableId}</td>
                <td className="px-4 py-3 text-char-400">{new Date(r.date).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</td>
                <td className="px-4 py-3 font-mono text-xs uppercase text-saffron-400">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
