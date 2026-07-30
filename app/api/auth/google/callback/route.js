import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "../../../../../lib/supabase";
import { sign, SESSION_COOKIE } from "../../../../../lib/auth";


// Google OAuth Callback
export async function GET(req) {

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const baseUrl = process.env.NEXTAUTH_URL || url.origin;


  if (!code) {
    return NextResponse.redirect(
      `${baseUrl}/login?error=google_oauth_cancelled`
    );
  }


  try {

    // Get Google access token
    const tokenRes = await fetch(
      "https://oauth2.googleapis.com/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: `${baseUrl}/api/auth/google/callback`,
          grant_type: "authorization_code",
        }),
      }
    );


    const tokenData = await tokenRes.json();


    if (!tokenData.access_token) {
      throw new Error("Google token failed");
    }



    // Get Google profile details
    const profileRes = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );


    const profile = await profileRes.json();

    console.log("GOOGLE PROFILE:", profile);


    // Check existing user
    let { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", profile.email.toLowerCase())
      .single();



    // Create user if first login
    if (!user) {


      const newUser = {

        id: crypto.randomUUID(),

        name: profile.name || profile.email,

        email: profile.email.toLowerCase(),

        avatar_url: profile.picture || null,

        role: "customer",

        password_hash: null,

      };



      const { data, error } = await supabase
        .from("users")
        .insert([newUser])
        .select()
        .single();



      if (error) {
        throw error;
      }


      user = data;


    } else {

  const { error } = await supabase
    .from("users")
    .update({
      avatar_url: profile.picture,
      name: profile.name || user.name,
    })
    .eq("id", user.id);


  if (error) {
    console.log("AVATAR UPDATE ERROR:", error);
  }

}



    // Create session
    const token = sign({
      uid: user.id,
    });



    cookies().set(
      SESSION_COOKIE,
      token,
      {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      }
    );



    return NextResponse.redirect(
      `${baseUrl}/menu`
    );


  } catch (err) {


    console.error(
      "Google OAuth error:",
      err
    );


    return NextResponse.redirect(
      `${baseUrl}/login?error=google_oauth_failed`
    );


  }

}