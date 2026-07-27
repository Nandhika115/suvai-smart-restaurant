import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStore, uid } from "../../../../../lib/store";
import { sign, SESSION_COOKIE } from "../../../../../lib/auth";

// Step 2 of Google OAuth: Google redirects here with ?code=...
export async function GET(req) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const baseUrl = process.env.NEXTAUTH_URL || url.origin;

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/login?error=google_oauth_cancelled`);
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${baseUrl}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error("No access token returned by Google.");

    const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileRes.json();

    const store = getStore();
    let user = store.users.find((u) => u.email.toLowerCase() === profile.email.toLowerCase());
    if (!user) {
      user = {
        id: uid("u"),
        name: profile.name || profile.email,
        email: profile.email.toLowerCase(),
        role: "customer",
        passwordHash: null, // Google-only account, no local password
        otp: null,
      };
      store.users.push(user);
    }

    const token = sign({ uid: user.id });
    cookies().set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7 });

    return NextResponse.redirect(`${baseUrl}/menu`);
  } catch (err) {
    console.error("Google OAuth error:", err);
    return NextResponse.redirect(`${baseUrl}/login?error=google_oauth_failed`);
  }
}
