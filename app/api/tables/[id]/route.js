import { NextResponse } from "next/server";
import { getStore } from "../../../../lib/store";
import { getSession } from "../../../../lib/session";


const VALID = [
  "available",
  "occupied",
  "reserved",
  "cleaning"
];


export const dynamic = "force-dynamic";
export const runtime = "nodejs";



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




  if (!VALID.includes(status)) {

    return NextResponse.json(
      {
        error: "Invalid status."
      },
      {
        status: 400
      }
    );

  }




  const store = getStore();




  const table = store.tables.find(
    (t) => t.id === params.id
  );




  if (!table) {

    return NextResponse.json(
      {
        error: "Table not found."
      },
      {
        status: 404
      }
    );

  }




  table.status = status;




  return NextResponse.json({
    table
  });

}