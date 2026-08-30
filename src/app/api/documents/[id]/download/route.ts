import { NextRequest } from "next/server";
import { pdfResponse } from "@/lib/pdf-response";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return pdfResponse(id, "attachment");
}
