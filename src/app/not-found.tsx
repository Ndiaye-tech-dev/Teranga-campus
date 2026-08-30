import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-5 py-24 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-clay">404</p>
      <h1 className="mt-3 font-serif text-3xl">Page introuvable</h1>
      <p className="mt-3 text-muted">Ce contenu n’existe pas ou a été retiré.</p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-pine px-5 py-2.5 text-sm text-paper"
      >
        Retour à l’accueil
      </Link>
    </div>
  );
}
