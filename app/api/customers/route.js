import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verify } from "../../../lib/auth";
import { supabase } from "../../../lib/supabase";
import { getStore } from "../../../lib/store";


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



  const {data:user,error}=

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


  const admin =
    await checkAdmin();



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



  const customers =
    (store.users || [])
    .filter(
      user =>
        user.role==="customer"
    )
    .map(user=>{


      const orders =
        store.orders.filter(
          order =>
            order.customerId===user.id
        );



      const totalSpent =
        orders.reduce(
          (sum,order)=>
            sum+order.total,
          0
        );



      const lastOrder =
        orders.sort(
          (a,b)=>
            b.createdAt-a.createdAt
        )[0];



      return {

        id:user.id,

        name:user.name,

        email:user.email,

        orderCount:
          orders.length,


        totalSpent,


        lastVisit:
          lastOrder
          ? lastOrder.createdAt
          : null

      };


    });





  return NextResponse.json({
    customers
  });


}