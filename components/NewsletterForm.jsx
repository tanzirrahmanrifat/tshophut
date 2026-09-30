"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    // No email backend is wired up yet — this just confirms the submit
    // locally. Swap in a real provider (Mailchimp, Klaviyo, Resend, etc.)
    // here when you're ready.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="font-mono text-sm max-w-[420px] w-full py-3.5">
        You&apos;re on the list — see you Friday.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-[420px] w-full">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="flex-1 bg-transparent border-[1.5px] border-canvas px-4 py-3.5 font-mono text-sm placeholder:text-canvas/50"
      />
      <button className="bg-cobalt border-[1.5px] border-cobalt px-5 font-mono text-xs uppercase tracking-wider hover:bg-canvas hover:text-ink transition-colors">
        Notify me
      </button>
    </form>
  );
}
