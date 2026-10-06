"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(contact, password);
      router.push(redirect);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="max-w-sm mx-auto px-5 py-20">
      <span className="eyebrow">Welcome back</span>
      <h1 className="font-display text-3xl mt-1 mb-8">Log in</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Phone or email" value={contact} onChange={setContact} required />
        <Field label="Password" value={password} onChange={setPassword} type="password" required />
        {error && <p className="text-stamp font-mono text-xs">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-ink text-canvas py-3 font-mono text-xs uppercase tracking-wider rounded-sm hover:bg-cobalt transition-colors disabled:opacity-50"
        >
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p className="font-mono text-xs text-ink/60 mt-6 text-center">
        No account yet?{" "}
        <Link href="/register" className="underline hover:text-cobalt">
          Create one
        </Link>
      </p>
      <p className="font-mono text-[11px] text-ink/40 mt-4 text-center">
        You can also check out as a guest — no account required.
      </p>
    </main>
  );
}

function Field({ label, value, onChange, type = "text", required }) {
  return (
    <label className="block">
      <span className="font-mono text-[11px] uppercase tracking-wider text-ink/50 block mb-1.5">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-line rounded-sm px-3.5 py-2.5 bg-paper text-sm outline-none focus:border-cobalt"
      />
    </label>
  );
}
