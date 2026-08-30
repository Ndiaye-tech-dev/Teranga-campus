import Link from "next/link";

export function EmptyState({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-card/50 px-6 py-14 text-center">
      <p className="font-serif text-xl text-ink">{title}</p>
      {hint ? <p className="mt-2 text-sm text-muted">{hint}</p> : null}
    </div>
  );
}

export function SetupBanner({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "" : "mx-auto max-w-6xl px-5 pt-8"}>
      <div className="rounded-2xl border border-line bg-card px-5 py-4 text-sm text-muted">
        Connectez Supabase pour afficher les cours : copiez{" "}
        <code className="text-ink">.env.example</code> vers{" "}
        <code className="text-ink">.env.local</code>,         ensuite exécutez{" "}
        <code className="text-ink">supabase/schema.sql</code>
        {" "}(ou{" "}
        <code className="text-ink">migration-v2.sql</code>
        {" "}si la base existe déjà). Voir le README.
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
    <nav className="mb-8 text-sm text-muted">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`}>
          {index > 0 ? <span className="mx-2 text-line">/</span> : null}
          {item.href ? (
            <Link href={item.href} className="transition-colors hover:text-ink">
              {item.label}
            </Link>
          ) : (
            <span className="text-ink">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
