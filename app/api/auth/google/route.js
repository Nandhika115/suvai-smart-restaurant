import { NextResponse } from "next/server";

// Step 1 of Google OAuth: send the user to Google's consent screen.
export async function GET(req) {

  const clientId = process.env.GOOGLE_CLIENT_ID;

  console.log("GOOGLE CLIENT ID:", clientId ? "FOUND" : "MISSING");


  if (!clientId) {

    return NextResponse.json(
      {
        error: "GOOGLE_CLIENT_ID is not set. Add it to .env.local."
      },
      {
        status: 500
      }
    );

  }



  const baseUrl =
    process.env.NEXTAUTH_URL ||
    new URL(req.url).origin;


  const redirectUri =
    `${baseUrl}/api/auth/google/callback`;



  const params = new URLSearchParams({

    client_id: clientId,

    redirect_uri: redirectUri,

    response_type: "code",

    scope: "openid email profile",

    prompt: "select_account",

  });



  console.log("Google Redirect URI:", redirectUri);



  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );

}