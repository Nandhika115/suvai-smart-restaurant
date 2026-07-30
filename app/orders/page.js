"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";

export default function OrdersHistoryPage() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {

    fetch("/api/orders")

      .then((r) =>
        r.ok
          ? r.json()
          : { orders: [] }
      )

      .then((d) => {

        setOrders(d.orders || []);

        setLoading(false);

      })

      .catch(() => {

        setOrders([]);

        setLoading(false);

      });


  }, []);




  return (

    <main className="min-h-screen bg-char-900 pb-24">

      <Navbar />



      <section className="mx-auto max-w-2xl px-5 py-10">


        <h1 className="font-display text-3xl font-semibold text-char-50">
          My Orders
        </h1>




        {loading ? (

          <p className="mt-8 text-char-400">
            Loading orders...
          </p>


        ) : orders.length === 0 ? (

          <p className="mt-8 text-char-400">
            No orders yet — place your first order from the menu.
          </p>


        ) : (


          <div className="mt-6 space-y-4">


            {orders.map((o) => (


              <div

                key={o.id}

                className="rounded-ticket border border-char-700 bg-char-850 px-5 py-4"

              >



                <div className="flex justify-between">


                  <div>


                    <p className="font-display text-lg text-char-50">

                      Order #{o.id.slice(-6).toUpperCase()}

                    </p>



                    <p className="mt-1 text-xs text-char-400">

                      {new Date(
  o.createdAt || o.created_at
).toLocaleString(
  "en-IN",
  {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short"
  }
)}

                    </p>


                  </div>




                  <div className="text-right">


                    <p className="font-mono text-lg text-saffron-400">

                      ₹{o.total}

                    </p>



                    <p className="font-mono text-xs uppercase text-green-400">

                      {o.status}

                    </p>


                  </div>


                </div>





                {/* TRACK ID */}

                <div className="mt-4 rounded-ticket border border-char-700 bg-char-900 px-4 py-3">


                  <p className="text-xs text-char-400">

                    Tracking ID

                  </p>


                  <p className="font-mono text-sm text-char-50 break-all">

                    {o.id}

                  </p>


                </div>






                <Link

                  href={`/track/${o.id}`}

                  className="mt-4 block rounded-ticket bg-saffron-400 py-2 text-center font-semibold text-char-950 hover:bg-saffron-300"

                >

                  Track Order

                </Link>



              </div>



            ))}


          </div>


        )}


      </section>


    </main>


  );

}