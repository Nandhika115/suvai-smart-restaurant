"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

export default function ReservationsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [partySize, setPartySize] = useState(2);
  const [date, setDate] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [mine, setMine] = useState([]);


  useEffect(() => {
    fetch("/api/reservations")
      .then((r) => (r.ok ? r.json() : { reservations: [] }))
      .then((data) => {
        setMine(data.reservations || []);
      })
      .catch(() => {});
  }, [result]);


  async function book(e) {
    e.preventDefault();

    setError("");
    setResult(null);


    const res = await fetch("/api/reservations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name,
        email,
        partySize,
        date,
      }),
    });


    const data = await res.json();


    if (!res.ok) {
      setError(data.error || "Could not reserve a table.");
      return;
    }


    setResult(data);


    // Clear form after successful booking
    setName("");
    setEmail("");
    setPartySize(2);
    setDate("");
  }



  return (
    <main className="min-h-screen bg-char-900 pb-24">

      <Navbar />


      <section className="mx-auto max-w-xl px-5 py-10">


        <h1 className="font-display text-3xl font-semibold text-char-50">
          Reserve a table
        </h1>


        <p className="mt-1 text-sm text-char-400">
          Enter your details and receive your booking confirmation mail instantly.
        </p>



        <form
          onSubmit={book}
          className="mt-8 space-y-4 rounded-ticket border border-char-700 bg-char-850 p-6"
        >


          <label className="block text-sm text-char-200">
            Name

            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="focus-ring mt-1 w-full rounded-ticket border border-char-700 bg-char-900 px-4 py-2.5 text-char-50"
            />

          </label>




          <label className="block text-sm text-char-200">
            Gmail

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="focus-ring mt-1 w-full rounded-ticket border border-char-700 bg-char-900 px-4 py-2.5 text-char-50"
            />

          </label>




          <label className="block text-sm text-char-200">
            Party Size

            <input
              type="number"
              min={1}
              max={10}
              required
              value={partySize}
              onChange={(e) => setPartySize(e.target.value)}
              className="focus-ring mt-1 w-full rounded-ticket border border-char-700 bg-char-900 px-4 py-2.5 text-char-50"
            />

          </label>




          <label className="block text-sm text-char-200">
            Date & Time

            <input
              type="datetime-local"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="focus-ring mt-1 w-full rounded-ticket border border-char-700 bg-char-900 px-4 py-2.5 text-char-50"
            />

          </label>




          {error && (
            <p className="text-sm text-chili-400">
              {error}
            </p>
          )}




          <button
            type="submit"
            className="focus-ring w-full rounded-ticket bg-saffron-400 py-3 font-display font-semibold text-char-950 hover:bg-saffron-300"
          >
            Confirm Reservation
          </button>


        </form>





        {result && (

          <div className="mt-4 rounded-ticket border border-sage-500/40 bg-sage-500/10 p-4 text-sm text-sage-400">

            ✅ Reservation Confirmed

            <br />

            Table {result.table.name} has been booked.

            <br />

            Confirmation email sent to {result.reservation.customerEmail}.

          </div>

        )}







        {mine.length > 0 && (

          <div className="mt-10">

            <h2 className="font-display text-lg font-semibold text-char-50">
              Recent Reservations
            </h2>


            <ul className="mt-3 space-y-2">


              {mine.map((reservation) => (

                <li
                  key={reservation.id}
                  className="flex items-center justify-between rounded-ticket border border-char-700 bg-char-850 px-4 py-3 text-sm"
                >

                  <span className="text-char-100">

                    {new Date(reservation.date).toLocaleString(
                      "en-IN",
                      {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }
                    )}

                    {" · "}
                    Party of {reservation.partySize}

                  </span>


                  <span className="font-mono text-xs uppercase text-saffron-400">

                    {reservation.status}

                  </span>


                </li>

              ))}


            </ul>

          </div>

        )}



      </section>


    </main>
  );
}