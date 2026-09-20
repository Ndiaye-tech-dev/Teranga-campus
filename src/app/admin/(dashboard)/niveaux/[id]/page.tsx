import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Plus } from "lucide-react";
import { createMatiere, deleteMatiere } from "@/app/actions/matieres";
import { createModule, deleteModule } from "@/app/actions/modules";
import { updateNiveau } from "@/app/actions/niveaux";
import { ConfirmDelete } from "@/components/confirm-delete";
import { EmptyState } from "@/components/ui";
import {
  getDocumentCounts,
  getMatieresByNiveau,
  getModulesByNiveau,
  getNiveau,
  isModulesTableMissing,
} from "@/lib/queries";
import { semestreLabel, type Semestre } from "@/lib/types";

const inputCls =
  "flex-1 rounded-2xl border-2 border-ink bg-paper px-4 py-2.5 font-semibold outline-none placeholder:font-medium placeholder:text-muted/60 focus:bg-white";

export default async function AdminNiveauPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const niveau = await getNiveau(id);
  if (!niveau) notFound();
  const [modules, matieres, modulesMissing] = await Promise.all([
    getModulesByNiveau(id),
    getMatieresByNiveau(id),
    isModulesTableMissing(),
  ]);
  const docCounts = await getDocumentCounts(matieres.map((m) => m.id));

  return (
    <div className="space-y-6">
      <p className="text-sm font-black">
        <Link href="/admin" className="text-muted hover:text-ink">
          ← Tous les niveaux
        </Link>
      </p>

      <div className="card-pop !bg-sun px-6 py-5">
        <h2 className="font-display text-2xl">{niveau.nom}</h2>
        <form action={updateNiveau} className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input type="hidden" name="id" value={niveau.id} />
          <input name="nom" defaultValue={niveau.nom} required className={inputCls} />
          <button type="submit" className="btn-pop btn-primary px-5 py-2.5 text-sm">
            Renommer
          </button>
        </form>
      </div>

      {modulesMissing ? (
        <div className="card-pop !bg-candy px-6 py-5 text-sm font-semibold text-white">
          <p className="font-display text-xl">Table « modules » manquante</p>
          <p className="mt-2 text-white/85">
            Lance <code className="rounded bg-ink px-1.5 py-0.5">supabase/migration-v2.sql</code> dans
            le SQL Editor de Supabase, puis recharge cette page.
          </p>
        </div>
      ) : null}

      <section className="card-pop px-6 py-5">
        <h2 className="font-display text-xl">Nouveau module</h2>
        <p className="mt-1 text-sm font-medium text-muted">
          Ex. Module Économie 1, Module Management, Module Mathématiques
        </p>
        <form action={createModule} className="mt-3 flex flex-col gap-3 sm:flex-row">
          <input type="hidden" name="niveau_id" value={niveau.id} />
          <input name="nom" required placeholder="Nom du module" className={inputCls} />
          <select name="semestre" required className="rounded-2xl border-2 border-ink bg-paper px-4 py-2.5 font-semibold">
            <option value="1">Semestre 1</option>
            <option value="2">Semestre 2</option>
          </select>
          <button type="submit" className="btn-pop btn-grape inline-flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm">
            <Plus className="h-4 w-4" /> Ajouter
          </button>
        </form>
      </section>

      {([1, 2] as Semestre[]).map((semestre) => {
        const mods = modules.filter((mod) => mod.semestre === semestre);
        return (
          <section key={semestre}>
            <h2 className="font-display text-xl">{semestreLabel(semestre)}</h2>
            {mods.length === 0 ? (
              <div className="mt-4">
                <EmptyState title="Aucun module" />
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {mods.map((mod) => {
                  const items = matieres.filter((m) => m.module_id === mod.id);
                  return (
                    <div key={mod.id} className="card-pop overflow-hidden">
                      <div className="flex items-center justify-between gap-4 border-b-[2.5px] border-ink bg-mint px-5 py-3">
                        <p className="font-black">{mod.nom}</p>
                        <ConfirmDelete action={deleteModule}>
                          <input type="hidden" name="id" value={mod.id} />
                          <input type="hidden" name="niveau_id" value={niveau.id} />
                        </ConfirmDelete>
                      </div>
                      {items.length === 0 ? (
                        <p className="bg-white px-5 py-4 text-sm font-medium text-muted">
                          Aucune matière dans ce module. Ajoute la première juste en dessous.
                        </p>
                      ) : (
                        <ul className="divide-y-2 divide-ink/10 bg-white">
                          {items.map((matiere) => {
                            const n = docCounts[matiere.id] ?? 0;
                            return (
                              <li key={matiere.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                                <Link
                                  href={`/admin/matieres/${matiere.id}`}
                                  className="group flex min-w-0 items-center gap-2 font-black hover:underline"
                                >
                                  <span className="truncate">{matiere.nom}</span>
                                  <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1" />
                                </Link>
                                <span className="flex shrink-0 items-center gap-3">
                                  <span className="rounded-full border-2 border-ink bg-paper px-2.5 py-0.5 text-[11px] font-black">
                                    {n} doc{n > 1 ? "s" : ""}
                                  </span>
                                  <ConfirmDelete action={deleteMatiere}>
                                    <input type="hidden" name="id" value={matiere.id} />
                                    <input type="hidden" name="niveau_id" value={niveau.id} />
                                  </ConfirmDelete>
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                      <form
                        action={createMatiere}
                        className="flex flex-col gap-2 border-t-[2.5px] border-ink bg-paper/60 px-5 py-3 sm:flex-row sm:items-center"
                      >
                        <input type="hidden" name="niveau_id" value={niveau.id} />
                        <input type="hidden" name="module_id" value={mod.id} />
                        <input
                          name="nom"
                          required
                          placeholder={`Nouvelle matière dans « ${mod.nom} »…`}
                          className="flex-1 rounded-xl border-2 border-ink bg-white px-3 py-2 text-sm font-semibold outline-none placeholder:font-medium placeholder:text-muted/60"
                        />
                        <button
                          type="submit"
                          className="btn-pop bg-white inline-flex shrink-0 items-center justify-center gap-1 px-4 py-2 text-xs"
                        >
                          <Plus className="h-3.5 w-3.5" /> Ajouter ici
                        </button>
                      </form>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
