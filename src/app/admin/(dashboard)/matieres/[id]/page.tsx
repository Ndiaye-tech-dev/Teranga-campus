import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
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
import { matierePath } from "@/lib/site";
import type { Semestre } from "@/lib/types";
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

  const moduleRow = modules.find((m) => m.id === matiere.module_id);
  const publicHref = moduleRow
    ? matierePath(matiere.niveau_id, moduleRow.semestre as Semestre, matiere.id)
    : null;

  const cours = documents.filter((d) => d.type === "cours");
  const tds = documents.filter((d) => d.type === "td");
  const flashcards = documents.filter((d) => d.type === "flashcards");
  const corrections = documents.filter((d) => d.type === "correction");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-black">
          <Link href={`/admin/niveaux/${matiere.niveau_id}`} className="text-muted hover:text-ink">
            ← {niveau?.nom ?? "Niveau"}
          </Link>
        </p>
        {publicHref ? (
          <Link
            href={publicHref}
            className="btn-pop bg-white inline-flex items-center gap-1.5 px-4 py-2 text-xs"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Voir sur le site
          </Link>
        ) : null}
      </div>

      <div className="card-pop !bg-grape px-6 py-5 text-white">
        <p className="text-xs font-black uppercase tracking-widest text-sun">
          {moduleRow ? `S${moduleRow.semestre} · ${moduleRow.nom}` : "Matière"} · {documents.length} doc{documents.length > 1 ? "s" : ""}
        </p>
        <h2 className="font-display mt-1 text-3xl">{matiere.nom}</h2>
        <form action={updateMatiere} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input type="hidden" name="id" value={matiere.id} />
          <input
            name="nom"
            defaultValue={matiere.nom}
            required
            className="flex-1 rounded-2xl border-2 border-ink px-4 py-2.5 font-semibold text-ink outline-none"
          />
          <select
            name="module_id"
            defaultValue={matiere.module_id}
            required
            className="rounded-2xl border-2 border-ink px-4 py-2.5 font-semibold text-ink"
          >
            {modules.map((mod) => (
              <option key={mod.id} value={mod.id}>
                S{mod.semestre} · {mod.nom}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-pop btn-accent px-5 py-2.5 text-sm">
            Enregistrer
          </button>
        </form>
      </div>

      <ResourceAdmin
        title="Cours"
        hint="Autant de PDF que nécessaire. Le premier s'ouvre par défaut côté étudiant."
        items={cours}
        empty="Aucun cours"
        upload={<DocumentUpload matiereId={matiere.id} type="cours" titrePlaceholder="Titre du cours" />}
      />

      <section className="card-pop px-6 py-5">
        <h2 className="font-display text-xl">TD</h2>
        <p className="mt-1 text-sm font-medium text-muted">
          Chaque TD peut avoir sa correction, affichée juste à côté sur le site.
        </p>
        <DocumentUpload matiereId={matiere.id} type="td" titrePlaceholder="Titre du TD" />
        {tds.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="Aucun TD" />
          </div>
        ) : (
          <ul className="mt-5 space-y-3">
            {tds.map((td) => {
              const correction = corrections.find((c) => c.parent_id === td.id);
              return (
                <li key={td.id} className="rounded-2xl border-2 border-ink bg-paper px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-black">{td.titre}</p>
                    <ConfirmDelete action={deleteDocument}>
                      <input type="hidden" name="id" value={td.id} />
                    </ConfirmDelete>
                  </div>
                  {correction ? (
                    <div className="mt-2 flex items-center justify-between gap-3 rounded-xl border-2 border-ink bg-mint px-3 py-2 text-sm font-bold">
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
        hint="Plusieurs jeux possibles par matière."
        items={flashcards}
        empty="Aucune flashcard"
        upload={<DocumentUpload matiereId={matiere.id} type="flashcards" titrePlaceholder="Titre du jeu de flashcards" />}
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
    <section className="card-pop px-6 py-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-xl">{title}</h2>
        <span className="rounded-full border-2 border-ink bg-sun px-3 py-1 text-xs font-black">
          {items.length}
        </span>
      </div>
      <p className="mt-1 text-sm font-medium text-muted">{hint}</p>
      {upload}
      {items.length === 0 ? (
        <div className="mt-4">
          <EmptyState title={empty} />
        </div>
      ) : (
        <ul className="mt-4 divide-y-2 divide-ink/10 overflow-hidden rounded-2xl border-2 border-ink">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 bg-white px-4 py-3">
              <span className="min-w-0 truncate font-semibold">{item.titre}</span>
              <span className="flex shrink-0 items-center gap-3">
                <a
                  href={`/api/documents/${item.id}/view`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-black text-grape hover:underline"
                >
                  Vérifier
                </a>
                <ConfirmDelete action={deleteDocument}>
                  <input type="hidden" name="id" value={item.id} />
                </ConfirmDelete>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
