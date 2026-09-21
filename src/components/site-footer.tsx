import Link from "next/link";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { ViewModeSwitch } from "@/components/view-mode-switch";
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
    <footer className="mt-10 px-3 pb-3 sm:px-5 sm:pb-5">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border-[2.5px] border-ink bg-ink text-white shadow-[8px_8px_0_rgba(26,18,51,0.2)]">
        {/* Bandeau CTA */}
        <div className="flex flex-col items-start justify-between gap-5 border-b-2 border-white/15 bg-grape px-6 py-8 sm:flex-row sm:items-center sm:px-10">
          <div>
            <p className="sticker bg-sun text-ink">100% gratuit · sans compte</p>
            <p className="font-display mt-4 max-w-md text-3xl text-white sm:text-4xl">
              Tes cours t&apos;attendent. Lance-toi.
            </p>
          </div>
          <Link
            href="/#niveaux"
            className="btn-pop bg-white px-6 py-3 text-sm text-ink"
          >
            Voir les niveaux
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-10 px-6 py-12 sm:grid-cols-2 sm:px-10 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border-2 border-white/80 bg-sun">
                <Logo className="h-7 w-7 object-contain" />
              </span>
              <p className="text-xl font-black tracking-tight">{SITE.name}</p>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              {SITE.tagline}
            </p>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-sun">
              {SITE.department} · {SITE.city}
            </p>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-sun">
              Explorer
            </p>
            <ul className="mt-4 space-y-2.5 text-sm font-semibold">
              <li>
                <Link href="/" className="text-white/80 transition-colors hover:text-sun">
                  Accueil
                </Link>
              </li>
              {niveaux.map((niveau) => (
                <li key={niveau.id}>
                  <Link
                    href={`/niveaux/${niveau.id}`}
                    className="text-white/80 transition-colors hover:text-sun"
                  >
                    {niveau.nom}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/a-propos" className="text-white/80 transition-colors hover:text-sun">
                  À propos & contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-mint">
              Au programme
            </p>
            <ul className="mt-4 space-y-2.5 text-sm text-white/75">
              <li>📚 Cours magistraux en PDF</li>
              <li>✏️ TD + corrections</li>
              <li>⚡ Flashcards de révision</li>
              <li>📱 100% mobile friendly</li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-candy">
              Contact
            </p>
            <p className="mt-4 text-lg font-black">
              {SITE.developer}{" "}
              <span className="whitespace-nowrap rounded-full border border-sun/60 bg-sun/15 px-2.5 py-0.5 align-middle font-sans text-xs font-black text-sun">
                {SITE.pseudo}
              </span>
            </p>
            <p className="mt-1 text-sm text-white/70">{SITE.role}</p>
            <ul className="mt-4 space-y-2 text-sm font-semibold">
              {contact.email ? (
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex items-center gap-2 text-white/85 hover:text-sun"
                  >
                    <Mail className="h-4 w-4" /> {contact.email}
                  </a>
                </li>
              ) : null}
              {contact.phone ? (
                <li>
                  <a
                    href={`tel:${contact.phone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-2 text-white/85 hover:text-sun"
                  >
                    <Phone className="h-4 w-4" /> {contact.phone}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t-2 border-white/15 px-6 py-5 text-xs text-white/50 sm:px-10">
          <ViewModeSwitch />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>© {year} {SITE.name} · Fait à Kaolack</p>
            <p>Par {SITE.developer} · Pour les étudiants SEG de l&apos;UAM.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
