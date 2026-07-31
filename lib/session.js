// lib/session.js

import { cookies } from "next/headers";
import { SESSION_COOKIE, verify } from "./auth";
import { supabase } from "./supabase";


export async function getSession() {

  const cookieStore = await cookies();


  const token = cookieStore.get(SESSION_COOKIE)?.value;


  if (!token) {
    return null;
  }



  const payload = verify(token);


  if (!payload) {
    return null;
  }



  const { data: user, error } = await supabase
    .from("users")
    .select("id, name, email, role")
    .eq("id", payload.uid)
    .single();



  if (error || !user) {

    console.log(
      "SESSION USER ERROR:",
      error
    );

    return null;

  }



  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

}