"use client";

import { useEffect, useState } from "react";

export default function AdminMenuPage() {
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState({ name: "", category: "Mains", price: "", stock: "", veg: false, description: "", image: "🍽️" });
  const [showForm, setShowForm] = useState(false);

  async function load() {
    const res = await fetch("/api/menu");
    const data = await res.json();
    setMenu(data.menu || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateItem(id, patch) {
    await fetch(`/api/menu/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    load();
  }

  async function removeItem(id) {
    await fetch(`/api/menu/${id}`, { method: "DELETE" });
    load();
  }

  async function addItem(e) {
    e.preventDefault();
    await fetch("/api/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", category: "Mains", price: "", stock: "", veg: false, description: "", image: "🍽️" });
    setShowForm(false);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-char-50">Menu</h1>
          <p className="mt-1 text-sm text-char-400">Stock hits zero → dish auto-marks as sold out on the live menu.</p>
        </div>
        <button onClick={() => setShowForm((v) => !v)} className="focus-ring rounded-ticket bg-saffron-400 px-4 py-2 text-sm font-semibold text-char-950 hover:bg-saffron-300">
          {showForm ? "Cancel" : "+ Add dish"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={addItem} className="mt-4 grid gap-3 rounded-ticket border border-char-800 bg-char-900 p-5 sm:grid-cols-2">
          <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="focus-ring rounded-ticket border border-char-700 bg-char-850 px-3 py-2 text-char-50" />
          <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="focus-ring rounded-ticket border border-char-700 bg-char-850 px-3 py-2 text-char-50" />
          <input required type="number" placeholder="Price (₹)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="focus-ring rounded-ticket border border-char-700 bg-char-850 px-3 py-2 text-char-50" />
          <input required type="number" placeholder="Starting stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="focus-ring rounded-ticket border border-char-700 bg-char-850 px-3 py-2 text-char-50" />
          <input placeholder="Emoji icon" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="focus-ring rounded-ticket border border-char-700 bg-char-850 px-3 py-2 text-char-50" />
          <label className="flex items-center gap-2 text-sm text-char-200">
            <input type="checkbox" checked={form.veg} onChange={(e) => setForm({ ...form, veg: e.target.checked })} /> Vegetarian
          </label>
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="focus-ring rounded-ticket border border-char-700 bg-char-850 px-3 py-2 text-char-50 sm:col-span-2" />
          <button className="focus-ring rounded-ticket bg-saffron-400 py-2 font-semibold text-char-950 hover:bg-saffron-300 sm:col-span-2">Add to menu</button>
        </form>
      )}

      <div className="mt-6 overflow-x-auto rounded-ticket border border-char-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-char-900 text-char-400">
            <tr>
              <th className="px-4 py-3">Dish</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Available</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {menu.map((item) => (
              <tr key={item.id} className="border-t border-char-800 bg-char-900">
                <td className="px-4 py-3 text-char-100">{item.image} {item.name}</td>
                <td className="px-4 py-3 text-char-400">{item.category}</td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    defaultValue={item.price}
                    onBlur={(e) => updateItem(item.id, { price: Number(e.target.value) })}
                    className="w-20 rounded-ticket border border-char-700 bg-char-850 px-2 py-1 text-char-50"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    defaultValue={item.stock}
                    onBlur={(e) => updateItem(item.id, { stock: Number(e.target.value) })}
                    className="w-16 rounded-ticket border border-char-700 bg-char-850 px-2 py-1 text-char-50"
                  />
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => updateItem(item.id, { available: !item.available })}
                    className={`rounded-ticket px-3 py-1 text-xs font-semibold ${item.available ? "bg-sage-500/20 text-sage-400" : "bg-chili-500/20 text-chili-400"}`}
                  >
                    {item.available ? "Live" : "Sold out"}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => removeItem(item.id)} className="text-xs text-chili-400 hover:underline">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
