"use client";

import { useMemo, useState } from "react";

export function ContactForm({ email }: { email: string }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const mailto = useMemo(() => {
    const subject = encodeURIComponent(`Teranga Campus — message de ${name || "un étudiant"}`);
    const body = encodeURIComponent(message);
    return `mailto:${email}?subject=${subject}&body=${body}`;
  }, [email, name, message]);

  if (!email) {
    return (
      <p className="text-sm text-muted">
        L’adresse de contact sera affichée ici une fois{" "}
        <code className="text-ink">NEXT_PUBLIC_CONTACT_EMAIL</code> renseignée.
      </p>
    );
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        window.location.href = mailto;
      }}
    >
      <label className="block text-sm">
        <span className="text-muted">Votre nom</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 outline-none transition-shadow focus:shadow-[0_0_0_3px_rgba(30,58,138,0.12)]"
        />
      </label>
      <label className="block text-sm">
        <span className="text-muted">Message</span>
        <textarea
          rows={5}
          required
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 outline-none transition-shadow focus:shadow-[0_0_0_3px_rgba(30,58,138,0.12)]"
        />
      </label>
      <button
        type="submit"
        className="rounded-full bg-pine px-5 py-2.5 text-sm text-paper transition-transform duration-200 hover:-translate-y-0.5"
      >
        Envoyer par e-mail
      </button>
      <p className="text-sm text-muted">
        Ou écrire directement à{" "}
        <a href={`mailto:${email}`} className="text-pine underline underline-offset-4">
          {email}
        </a>
      </p>
    </form>
  );
}
