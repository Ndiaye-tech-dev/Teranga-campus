import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center sm:px-6">
      <p className="eyebrow">404</p>
      <h1 className="font-display mt-3 text-4xl">Page introuvable</h1>
      <p className="mt-3 text-muted">Ce contenu n&apos;existe pas ou a été retiré.</p>
      <Link href="/" className="btn btn-primary mt-8 px-6 py-3 text-sm">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
