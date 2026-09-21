import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff } from "lucide-react";

export const metadata: Metadata = {
  title: "Hors-ligne",
};

export default function OfflinePage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
      <div className="card px-8 py-12">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-soft text-accent-ink">
          <WifiOff className="h-7 w-7" />
        </span>
        <h1 className="font-display mt-6 text-4xl">Pas de connexion</h1>
        <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-muted">
          Les pages et les PDF déjà ouverts restent accessibles avec le bouton
          retour. Pour le reste, il faudra attendre le réseau.
        </p>
        <Link href="/" className="btn btn-primary mt-7 px-6 py-3 text-sm">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
