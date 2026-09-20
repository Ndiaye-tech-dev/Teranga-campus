import Link from "next/link";

export function EmptyState({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  return (
    <div className="card-pop px-6 py-14 text-center">
      <p className="font-display text-2xl text-ink">{title}</p>
      {hint ? <p className="mt-2 text-sm font-semibold text-muted">{hint}</p> : null}
      <Link href="/" className="btn-pop btn-accent mt-6 px-5 py-2.5 text-sm">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}

export function SetupBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "" : "mx-auto max-w-6xl px-5 pt-8"}>
      <div className="card-pop !bg-sun px-5 py-4 text-sm font-bold">
        ⚙️ Connecte Supabase pour afficher les cours : copie{" "}
        <code className="rounded bg-ink px-1.5 py-0.5 text-white">.env.example</code> vers{" "}
        <code className="rounded bg-ink px-1.5 py-0.5 text-white">.env.local</code>, ensuite exécute{" "}
        <code className="rounded bg-ink px-1.5 py-0.5 text-white">supabase/schema.sql</code>. Voir le README.
      </div>
    </div>
  );
}

export function Breadcrumb({
  items,
}: {
  items: { href?: string; label: string }[];
}) {
  return (
    <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm font-bold">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-2">
          {index > 0 ? <span className="text-clay">✦</span> : null}
          {item.href ? (
            <Link
              href={item.href}
              className="rounded-full border-2 border-ink bg-white px-3 py-1 transition-all hover:-translate-y-0.5 hover:bg-sun"
            >
              {item.label}
            </Link>
          ) : (
            <span className="rounded-full border-2 border-ink bg-ink px-3 py-1 text-white">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
