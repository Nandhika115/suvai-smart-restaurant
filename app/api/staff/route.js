import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verify } from "../../../lib/auth";
import { supabase } from "../../../lib/supabase";
import { getStore, uid } from "../../../lib/store";


export const dynamic = "force-dynamic";
export const runtime = "nodejs";



async function checkAdmin(){

  const cookieStore = await cookies();

  const token =
    cookieStore.get(SESSION_COOKIE)?.value;


  const payload = verify(token);


  if(!payload){
    return null;
  }



  const {data:user,error} =
    await supabase
    .from("users")
    .select("*")
    .eq("id",payload.uid)
    .single();



  if(error || !user){
    return null;
  }



  if(user.role !== "admin"){
    return null;
  }


  return user;

}




export async function GET(){

  const admin = await checkAdmin();


  if(!admin){

    return NextResponse.json(
      {
        error:"Admin access required."
      },
      {
        status:403
      }
    );

  }



  const store=getStore();


  return NextResponse.json({
    staff: store.staff || []
  });

}






export async function POST(req){


  const admin = await checkAdmin();


  if(!admin){

    return NextResponse.json(
      {
        error:"Admin access required."
      },
      {
        status:403
      }
    );

  }



  const body = await req.json();


  const store=getStore();



  const member={

    id:uid("s"),

    name:
      body.name,


    role:
      body.role || "Server",


    shift:
      body.shift || "TBD",


    status:
      "on-duty"

  };



  store.staff.push(member);



  return NextResponse.json(
    {
      member
    },
    {
      status:201
    }
  );


}