import type { Metadata } from "next";
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
