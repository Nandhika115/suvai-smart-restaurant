import { NextResponse } from "next/server";
import { getStore } from "../../../lib/store";
import { getSession } from "../../../lib/session";

export async function GET() {
  const session = getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  const store = getStore();
  return NextResponse.json({ inventory: store.inventory });
}

export async function PATCH(req) {
  const session = getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  const { id, quantity } = await req.json();
  const store = getStore();
  const stockItem = store.inventory.find((i) => i.id === id);
  if (!stockItem) return NextResponse.json({ error: "Ingredient not found." }, { status: 404 });

  stockItem.quantity = Number(quantity);

  // If restocking a key ingredient back above zero, bring linked menu items back online.
  for (const menuId of stockItem.linkedItems) {
    const menuItem = store.menu.find((m) => m.id === menuId);
    if (menuItem && stockItem.quantity > 0 && menuItem.stock > 0) {
      menuItem.available = true;
    }
  }

  return NextResponse.json({ item: stockItem });
}
