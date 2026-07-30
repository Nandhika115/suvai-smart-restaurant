"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./CartContext";

export default function Navbar() {

  const [user, setUser] = useState(undefined);
  const [profileOpen, setProfileOpen] = useState(false);

  const { count } = useCart();


  useEffect(() => {

    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => setUser(d.user || null))
      .catch(() => setUser(null));

  }, []);



  async function handleLogout() {

    await fetch("/api/auth/logout", {
      method: "POST",
    });

    setUser(null);
    setProfileOpen(false);

    window.location.reload();

  }



  function Avatar({ size = "h-10 w-10" }) {

    if (user?.avatar_url) {

      return (
        <img
          src={user.avatar_url}
          alt={user.name}
          className={`${size} rounded-full border border-char-600 object-cover`}
        />
      );

    }


    return (

      <div
        className={`${size} flex items-center justify-center rounded-full bg-saffron-400 font-bold text-char-950`}
      >

        {user?.name?.charAt(0).toUpperCase()}

      </div>

    );

  }



  return (

    <header className="sticky top-0 z-40 border-b border-char-700 bg-char-900/95 backdrop-blur">

      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">


        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight text-char-50"
        >
          Suvai <span className="text-saffron-400">OS</span>
        </Link>



        <div className="flex items-center gap-6 font-body text-sm text-char-200">


          <Link href="/menu" className="hover:text-saffron-400">
            Menu
          </Link>


          <Link href="/reservations" className="hover:text-saffron-400">
            Reserve a table
          </Link>



          {user && (
            <Link href="/orders" className="hover:text-saffron-400">
              My orders
            </Link>
          )}




          {user?.role === "admin" && (
            <Link href="/admin" className="hover:text-saffron-400">
              Dashboard
            </Link>
          )}




          <Link
            href="/cart"
            className="relative flex items-center gap-1 rounded-ticket border border-char-600 px-3 py-1.5 hover:border-saffron-400"
          >

            Cart

            {count > 0 && (
              <span className="ml-1 rounded-full bg-saffron-400 px-1.5 text-xs font-mono font-semibold text-char-950">
                {count}
              </span>
            )}

          </Link>





          {user === undefined ? null : user ? (

            <div className="relative">


              <button
                onClick={() => setProfileOpen(!profileOpen)}
              >

                <Avatar />

              </button>





              {profileOpen && (

                <div className="absolute right-0 mt-3 w-72 rounded-ticket border border-char-700 bg-char-850 p-5 shadow-lg">


                  <div className="flex items-center gap-3">


                    {/* SAME SIZE PROFILE IMAGE */}

                    <Avatar size="h-10 w-10" />


                    <div>

                      <h3 className="font-semibold text-char-50">
                        {user.name}
                      </h3>


                      <p className="text-sm text-char-400">
                        {user.email}
                      </p>

                    </div>


                  </div>




                  <div className="mt-4 space-y-2 text-sm">


                    <p className="text-green-400">
                      Role: {user.role}
                    </p>


                    <p className="text-char-200">
                      🍽 Total Orders: {user.totalOrders || 0}
                    </p>


                  </div>





                  <Link
                    href="/orders"
                    className="mt-5 block text-sm text-char-100 hover:text-saffron-400"
                  >
                    📦 My Orders
                  </Link>





                  <button
                    onClick={handleLogout}
                    className="mt-4 w-full rounded-ticket bg-chili-500 py-2 text-sm font-semibold text-white hover:bg-chili-400"
                  >
                    Sign out
                  </button>


                </div>

              )}


            </div>



          ) : (


            <Link
              href="/login"
              className="rounded-ticket bg-saffron-400 px-3 py-1.5 font-medium text-char-950 hover:bg-saffron-300"
            >
              Sign in
            </Link>


          )}



        </div>


      </nav>


    </header>

  );

}