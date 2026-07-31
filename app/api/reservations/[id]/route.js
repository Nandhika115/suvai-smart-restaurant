import { NextResponse } from "next/server";
import { getStore } from "../../../../lib/store";
import { getSession } from "../../../../lib/session";


export const dynamic = "force-dynamic";
export const runtime = "nodejs";



export async function PATCH(req, { params }) {

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



  const { status } = await req.json();



  const store = getStore();



  const reservation = store.reservations.find(
    (r) => r.id === params.id
  );



  if (!reservation) {

    return NextResponse.json(
      {
        error: "Reservation not found."
      },
      {
        status: 404
      }
    );

  }




  if (
    session.role !== "admin" &&
    reservation.customerId !== session.id
  ) {

    return NextResponse.json(
      {
        error: "You can only modify your own reservation."
      },
      {
        status: 403
      }
    );

  }





  reservation.status = status;




  if (
    status === "cancelled" ||
    status === "completed"
  ) {

    const table = store.tables.find(
      (t) => t.id === reservation.tableId
    );


    if (table) {

      table.status = "available";

    }

  }





  return NextResponse.json({
    reservation
  });

}