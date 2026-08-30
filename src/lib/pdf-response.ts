import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function pdfResponse(
  id: string,
  disposition: "inline" | "attachment",
) {
  const supabase = await createClient();
  const { data: document } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!document) {
    return NextResponse.json({ error: "Document introuvable" }, { status: 404 });
  }

  const file = await fetch(document.fichier_url);
  if (!file.ok) {
    return NextResponse.json({ error: "Fichier inaccessible" }, { status: 502 });
  }

  const bytes = await file.arrayBuffer();
  const safeTitle = String(document.titre ?? document.type)
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
  const filename = `${safeTitle || document.type}.pdf`;

  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${disposition}; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
