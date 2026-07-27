"use client";

import Link from "next/link";
import { useState } from "react";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/menu", label: "Menu" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/tables", label: "Tables" },
  { href: "/admin/staff", label: "Staff" },
  { href: "/admin/customers", label: "Customers" },
];

export default function AdminTopbar({ name }) {
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  }

  return (
    <header className="flex items-center justify-between border-b border-char-800 bg-char-900 px-6 py-4">
      <button className="text-char-100 md:hidden" onClick={() => setOpen((v) => !v)}>
        ☰ Menu
      </button>
      <p className="hidden font-mono text-xs text-char-400 md:block">Signed in as {name}</p>
      <button onClick={handleLogout} className="font-mono text-xs text-char-400 hover:text-chili-400">
        Sign out
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-16 z-30 border-b border-char-800 bg-char-900 p-3 md:hidden">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="block rounded-ticket px-3 py-2 text-sm text-char-200 hover:bg-char-800">
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
