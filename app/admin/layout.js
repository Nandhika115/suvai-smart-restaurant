"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminTopbar from "../../components/AdminTopbar";

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/menu", label: "Menu" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/tables", label: "Tables" },
  { href: "/admin/staff", label: "Staff" },
  { href: "/admin/customers", label: "Customers" },
];

export default function AdminLayout({ children }) {
  const [session, setSession] = useState(null);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (!data.user || data.user.role !== "admin") {
          redirect("/login?next=/admin");
        }

        setSession(data.user);
      });
  }, []);

  if (!session) {
    return <p className="p-6 text-char-400">Loading...</p>;
  }

  return (
    <div className="flex min-h-screen bg-char-950">
      <aside className="hidden w-56 shrink-0 border-r border-char-800 bg-char-900 md:block">
        <div className="px-5 py-6">
          <p className="font-display text-lg font-semibold text-char-50">
            Suvai <span className="text-saffron-400">OS</span>
          </p>
          <p className="font-mono text-xs text-char-400">
            Management console
          </p>
        </div>

        <nav className="flex flex-col gap-1 px-3">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-ticket px-3 py-2 text-sm text-char-200 hover:bg-char-800 hover:text-saffron-400"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <AdminTopbar name={session.name} />
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}