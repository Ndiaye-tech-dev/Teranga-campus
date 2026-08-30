import Link from "next/link";
import { notFound } from "next/navigation";
import { createMatiere, deleteMatiere } from "@/app/actions/matieres";
import { createModule, deleteModule } from "@/app/actions/modules";
import { updateNiveau } from "@/app/actions/niveaux";
import { ConfirmDelete } from "@/components/confirm-delete";
import { EmptyState } from "@/components/ui";
import {
  getMatieresByNiveau,
  getModulesByNiveau,
  getNiveau,
  isModulesTableMissing,
} from "@/lib/queries";
import { semestreLabel, type Semestre } from "@/lib/types";

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

  return (
    <div className="space-y-10">
      <p className="text-sm">
        <Link href="/admin" className="text-muted hover:text-ink">
          ← Niveaux
        </Link>
      </p>

      <section className="rounded-2xl border border-line bg-card p-6">
        <h2 className="font-serif text-xl">Modifier le niveau</h2>
        <form action={updateNiveau} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input type="hidden" name="id" value={niveau.id} />
          <input
            name="nom"
            defaultValue={niveau.nom}
            required
            className="flex-1 rounded-xl border border-line bg-white px-3 py-2.5 outline-none focus:shadow-[0_0_0_3px_rgba(30,58,138,0.12)]"
          />
          <button
            type="submit"
            className="rounded-full bg-pine px-5 py-2.5 text-sm text-paper"
          >
            Enregistrer
          </button>
        </form>
      </section>

      {modulesMissing ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-sm text-ink">
          <p className="font-medium">Table « modules » absente dans Supabase</p>
          <p className="mt-2 text-muted">
            L’app ne peut pas créer de modules tant que la migration n’est pas
            exécutée. Dans le SQL Editor du projet Supabase, lancez{" "}
            <code className="rounded bg-white px-1">supabase/migration-v2.sql</code>{" "}
            (projet déjà en place) ou{" "}
            <code className="rounded bg-white px-1">supabase/schema.sql</code>{" "}
            (nouveau projet), puis rechargez cette page.
          </p>
        </div>
      ) : null}

      <section className="rounded-2xl border border-line bg-card p-6">
        <h2 className="font-serif text-xl">Nouveau module</h2>
        <p className="mt-1 text-sm text-muted">
          Ex. Module Économie 1, Module Management, Module Mathématiques
        </p>
        <form action={createModule} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input type="hidden" name="niveau_id" value={niveau.id} />
          <input
            name="nom"
            required
            placeholder="Nom du module"
            className="flex-1 rounded-xl border border-line bg-white px-3 py-2.5 outline-none focus:shadow-[0_0_0_3px_rgba(30,58,138,0.12)]"
          />
          <select
            name="semestre"
            required
            className="rounded-xl border border-line bg-white px-3 py-2.5"
          >
            <option value="1">Semestre 1</option>
            <option value="2">Semestre 2</option>
          </select>
          <button
            type="submit"
            className="rounded-full bg-pine px-5 py-2.5 text-sm text-paper"
          >
            Ajouter
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-line bg-card p-6">
        <h2 className="font-serif text-xl">Nouvelle matière</h2>
        {modules.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            Créez d’abord un module pour y rattacher une matière.
          </p>
        ) : (
          <form action={createMatiere} className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input type="hidden" name="niveau_id" value={niveau.id} />
            <input
              name="nom"
              required
              placeholder="Ex. Microéconomie 1"
              className="flex-1 rounded-xl border border-line bg-white px-3 py-2.5 outline-none focus:shadow-[0_0_0_3px_rgba(30,58,138,0.12)]"
            />
            <select
              name="module_id"
              required
              className="min-w-48 rounded-xl border border-line bg-white px-3 py-2.5"
            >
              {modules.map((mod) => (
                <option key={mod.id} value={mod.id}>
                  S{mod.semestre} · {mod.nom}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="rounded-full bg-pine px-5 py-2.5 text-sm text-paper"
            >
              Ajouter
            </button>
          </form>
        )}
      </section>

      {([1, 2] as Semestre[]).map((semestre) => {
        const mods = modules.filter((mod) => mod.semestre === semestre);
        return (
          <section key={semestre}>
            <h2 className="font-serif text-xl">{semestreLabel(semestre)}</h2>
            {mods.length === 0 ? (
              <div className="mt-4">
                <EmptyState title="Aucun module" />
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {mods.map((mod) => {
                  const items = matieres.filter((m) => m.module_id === mod.id);
                  return (
                    <div
                      key={mod.id}
                      className="overflow-hidden rounded-2xl border border-line bg-card"
                    >
                      <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
                        <p className="font-medium text-ink">{mod.nom}</p>
                        <ConfirmDelete action={deleteModule}>
                          <input type="hidden" name="id" value={mod.id} />
                          <input type="hidden" name="niveau_id" value={niveau.id} />
                        </ConfirmDelete>
                      </div>
                      {items.length === 0 ? (
                        <p className="px-5 py-4 text-sm text-muted">
                          Aucune matière dans ce module.
                        </p>
                      ) : (
                        <ul className="divide-y divide-line">
                          {items.map((matiere) => (
                            <li
                              key={matiere.id}
                              className="flex items-center justify-between gap-4 px-5 py-4"
                            >
                              <Link
                                href={`/admin/matieres/${matiere.id}`}
                                className="font-medium text-pine hover:underline"
                              >
                                {matiere.nom}
                              </Link>
                              <ConfirmDelete action={deleteMatiere}>
                                <input type="hidden" name="id" value={matiere.id} />
                                <input
                                  type="hidden"
                                  name="niveau_id"
                                  value={niveau.id}
                                />
                              </ConfirmDelete>
                            </li>
                          ))}
                        </ul>
                      )}
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
