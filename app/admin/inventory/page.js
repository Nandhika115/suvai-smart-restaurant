"use client";

import { useEffect, useState } from "react";

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const res = await fetch("/api/menu");
      const data = await res.json();

      const items = (data.menu || []).map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.stock,
        unit: "",
        threshold: 5,
        available: item.available,
      }));

      setInventory(items);
      setLoading(false);

    } catch (error) {
      console.error("Inventory loading error:", error);
      setLoading(false);
    }
  }


  useEffect(() => {
    load();
  }, []);



  async function restock(id, quantity) {

    await fetch("/api/menu", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        id,
        stock: quantity,
      }),
    });

    load();
  }



  return (
    <div>

      <h1 className="font-display text-2xl font-semibold text-char-50">
        Inventory
      </h1>


      <p className="mt-1 text-sm text-char-400">
        Menu items linked with kitchen stock. Restocking updates dish availability.
      </p>



      {loading ? (

        <p className="mt-6 text-char-400">
          Loading inventory...
        </p>


      ) : (


        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">


          {inventory.map((item) => {

            const low = item.quantity <= item.threshold;


            return (

              <div
                key={item.id}
                className={`rounded-ticket border p-5 ${
                  low
                    ? "border-chili-500/40 bg-chili-500/10"
                    : "border-char-800 bg-char-900"
                }`}
              >


                <p className="font-display text-lg font-semibold text-char-50">
                  {item.name}
                </p>



                <p
                  className={`mt-2 font-mono text-3xl ${
                    low
                      ? "text-chili-400"
                      : "text-char-100"
                  }`}
                >
                  {item.quantity}
                </p>



                <p className="mt-1 text-xs text-char-400">
                  Stock available
                </p>



                <p className="mt-2 text-xs">

                  Status:

                  <span
                    className={
                      item.quantity > 0
                        ? "ml-2 text-sage-400"
                        : "ml-2 text-chili-400"
                    }
                  >

                    {item.quantity > 0
                      ? "Available"
                      : "Sold Out"}

                  </span>

                </p>




                <div className="mt-4 flex gap-2">


                  <button
                    onClick={() =>
                      restock(
                        item.id,
                        item.quantity + 5
                      )
                    }
                    className="focus-ring flex-1 rounded-ticket bg-saffron-400 py-1.5 text-xs font-semibold text-char-950 hover:bg-saffron-300"
                  >
                    + Restock 5
                  </button>



                  <button
                    onClick={() =>
                      restock(
                        item.id,
                        Math.max(
                          0,
                          item.quantity - 1
                        )
                      )
                    }
                    className="focus-ring rounded-ticket border border-char-700 px-3 text-xs text-char-200"
                  >
                    -1
                  </button>


                </div>


              </div>

            );

          })}


        </div>

      )}


    </div>
  );
}