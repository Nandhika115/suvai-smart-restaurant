import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStore } from "../../../../lib/store";
import { generateOtp, sign, SESSION_COOKIE } from "../../../../lib/auth";

// POST { action: "request", email } -> generates + "sends" a 6-digit code
// POST { action: "verify", email, code } -> verifies and logs the user in
export async function POST(req) {
  const { action, email, code } = await req.json();
  const store = getStore();
  const user = store.users.find((u) => u.email.toLowerCase() === (email || "").toLowerCase());

  if (!user) {
    return NextResponse.json({ error: "No account found for this email." }, { status: 404 });
  }

  if (action === "request") {
    const otp = generateOtp();
    user.otp = { code: otp, expiresAt: Date.now() + 5 * 60 * 1000 };

    // DEMO ONLY: we return the code directly so you can test without an
    // email/SMS provider wired up. In production, send `otp` via
    // Resend/SendGrid/Twilio and never return it in the response.
    return NextResponse.json({ sent: true, devCode: otp });
  }

  if (action === "verify") {
    if (!user.otp || user.otp.code !== code || Date.now() > user.otp.expiresAt) {
      return NextResponse.json({ error: "Invalid or expired code." }, { status: 401 });
    }
    user.otp = null;
    const token = sign({ uid: user.id });
    cookies().set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}
