"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import Navbar from "../../components/Navbar";


function PaymentContent() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const orderId = searchParams.get("orderId");

  const foodTotal = Number(searchParams.get("total")) || 0;

  const gst = Math.round(foodTotal * 0.05);

  const grandTotal = foodTotal + gst;


  const [method, setMethod] = useState("upi");
  const [loading, setLoading] = useState(false);



  function payNow() {

    setLoading(true);

    setTimeout(() => {

      router.push(`/track/${orderId}`);

    }, 1800);

  }



  return (

    <main className="min-h-screen bg-char-900 pb-20">

      <Navbar />


      <section className="mx-auto max-w-2xl px-5 py-10">


        <h1 className="font-display text-4xl font-bold text-char-50">
          Secure Payment
        </h1>


        <p className="mt-2 text-char-400">
          Complete your payment to confirm your delicious order.
        </p>




        {/* ORDER SUMMARY */}


        <div className="mt-8 rounded-ticket border border-char-700 bg-char-850 p-6">


          <h2 className="font-display text-xl text-char-50">
            Order Summary
          </h2>



          <div className="mt-5 flex justify-between text-char-300">

            <span>
              Food Total
            </span>

            <span>
              ₹ {foodTotal}
            </span>

          </div>




          <div className="mt-3 flex justify-between text-char-300">

            <span>
              GST (5%)
            </span>

            <span>
              ₹ {gst}
            </span>

          </div>




          <div className="mt-3 flex justify-between text-char-300">

            <span>
              Delivery
            </span>

            <span>
              FREE
            </span>

          </div>





          <div className="mt-5 flex justify-between border-t border-char-700 pt-4">


            <span className="font-display text-xl text-char-50">

              Total

            </span>



            <span className="font-display text-2xl text-saffron-400">

              ₹ {grandTotal}

            </span>



          </div>


        </div>





        {/* PAYMENT METHOD */}



        <div className="mt-8 rounded-ticket border border-char-700 bg-char-850 p-6">


          <h2 className="font-display text-xl text-char-50">

            Payment Method

          </h2>




          <div className="mt-5 space-y-3">


            {[
              {
                id: "upi",
                label: "UPI Payment"
              },
              {
                id: "card",
                label: "Credit / Debit Card"
              },
              {
                id: "cash",
                label: "Cash on Delivery"
              }

            ].map((item) => (


              <button

                key={item.id}

                onClick={() => setMethod(item.id)}

                className={`w-full rounded-ticket border px-4 py-3 text-left ${
                  method === item.id
                    ? "border-saffron-400 bg-saffron-400/10 text-saffron-400"
                    : "border-char-700 text-char-200"
                }`}

              >

                {item.label}


              </button>


            ))}


          </div>





          <button

            onClick={payNow}

            disabled={loading}

            className="mt-6 w-full rounded-ticket bg-saffron-400 px-5 py-3 font-semibold text-char-950 disabled:opacity-50"

          >

            {loading
              ? "Processing Payment..."
              : `Pay ₹ ${grandTotal}`
            }


          </button>



        </div>



      </section>


    </main>


  );


}





export default function PaymentPage() {


  return (


    <Suspense

      fallback={

        <div className="min-h-screen bg-char-900 p-10 text-char-50">

          Loading payment...

        </div>

      }

    >


      <PaymentContent />


    </Suspense>


  );


}