import { NextResponse } from "next/server";
import { getStore } from "../../../../lib/store";
import { getSession } from "../../../../lib/session";

const VALID_STATUSES = [
  "received",
  "preparing",
  "ready",
  "served",
  "billed",
  "cancelled"
];


// Get single order
export async function GET(req, { params }) {

  const session = getSession();

  if (!session) {
    return NextResponse.json(
      { error: "Sign in required." },
      { status: 401 }
    );
  }


  const store = getStore();


  const order = store.orders.find(
    (o) => o.id === params.id
  );


  if (!order) {
    return NextResponse.json(
      { error: "Order not found." },
      { status: 404 }
    );
  }



  // Admin can see all orders
  // Customer can see only their own orders

  if (
    session.role !== "admin" &&
    order.customerId !== session.id
  ) {

    return NextResponse.json(
      { error: "You are not allowed to view this order." },
      { status: 403 }
    );

  }


  return NextResponse.json({
    order
  });

}




// Update order status (Admin only)

export async function PATCH(req, { params }) {


  const session = getSession();


  if (!session || session.role !== "admin") {

    return NextResponse.json(
      { error: "Admin access required." },
      { status: 403 }
    );

  }



  const { status } = await req.json();



  if (!VALID_STATUSES.includes(status)) {

    return NextResponse.json(
      { error: "Invalid status." },
      { status: 400 }
    );

  }



  const store = getStore();



  const order = store.orders.find(
    (o) => o.id === params.id
  );



  if (!order) {

    return NextResponse.json(
      { error: "Order not found." },
      { status: 404 }
    );

  }



  order.status = status;



  return NextResponse.json({
    order
  });

}