import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "../../../../lib/supabase";

const {
  verifyPassword,
  sign,
  SESSION_COOKIE
} = require("../../../../lib/auth");


export const runtime = "nodejs";
export const dynamic = "force-dynamic";


export async function POST(req) {

  const { email, password } =
    await req.json();


  if (!email || !password) {

    return NextResponse.json(
      {
        error: "Email and password are required."
      },
      {
        status: 400
      }
    );

  }



  const normalizedEmail =
    email.trim().toLowerCase();


  const normalizedPassword =
    password.trim();




  const { data: user, error } =
    await supabase
      .from("users")
      .select("*")
      .eq(
        "email",
        normalizedEmail
      )
      .single();



  console.log(
    "LOGIN EMAIL:",
    normalizedEmail
  );

  console.log(
    "SUPABASE ERROR:",
    error
  );

  console.log(
    "USER FOUND:",
    user ? user.email : "NO USER"
  );




  if (error || !user) {

    return NextResponse.json(
      {
        error: "Invalid email or password."
      },
      {
        status: 401
      }
    );

  }





  const passwordMatch =
    verifyPassword(
      normalizedPassword,
      user.password_hash
    );



  console.log(
    "PASSWORD CHECK:",
    passwordMatch
  );





  if (!passwordMatch) {

    return NextResponse.json(
      {
        error: "Invalid email or password."
      },
      {
        status: 401
      }
    );

  }





  const token =
    sign({
      uid: user.id
    });





  const cookieStore =
    cookies();


  cookieStore.set(
    SESSION_COOKIE,
    token,
    {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    }
  );





  return NextResponse.json({

    user: {

      id: user.id,

      name: user.name,

      email: user.email,

      role: user.role,

    },

  });

}