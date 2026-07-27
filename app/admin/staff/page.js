"use client";

import { useEffect, useState } from "react";

export default function AdminStaffPage() {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState({ name: "", role: "Server", shift: "" });
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const res = await fetch("/api/staff");
    const data = await res.json();
    setStaff(data.staff || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function addStaff(e) {
    e.preventDefault();
    await fetch("/api/staff", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", role: "Server", shift: "" });
    setShowForm(false);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-char-50">Staff</h1>
        <button onClick={() => setShowForm((v) => !v)} className="focus-ring rounded-ticket bg-saffron-400 px-4 py-2 text-sm font-semibold text-char-950 hover:bg-saffron-300">
          {showForm ? "Cancel" : "+ Add staff"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addStaff} className="mt-4 grid gap-3 rounded-ticket border border-char-800 bg-char-900 p-5 sm:grid-cols-3">
          <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="focus-ring rounded-ticket border border-char-700 bg-char-850 px-3 py-2 text-char-50" />
          <input placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="focus-ring rounded-ticket border border-char-700 bg-char-850 px-3 py-2 text-char-50" />
          <input placeholder="Shift (e.g. 10:00 - 19:00)" value={form.shift} onChange={(e) => setForm({ ...form, shift: e.target.value })} className="focus-ring rounded-ticket border border-char-700 bg-char-850 px-3 py-2 text-char-50" />
          <button className="focus-ring rounded-ticket bg-saffron-400 py-2 font-semibold text-char-950 hover:bg-saffron-300 sm:col-span-3">Add to roster</button>
        </form>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {staff.map((s) => (
          <div key={s.id} className="rounded-ticket border border-char-800 bg-char-900 p-5">
            <p className="font-display text-lg font-semibold text-char-50">{s.name}</p>
            <p className="text-sm text-char-400">{s.role}</p>
            <p className="mt-2 font-mono text-xs text-char-400">{s.shift}</p>
            <span className={`mt-3 inline-block rounded-ticket px-2 py-1 text-xs font-semibold ${s.status === "on-duty" ? "bg-sage-500/20 text-sage-400" : "bg-char-800 text-char-400"}`}>
              {s.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
