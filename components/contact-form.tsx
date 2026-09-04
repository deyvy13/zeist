"use client";

import { useState } from "react";
import { whatsappUrl } from "@/lib/site";

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

  // The form no longer sends mail: it opens WhatsApp with the message already
  // composed. Same effort for the visitor, but the conversation starts in the
  // channel we actually answer, and with context instead of a bare "Hola".
  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const lines = [`*${labels.subject}*`, "", message, "", `-- ${name}`];
    if (email.trim()) lines.push(email.trim());
    window.open(whatsappUrl(lines.join("\n")), "_blank", "noopener,noreferrer");
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
