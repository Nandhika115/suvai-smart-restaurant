import { NextResponse } from "next/server";
import { getStore } from "../../../lib/store";
import { getSession } from "../../../lib/session";

export async function GET() {
  const session = getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  const store = getStore();

  const customers = store.users
    .filter((u) => u.role === "customer")
    .map((u) => {
      const orders = store.orders.filter((o) => o.customerId === u.id);
      const totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
      const lastOrder = orders.sort((a, b) => b.createdAt - a.createdAt)[0];
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        orderCount: orders.length,
        totalSpent,
        lastVisit: lastOrder ? lastOrder.createdAt : null,
      };
    });

  return NextResponse.json({ customers });
}
