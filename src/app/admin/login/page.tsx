import type { Metadata } from "next";
import { login } from "@/app/actions/auth";
import { SetupBanner } from "@/components/ui";
import { hasSupabaseConfig } from "@/lib/env";

export const metadata: Metadata = {
  title: "Connexion admin",
};

const messages: Record<string, string> = {
  credentials: "E-mail ou mot de passe incorrect.",
  unconfirmed:
    "E-mail non confirmé. Dans Supabase : Authentication → Users → votre user → Confirm email.",
  forbidden:
    "Ce compte n’est pas encore administrateur. Dans SQL Editor, insérez votre UUID dans la table profiles.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const configured = hasSupabaseConfig();

  return (
    <div className="mx-auto max-w-md px-5 py-20">
      {!configured ? (
        <div className="mb-8">
          <SetupBanner compact />
        </div>
      ) : null}
      <h1 className="font-serif text-3xl">Espace administrateur</h1>
      <p className="mt-2 text-sm text-muted">
        Réservé à la gestion des cours. Les étudiants n’ont pas besoin de compte.
      </p>
      <form action={login} className="mt-8 space-y-4">
        <label className="block text-sm">
          <span className="text-muted">E-mail</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 outline-none focus:shadow-[0_0_0_3px_rgba(30,58,138,0.12)]"
          />
        </label>
        <label className="block text-sm">
          <span className="text-muted">Mot de passe</span>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-xl border border-line bg-white px-3 py-2.5 outline-none focus:shadow-[0_0_0_3px_rgba(30,58,138,0.12)]"
          />
        </label>
        {error && messages[error] ? (
          <p className="text-sm text-clay">{messages[error]}</p>
        ) : null}
        <button
          type="submit"
          disabled={!configured}
          className="w-full rounded-full bg-pine py-2.5 text-sm text-paper transition-transform duration-200 hover:-translate-y-0.5 disabled:opacity-50"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
