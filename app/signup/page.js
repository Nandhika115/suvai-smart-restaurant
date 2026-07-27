"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) return setError(data.error);
    router.push("/menu");
  }

  return (
    <main className="min-h-screen bg-char-900">
      <Navbar />
      <section className="mx-auto max-w-sm px-5 py-16">
        <h1 className="font-display text-2xl font-semibold text-char-50">Create an account</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <input
            required
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="focus-ring w-full rounded-ticket border border-char-700 bg-char-850 px-4 py-2.5 text-char-50 placeholder:text-char-400"
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="focus-ring w-full rounded-ticket border border-char-700 bg-char-850 px-4 py-2.5 text-char-50 placeholder:text-char-400"
          />
          <input
            type="password"
            required
            placeholder="Password (6+ characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="focus-ring w-full rounded-ticket border border-char-700 bg-char-850 px-4 py-2.5 text-char-50 placeholder:text-char-400"
          />
          {error && <p className="text-sm text-chili-400">{error}</p>}
          <button className="focus-ring w-full rounded-ticket bg-saffron-400 py-2.5 font-display font-semibold text-char-950 hover:bg-saffron-300">
            Create account
          </button>
        </form>
        <p className="mt-6 text-sm text-char-400">
          Already have an account? <Link href="/login" className="text-saffron-400 hover:underline">Sign in</Link>
        </p>
      </section>
    </main>
  );
}
