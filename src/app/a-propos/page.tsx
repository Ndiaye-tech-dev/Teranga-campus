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
        Plus qu&apos;une plateforme, une communauté
      </h1>
      <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-muted">
        <p>
          Teranga Campus est né d&apos;un constat simple, et d&apos;une
          conviction : la réussite universitaire ne devrait jamais dépendre de
          la chance de tomber sur le bon groupe WhatsApp au bon moment.
        </p>
        <p>
          Ici, les cours de Sciences Économiques et de Gestion — de la
          Licence 1 à la Licence 3 — sont enfin réunis au même endroit,
          classés par semestre et par matière. Un seul réflexe à retenir :
          Teranga Campus, plutôt que dix conversations différentes.
        </p>
      </div>

      <section className="mx-auto max-w-4xl px-5 py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-clay">
          L&apos;origine
        </p>
        <h2 className="mt-2 font-serif text-3xl text-ink">
          Derrière chaque outil, il y a une histoire
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
            Je m&apos;appelle Ablaye Ndiaye, étudiant en Licence 2 Sciences
            Économiques et de Gestion à l&apos;Université Amadou Makhtar
            Mbow. Comme beaucoup d&apos;entre vous, j&apos;ai passé des heures
            à chercher un TD égaré dans une conversation vieille de trois
            mois, ou à demander à un camarade s&apos;il avait bien la version
            corrigée d&apos;un cours.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            En parallèle de mes études, je cultive une vraie passion pour la
            technologie : le développement web, l&apos;automatisation, tout ce
            qui permet de simplifier ce qui devrait l&apos;être. Un jour,
            l&apos;évidence s&apos;est imposée : pourquoi ne pas mettre cette
            passion au service de ma propre promotion ?
          </p>
        </div>
        <div className="clear-both" />
      </section>

      <section className="border-y border-line bg-card/40">
        <div className="mx-auto max-w-4xl px-5 py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-clay">
            Le déclic
          </p>
          <h2 className="mt-2 font-serif text-3xl text-ink">
            Un problème que tout le monde connaît, mais que personne ne
            résout
          </h2>
          <p className="mt-6 leading-relaxed text-muted">
            Nouvel arrivant en Licence 1, étudiant en pleine année en L2 ou
            L3, ou déjà diplômé qui repense à ces années : tout le monde a
            vécu la même frustration. Les supports de cours circulent, se
            perdent, changent de version sans prévenir — et personne n&apos;a
            jamais eu un endroit unique où tout retrouver.
          </p>
          <ul className="mt-6 space-y-3 text-muted">
            <li className="flex gap-3">
              <span className="text-pine">—</span>
              Un nouvel étudiant ne sait même pas par où commencer
            </li>
            <li className="flex gap-3">
              <span className="text-pine">—</span>
              Des heures perdues à fouiller dix groupes WhatsApp pour un
              seul document
            </li>
            <li className="flex gap-3">
              <span className="text-pine">—</span>
              Des fichiers qui s&apos;égarent, se dupliquent, ou disparaissent
              purement et simplement
            </li>
            <li className="flex gap-3">
              <span className="text-pine">—</span>
              Jamais la certitude d&apos;avoir la bonne version d&apos;un
              cours avant un examen
            </li>
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-20">
        <p className="text-xs uppercase tracking-[0.2em] text-clay">
          La réponse
        </p>
        <h2 className="mt-2 font-serif text-3xl text-ink">
          Un seul endroit, pour tout retrouver
        </h2>
        <p className="mt-6 leading-relaxed text-muted">
          C&apos;est de ce constat qu&apos;est né Teranga Campus : une
          plateforme qui centralise tous les cours de la filière, organisés
          clairement par niveau, semestre et matière. Pour chaque cours, les
          documents essentiels — le cours, le TD, sa correction, et des
          flashcards de révision — sont réunis au même endroit, sans jamais
          se perdre.
        </p>
        <p className="mt-4 leading-relaxed text-muted">
          Et parce qu&apos;un outil qui simplifie la vie doit lui-même être
          simple, tout est accessible gratuitement, sans création de compte,
          depuis un téléphone, une tablette ou un ordinateur — partout où une
          connexion internet vous accompagne.
        </p>
      </section>

      <section className="border-y border-line bg-card/40">
        <div className="mx-auto max-w-4xl px-5 py-20">
          <p className="text-xs uppercase tracking-[0.2em] text-clay">
            L&apos;étape suivante
          </p>
          <h2 className="mt-2 font-serif text-3xl text-ink">
            Ce n&apos;est qu&apos;un début
          </h2>
          <p className="mt-6 leading-relaxed text-muted">
            Teranga Campus est aujourd&apos;hui en phase de test — une
            première version, pensée pour évoluer avec ceux qui
            l&apos;utilisent. L&apos;ambition ne s&apos;arrête pas là :
            enrichir le contenu, affiner l&apos;expérience de navigation, et
            imaginer ensemble les fonctionnalités qui manquent encore.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            Ce projet grandira avec sa communauté, pas sans elle. Une
            suggestion, un document à ajouter, une envie de contribuer ?
            Chaque retour compte, et chaque collaboration est la bienvenue
            pour faire de Teranga Campus la référence de la filière.
          </p>
        </div>
      </section>

      <section className="mt-14 border-t border-line pt-10">
        <h2 className="font-serif text-2xl text-ink">Parlons-en</h2>
        <p className="mt-3 mb-2 text-muted">
          Une question, un document manquant, une idée à proposer ? Écrivez-moi,
          je réponds toujours.
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
