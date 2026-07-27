import { NextResponse } from "next/server";
import { getStore, uid } from "../../../lib/store";
import { getSession } from "../../../lib/session";

export async function GET() {
  const session = getSession();
  const store = getStore();
  if (!session) return NextResponse.json({ error: "Sign in required." }, { status: 401 });

  const orders =
    session.role === "admin"
      ? store.orders
      : store.orders.filter((o) => o.customerId === session.id);

  return NextResponse.json({ orders: [...orders].sort((a, b) => b.createdAt - a.createdAt) });
}

export async function POST(req) {
  const session = getSession();
  if (!session) return NextResponse.json({ error: "Sign in required to place an order." }, { status: 401 });

  const { items, tableId, notes } = await req.json();
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }

  const store = getStore();

  // Validate availability & stock, then decrement it (simple inventory sync).
  for (const line of items) {
    const menuItem = store.menu.find((m) => m.id === line.menuId);
    if (!menuItem || !menuItem.available) {
      return NextResponse.json({ error: `${line.name || "An item"} is no longer available.` }, { status: 409 });
    }
    if (menuItem.stock < line.qty) {
      return NextResponse.json({ error: `Only ${menuItem.stock} of ${menuItem.name} left.` }, { status: 409 });
    }
  }
  for (const line of items) {
    const menuItem = store.menu.find((m) => m.id === line.menuId);
    menuItem.stock -= line.qty;
    if (menuItem.stock <= 0) menuItem.available = false;
  }

  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const order = {
    id: uid("o"),
    customerId: session.id,
    customerName: session.name,
    tableId: tableId || null,
    items,
    status: "received",
    total,
    createdAt: Date.now(),
    notes: notes || "",
  };
  store.orders.push(order);
  store.salesLog.push({ orderId: order.id, total, at: order.createdAt });

  return NextResponse.json({ order }, { status: 201 });
}
