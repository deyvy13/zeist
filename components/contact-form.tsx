"use client";

import { useState } from "react";
import { site } from "@/lib/site";

type Labels = {
  name: string;
  email: string;
  message: string;
  send: string;
  subject: string;
};

export function ContactForm({ labels }: { labels: Labels }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = `${message}\n\n— ${name} (${email})`;
    const href = `mailto:${site.email}?subject=${encodeURIComponent(
      `${labels.subject} — ${name}`,
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = href;
  }

  const field =
    "w-full rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface)]/60 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--color-mint-500)] placeholder:text-[color:var(--color-muted)]";

  return (
    <form onSubmit={onSubmit} className="surface rounded-3xl p-6 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">{labels.name}</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={field}
            autoComplete="name"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">
            {labels.email}
          </span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={field}
            autoComplete="email"
          />
        </label>
      </div>
      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm font-medium">
          {labels.message}
        </span>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${field} resize-none`}
        />
      </label>
      <button type="submit" className="btn-primary mt-6 w-full sm:w-auto">
        {labels.send}
      </button>
    </form>
  );
}
