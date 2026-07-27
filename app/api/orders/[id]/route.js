import { NextResponse } from "next/server";
import { getStore } from "../../../../lib/store";
import { getSession } from "../../../../lib/session";

const VALID_STATUSES = ["received", "preparing", "ready", "served", "billed", "cancelled"];

export async function GET(req, { params }) {
  const store = getStore();
  const order = store.orders.find((o) => o.id === params.id);
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PATCH(req, { params }) {
  const session = getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  const { status } = await req.json();
  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status." }, { status: 400 });
  }
  const store = getStore();
  const order = store.orders.find((o) => o.id === params.id);
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });

  order.status = status;
  return NextResponse.json({ order });
}
