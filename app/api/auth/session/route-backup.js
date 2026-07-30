import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verify } from "../../../../lib/auth.js";
import { supabase } from "../../../../lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {

  const cookieStore = await cookies();

  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({
      user: null,
    });
  }


  const payload = verify(token);

  if (!payload) {
    return NextResponse.json({
      user: null,
    });
  }


  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", payload.uid)
    .single();


  if (error || !user) {
    return NextResponse.json({
      user: null,
    });
  }


  const { count, error: orderError } = await supabase
    .from("orders")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("customer_id", user.id);


  if (orderError) {
    console.log("ORDER COUNT ERROR:", orderError);
  }


  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar_url || null,
      totalOrders: count || 0,
    },
  });
}