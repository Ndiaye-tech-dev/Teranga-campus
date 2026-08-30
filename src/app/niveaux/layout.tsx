import { SetupBanner } from "@/components/ui";
import { hasSupabaseConfig } from "@/lib/env";

export const dynamic = "force-dynamic";

export default function NiveauxLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!hasSupabaseConfig()) {
    return <SetupBanner />;
  }

  return children;
}
