import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verify } from "../../../../lib/auth";
import { getStore } from "../../../../lib/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";


async function checkAdmin() {

  const cookieStore = await cookies();

  const token = cookieStore.get(SESSION_COOKIE)?.value;

  const session = verify(token);


  if (!session || session.role !== "admin") {
    return null;
  }


  return session;
}



export async function PATCH(req, { params }) {

  const session = await checkAdmin();


  if (!session) {
    return NextResponse.json(
      {
        error: "Admin access required."
      },
      {
        status: 403
      }
    );
  }



  const updates = await req.json();


  const store = getStore();



  const item = store.menu.find(
    (m) => m.id === params.id
  );



  if (!item) {

    return NextResponse.json(
      {
        error: "Menu item not found."
      },
      {
        status: 404
      }
    );

  }



  Object.assign(item, updates);



  // Auto update availability based on stock
  if (
    updates.stock !== undefined &&
    updates.available === undefined
  ) {

    item.available = item.stock > 0;

  }



  return NextResponse.json({
    item
  });

}




export async function DELETE(req, { params }) {

  const session = await checkAdmin();


  if (!session) {

    return NextResponse.json(
      {
        error: "Admin access required."
      },
      {
        status: 403
      }
    );

  }



  const store = getStore();



  store.menu =
    store.menu.filter(
      (m) => m.id !== params.id
    );



  return NextResponse.json({
    ok: true
  });

}