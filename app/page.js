import Link from "next/link";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { data: menu } = await supabase
    .from("menu")
    .select("*")
    .eq("available", true)
    .limit(4);

  const featured = menu || [];

  // Temporary value until reservations table is connected
  const openTables = 0;

  return (
    <main className="min-h-screen bg-char-900">
      <Navbar />

      <section className="mx-auto max-w-6xl px-5 pb-16 pt-20">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">

          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-saffron-400">
              Order &middot; 12:41 &middot; Table service
            </p>

            <h1 className="font-display text-5xl font-semibold leading-[1.05] text-char-50 md:text-6xl">
              Never wonder if
              <br />
              <span className="text-saffron-400">
                it's in stock.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-lg text-char-200">
              Suvai's live menu updates the moment the kitchen runs low —
              no more ordering a dish only to hear it's sold out.
              Book a table, browse what's actually available right now,
              and track your order from stove to table.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="rounded-ticket bg-saffron-400 px-6 py-3 font-display font-semibold text-char-950 hover:bg-saffron-300"
              >
                View Live Menu
              </Link>

              <Link
                href="/reservations"
                className="rounded-ticket border border-char-600 px-6 py-3 font-display font-semibold text-char-100 hover:border-saffron-400"
              >
                Reserve a Table ({openTables} open now)
              </Link>
            </div>
          </div>

          {/* Live Availability */}

          <div className="ticket-edge rounded-ticket border border-char-700 bg-char-850 p-6 pt-8 shadow-2xl">

            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-char-400">
              Live Availability
            </p>

            <ul className="space-y-3">

              {featured.map((item) => (

                <li
                  key={item.id}
                  className="flex items-center justify-between border-b border-dashed border-char-700 pb-3"
                >

                  <div className="flex items-center gap-3">

                    {/* Dish Image */}

                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-12 w-12 rounded-lg object-cover border border-char-700"
                    />

                    <div>

                      <p className="font-display text-char-50">
                        {item.name}
                      </p>

                      <p className="font-mono text-xs text-sage-400">
                        {item.stock} left &middot; kitchen fresh
                      </p>

                    </div>

                  </div>

                  <span className="font-mono text-char-100">
                    ₹{item.price}
                  </span>

                </li>

              ))}

            </ul>

          </div>

        </div>
      </section>

      <section className="border-t border-char-700 bg-char-950 py-16">

        <div className="mx-auto max-w-6xl px-5">

          <p className="mb-10 font-mono text-xs uppercase tracking-[0.3em] text-char-400">
            Why we built this
          </p>

          <div className="grid gap-8 md:grid-cols-3">

            {[
              {
                title: "No more phantom orders",
                body:
                  "Menu availability is tied directly to kitchen stock, so what you see is what you'll actually get.",
              },
              {
                title: "One queue, not three group chats",
                body:
                  "Orders move from received → preparing → ready → served, visible to kitchen, floor staff, and the guest at once.",
              },
              {
                title: "Numbers the owner can act on",
                body:
                  "Sales, top dishes, table occupancy, and low-stock alerts roll up into one dashboard — no spreadsheet required.",
              },
            ].map((f) => (

              <div
                key={f.title}
                className="rounded-ticket border border-char-700 p-6"
              >

                <h3 className="font-display text-lg font-semibold text-saffron-400">
                  {f.title}
                </h3>

                <p className="mt-2 text-sm text-char-200">
                  {f.body}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

    </main>
  );
}