import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verify } from "../../../../lib/auth.js";
import { supabase } from "../../../../lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {

  const cookieStore = await cookies();

  const token = cookieStore.get(SESSION_COOKIE)?.value;

  console.log("SESSION TOKEN:", token);


  if (!token) {
    console.log("NO COOKIE FOUND");
    return NextResponse.json({ user: null });
  }


  const payload = verify(token);

  console.log("PAYLOAD:", payload);


  if (!payload) {
    console.log("INVALID TOKEN");
    return NextResponse.json({ user: null });
  }


  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", payload.uid)
    .single();


  console.log("USER:", user);
  console.log("SUPABASE ERROR:", error);


  if (error || !user) {
    return NextResponse.json({ user: null });
  }


  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar_url || null,
    },
  });
}