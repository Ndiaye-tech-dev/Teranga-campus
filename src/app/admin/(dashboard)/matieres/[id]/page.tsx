import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteDocument } from "@/app/actions/documents";
import { updateMatiere } from "@/app/actions/matieres";
import { ConfirmDelete } from "@/components/confirm-delete";
import { DocumentUpload } from "@/components/document-upload";
import { EmptyState } from "@/components/ui";
import {
  getDocumentsByMatiere,
  getMatiere,
  getModulesByNiveau,
  getNiveau,
} from "@/lib/queries";
import type { ReactNode } from "react";

export default async function AdminMatierePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const matiere = await getMatiere(id);
  if (!matiere) notFound();
  const [niveau, modules, documents] = await Promise.all([
    getNiveau(matiere.niveau_id),
    getModulesByNiveau(matiere.niveau_id),
    getDocumentsByMatiere(id),
  ]);

  const cours = documents.filter((d) => d.type === "cours");
  const tds = documents.filter((d) => d.type === "td");
  const flashcards = documents.filter((d) => d.type === "flashcards");
  const corrections = documents.filter((d) => d.type === "correction");

  return (
    <div className="space-y-10">
      <p className="text-sm">
        <Link
          href={`/admin/niveaux/${matiere.niveau_id}`}
          className="text-muted hover:text-ink"
        >
          ← {niveau?.nom ?? "Niveau"}
        </Link>
      </p>

      <section className="rounded-2xl border border-line bg-card p-6">
        <h2 className="font-serif text-xl">Modifier la matière</h2>
        <form action={updateMatiere} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input type="hidden" name="id" value={matiere.id} />
          <input
            name="nom"
            defaultValue={matiere.nom}
            required
            className="flex-1 rounded-xl border border-line bg-white px-3 py-2.5 outline-none focus:shadow-[0_0_0_3px_rgba(30,58,138,0.12)]"
          />
          <select
            name="module_id"
            defaultValue={matiere.module_id}
            required
            className="rounded-xl border border-line bg-white px-3 py-2.5"
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
            Enregistrer
          </button>
        </form>
      </section>

      <ResourceAdmin
        title="Cours"
        hint="Ajoutez autant de cours PDF que nécessaire."
        items={cours}
        empty="Aucun cours"
        upload={
          <DocumentUpload
            matiereId={matiere.id}
            type="cours"
            titrePlaceholder="Titre du cours"
          />
        }
      />

      <section className="rounded-2xl border border-line bg-card p-6">
        <h2 className="font-serif text-xl">TD</h2>
        <p className="mt-1 text-sm text-muted">
          Chaque TD peut avoir sa correction, affichée juste à côté sur le site.
        </p>
        <DocumentUpload
          matiereId={matiere.id}
          type="td"
          titrePlaceholder="Titre du TD"
        />
        {tds.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="Aucun TD" />
          </div>
        ) : (
          <ul className="mt-5 divide-y divide-line overflow-hidden rounded-2xl border border-line">
            {tds.map((td) => {
              const correction = corrections.find((c) => c.parent_id === td.id);
              return (
                <li key={td.id} className="space-y-3 px-5 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium">{td.titre}</p>
                    <ConfirmDelete action={deleteDocument}>
                      <input type="hidden" name="id" value={td.id} />
                    </ConfirmDelete>
                  </div>
                  {correction ? (
                    <div className="flex items-center justify-between gap-3 rounded-xl bg-paper px-3 py-2 text-sm">
                      <span>Correction : {correction.titre}</span>
                      <ConfirmDelete action={deleteDocument} label="Retirer">
                        <input type="hidden" name="id" value={correction.id} />
                      </ConfirmDelete>
                    </div>
                  ) : (
                    <DocumentUpload
                      matiereId={matiere.id}
                      type="correction"
                      parentId={td.id}
                      titrePlaceholder="Correction"
                      defaultTitre={`Correction — ${td.titre}`}
                      hideTitre
                      submitLabel="Ajouter la correction"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <ResourceAdmin
        title="Flashcards"
        hint="Plusieurs jeux de flashcards possibles."
        items={flashcards}
        empty="Aucune flashcard"
        upload={
          <DocumentUpload
            matiereId={matiere.id}
            type="flashcards"
            titrePlaceholder="Titre du jeu de flashcards"
          />
        }
      />
    </div>
  );
}

function ResourceAdmin({
  title,
  hint,
  items,
  empty,
  upload,
}: {
  title: string;
  hint: string;
  items: { id: string; titre: string }[];
  empty: string;
  upload: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-card p-6">
      <h2 className="font-serif text-xl">{title}</h2>
      <p className="mt-1 text-sm text-muted">{hint}</p>
      {upload}
      {items.length === 0 ? (
        <div className="mt-4">
          <EmptyState title={empty} />
        </div>
      ) : (
        <ul className="mt-5 divide-y divide-line overflow-hidden rounded-2xl border border-line">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <span>{item.titre}</span>
              <ConfirmDelete action={deleteDocument}>
                <input type="hidden" name="id" value={item.id} />
              </ConfirmDelete>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
