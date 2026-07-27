import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStore } from "../../../../lib/store";
import { verifyPassword, sign, SESSION_COOKIE } from "../../../../lib/auth";

export async function POST(req) {
  const { email, password } = await req.json();
  const store = getStore();
  const user = store.users.find((u) => u.email.toLowerCase() === (email || "").toLowerCase());

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const token = sign({ uid: user.id });
  cookies().set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });

  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}
