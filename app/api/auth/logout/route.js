import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "../../../../lib/auth";

export async function POST() {

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, "", {
    value: "",
    expires: new Date(0),
    maxAge: 0,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return NextResponse.json({
    ok: true,
  });

}