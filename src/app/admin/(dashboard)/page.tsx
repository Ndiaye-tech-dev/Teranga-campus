import Link from "next/link";
import { ArrowRight, BookOpen, FolderOpen, GraduationCap, Plus } from "lucide-react";
import { createNiveau, deleteNiveau } from "@/app/actions/niveaux";
import { ConfirmDelete } from "@/components/confirm-delete";
import { EmptyState } from "@/components/ui";
import { getMatieresByNiveau, getModulesByNiveau, getNiveaux } from "@/lib/queries";

export default async function AdminHomePage() {
  const niveaux = await getNiveaux();
  const details = await Promise.all(
    niveaux.map(async (niveau) => {
      const [modules, matieres] = await Promise.all([
        getModulesByNiveau(niveau.id),
        getMatieresByNiveau(niveau.id),
      ]);
      return { niveau, modules: modules.length, matieres: matieres.length };
    }),
  );
  const totalMatieres = details.reduce((sum, d) => sum + d.matieres, 0);

  return (
    <div className="space-y-6">
      {/* Chiffres */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[
          { icon: GraduationCap, bg: "bg-sun", value: niveaux.length, label: "Niveaux" },
          { icon: FolderOpen, bg: "bg-mint", value: details.reduce((s, d) => s + d.modules, 0), label: "Modules" },
          { icon: BookOpen, bg: "bg-candy text-white", value: totalMatieres, label: "Matières" },
        ].map((s) => (
          <div key={s.label} className="card-pop flex items-center gap-4 px-5 py-4">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-2 border-ink ${s.bg}`}>
              <s.icon className="h-5 w-5" />
            </span>
            <span>
              <span className="font-display block text-3xl leading-none">{s.value}</span>
              <span className="text-xs font-black uppercase tracking-wider text-muted">{s.label}</span>
            </span>
          </div>
        ))}
      </div>

      {/* Ajout niveau */}
      <section className="card-pop px-6 py-5">
        <h2 className="font-display text-xl">Ajouter un niveau</h2>
        <form action={createNiveau} className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input
            name="nom"
            required
            placeholder="Ex. Licence 1"
            className="flex-1 rounded-2xl border-2 border-ink bg-paper px-4 py-2.5 font-semibold outline-none placeholder:font-medium placeholder:text-muted/60 focus:bg-white"
          />
          <button
            type="submit"
            className="btn-pop btn-grape inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm"
          >
            <Plus className="h-4 w-4" /> Ajouter
          </button>
        </form>
      </section>

      {/* Liste niveaux */}
      <section>
        <h2 className="font-display text-xl">Tes niveaux</h2>
        {details.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="Aucun niveau" hint="Ajoute Licence 1, Licence 2 et Licence 3 pour commencer." />
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {details.map(({ niveau, modules, matieres }) => (
              <li
                key={niveau.id}
                className="card-pop flex flex-wrap items-center gap-3 px-5 py-4"
              >
                <Link
                  href={`/admin/niveaux/${niveau.id}`}
                  className="group mr-auto flex min-w-0 items-center gap-2"
                >
                  <span className="font-display truncate text-2xl group-hover:underline">
                    {niveau.nom}
                  </span>
                  <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
                </Link>
                <span className="rounded-full border-2 border-ink bg-sun px-3 py-1 text-xs font-black">
                  {modules} module{modules > 1 ? "s" : ""}
                </span>
                <span className="rounded-full border-2 border-ink bg-mint px-3 py-1 text-xs font-black">
                  {matieres} matière{matieres > 1 ? "s" : ""}
                </span>
                <ConfirmDelete action={deleteNiveau}>
                  <input type="hidden" name="id" value={niveau.id} />
                </ConfirmDelete>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
