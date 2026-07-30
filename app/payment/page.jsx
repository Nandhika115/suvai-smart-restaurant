"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Navbar from "../../components/Navbar";


export default function PaymentPage() {

  const router = useRouter();
  const searchParams = useSearchParams();


  const orderId = searchParams.get("orderId");

  const foodTotal = Number(searchParams.get("total")) || 0;


  const gst = Math.round(foodTotal * 0.05);

  const grandTotal = foodTotal + gst;


  const [method, setMethod] = useState("upi");
  const [loading, setLoading] = useState(false);



  function payNow(){

    setLoading(true);


    setTimeout(()=>{

      router.push(`/track/${orderId}`);

    },1800);

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
            <span>Food Total</span>
            <span>₹ {foodTotal}</span>
          </div>


          <div className="mt-3 flex justify-between text-char-300">
            <span>GST (5%)</span>
            <span>₹ {gst}</span>
          </div>


          <div className="mt-3 flex justify-between text-char-300">
            <span>Delivery</span>
            <span>FREE</span>
          </div>



          <div className="mt-5 border-t border-char-700 pt-4 flex justify-between">

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


          <div className="mt-5 space-y-4">


            {[
              ["upi","📱 UPI (Google Pay / PhonePe / Paytm)"],
              ["card","💳 Credit / Debit Card"],
              ["cash","💵 Cash at Restaurant"]
            ].map(([value,label])=>(


              <label
                key={value}
                className={`flex cursor-pointer items-center rounded-ticket border p-4 ${
                  method===value
                  ?"border-saffron-400 bg-char-800"
                  :"border-char-700"
                }`}
              >


                <input
                  type="radio"
                  checked={method===value}
                  onChange={()=>setMethod(value)}
                  className="mr-3"
                />


                {label}


              </label>


            ))}



          </div>


        </div>





        <div className="mt-8 rounded-ticket border border-green-700 bg-green-950/20 p-5">

          <p className="text-green-300">
            🔒 Your payment is secured with 256-bit encryption.
          </p>

        </div>





        <button

          onClick={payNow}

          disabled={loading}

          className="mt-8 w-full rounded-ticket bg-saffron-400 py-4 font-display text-xl font-bold text-char-950"

        >

          {
            loading
            ?
            "Processing Payment..."
            :
            `Pay ₹${grandTotal}`
          }


        </button>



      </section>


    </main>

  );


}