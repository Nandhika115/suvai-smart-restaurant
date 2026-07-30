"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "../../components/Navbar";
import { useCart } from "../../components/CartContext";

export default function MenuPage() {
  const [menu, setMenu] = useState([]);
  const [category, setCategory] = useState("All");
  const [vegOnly, setVegOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recs, setRecs] = useState([]);
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(null);

  async function loadMenu() {
    try {
      const res = await fetch("/api/menu");
      const data = await res.json();

      setMenu(data.menu || []);
      setLoading(false);

    } catch (error) {
      console.error("Menu loading error:", error);
      setLoading(false);
    }
  }


  useEffect(() => {

    loadMenu();

    fetch("/api/recommendations")
      .then((r) =>
        r.ok ? r.json() : { recommendations: [] }
      )
      .then((d) =>
        setRecs(d.recommendations || [])
      )
      .catch(() => {});


    const interval = setInterval(loadMenu, 8000);

    return () => clearInterval(interval);

  }, []);



  const categories = useMemo(
    () => [
      "All",
      ...new Set(menu.map((m) => m.category))
    ],
    [menu]
  );



  const visible = menu.filter(
    (item) =>
      (category === "All" ||
        item.category === category) &&
      (!vegOnly || item.veg)
  );


  // Best Sellers (demo - first 3 available items)
  const bestSellers = menu
    .filter((item) => item.available)
    .slice(0, 3);



  function handleAdd(item) {

    addItem(item);

    setJustAdded(item.id);

    setTimeout(() => {
      setJustAdded(null);
    }, 1200);

  }



  return (

    <main className="min-h-screen bg-char-900 pb-24">

      <Navbar />


      <section className="mx-auto max-w-6xl px-5 py-10">


        <h1 className="font-display text-3xl font-semibold text-char-50">
          Today's Menu
        </h1>


        <p className="mt-1 text-sm text-char-400">
          Fresh dishes prepared by Suvai Restaurant.
        </p>



        {/* BEST SELLERS */}

        {!loading && bestSellers.length > 0 && (

          <section className="mt-8">

            <h2 className="font-display text-2xl font-semibold text-char-50">
              🔥 Best Sellers
            </h2>


            <div className="mt-4 grid gap-4 sm:grid-cols-3">

              {bestSellers.map((item) => (

                <div
                  key={item.id}
                  className="rounded-ticket border border-saffron-400/30 bg-char-850 p-4"
                >

                 <img
  src={item.image}
  alt={item.name}
  className="h-48 w-full rounded-ticket object-cover"
/>


                  <h3 className="mt-3 font-semibold text-char-50">
                    {item.name}
                  </h3>


                  <p className="mt-1 text-saffron-400">
                    ₹{item.price}
                  </p>


                  <p className="mt-2 text-xs text-green-400">
                    Available ✅
                  </p>

                </div>

              ))}

            </div>

          </section>

        )}



        {recs.length > 0 && (

          <div className="mt-6 rounded-ticket border border-saffron-400/30 bg-saffron-400/5 p-4">

            <p className="font-mono text-xs uppercase tracking-widest text-saffron-400">
              Picked for you
            </p>


            <div className="mt-2 flex flex-wrap gap-2">

              {recs.map((r) => (

                <span
                  key={r.id}
                  className="rounded-ticket border border-saffron-400/30 bg-char-900 px-3 py-1 text-xs text-char-100"
                >

                  {r.name}

                  <span className="text-char-400">
                    {" "}— {r.reason}
                  </span>

                </span>

              ))}

            </div>

          </div>

        )}




        <div className="mt-6 flex flex-wrap items-center gap-2">

          {categories.map((c) => (

            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`focus-ring rounded-ticket border px-3 py-1.5 text-sm font-medium ${
                category === c
                  ? "border-saffron-400 bg-saffron-400/10 text-saffron-400"
                  : "border-char-700 text-char-200 hover:border-char-600"
              }`}
            >

              {c}

            </button>

          ))}



          <label className="ml-2 flex items-center gap-2 text-sm text-char-200">

            <input
              type="checkbox"
              checked={vegOnly}
              onChange={(e) =>
                setVegOnly(e.target.checked)
              }
              className="accent-sage-400"
            />

            Veg only

          </label>


        </div>





        {loading ? (

          <p className="mt-10 text-char-400">
            Loading menu...
          </p>


        ) : (


          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">


            {visible.map((item) => (

              <div
                key={item.id}
                className={`rounded-ticket border p-5 transition ${
                  item.available
                    ? "border-char-700 bg-char-850"
                    : "border-char-800 bg-char-900 opacity-50"
                }`}
              >

                <div className="relative">

                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-48 w-full rounded-ticket object-cover"
                  />


                  <span
                    className={`absolute right-3 top-3 h-3 w-3 rounded-full ${
                      item.veg
                        ? "bg-sage-400"
                        : "bg-chili-400"
                    }`}
                  />

                </div>



                <h3 className="mt-4 font-display text-lg font-semibold text-char-50">
                  {item.name}
                </h3>



                <p className="mt-1 text-sm text-char-400">
                  {item.description}
                </p>



                <div className="mt-4 flex items-center justify-between">


                  <span className="font-mono text-char-100">
                    ₹{item.price}
                  </span>



                  {item.available ? (

                    <button
                      onClick={() => handleAdd(item)}
                      className="focus-ring rounded-ticket bg-saffron-400 px-4 py-1.5 text-sm font-semibold text-char-950 hover:bg-saffron-300"
                    >

                      {justAdded === item.id
                        ? "Added ✓"
                        : "Add to order"}

                    </button>


                  ) : (


                    <span className="font-mono text-xs uppercase tracking-wide text-chili-400">
                      Sold out
                    </span>


                  )}


                </div>



                {item.available &&
                  item.stock <= 5 && (

                  <p className="mt-2 font-mono text-xs text-saffron-400">
                    Only {item.stock} left today
                  </p>

                )}


              </div>

            ))}


          </div>


        )}


      </section>


    </main>

  );

}