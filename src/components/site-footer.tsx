import Link from "next/link";
import { Logo } from "@/components/logo";
import { hasSupabaseConfig } from "@/lib/env";
import { getNiveaux } from "@/lib/queries";
import { getSiteContact, SITE } from "@/lib/site";

export async function SiteFooter() {
  const contact = getSiteContact();
  let niveaux: Awaited<ReturnType<typeof getNiveaux>> = [];
  if (hasSupabaseConfig()) {
    try {
      niveaux = await getNiveaux();
    } catch {
      niveaux = [];
    }
  }

  const year = 2026;

  return (
    <footer className="mt-8 border-t border-line bg-[#0b1220] text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <Logo className="h-10 w-10" />
            <p className="font-serif text-xl">{SITE.name}</p>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-white/70">{SITE.tagline}</p>
          <p className="mt-4 text-sm text-white/55">
            {SITE.department}
            <br />
            {SITE.university}
            <br />
            {SITE.city}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
            Navigation rapide
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/" className="text-white/75 transition-colors hover:text-white">
                Accueil — choix du niveau
              </Link>
            </li>
            {niveaux.map((niveau) => (
              <li key={niveau.id}>
                <Link
                  href={`/niveaux/${niveau.id}`}
                  className="text-white/75 transition-colors hover:text-white"
                >
                  {niveau.nom}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/a-propos"
                className="text-white/75 transition-colors hover:text-white"
              >
                À propos & contact
              </Link>
            </li>
            <li>
              <Link
                href="/admin/login"
                className="text-white/75 transition-colors hover:text-white"
              >
                Espace administrateur
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
            Ressources
          </p>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li>Cours magistraux (PDF)</li>
            <li>Travaux dirigés et corrections</li>
            <li>Flashcards de révision</li>
            <li>Accès libre, sans compte étudiant</li>
            <li>Licence 1 · Licence 2 · Licence 3</li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
            Développé par
          </p>
          <p className="mt-4 font-serif text-lg">{SITE.developer}</p>
          <p className="mt-1 text-sm text-white/70">{SITE.role}</p>
          <p className="mt-1 text-sm text-white/55">
            {SITE.university} · {SITE.city}
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {contact.email ? (
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-white/80 underline decoration-white/25 underline-offset-4 hover:text-white"
                >
                  {contact.email}
                </a>
              </li>
            ) : (
              <li className="text-white/50">
                E-mail : renseignez NEXT_PUBLIC_CONTACT_EMAIL
              </li>
            )}
            {contact.phone ? (
              <li>
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="text-white/80 hover:text-white">
                  {contact.phone}
                </a>
              </li>
            ) : null}
            {contact.linkedin ? (
              <li>
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/80 underline decoration-white/25 underline-offset-4 hover:text-white"
                >
                  Profil LinkedIn
                </a>
              </li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {SITE.name}. Site conçu et développé par {SITE.developer}.
          </p>
          <p>Supports pédagogiques destinés aux étudiants SEG de l’UAM.</p>
        </div>
      </div>
    </footer>
  );
}
