"use client";

import { useState, type ReactNode } from "react";

export function ConfirmDelete({
  action,
  children,
  label = "Supprimer",
}: {
  action: (formData: FormData) => void | Promise<void>;
  children: ReactNode;
  label?: string;
}) {
  const [pending, setPending] = useState(false);

  return (
    <form
      action={async (formData) => {
        if (!window.confirm("Confirmer la suppression ?")) return;
        setPending(true);
        await action(formData);
        setPending(false);
      }}
    >
      {children}
      <button
        type="submit"
        disabled={pending}
        className="text-sm text-clay transition-opacity hover:opacity-80 disabled:opacity-50"
      >
        {pending ? "Suppression…" : label}
      </button>
    </form>
  );
}
