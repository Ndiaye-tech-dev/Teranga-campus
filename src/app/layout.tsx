import type { Metadata, Viewport } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SwRegister } from "@/components/sw-register";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["italic", "normal"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://teranga-campus.vercel.app"),
  title: {
    default: "Teranga Campus — Tous tes cours SEG au même endroit",
    template: "%s · Teranga Campus",
  },
  description:
    "Cours, TD, corrections et flashcards de Sciences Économiques et de Gestion (L1 → L3, UAM Diamniadio). Gratuit, sans compte, accessible sur téléphone.",
  keywords: [
    "Teranga Campus",
    "UAM",
    "SEG Diamniadio",
    "cours économie gestion",
    "Licence SEG Sénégal",
    "TD corrigés",
    "flashcards révision",
    "Université Amadou Makhtar Mbow",
  ],
  authors: [{ name: "Ablaye Ndiaye" }],
  creator: "Ablaye Ndiaye",
  openGraph: {
    type: "website",
    locale: "fr_SN",
    siteName: "Teranga Campus",
    title: "Teranga Campus — Tous tes cours SEG au même endroit",
    description:
      "L1, L2, L3 SEG de l'UAM (Diamniadio) : cours, TD, corrections et flashcards. Gratuit, sans compte, sur ton téléphone.",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Teranga Campus — Tous tes cours SEG au même endroit",
    description:
      "Cours, TD, corrections et flashcards SEG. Gratuit, sans compte. UAM Diamniadio.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Teranga Campus",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  other: {
    // iPhones plus anciens : plein écran à l'ouverture depuis l'écran d'accueil.
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFF8EC",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className={`${outfit.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper pt-20 text-ink sm:pt-28">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <ScrollReveal />
        <SwRegister />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Teranga Campus",
              inLanguage: "fr",
              description:
                "Cours SEG de l'UAM (Diamniadio), de la Licence 1 à la Licence 3.",
              author: { "@type": "Person", name: "Ablaye Ndiaye" },
            }),
          }}
        />
      </body>
    </html>
  );
}
