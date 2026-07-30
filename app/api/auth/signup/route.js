import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "../../../../lib/supabase";
import { hashPassword, sign, SESSION_COOKIE } from "../../../../lib/auth";

export async function POST(req) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Name, email, and password are required." },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters." },
      { status: 400 }
    );
  }

  const normalizedEmail = email.toLowerCase();


  // Check existing user in Supabase
  const { data: existingUser } = await supabase
    .from("users")
    .select("*")
    .eq("email", normalizedEmail)
    .single();


  if (existingUser) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }



  // Generate UUID compatible with Supabase
  const userId = crypto.randomUUID();



  const newUser = {
    id: userId,
    name,
    email: normalizedEmail,
    role: "customer",
    password_hash: hashPassword(password),
  };



  // Save user permanently
  const { data: user, error } = await supabase
    .from("users")
    .insert(newUser)
    .select()
    .single();



  if (error) {
    console.error("Signup error:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }



  // Create login session
  const token = sign({
    uid: user.id
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



  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}