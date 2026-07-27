import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStore, uid } from "../../../../lib/store";
import { hashPassword, sign, SESSION_COOKIE } from "../../../../lib/auth";

export async function POST(req) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  const store = getStore();
  const exists = store.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
  }

  const user = {
    id: uid("u"),
    name,
    email: email.toLowerCase(),
    role: "customer",
    passwordHash: hashPassword(password),
    otp: null,
  };
  store.users.push(user);

  const token = sign({ uid: user.id });
  cookies().set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });

  return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
}
