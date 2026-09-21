import Link from "next/link";
import { ArrowUpRight, BookOpen, Mail, Pencil, Phone, Smartphone, Zap } from "lucide-react";
import { TikTokIcon, WhatsAppIcon } from "@/components/brand-icons";
import { ViewModeSwitch } from "@/components/view-mode-switch";
import { Logo } from "@/components/logo";
import { hasSupabaseConfig } from "@/lib/env";
import { getNiveaux } from "@/lib/queries";
import { getSiteContact, getSiteSocial, SITE } from "@/lib/site";

export async function SiteFooter() {
  const contact = getSiteContact();
  const social = getSiteSocial();
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
              Tes cours t&apos;attendent.
            </p>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
              Nouveautés, entraide entre étudiants, signalements : tout se
              passe dans le groupe WhatsApp. Les projets et les coulisses,
              c&apos;est sur TikTok.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/#niveaux"
              className="btn-pop bg-white px-6 py-3 text-sm text-ink"
            >
              Voir les niveaux
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            {social.whatsapp ? (
              <a
                href={social.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="btn-pop btn-mint px-6 py-3 text-sm"
              >
                <WhatsAppIcon className="h-4 w-4" /> Rejoindre le groupe
              </a>
            ) : null}
            {social.tiktok ? (
              <a
                href={social.tiktok}
                target="_blank"
                rel="noreferrer"
                className="btn-pop bg-white px-6 py-3 text-sm text-ink"
              >
                <TikTokIcon className="h-4 w-4 text-ink" /> Suivre sur TikTok
              </a>
            ) : null}
          </div>
        </div>

        <div className="grid gap-10 px-6 py-12 sm:grid-cols-2 sm:px-10 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border-2 border-white/80 bg-white p-0.5">
                <Logo variant="mark" className="h-full w-full" />
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
              <li className="flex items-center gap-2.5">
                <BookOpen className="h-4 w-4 shrink-0 text-sun" /> Cours magistraux en PDF
              </li>
              <li className="flex items-center gap-2.5">
                <Pencil className="h-4 w-4 shrink-0 text-sun" /> TD + corrections
              </li>
              <li className="flex items-center gap-2.5">
                <Zap className="h-4 w-4 shrink-0 text-sun" /> Flashcards de révision
              </li>
              <li className="flex items-center gap-2.5">
                <Smartphone className="h-4 w-4 shrink-0 text-sun" /> 100% mobile friendly
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-candy">
              Contact
            </p>
            <p className="mt-4 text-lg font-black">{SITE.pseudo}</p>
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
            <p>Par {SITE.pseudo} · Pour les étudiants de l&apos;UFR SEG de l&apos;UAM.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
