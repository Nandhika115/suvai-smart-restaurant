import { NextResponse } from "next/server";
import { getStore } from "../../../lib/store";
import { getSession } from "../../../lib/session";


export const dynamic = "force-dynamic";
export const runtime = "nodejs";


export async function GET() {

  const session = getSession();


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



  const store = getStore();



  const totalRevenue =
    store.orders.reduce(
      (sum, o) => sum + o.total,
      0
    );



  const activeOrders =
    store.orders.filter(
      (o) =>
        !["billed", "cancelled"].includes(o.status)
    ).length;



  const avgOrderValue =
    store.orders.length
      ? Math.round(
          totalRevenue / store.orders.length
        )
      : 0;




  const itemCounts = {};


  for (const order of store.orders) {

    for (const line of order.items) {

      itemCounts[line.name] =
        (itemCounts[line.name] || 0) + line.qty;

    }

  }



  const topItems =
    Object.entries(itemCounts)
      .map(
        ([name, qty]) => ({
          name,
          qty
        })
      )
      .sort(
        (a, b) => b.qty - a.qty
      )
      .slice(0, 5);




  const lowStock =
    store.inventory.filter(
      (i) =>
        i.quantity <= i.threshold
    );





  const occupancy = {

    total:
      store.tables.length,

    occupied:
      store.tables.filter(
        (t) =>
          t.status === "occupied" ||
          t.status === "reserved"
      ).length,

  };






  const dayBuckets =
    Array.from({ length: 7 }).map((_, i) => {

      const daysAgo = 6 - i;


      const label =
        new Date(
          Date.now() -
          daysAgo * 86400000
        ).toLocaleDateString(
          "en-IN",
          {
            weekday: "short"
          }
        );



      const dayStart =
        Date.now() -
        daysAgo * 86400000 -
        (Date.now() % 86400000);



      const dayTotal =
        store.salesLog
          .filter(
            (s) =>
              s.at >= dayStart &&
              s.at < dayStart + 86400000
          )
          .reduce(
            (sum, s) =>
              sum + s.total,
            0
          );



      return {
        day: label,
        revenue: dayTotal
      };

    });





  if (
    dayBuckets.every(
      (d) => d.revenue === 0
    ) &&
    store.orders.length
  ) {

    dayBuckets[6].revenue =
      totalRevenue;

  }





  return NextResponse.json({

    totalRevenue,

    activeOrders,

    avgOrderValue,

    orderCount:
      store.orders.length,

    topItems,

    lowStock,

    occupancy,

    revenueByDay:
      dayBuckets,

  });

}