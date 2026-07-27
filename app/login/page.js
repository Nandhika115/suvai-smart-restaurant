"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Navbar from "../../components/Navbar";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}


function LoginForm() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Show / hide password
  const [showPassword, setShowPassword] = useState(false);

  const [step, setStep] = useState("password"); // password -> otp
  const [otp, setOtp] = useState("");
  const [devCode, setDevCode] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const params = useSearchParams();

  const next = params.get("next") || "/menu";



  async function handlePasswordLogin(e) {

    e.preventDefault();

    setError("");

    const res = await fetch("/api/auth/login", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        password,
      }),

    });


    const data = await res.json();


    if (!res.ok) {
      return setError(data.error);
    }


    router.push(next);

  }




  async function requestOtp() {

    setError("");


    const res = await fetch("/api/auth/otp", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        action: "request",
        email,
      }),

    });


    const data = await res.json();


    if (!res.ok) {
      return setError(data.error);
    }


    setDevCode(data.devCode);

    setStep("otp");

  }




  async function verifyOtp(e) {

    e.preventDefault();

    setError("");


    const res = await fetch("/api/auth/otp", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        action: "verify",
        email,
        code: otp,
      }),

    });



    const data = await res.json();


    if (!res.ok) {
      return setError(data.error);
    }


    router.push(next);

  }




  return (

    <main className="min-h-screen bg-char-900">

      <Navbar />


      <section className="mx-auto max-w-sm px-5 py-16">


        <h1 className="font-display text-2xl font-semibold text-char-50">
          Sign in
        </h1>


        <p className="mt-1 text-sm text-char-400">
          Demo account: guest@smartbistro.app / demo123
        </p>




        {step === "password" && (

          <form
            onSubmit={handlePasswordLogin}
            className="mt-6 space-y-3"
          >


            <input

              type="email"

              required

              placeholder="Email"

              value={email}

              onChange={(e) =>
                setEmail(e.target.value)
              }

              className="focus-ring w-full rounded-ticket border border-char-700 bg-char-850 px-4 py-2.5 text-char-50 placeholder:text-char-400"

            />




            {/* Password with Eye Icon */}

            <div className="relative">


              <input

                type={showPassword ? "text" : "password"}

                required

                placeholder="Password"

                value={password}

                onChange={(e) =>
                  setPassword(e.target.value)
                }


                className="focus-ring w-full rounded-ticket border border-char-700 bg-char-850 px-4 py-2.5 pr-12 text-char-50 placeholder:text-char-400"

              />



              <button

                type="button"

                onClick={() =>
                  setShowPassword(!showPassword)
                }

                className="absolute right-3 top-1/2 -translate-y-1/2 text-char-400 hover:text-saffron-400"

                aria-label="Toggle password visibility"

              >

                {showPassword ? (

                  <Eye size={20} />

                ) : (

                  <EyeOff size={20} />

                )}


              </button>


            </div>





            {error && (

              <p className="text-sm text-chili-400">
                {error}
              </p>

            )}





            <button

              className="focus-ring w-full rounded-ticket bg-saffron-400 py-2.5 font-display font-semibold text-char-950 hover:bg-saffron-300"

            >

              Sign in with password

            </button>





            <button

              type="button"

              onClick={requestOtp}

              disabled={!email}

              className="w-full rounded-ticket border border-char-600 py-2.5 text-sm text-char-200 hover:border-saffron-400 disabled:opacity-50"

            >

              Or email me a one-time code instead

            </button>



          </form>

        )}






        {step === "otp" && (

          <form
            onSubmit={verifyOtp}
            className="mt-6 space-y-3"
          >


            <p className="rounded-ticket border border-saffron-400/30 bg-saffron-400/10 p-3 text-xs text-saffron-400">

              Demo mode: no email provider is wired up,
              so here's your code — {devCode}.

            </p>




            <input

              placeholder="6-digit code"

              value={otp}

              onChange={(e) =>
                setOtp(e.target.value)
              }

              className="focus-ring w-full rounded-ticket border border-char-700 bg-char-850 px-4 py-2.5 text-char-50 placeholder:text-char-400"

            />




            {error && (

              <p className="text-sm text-chili-400">
                {error}
              </p>

            )}





            <button

              className="focus-ring w-full rounded-ticket bg-saffron-400 py-2.5 font-display font-semibold text-char-950 hover:bg-saffron-300"

            >

              Verify & sign in

            </button>



          </form>

        )}






        <div className="my-6 flex items-center gap-3 text-xs text-char-400">

          <div className="h-px flex-1 bg-char-700" />

          or

          <div className="h-px flex-1 bg-char-700" />

        </div>





        <a

          href="/api/auth/google"

          className="focus-ring flex w-full items-center justify-center gap-2 rounded-ticket border border-char-600 py-2.5 text-sm text-char-100 hover:border-saffron-400"

        >

          Continue with Google

        </a>





        <p className="mt-6 text-sm text-char-400">

          New here?

          {" "}

          <Link

            href="/signup"

            className="text-saffron-400 hover:underline"

          >

            Create an account

          </Link>

        </p>



      </section>


    </main>

  );

}