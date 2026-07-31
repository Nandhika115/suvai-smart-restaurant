import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verify } from "../../../lib/auth";
import { supabase } from "../../../lib/supabase";
import { getStore } from "../../../lib/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";


export async function GET() {

  const cookieStore = await cookies();

  const token = cookieStore.get(SESSION_COOKIE)?.value;

  const session = verify(token);


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



  // Get user from database
  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.uid)
    .single();



  if (!user || user.role !== "admin") {
    return NextResponse.json(
      {
        error: "Admin access required."
      },
      {
        status: 403
      }
    );
  }



  // ORDERS

  const { data: orderData, error: orderError } =
    await supabase
      .from("orders")
      .select("*")
      .order(
        "created_at",
        {
          ascending:false
        }
      );


  if(orderError){
    console.log("ORDER ERROR:",orderError);
  }


  const orders = orderData || [];




  // TOTAL REVENUE

  const totalRevenue =
    orders.reduce(
      (sum,order)=>
        sum + Number(order.total || 0),
      0
    );




  // ACTIVE ORDERS

  const activeOrders =
    orders.filter(
      order =>
        !["billed","cancelled"]
        .includes(order.status)
    ).length;




  // AVG ORDER VALUE

  const avgOrderValue =
    orders.length
      ? Math.round(
          totalRevenue / orders.length
        )
      : 0;





  // TOP SELLERS

  const itemCounts={};


  orders.forEach(order=>{

    (order.items || [])
    .forEach(item=>{

      itemCounts[item.name]=
      (itemCounts[item.name] || 0)
      + item.qty;

    });

  });



  const topItems =
    Object.entries(itemCounts)
    .map(([name,qty])=>({
      name,
      qty
    }))
    .sort(
      (a,b)=>b.qty-a.qty
    )
    .slice(0,5);







  // TABLES

  const store = getStore();
  const tables = store.tables || [];


  const occupancy = {

    total: tables.length,

    occupied: tables.filter(
      table =>
        table.status === "occupied" ||
        table.status === "reserved"
    ).length

  };




  // LAST 7 DAYS REVENUE

  const revenueByDay =
    Array.from({length:7})
    .map((_,index)=>{


      const date=new Date();

      date.setDate(
        date.getDate()-(6-index)
      );



      const revenue =
        orders
        .filter(order=>{

          const orderDate =
            new Date(order.created_at);


          return (
            orderDate.toDateString()
            ===
            date.toDateString()
          );

        })
        .reduce(
          (sum,order)=>
            sum + Number(order.total || 0),
          0
        );



      return {

        day:
          date.toLocaleDateString(
            "en-IN",
            {
              weekday:"short"
            }
          ),

        revenue

      };


    });






  return NextResponse.json({

    totalRevenue,

    activeOrders,

    avgOrderValue,

    orderCount:
      orders.length,


    topItems,


    lowStock:[],


    occupancy,


    revenueByDay

  });


}