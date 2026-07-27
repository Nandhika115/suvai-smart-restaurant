"use client";

import { useEffect, useState } from "react";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetch("/api/customers")
      .then((r) => r.json())
      .then((d) => setCustomers(d.customers || []));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-char-50">Customers</h1>
      <p className="mt-1 text-sm text-char-400">Order history and lifetime value per guest.</p>

      <div className="mt-6 overflow-x-auto rounded-ticket border border-char-800">
        <table className="w-full text-left text-sm">
          <thead className="bg-char-900 text-char-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Total spent</th>
              <th className="px-4 py-3">Last visit</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t border-char-800 bg-char-900">
                <td className="px-4 py-3 text-char-100">{c.name}</td>
                <td className="px-4 py-3 text-char-400">{c.email}</td>
                <td className="px-4 py-3 text-char-400">{c.orderCount}</td>
                <td className="px-4 py-3 font-mono text-saffron-400">₹{c.totalSpent}</td>
                <td className="px-4 py-3 text-char-400">{c.lastVisit ? new Date(c.lastVisit).toLocaleDateString("en-IN") : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
