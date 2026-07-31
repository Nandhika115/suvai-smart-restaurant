import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";
import { getSession } from "../../../../lib/session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";


const VALID_STATUSES = [
  "received",
  "preparing",
  "ready",
  "served",
  "billed",
  "cancelled"
];



// GET SINGLE ORDER
export async function GET(req, { params }) {

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



  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", params.id)
    .single();



  if (error || !order) {

    return NextResponse.json(
      {
        error: "Order not found."
      },
      {
        status: 404
      }
    );

  }



  if (
    session.role !== "admin" &&
    order.customer_id !== session.id
  ) {

    return NextResponse.json(
      {
        error: "You are not allowed to view this order."
      },
      {
        status: 403
      }
    );

  }



  return NextResponse.json({
    order: {
      id: order.id,
      customerId: order.customer_id,
      customerName: order.customer_name,
      tableId: order.table_id,
      items: order.items,
      status: order.status,
      total: order.total,
      notes: order.notes,
      createdAt: order.created_at
    }
  });

}




// UPDATE ORDER STATUS (ADMIN)
export async function PATCH(req, { params }) {

  const session = await getSession();


  if (!session || session.role !== "admin") {

    return NextResponse.json(
      {
        error: "Admin access required."
      },
      {
        status: 403
      }
    );

  }



  const { status } = await req.json();



  if (!VALID_STATUSES.includes(status)) {

    return NextResponse.json(
      {
        error: "Invalid status."
      },
      {
        status: 400
      }
    );

  }



  const { data: order, error } = await supabase
    .from("orders")
    .update({
      status
    })
    .eq("id", params.id)
    .select()
    .single();



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



  return NextResponse.json({
    order
  });

}