import Link from "next/link";
import { createNiveau, deleteNiveau } from "@/app/actions/niveaux";
import { ConfirmDelete } from "@/components/confirm-delete";
import { EmptyState } from "@/components/ui";
import { getNiveaux } from "@/lib/queries";

export default async function AdminHomePage() {
  const niveaux = await getNiveaux();

  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-line bg-card p-6">
        <h2 className="font-serif text-xl">Nouveau niveau</h2>
        <form action={createNiveau} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            name="nom"
            required
            placeholder="Ex. Licence 1"
            className="flex-1 rounded-xl border border-line bg-white px-3 py-2.5 outline-none focus:shadow-[0_0_0_3px_rgba(30,58,138,0.12)]"
          />
          <button
            type="submit"
            className="rounded-full bg-pine px-5 py-2.5 text-sm text-paper transition-transform duration-200 hover:-translate-y-0.5"
          >
            Ajouter
          </button>
        </form>
      </section>

      <section>
        <h2 className="font-serif text-xl">Niveaux</h2>
        {niveaux.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="Aucun niveau" hint="Ajoutez Licence 1, Licence 2 et Licence 3 pour commencer." />
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-card">
            {niveaux.map((niveau) => (
              <li
                key={niveau.id}
                className="flex items-center justify-between gap-4 px-5 py-4"
              >
                <Link
                  href={`/admin/niveaux/${niveau.id}`}
                  className="font-medium text-pine hover:underline"
                >
                  {niveau.nom}
                </Link>
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
