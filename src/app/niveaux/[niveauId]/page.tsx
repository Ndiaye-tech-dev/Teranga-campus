import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/ui";
import { getNiveau } from "@/lib/queries";
import { semestrePath } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ niveauId: string }>;
}): Promise<Metadata> {
  const { niveauId } = await params;
  const niveau = await getNiveau(niveauId);
  return { title: niveau?.nom ?? "Niveau" };
}

export default async function NiveauPage({
  params,
}: {
  params: Promise<{ niveauId: string }>;
}) {
  const { niveauId } = await params;
  const niveau = await getNiveau(niveauId);
  if (!niveau) notFound();

  const semestres = [
    {
      n: 1 as const,
      title: "Semestre 1",
      hint: "Premier semestre — modules et matières",
    },
    {
      n: 2 as const,
      title: "Semestre 2",
      hint: "Second semestre — modules et matières",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <Breadcrumb
        items={[{ href: "/", label: "Accueil" }, { label: niveau.nom }]}
      />
      <p className="text-xs uppercase tracking-[0.2em] text-muted">Étape 2</p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight">{niveau.nom}</h1>
      <p className="mt-3 text-muted">Choisissez un semestre</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {semestres.map((item) => (
          <Link
            key={item.n}
            href={semestrePath(niveau.id, item.n)}
            className="group rounded-2xl border border-line bg-card p-8 transition-all duration-200 hover:-translate-y-0.5 hover:border-pine/25 hover:shadow-[0_12px_40px_-24px_rgba(30,58,138,0.55)]"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-muted">
              Semestre
            </p>
            <p className="mt-3 font-serif text-3xl text-pine">{item.title}</p>
            <p className="mt-4 text-sm text-muted group-hover:text-ink">
              {item.hint}
            </p>
            <p className="mt-8 text-sm text-pine">Voir les matières →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
