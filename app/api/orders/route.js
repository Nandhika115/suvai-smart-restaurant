import { NextResponse } from "next/server";
import crypto from "crypto";

import { supabase } from "../../../lib/supabase";
import { verify, SESSION_COOKIE } from "../../../lib/auth";
import { cookies } from "next/headers";


// GET CURRENT SESSION
async function getSession() {

  const cookieStore = cookies();

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
    .select("*")
    .eq("id", payload.uid)
    .single();



  if (error || !user) {
    console.log("SESSION ERROR:", error);
    return null;
  }



  return {
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar_url: user.avatar_url,
};
}



// ======================
// GET ORDERS
// ======================

export async function GET() {

  const session = await getSession();



  if (!session) {

    return NextResponse.json(
      {
        error: "Sign in required."
      },
      {
        status: 401
      }
    );

  }




  let query = supabase
    .from("orders")
    .select("*")
    .order("created_at", {
      ascending: false
    });



  // Customer sees only own orders
  // Admin sees all orders
  if (session.role !== "admin") {

    query = query.eq(
      "customer_id",
      session.id
    );

  }




  const { data, error } = await query;



  if (error) {

    return NextResponse.json(
      {
        error: error.message
      },
      {
        status: 500
      }
    );

  }




  // Convert database fields to frontend fields
  const orders = data.map((order) => ({

    id: order.id,

    customerName:
      order.customer_name,

    tableId:
      order.table_id,

    items:
      order.items,

    status:
      order.status,

    total:
      order.total,

    notes:
      order.notes,

    createdAt:
      order.created_at

  }));





  return NextResponse.json({
    orders
  });


}







// ======================
// PLACE ORDER
// ======================

export async function POST(req) {

  try {


    const session = await getSession();



    if (!session) {

      return NextResponse.json(
        {
          error: "Sign in required to place an order."
        },
        {
          status: 401
        }
      );

    }





    const {
      items,
      tableId,
      notes

    } = await req.json();






    if (!Array.isArray(items) || items.length === 0) {

      return NextResponse.json(
        {
          error: "Cart is empty."
        },
        {
          status: 400
        }
      );

    }






    const total = items.reduce(
      (sum, item) =>
        sum + item.price * item.qty,
      0
    );






    const order = {


      id:
        crypto.randomUUID(),


      customer_id:
        session.id,


      customer_name:
        session.name,



      table_id:
        tableId || null,



      items,



      status:
        "received",



      total,



      notes:
        notes || "",



      created_at:
        new Date().toISOString()

    };







    const { data, error } = await supabase

      .from("orders")

      .insert(order)

      .select()

      .single();







    if (error) {


      console.error(
        "ORDER INSERT ERROR:",
        error
      );


      return NextResponse.json(
        {
          error: error.message
        },
        {
          status: 500
        }
      );

    }






    return NextResponse.json(

      {
        order: data
      },

      {
        status: 201
      }

    );





  } catch (err) {


    console.error(
      "ORDER API ERROR:",
      err
    );


    return NextResponse.json(

      {
        error: err.message
      },

      {
        status: 500
      }

    );


  }

}