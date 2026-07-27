import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { getSession } from "../../../lib/session";
import { uid } from "../../../lib/store";

export async function GET() {
  const { data, error } = await supabase
    .from("menu")
    .select("*");

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ menu: data });
}

export async function POST(req) {
  const session = getSession();

  if (!session || session.role !== "admin") {
    return NextResponse.json(
      { error: "Admin access required." },
      { status: 403 }
    );
  }

  const body = await req.json();

  const item = {
    id: uid("m"),
    name: body.name,
    category: body.category || "Mains",
    price: Number(body.price) || 0,
    veg: !!body.veg,
    available: Number(body.stock) > 0,
    stock: Number(body.stock) || 0,
    image: body.image || "🍽️",
    description: body.description || "",
  };

  const { data, error } = await supabase
    .from("menu")
    .insert([item])
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { item: data },
    { status: 201 }
  );
}