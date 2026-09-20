import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardList, Zap } from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { getSiteContact } from "@/lib/site";

export const metadata: Metadata = {
  title: "À propos",
};

export default function AboutPage() {
  const contact = getSiteContact();

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <p className="sticker bg-white">À propos</p>
      <h1 className="font-display mt-4 max-w-2xl text-4xl sm:text-5xl">
        Un seul endroit pour tous les cours.
      </h1>
      <p className="mt-4 max-w-xl font-medium leading-relaxed text-muted">
        Teranga Campus rassemble les cours de SEG de l&apos;UAM, de la L1 à
        la L3. Plus besoin de fouiller dix groupes WhatsApp pour un TD.
      </p>

      {/* Qui est derrière */}
      <section className="card-pop mt-10 grid gap-8 p-7 sm:p-10 lg:grid-cols-[280px_1fr]">
        <div className="relative mx-auto w-full max-w-[280px]">
          <div className="card-pop -rotate-2 overflow-hidden !rounded-3xl">
            <Image
              src="/ablaye.jpg"
              alt="Ablaye Ndiaye"
              width={560}
              height={560}
              className="aspect-square w-full object-cover"
            />
          </div>
          <p className="sticker absolute -bottom-3 left-1/2 -translate-x-1/2 bg-sun whitespace-nowrap">
            NdiayeTech
          </p>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-clay">
            Derrière le site
          </p>
          <h2 className="font-display mt-2 text-3xl">Ablaye Ndiaye</h2>
          <p className="mt-1 text-sm font-bold text-muted">
            Étudiant en L2 SEG à l&apos;UAM · alias NdiayeTech
          </p>
          <div className="mt-5 space-y-4 font-medium leading-relaxed text-muted">
            <p>
              Comme beaucoup, j&apos;ai perdu des heures à chercher un cours
              égaré dans une vieille conversation, ou à demander autour de moi
              si quelqu&apos;un avait la bonne version d&apos;un TD.
            </p>
            <p>
              À côté des cours, je passe mon temps sur le web et la tech.
              Alors j&apos;ai fait le lien : un site simple, où chaque matière
              a ses documents au même endroit, accessibles sans compte, même
              sur téléphone.
            </p>
            <p>
              C&apos;est comme ça qu&apos;est né Teranga Campus. Je le
              construis petit à petit, en fonction de ce qui vous manque
              vraiment.
            </p>
          </div>
        </div>
      </section>

      {/* Ce que tu y trouves */}
      <section className="mt-8">
        <h2 className="font-display text-3xl">Ce que tu y trouves</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {[
            { icon: BookOpen, bg: "bg-sun", t: "Les cours", d: "Les supports complets, matière par matière." },
            { icon: ClipboardList, bg: "bg-mint", t: "Les TD + corrigés", d: "Pour t'entraîner avec la correction à côté." },
            { icon: Zap, bg: "bg-candy text-white", t: "Les flashcards", d: "L'essentiel à revoir avant un examen." },
          ].map((c, i) => (
            <div key={c.t} className={`card-pop p-6 ${i % 2 ? "rotate-1" : "-rotate-1"}`}>
              <span className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl border-[2.5px] border-ink ${c.bg}`}>
                <c.icon className="h-6 w-6" />
              </span>
              <h3 className="font-display mt-4 text-2xl">{c.t}</h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-muted">{c.d}</p>
            </div>
          ))}
        </div>
        <Link href="/#niveaux" className="btn-pop btn-grape mt-6 px-6 py-3 text-sm">
          Voir les cours <ArrowRight className="h-4 w-4" />
        </Link>
      </section>

      {/* Et après */}
      <section className="card-pop mt-8 !bg-ink !text-white px-7 py-8 sm:px-10">
        <h2 className="font-display text-3xl">Et la suite ?</h2>
        <p className="mt-3 max-w-2xl font-medium leading-relaxed text-white/75">
          Le site est encore jeune. J&apos;ajoute les documents au fur et à
          mesure, et je réfléchis aux prochaines fonctionnalités (des quiz,
          peut-être). Si tu as une idée, un document qui manque, ou si tu vois
          une erreur : écris-moi. C&apos;est comme ça que le site avancera.
        </p>
      </section>

      {/* Contact */}
      <section className="card-pop mt-8 px-7 py-8 sm:px-10">
        <h2 className="font-display text-3xl">Parlons-en</h2>
        <p className="mt-2 font-medium text-muted">
          Une question, un document manquant, une idée ? Écris-moi, je réponds.
        </p>
        {contact.phone ? (
          <p className="mt-3 text-sm font-bold">
            Tél :{" "}
            <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="text-grape underline decoration-sun decoration-2 underline-offset-4">
              {contact.phone}
            </a>
          </p>
        ) : null}
        <div className="mt-5">
          <ContactForm email={contact.email} />
        </div>
      </section>
    </div>
  );
}
