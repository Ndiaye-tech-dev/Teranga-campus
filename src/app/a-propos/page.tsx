import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/contact-form";
import { getSiteContact } from "@/lib/site";

export const metadata: Metadata = {
  title: "À propos",
};

export default function AboutPage() {
  const contact = getSiteContact();

  return (
    <article className="mx-auto max-w-2xl px-5 py-16">
      <p className="text-sm uppercase tracking-[0.22em] text-clay">À propos</p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight">
        Un campus partagé
      </h1>
      <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-muted">
        <p>
          Je m’appelle Ablaye Ndiaye, étudiant en Licence 2 de Sciences
          Économiques et de Gestion à l’Université Amadou Makhtar Mbow, à Dakar.
        </p>
        <p>
          Teranga Campus rassemble les cours du département, de la Licence 1 à
          la Licence 3, organisés par semestre et par module, pour que chaque
          étudiant puisse les consulter sans chercher dans dix groupes
          différents. Teranga, c’est l’hospitalité : ici, les supports
          circulent.
        </p>
        <p>
          Pour chaque matière vous trouverez les cours, les TD avec leur
          correction, et des flashcards de révision.
        </p>
      </div>
      <section className="mx-auto max-w-4xl px-5 py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-clay">
          À l'origine du projet
        </p>
        <h2 className="mt-2 font-serif text-3xl text-ink">
          Ablaye Ndiaye, étudiant passionné de technologie
        </h2>
        <div className="mt-6">
          <Image
            src="/ablaye.jpg"
            alt="Ablaye Ndiaye"
            width={220}
            height={220}
            className="float-left mb-4 mr-6 rounded-2xl object-cover shadow-[0_12px_40px_-24px_rgba(30,58,138,0.55)]"
          />
          <p className="leading-relaxed text-muted">
            Je m'appelle Ablaye Ndiaye, étudiant en Licence 2 Sciences Économiques
            et de Gestion à l'Université Amadou Makhtar Mbow. Au-delà de mes
            études, la technologie est une véritable passion : je m'intéresse au
            développement web, à l'automatisation et aux outils numériques qui
            simplifient la vie de tous les jours.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            Teranga Campus est né de cette envie de mettre la technologie au
            service de a communauté étudiante, en combinant  :
            l'économie/gestion et le numérique.
          </p>
        </div>
        <div className="clear-both" />
      </section>

      <section className="border-y border-line bg-card/40">
        <div className="mx-auto max-w-4xl px-5 py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-clay">
            Le constat
          </p>
          <h2 className="mt-2 font-serif text-3xl text-ink">
            Un problème partagé par tous les étudiants SEG
          </h2>
          <p className="mt-6 leading-relaxed text-muted">
            Que l'on soit nouvel arrivant en Licence 1, étudiant actuel en
            L2/L3, ou même ancien diplômé, un même problème revient : les cours
            sont dispersés.
          </p>
          <ul className="mt-6 space-y-3 text-muted">
            <li className="flex gap-3">
              <span className="text-pine">—</span>
              Les nouveaux étudiants ne savent pas où trouver les supports de
              leurs premières matières
            </li>
            <li className="flex gap-3">
              <span className="text-pine">—</span>
              Les étudiants actuels perdent du temps à chercher un cours dans
              dix groupes WhatsApp différents
            </li>
            <li className="flex gap-3">
              <span className="text-pine">—</span>
              Les documents circulent de main en main, se perdent, ou
              deviennent introuvables
            </li>
            <li className="flex gap-3">
              <span className="text-pine">—</span>
              Réviser efficacement devient difficile sans être sûr d'avoir la
              bonne version d'un document
            </li>
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-clay">
          La solution
        </p>
        <h2 className="mt-2 font-serif text-3xl text-ink">
          Un accès simple, organisé et permanent
        </h2>
        <p className="mt-6 leading-relaxed text-muted">
          Teranga Campus centralise tous les cours de la filière, de la
          Licence 1 à la Licence 3, organisés clairement par niveau, semestre
          et matière. Pour chaque cours, des documents essentiels sont
          réunis au même endroit : le cours,le TD, la Correction des TD, et les flashcards de révision.
        </p>
        <p className="mt-4 leading-relaxed text-muted">
          Plus besoin de chercher dans des dizaines de conversations : tout est
          accessible en ligne, gratuitement, sans création de compte,
          directement depuis un téléphone, une tablette ou un ordinateur — où
          que vous soyez, dès que vous avez une connexion internet.
        </p>
      </section>

      <section className="border-y border-line bg-card/40">
        <div className="mx-auto max-w-4xl px-5 py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-clay">
            Et la suite ?
          </p>
          <h2 className="mt-2 font-serif text-3xl text-ink">
            Un projet qui ne fait que commencer
          </h2>
          <p className="mt-6 leading-relaxed text-muted">
            Teranga Campus est encore en phase de test, mais l'ambition est
            grande : enrichir progressivement le contenu disponible, améliorer
            l'expérience de navigation, et ajouter de nouvelles fonctionnalités
            au fil du temps (recherche de cours, espace de contribution,
            statistiques d'usage, et bien plus encore).
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            Ce projet est pensé pour grandir avec vous. Toute suggestion,
            contribution ou collaboration est la bienvenue pour faire de
            Teranga Campus un véritable outil de référence pour la filière.
          </p>
        </div>
      </section>

      <section className="mt-14 border-t border-line pt-10">
        <h2 className="font-serif text-2xl text-ink">Contact</h2>
        <p className="mt-3 mb-2 text-muted">
          Une question, un document manquant, une correction ? Écrivez-moi.
        </p>
        {contact.phone ? (
          <p className="mb-6 text-sm text-muted">
            Téléphone :{" "}
            <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="text-pine">
              {contact.phone}
            </a>
          </p>
        ) : (
          <div className="mb-6" />
        )}
        <ContactForm email={contact.email} />
      </section>
    </article>
  );
}