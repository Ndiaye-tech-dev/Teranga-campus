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

const field =
  "mt-1.5 w-full rounded-xl border border-line bg-card px-4 py-2.5 outline-none transition-colors duration-150 focus:border-ink/40";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const configured = hasSupabaseConfig();

  return (
    <div className="mx-auto max-w-md px-4 py-20 sm:px-6">
      {!configured ? (
        <div className="mb-8">
          <SetupBanner compact />
        </div>
      ) : null}
      <p className="eyebrow">Admin</p>
      <h1 className="font-display mt-2 text-4xl">Connexion</h1>
      <p className="mt-2 text-[15px] text-muted">
        Réservé à la gestion des cours. Les étudiants n&apos;ont pas besoin de compte.
      </p>
      <form action={login} className="card mt-8 space-y-4 p-6">
        <label className="block text-sm font-medium">
          <span className="text-muted">E-mail</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className={field}
          />
        </label>
        <label className="block text-sm font-medium">
          <span className="text-muted">Mot de passe</span>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            className={field}
          />
        </label>
        {error && messages[error] ? (
          <p className="text-sm font-medium text-red-800">{messages[error]}</p>
        ) : null}
        <button
          type="submit"
          disabled={!configured}
          className="btn btn-primary w-full py-2.5 text-sm disabled:opacity-50"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
