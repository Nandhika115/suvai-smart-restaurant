import { NextResponse } from "next/server";
import { getStore, uid } from "../../../lib/store";
import { getSession } from "../../../lib/session";

export async function GET() {
  const session = getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  const store = getStore();
  return NextResponse.json({ staff: store.staff });
}

export async function POST(req) {
  const session = getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  const body = await req.json();
  const store = getStore();
  const member = {
    id: uid("s"),
    name: body.name,
    role: body.role || "Server",
    shift: body.shift || "TBD",
    status: "on-duty",
  };
  store.staff.push(member);
  return NextResponse.json({ member }, { status: 201 });
}
