import { NextResponse } from "next/server";
import { getStore } from "../../../../lib/store";
import { getSession } from "../../../../lib/session";

export async function PATCH(req, { params }) {
  const session = getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  const updates = await req.json();
  const store = getStore();
  const item = store.menu.find((m) => m.id === params.id);
  if (!item) return NextResponse.json({ error: "Menu item not found." }, { status: 404 });

  Object.assign(item, updates);
  // Live availability follows stock automatically unless explicitly overridden.
  if (updates.stock !== undefined && updates.available === undefined) {
    item.available = item.stock > 0;
  }
  return NextResponse.json({ item });
}

export async function DELETE(req, { params }) {
  const session = getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  const store = getStore();
  store.menu = store.menu.filter((m) => m.id !== params.id);
  return NextResponse.json({ ok: true });
}
