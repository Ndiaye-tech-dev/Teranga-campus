import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff } from "lucide-react";

export const metadata: Metadata = {
  title: "Hors-ligne",
};

export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-xl px-5 py-16 text-center">
      <div className="card-pop px-8 py-12">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border-[2.5px] border-ink bg-sun">
          <WifiOff className="h-8 w-8" />
        </span>
        <h1 className="font-display mt-6 text-4xl">Pas de connexion</h1>
        <p className="mx-auto mt-3 max-w-sm font-medium leading-relaxed text-muted">
          Les pages et les PDF que tu as déjà ouverts restent accessibles :
          utilise le bouton retour de ton téléphone ou la recherche. Pour le
          reste, il faudra attendre le réseau.
        </p>
        <Link href="/" className="btn-pop btn-grape mt-7 px-7 py-3.5">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
