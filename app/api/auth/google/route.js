import { NextResponse } from "next/server";

// Step 1 of Google OAuth: send the user to Google's consent screen.
// Requires GOOGLE_CLIENT_ID and NEXTAUTH_URL (your app's base URL) in .env.local.
// See README.md > "Wiring up real Google OAuth" for the 5-minute setup.
export async function GET(req) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "GOOGLE_CLIENT_ID is not set. Add it to .env.local — see README.md." },
      { status: 500 }
    );
  }

  const baseUrl = process.env.NEXTAUTH_URL || new URL(req.url).origin;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}
